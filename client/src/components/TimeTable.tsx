import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ITimeTableInfo } from "../util/TimeTableInfo";
import sort from "../util/sort";
import Day from "./Day";
import "./TimeTable.scss";
import { SERVER } from "../config.json";

const arr = (n: number) => Array(n).fill(null);

const get = async (date: dayjs.Dayjs) => {
    const doFetch = async () => {
        const response = await fetch(
            `${SERVER}/timetable?week=${date.week()}&year=${date.year()}`
        );
        return await response.json();
    };

    for (let i = 0; i < 6; i++) {
        const json = await doFetch().catch((x) => null);

        if (json !== null) {
            return json;
        }
    }

    return null;
};

const TimeTable: React.FC = () => {
    const url = new URL(window.location.href);
    const week = Number(url.searchParams.get("week")) || dayjs().week();
    const year = Number(url.searchParams.get("year")) || dayjs().year();

    const [date] = useState<dayjs.Dayjs>(dayjs().year(year).week(week));
    const [timetable, setTimetable] = useState<ITimeTableInfo>();

    useEffect(() => {
        setTimetable(undefined);
        get(date).then((json) => setTimetable(json));
    }, [date]);

    if (!timetable) {
        return <div>Loading...</div>;
    }

    const days = sort(timetable, date);

    return (
        <div className="TimeTable">
            <div className="hours">
                {arr(8).map((_, i) => (
                    <div
                        key={i}
                        className="hour"
                        style={{
                            top: `calc((var(--height) / 7.5) * ${i})`,
                        }}
                    >
                        {date.hour(i + 8).format("HH:00")}
                    </div>
                ))}
            </div>
            {days.map((day, index) => (
                <Day day={day} date={date} index={index} key={index} />
            ))}
        </div>
    );
};

export default TimeTable;
