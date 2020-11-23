import { useEffect, useMemo, useState } from "react";

export enum Unit {
    Year = 0,
    Month = 1,
    Day = 2,
    Hour = 3,
    Minute = 4,
    Second = 5,
    MilliSecond = 6,
}

export const useLiveDate = (unit: Unit) => {
    const initial = useMemo(() => new Date(), []);
    const [date, setDate] = useState<Date>(initial);

    useEffect(() => {
        const values = [
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds(),
        ].map((value, index) => {
            if (index === unit) {
                return value + 1;
            } else if (index > unit) {
                return 0;
            }
            return value;
        });

        // @ts-ignore
        const next: Date = new Date(...values);
        const delayMs = next.getTime() - date.getTime();
        const timeout = setTimeout(setDate, delayMs, next);
        return () => clearTimeout(timeout);
    }, [unit, date, setDate]);

    return date;
};
