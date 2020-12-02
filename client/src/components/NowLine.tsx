import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
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

const constrain = (n: number) => Math.max(8, Math.min(15.475, n));

const NowLine: React.FC = () => {
    const now = useLiveDate(Unit.Second);
    const [time, setTime] = useState<number>(constrain(num(now)));

    useEffect(() => {
        setTime(constrain(num(now)));
    }, [now, setTime]);

    return (
        <div
            className="NowLine"
            style={{
                top: style(pos(time)),
            }}
        >
            <div className="time-container">
                <span className="time">{now.format("HH:ss")}</span>
            </div>
        </div>
    );
};

export default NowLine;
