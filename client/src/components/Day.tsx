import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ITimeTableItem } from "src/util/TimeTableInfo";
import { Unit, useLiveDate } from "src/util/useLiveDate";
import { intersects } from "../util/intersects";
import NowLine from "./NowLine";
import TimeTableCell from "./TimeTableCell";
import "./Day.scss";

const group = (_items: ITimeTableItem[]) => {
    const items = _items.slice();
    const grouped: ITimeTableItem[][] = [];
    const col: ITimeTableItem[][] = [];

    for (const a of items) {
        const collissions = [];
        for (const b of items) {
            if (intersects(a, b)) {
                collissions.push(b);
            }
        }
        col.push(collissions);
    }

    let used = [];
    for (let i = 0; i < col.length; i++) {
        const collisions = col[i];
        const overlap = col.find((c) =>
            c.find((it) => collisions.indexOf(it) !== -1)
        );

        if (overlap && used.indexOf(col.indexOf(overlap)) === -1) {
            const set = new Set([...collisions, ...overlap]);
            grouped.push(Array.from(set));
            used.push(i);
        }
    }

    return grouped;
};

interface Props {
    day: ITimeTableItem[];
    date: dayjs.Dayjs;
    hidden: boolean;
}

const Day: React.FC<Props> = ({ day, date, hidden }) => {
    const F = "DD/MM/YYYY";
    const cells = group(day);
    const now = useLiveDate(Unit.Day);

    const [nowLine, setNowLine] = useState(false);

    useEffect(() => {
        if (now.format(F) === date.format(F)) {
            setNowLine(true);
        } else {
            setNowLine(false);
        }
    }, [now, date, setNowLine]);

    return (
        <div className={`Day ${hidden ? "hidden" : ""}`}>
            {nowLine && <NowLine />}
            {cells.map((cellItems, index) => (
                <TimeTableCell items={cellItems} key={index} />
            ))}
        </div>
    );
};

export default Day;
