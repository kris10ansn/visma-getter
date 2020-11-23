import dayjs from "dayjs";
import React from "react";
import { ITimeTableItem } from "src/util/TimeTableInfo";
import { intersects } from "../util/intersects";
import NowLine from "./NowLine";
import TimeTableCell from "./TimeTableCell";

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
    index: number;
}

const style: React.CSSProperties = {
    flex: "1 1 0",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    height: "100%",
};

const Day: React.FC<Props> = ({ day, date, index }) => {
    const cells = group(day);

    return (
        <div className="Day" style={style}>
            {index + 1 === date.day() && <NowLine />}
            {cells.map((cellItems, index) => (
                <TimeTableCell items={cellItems} key={index} />
            ))}
        </div>
    );
};

export default Day;
