import React, { RefObject, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { ITimeTableInfo, ITimeTableItem } from "../util/TimeTableInfo";
import sort from "../util/sort";
import Day from "./Day";
import "./TimeTable.scss";
import { pos, style } from "src/util/pos";
import useInterval from "@use-it/interval";

const arr = (n: number) => Array(n).fill(null);

const get = async (date: dayjs.Dayjs) => {
    const doFetch = async () => {
        const SERVER = process.env.REACT_APP_SERVER;
        const response = await fetch(
            `${SERVER}/timetable?week=${date.isoWeek()}&year=${date.year()}`
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
    const self = useRef() as RefObject<HTMLDivElement>;
    const { current } = self;

    const url = new URL(window.location.href);
    const week = Number(url.searchParams.get("week")) || dayjs().isoWeek();
    const year = Number(url.searchParams.get("year")) || dayjs().year();

    const [height, setHeight] = useState<number>();
    const [date] = useState<dayjs.Dayjs>(dayjs().year(year).isoWeek(week));
    const [timetable, setTimetable] = useState<ITimeTableInfo>();
    const [days, setDays] = useState<ITimeTableItem[][]>();
    const [mobile, setMobile] = useState<boolean>();

    useInterval(() => {
        if (self.current) {
            const parent = self.current.parentElement!;
            setHeight(parent.clientHeight);

            if (self.current.clientWidth < 750) {
                setMobile(true);
            } else {
                setMobile(false);
            }
        }
    }, 100);

    useEffect(() => {
        if (height && current) {
            current.style.setProperty("--height", `${height}px`);
        }
    }, [height, current]);

    useEffect(() => {
        setTimetable(undefined);
        get(date).then((json) => setTimetable(json));
    }, [date]);

    useEffect(() => {
        if (timetable) {
            setDays(sort(timetable, date));
        }
    }, [timetable, setDays, date]);

    if (!days) {
        return <div>Loading...</div>;
    }

    return (
        <div className="TimeTable">
            <div className="TimeTable__inner" ref={self}>
                <div className={`hours ${mobile ? "hidden" : ""}`}>
                    {arr(8).map((_, i) => (
                        <div
                            key={i}
                            className="hour"
                            style={{
                                top: style(pos(8 + i)),
                            }}
                        >
                            {date.hour(i + 8).format("HH:00")}
                        </div>
                    ))}
                </div>
                {days?.map((day, index) => {
                    return (
                        <Day
                            day={day}
                            date={date.day(index + 1)}
                            key={index}
                            hidden={(mobile && index + 1 !== date.day())!}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default TimeTable;
