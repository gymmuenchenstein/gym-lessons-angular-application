import {Temporal} from "@js-temporal/polyfill";
import Duration = Temporal.Duration;
import PlainDateTime = Temporal.PlainDateTime;
import {CalendarDataClassDepartment} from "./calendar-data-class-department";

export interface CalendarDataEntry {
    index: number,
    teacher: {
        name: string,
        abbr: string
    },
    room: string,
    lesson: string,
    class: {
        full: string,
        department: CalendarDataClassDepartment,
        year: number,
        alpha: string
    },
    datetime: PlainDateTime
    duration: Duration
}
