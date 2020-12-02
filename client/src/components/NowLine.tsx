import dayjs from "dayjs";
import React, { RefObject, useRef } from "react";
import { pos, style } from "src/util/pos";
import { Unit, useLiveDate } from "src/util/useLiveDate";
import "./NowLine.scss";

const num = (date: dayjs.Dayjs) => {
    return (
        date.hour() +
        date.minute() / Math.pow(60, 1) +
        date.second() / Math.pow(60, 2)
    );
};

const constrain = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));

const NowLine: React.FC = () => {
    const getTime = (now: dayjs.Dayjs) => constrain(num(now), 8, 15.475);
    const now = useLiveDate(Unit.Second);
    const position = pos(getTime(now));
    const timeSpanCopy = useRef() as RefObject<HTMLDivElement>;
    const timeContainer = useRef() as RefObject<HTMLDivElement>;

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            top: style(position),
            bottom: "",
        },
        span: {
            transform: "translateY(-40%)",
        },
        spanCopy: {
            transform: "translateY(-40%)",
            visibility: "hidden",
        },
    };

    if (timeSpanCopy.current && timeContainer.current) {
        const timetable = document
            .querySelector("div.TimeTable")!
            .getBoundingClientRect();

        const containerBounds = timeContainer.current.getBoundingClientRect();
        const bounds = timeSpanCopy.current.getBoundingClientRect();

        if (bounds.top < timetable.top) {
            styles.span.transform = "translate(0)";
            styles.span.top = timetable.top - containerBounds.top;
        }

        if (bounds.bottom > timetable.bottom) {
            styles.span.transform = "translate(0)";
            styles.span.bottom = containerBounds.bottom - timetable.bottom;
        }
    }

    return (
        <div className="NowLine" style={styles.container}>
            <div className="time-container" ref={timeContainer}>
                <span
                    className="time"
                    style={styles.spanCopy}
                    ref={timeSpanCopy}
                >
                    00:00:00
                </span>
                <span className="time" style={styles.span}>
                    {now.format("HH:mm:ss")}
                </span>
            </div>
        </div>
    );
};

export default NowLine;
