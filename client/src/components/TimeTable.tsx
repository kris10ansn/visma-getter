import React, { RefObject, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { ITimeTableInfo, ITimeTableItem } from "../util/TimeTableInfo";
import sort from "../util/sort";
import Day from "./Day";
import "./TimeTable.scss";
import { SERVER } from "../config.json";
import { pos, style } from "src/util/pos";
import { withResizeDetector } from "react-resize-detector";

const arr = (n: number) => Array(n).fill(null);

const get = async (date: dayjs.Dayjs) => {
    const doFetch = async () => {
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

interface Props {
    height: number;
    width: number;
}
const TimeTable: React.FC<Props> = () => {
    const self = useRef() as RefObject<HTMLDivElement>;

    const url = new URL(window.location.href);
    const week = Number(url.searchParams.get("week")) || dayjs().isoWeek();
    const year = Number(url.searchParams.get("year")) || dayjs().year();

    const [date] = useState<dayjs.Dayjs>(dayjs().year(year).isoWeek(week));
    const [timetable, setTimetable] = useState<ITimeTableInfo>();
    const [days, setDays] = useState<ITimeTableItem[][]>();

    if (self.current) {
        const height = self.current.parentElement?.clientHeight;
        self.current.style.setProperty("--height", `${height}px`);
    }

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
                <div className="hours">
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
                {days?.map((day, index) => (
                    <Day day={day} date={date} index={index} key={index} />
                ))}
            </div>
        </div>
    );
};

export default withResizeDetector(TimeTable, { handleHeight: true });
