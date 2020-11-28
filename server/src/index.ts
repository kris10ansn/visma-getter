import express from "express";
import fetch from "node-fetch";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import getSession from "./getSession";
import cors from "cors";
import { Cookie } from "puppeteer-core";
import nullify from "./util/nullify";
import json from "./util/json";
import path from "path";
import getEnv from "./util/getEnv";

dayjs.extend(weekOfYear);

const PORT = getEnv("PORT");
const url =
    "https://sandnes-vgs.inschool.visma.no/control/timetablev2/learner/7672361/fetch/ALL/0/current";
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));

let jsession: Cookie | undefined;

getSession().then((session) => {
    jsession = session;
    console.log("jsession loaded!");
});

app.get("/logs", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "output.log"));
});

app.get("/timetable", async (req, res) => {
    if (!jsession) {
        res.status(503);
        res.send("jsession not ready");
        return;
    }
    if (!Number(req.query.week)) {
        res.status(404);
        res.send("No week parameter provided!");
        return;
    }

    const week = Number(req.query.week);
    const year = Number(req.query.year) || dayjs().year();
    const date = dayjs().year(year).week(week);

    const get = async (i = 0, refreshCookie = false): Promise<any> => {
        if (refreshCookie) jsession = await getSession();

        const cookie = `JSESSIONID=${jsession?.value}`;

        const dateString = date.format("DD/MM/YYYY");
        const response = await fetch(`${url}?forWeek=${dateString}`, {
            headers: { cookie },
        })
            .then(json)
            .catch(nullify);

        if (response !== null) {
            return response;
        } else if (refreshCookie === false) {
            return await get(++i, i > 4);
        } else {
            throw Error("Server error");
        }
    };

    const timeTable = await get();

    if (timeTable != null) {
        res.json(timeTable);
    } else {
        res.status(500);
        res.send("Server error");
    }
});

app.listen(PORT, () => {
    console.log(`Active on port ${PORT}`);
});
