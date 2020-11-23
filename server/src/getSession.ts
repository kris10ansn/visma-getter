import puppeteer from "puppeteer-core";

const error = (err: Error) => console.error(err);

let browser: puppeteer.Browser;

export default async ({ debug } = { debug: false }) => {
    const env = process.env as { [key: string]: string };
    console.log("getSession");

    if (!browser) {
        browser = await puppeteer.launch({
            executablePath: env["BROWSER"],
            headless: !debug,
        });
    }

    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));

    const page = await browser.newPage();

    await page.deleteCookie({
        name: "JSESSIONID",
        domain: "sandnes-vgs.inschool.visma.no",
    });

    await page.goto("https://sandnes-vgs.inschool.visma.no/");

    await page.waitForSelector("#login-with-feide-button");
    await page.click("#login-with-feide-button");

    await page.waitForSelector("#username");
    await page.waitForSelector("#password");
    await page.type("#username", env["username"]).catch(error);
    await page.type("#password", env["password"]).catch(error);
    await page.click("#main > div.main > form > button");

    try {
        await page.waitForNavigation({
            waitUntil: "networkidle0",
            timeout: 10000,
        });
    } catch (e) {}

    const cookies = await page.cookies();

    const jsession = cookies.find((cookie) => cookie.name === "JSESSIONID");

    console.log(`JSESSION: ${jsession?.value}`);

    return jsession;
};

async function exitHandler(code: string) {
    if (browser) {
        console.log(`Exit: closing browser. [${code}]`);
        await browser.close();
    }
    console.log("Browser closed. Running process.exit()...");
    process.exit();
}

["exit", "SIGINT", "SIGUSR1", "SIGUSR2"].forEach((code) => {
    process.on(code, exitHandler.bind(null, code));
});
