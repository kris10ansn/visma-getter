import React from "react";
import { Unit, useLiveDate } from "src/util/useLiveDate";

const time = (date: Date) => {
    return (
        date.getHours() +
        date.getMinutes() / Math.pow(60, 1) +
        date.getSeconds() / Math.pow(60, 2)
    );
};

const NowLine: React.FC = () => {
    const now = useLiveDate(Unit.Second);

    return (
        <div
            style={{
                width: "100%",
                height: "3px",
                background: "red",
                position: "absolute",
                top: `${((time(now) - 8) / 8) * 1000}px`,
            }}
        ></div>
    );
};

export default NowLine;
