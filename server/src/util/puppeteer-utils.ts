import puppeteer from "puppeteer-core";

export const waitForSelector = async (
    page: puppeteer.Page,
    selector: string,
    timeout = 10000
) => {
    try {
        await page.waitForSelector(selector, { timeout });
    } catch (e) {
        throw e;
    }

    return true;
};

export const waitForNavigation = async (
    page: puppeteer.Page,
    options: puppeteer.NavigationOptions
) => {
    try {
        await page.waitForNavigation(options);
    } catch (e) {
        throw e;
    }

    return true;
};
