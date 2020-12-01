import puppeteer from "puppeteer-core";

export const waitForSelector = (
    page: puppeteer.Page,
    selector: string,
    timeout = 10000
) =>
    new Promise<void>(async (resolve, reject) => {
        try {
            await page.waitForSelector(selector, { timeout }).then(() => {
                resolve();
            });
        } catch (e) {
            console.log(e);
            reject();
        }
    });

export const waitForNavigation = (
    page: puppeteer.Page,
    options: puppeteer.NavigationOptions
) =>
    new Promise<void>(async (resolve, reject) => {
        try {
            await page.waitForNavigation(options).then(() => {
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
