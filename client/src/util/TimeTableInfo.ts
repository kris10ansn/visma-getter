export interface ITimeTableItem {
    id: number | null;
    startTime: string;
    endTime: string;
    date: string;
    tenant: number;
    academicYearId: number | null;
    entityId: number;
    label: string;
    type: string;
    originalType: string | null;
    locations: string[];
    colour: string;
    teachingGroupId: number;
    subjectCode: string;
    subject: string;
    assesment: null;
    hasFutureAbsence: boolean;
    teacherName: string;
    extraInfo: null;
}

export interface ITimeTableInfo {
    startDate: string;
    startTime: string;
    endTime: string;
    absences: Array<any>;
    daysInWeek: number;
    timetableItems: Array<ITimeTableItem>;
}
