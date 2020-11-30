import React from "react";
import { ITimeTableItem } from "src/util/TimeTableInfo";
import "src/components/TimeTableItem.scss";

interface Props {
    top: number;
    height: number;
    item: ITimeTableItem;
}

const norwegian = (type: string) => {
    switch (type) {
        case "LESSON":
            return "Undervisningstime";
        case "ASSESSMENT":
            return "Vurdering";
        case "EVENT":
            return "Avtale";
        case "ACTIVITY":
            return "Aktivitet";
        default:
            return null;
    }
};

const TimeTableItem: React.FC<Props> = ({ item, top, height }) => {
    const styles: React.CSSProperties = {
        top: `calc(${top} * var(--height))`,
        height: `calc(${height} * var(--height))`,
        borderColor: `#ccc #ccc #ccc #${item.colour}`,
    };
    return (
        <div className="TimeTableItem" style={styles}>
            <div className="info">
                <small>
                    {item.startTime}-{item.endTime}
                </small>{" "}
                <small>{item.locations.join(" ")}</small>
            </div>
            <p>{item.subject || item.label}</p>
            <small>{item.subject ? item.label : ""}</small>
            <small>{norwegian(item.type)}</small>
        </div>
    );
};

export default TimeTableItem;
