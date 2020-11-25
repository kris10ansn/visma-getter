import * as math from "src/util/math";
import num from "src/util/numFromTime";
import { ITimeTableItem } from "src/util/TimeTableInfo";

export const intersects = (a: ITimeTableItem, b: ITimeTableItem) => {
    const rangeA = [num(a.startTime) + 0.01, num(a.endTime) - 0.01];
    const rangeB = [num(b.startTime) + 0.01, num(b.endTime) - 0.01];

    const min = math.min(rangeA) < math.min(rangeB) ? rangeA : rangeB;
    const max = math.max(rangeA) > math.max(rangeB) ? rangeA : rangeB;

    return !(min[min.length - 1] < max[0]);
};
