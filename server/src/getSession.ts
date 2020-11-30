import puppeteer from "puppeteer-core";
import getEnv from "./util/getEnv";
import { waitForNavigation, waitForSelector } from "./util/puppeteer-utils";
import error from "./util/error";

const message = (msg: string) => () => console.log(msg);

let browser: puppeteer.Browser;

const getSession = async () => {
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
    await page.click("#login-with-feide-button");

    await waitForSelector(page, "#username");
    await waitForSelector(page, "#password");
    console.log("Logging in...");
    await page.type("#username", getEnv("username")).catch(error);
    await page.type("#password", getEnv("password")).catch(error);
    await page.click("#main > div.main > form > button");

    await waitForNavigation(page, {
        waitUntil: "networkidle0",
        timeout: 10000,
    }).catch(message("Wait for networkidle0 timed out, continuing..."));

    const cookies = await page.cookies();

    const jsession = cookies.find((cookie) => cookie.name === "JSESSIONID");

    console.log(`JSESSION: ${jsession?.value}`);
    console.groupEnd();

    return jsession;
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
