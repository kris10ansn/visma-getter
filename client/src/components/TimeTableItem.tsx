import React from "react";
import { ITimeTableItem } from "src/util/TimeTableInfo";
import "src/components/TimeTableItem.scss";
import { HiOutlineLocationMarker } from "@react-icons/all-files/hi/HiOutlineLocationMarker";
import { HiOutlineClock } from "@react-icons/all-files/hi/HiOutlineClock";
import { HiOutlineCalendar } from "@react-icons/all-files/hi/HiOutlineCalendar";

interface Props {
    top: string;
    height: string;
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
        case "SUBSTITUTION":
            return "Vikartime";
        default:
            return type;
    }
};

const TimeTableItem: React.FC<Props> = ({ item, top, height }) => {
    const styles: { [key: string]: React.CSSProperties } = {
        main: {
            top,
            height,
            borderColor: `#ccc #ccc #ccc #${item.colour}`,
        },
    };

    return (
        <div className="TimeTableItem" style={styles.main}>
            <div className="info">
                <small>
                    <HiOutlineClock />
                    {item.startTime}-{item.endTime}
                </small>
                <small>
                    <HiOutlineLocationMarker />
                    {item.locations.join(" ")}
                </small>
            </div>
            <p>{item.subject || item.label}</p>
            <small>{item.subject ? item.label : ""}</small>
            <small>
                <HiOutlineCalendar />
                {norwegian(item.type)}
            </small>
        </div>
    );
};

export default TimeTableItem;
