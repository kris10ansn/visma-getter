import React from "react";
import { ITimeTableItem } from "src/util/TimeTableInfo";
import num from "src/util/numFromTime";
import { max, min } from "src/util/math";
import TimeTableItem from "./TimeTableItem";
import { intersects } from "src/util/intersects";
import "./TimeTableCell.scss";
import { pos, style } from "src/util/pos";

interface Props {
    items: ITimeTableItem[];
}

const group = (_items: ITimeTableItem[]) => {
    const items = _items.slice();
    const grouped = [];
    const used = new Set();

    for (const a of items) {
        if (used.has(a)) break;
        const group = [];

        for (const b of items) {
            if (a === b || used.has(b)) break;
            const i = intersects(a, b);
            if (!i) {
                group.push(b);
                used.add(b);

                const duplicate = grouped.findIndex(
                    (it) => it.length === 0 && it[0] === b
                );
                grouped.splice(duplicate, 1);
            }
        }

        grouped.push([...group, a]);
    }

    return grouped;
};

const TimeTableCell: React.FC<Props> = ({ items }) => {
    const startTime = min(items.map((a) => num(a.startTime)));
    const endTime = max(items.map((a) => num(a.endTime)));

    const grouped = group(items);

    const positioning: React.CSSProperties = {
        position: "absolute",
        top: style(pos(startTime)),
        height: style(pos(endTime - startTime)),
    };

    return (
        <div className="TimeTableCell" style={positioning}>
            {grouped.map((group, i) => {
                return (
                    <div className="group" key={i}>
                        {group.map((item, j) => {
                            const top = style(
                                pos(num(item.startTime)) - pos(startTime)
                            );
                            const height = style(
                                pos(num(item.endTime)) -
                                    pos(num(item.startTime))
                            );

                            return (
                                <TimeTableItem
                                    item={item}
                                    top={top}
                                    height={height}
                                    key={j}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default TimeTableCell;
