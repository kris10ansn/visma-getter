import React from "react";
import { ITimeTableItem } from "src/util/TimeTableInfo";
import "src/components/TimeTableItem.scss";
import { HiOutlineLocationMarker } from "@react-icons/all-files/hi/HiOutlineLocationMarker";
import { HiOutlineClock } from "@react-icons/all-files/hi/HiOutlineClock";

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
        default:
            return null;
    }
};

const TimeTableItem: React.FC<Props> = ({ item, top, height }) => {
    const styles: { [key: string]: React.CSSProperties } = {
        main: {
            top,
            height,
            borderColor: `#ccc #ccc #ccc #${item.colour}`,
        },
        icon: {
            transform: "translateY(14.5%)",
            marginRight: 4,
            marginLeft: 4,
        },
        info: {
            marginLeft: -4,
        },
    };

    return (
        <div className="TimeTableItem" style={styles.main}>
            <div className="info" style={styles.info}>
                <small>
                    <HiOutlineClock style={styles.icon} />
                    {item.startTime}-{item.endTime}
                </small>
                <small>
                    <HiOutlineLocationMarker style={styles.icon} />
                    {item.locations.join(" ")}
                </small>
            </div>
            <p>{item.subject || item.label}</p>
            <small>{item.subject ? item.label : ""}</small>
            <small>{norwegian(item.type)}</small>
        </div>
    );
};

export default TimeTableItem;
