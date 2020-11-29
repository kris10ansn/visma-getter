import puppeteer from "puppeteer-core";
import { tryCatch } from "./tryCatch";

export const waitForSelector = async (
    page: puppeteer.Page,
    selector: string,
    timeout = 10000
) => tryCatch(async () => await page.waitForSelector(selector, { timeout }));

export const waitForNavigation = async (
    page: puppeteer.Page,
    options: puppeteer.NavigationOptions
) => tryCatch(async () => await page.waitForNavigation(options));
