import express from "express";
import fetch from "node-fetch";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import getSession from "./getSession";
import cors from "cors";
import puppeteer from "puppeteer-core";
import nullify from "./util/nullify";
import json from "./util/json";
import path from "path";
import getEnv from "./util/getEnv";
import error from "./util/error";

dayjs.extend(weekOfYear);

const PORT = getEnv("PORT");
const url =
    "https://sandnes-vgs.inschool.visma.no/control/timetablev2/learner/7672361/fetch/ALL/0/current";
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));

let jsession: puppeteer.Cookie | undefined;
const getCookie = () => `JSESSIONID=${jsession?.value}`;

let refreshing = false;
const refreshCookie = async (): Promise<puppeteer.Cookie> => {
    refreshing = true;

    const session = await getSession().catch(error);

    refreshing = false;
    if (session) {
        return session;
    } else {
        return await refreshCookie();
    }
};

refreshCookie().then((session) => {
    jsession = session;
    console.log("jsession loaded!");
});

const cookieCheck = async () => {
    console.group("cookie check");

    for (let i = 0; i < 6; i++) {
        const cookie = getCookie();
        const res = await fetch(`${url}?forWeek=1/10/2020`, {
            headers: { cookie },
        })
            .then(json)
            .catch(nullify);

        if (res !== null) {
            console.log("valid jsession");
            console.groupEnd();
            return;
        }
    }

    if (!refreshing) {
        console.log("refresh");
        await refreshCookie().catch(error);
    } else {
        console.log("already refreshing...");
    }
    console.groupEnd();
};
setInterval(cookieCheck, 1000 * 60);

app.get("/logs", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "output.log"));
});

app.get("/timetable", async (req, res) => {
    if (!jsession) {
        res.status(503);
        res.send("jsession not ready");
        return;
    }

    const week = Number(req.query.week) || dayjs().week();
    const year = Number(req.query.year) || dayjs().year();
    const date = dayjs().day(1).year(year).week(week);

    const dateString = date.format("DD/MM/YYYY");
    const cookie = getCookie();

    const timeTable = await fetch(`${url}?forWeek=${dateString}`, {
        headers: { cookie },
    })
        .then(json)
        .catch(nullify);

    if (timeTable != null) {
        res.json(timeTable);
    } else {
        res.status(503);
        res.send("Server error");
    }
});

app.listen(PORT, () => {
    console.log(`Active on port ${PORT}`);
});
