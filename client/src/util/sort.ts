import dayjs from "dayjs";
import num from "./numFromTime";
import { ITimeTableInfo, ITimeTableItem } from "./TimeTableInfo";

const { stringify: str } = JSON;

const combine = (x: ITimeTableItem, _index: number, day: ITimeTableItem[]) => {
    const next = day.find(
        (it) =>
            it.startTime === x.endTime &&
            it.subjectCode === x.subjectCode &&
            str(it.locations) === str(x.locations) &&
            it !== x
    );

    if (next) {
        next["remove"] = true;

        return {
            ...x,
            origEndTime: x.endTime,
            endTime: next.endTime,
        };
    } else {
        return x;
    }
};

const sort = (
    timetable: ITimeTableInfo,
    date: dayjs.Dayjs
): ITimeTableItem[][] => {
    const days: ITimeTableItem[][] = [];
    const { timetableItems, daysInWeek } = timetable;

    for (let i = 1; i <= daysInWeek; i++) {
        const dateString = date.weekday(i).format("DD/MM/YYYY");
        const day = timetableItems
            .filter((it) => it.date === dateString)
            .sort((a, b) => num(a.startTime) - num(b.startTime))
            .map(combine)
            .filter((it) => !it["remove"]);

        days.push(day);
    }
    return days;
};

export default sort;
