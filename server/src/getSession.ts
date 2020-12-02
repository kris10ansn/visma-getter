import puppeteer from "puppeteer-core";
import getEnv from "./util/getEnv";
import { waitForNavigation, waitForSelector } from "./util/puppeteer-utils";
import { error, throwError } from "./util/error";
import nullify from "./util/nullify";

const message = (msg: string) => () => console.log(msg);

let browser: puppeteer.Browser;

const getSession = async (): Promise<puppeteer.Cookie | null> => {
    console.group("getSession");
    const debug = getEnv("debug") === "true";

    if (!browser) {
        browser = await puppeteer.launch({
            executablePath: getEnv("BROWSER"),
            headless: !debug,
            args: ["--no-sandbox"],
        });
    }

    const [page] = await browser.pages();

    await page.deleteCookie({
        name: "JSESSIONID",
        domain: "sandnes-vgs.inschool.visma.no",
    });

    await page.goto("about:blank");

    console.log("Loading website...");
    await page.goto("https://sandnes-vgs.inschool.visma.no/");

    await waitForSelector(page, "#login-with-feide-button").catch(error);

    console.log(`Currently at: ${page.url()}`);

    if (page.url().indexOf("Login.jsp") !== -1) {
        await page.click("#login-with-feide-button");
        await waitForNavigation(page, {
            waitUntil: "networkidle2",
            timeout: 5000,
        }).catch(nullify);

        try {
            if (page.url().indexOf("idp.feide.no") !== -1) {
                console.log(`Logging in at ${page.url().slice(0, 99)}`);
                console.log(
                    `Index of idp.feide.no: ${page
                        .url()
                        .indexOf("idp.feide.no")}`
                );

                await waitForSelector(page, "#username").catch(throwError);
                await waitForSelector(page, "#password").catch(throwError);
                console.log("Logging in...");
                await page.type("#username", getEnv("username"));
                await page.type("#password", getEnv("password"));
                await page.click("#main > div.main > form > button");

                await waitForNavigation(page, {
                    waitUntil: "networkidle0",
                    timeout: 10000,
                }).catch(
                    message("Wait for networkidle0 timed out, continuing...")
                );
            }
        } catch (error) {
            console.log(`Probably already logged in: ${page.url()}`);
            console.log(`Error: ${error}`);
        }
    }

    console.log("Getting cookies...");
    const cookies = await page.cookies();

    const jsession = cookies.find((cookie) => cookie.name === "JSESSIONID");

    console.log(`JSESSION: ${jsession?.value}`);
    console.groupEnd();

    return jsession || null;
};

let closing = false;
async function exitHandler(code: string) {
    if (browser) {
        closing = true;
        console.log(`Exit: closing browser. [${code}]`);
        await browser.close().then(() => (closing = false));
    }
    if (!closing) {
        console.log("Browser closed. Running process.exit()...");
        process.exit();
    }
}

["exit", "SIGINT", "SIGUSR1", "SIGUSR2"].forEach((code) => {
    process.on(code, exitHandler.bind(null, code));
});

export default getSession;
