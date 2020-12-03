import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { FixedArray } from "./FixedArray";

export enum Unit {
    Year = 0,
    Month = 1,
    Day = 2,
    Hour = 3,
    Minute = 4,
    Second = 5,
    MilliSecond = 6,
}

export const useLiveDate = (unit: Unit): dayjs.Dayjs => {
    const initial = useMemo(() => dayjs(), []);
    const [date, setDate] = useState<dayjs.Dayjs>(initial);

    const updateDate = () => {
        setDate(dayjs());
    };

    useEffect(() => {
        const values = [
            date?.year(),
            date?.month(),
            date?.date(),
            date?.hour(),
            date?.minute(),
            date?.second(),
            date?.millisecond(),
        ].map((value, index) => {
            if (index === unit) {
                return value! + 1;
            } else if (index > unit) {
                return 0;
            }

            return value;
        }) as FixedArray<number, 7>;

        const next = new Date(...values);
        const delay = next.valueOf() - date.valueOf();
        const timeout = setTimeout(updateDate, delay);
        return () => clearTimeout(timeout);
    }, [unit, date, setDate]);

    return date;
};
