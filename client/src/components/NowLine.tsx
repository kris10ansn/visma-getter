import dayjs from "dayjs";
import React from "react";
import { Unit, useLiveDate } from "src/util/useLiveDate";

const num = (date: dayjs.Dayjs) => {
    return (
        date.hour() +
        date.minute() / Math.pow(60, 1) +
        date.second() / Math.pow(60, 2)
    );
};

const NowLine: React.FC = () => {
    const now = useLiveDate(Unit.Second);
    const time = Math.max(8, Math.min(15.25, num(now)));

    return (
        <div
            style={{
                width: "100%",
                height: "3px",
                background: "red",
                position: "absolute",
                top: `${((time - 8) / 8) * 1000}px`,
            }}
        ></div>
    );
};

export default NowLine;
