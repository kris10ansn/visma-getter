import puppeteer from "puppeteer-core";
import getEnv from "./util/getEnv";
import { waitForNavigation, waitForSelector } from "./util/puppeteer-utils";

const error = (err: Error) => console.error(err);

let browser: puppeteer.Browser;

export default async () => {
    const debug = getEnv("debug") === "true";
    console.log("getSession");

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

    await waitForSelector(page, "#login-with-feide-button");
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
    }).catch(() =>
        console.log("Wait for networkidle0 timed out, continuing...")
    );

    const cookies = await page.cookies();

    const jsession = cookies.find((cookie) => cookie.name === "JSESSIONID");

    console.log(`JSESSION: ${jsession?.value}`);

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
