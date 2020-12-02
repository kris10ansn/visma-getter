import dayjs from "dayjs";
import React, { RefObject, useRef } from "react";
import inViewport from "src/util/inViewport";
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
    const timeElement = useRef() as RefObject<HTMLDivElement>;
    const getTime = (now: dayjs.Dayjs) => constrain(num(now), 8, 15.475);
    const now = useLiveDate(Unit.Second);
    const position = pos(getTime(now));

    const styles = {
        container: {
            top: style(position),
        },
        span: {
            transform: "translateY(-40%)",
        },
    };

    if (timeElement.current && !inViewport(timeElement.current)) {
        styles.span["transform"] = "translate(0)";
        const prop = getTime(now) > 15 ? "bottom" : "top";
        styles.span[prop] = -1;
    }

    return (
        <div className="NowLine" style={styles.container}>
            <div className="time-container">
                <span className="time" style={styles.span} ref={timeElement}>
                    {now.format("HH:mm:ss")}
                </span>
            </div>
        </div>
    );
};

export default NowLine;
