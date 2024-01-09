import {Temporal} from "@js-temporal/polyfill";
import Duration = Temporal.Duration;
import PlainDateTime = Temporal.PlainDateTime;
import {CalendarDataClassDepartment} from "./calendar-data-class-department";

export class CalendarDataEntry {
    index: number = 0
    teachers: {
        surname: string,
        name: string,
        abbr: string
    }[] = []
    room: string = ""
    lesson: string = ""
    classes: {
        full: string,
        department: CalendarDataClassDepartment,
        year: number,
        alpha: string
    }[] = []
    datetime: PlainDateTime | undefined
    duration: Duration | undefined
}
