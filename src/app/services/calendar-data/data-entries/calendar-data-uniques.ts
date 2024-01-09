import {Temporal} from "@js-temporal/polyfill";
import Duration = Temporal.Duration;
import PlainDateTime = Temporal.PlainDateTime;
import {CalendarDataClassDepartment} from "./calendar-data-class-department";

export class CalendarDataUniques {
    indices: number[] = []
    teachers: {
        surname: string,
        name: string,
        abbr: string
    }[] = []
    rooms: string[] = []
    lessons: string[] = []
    classes: {
        full: string,
        department: CalendarDataClassDepartment,
        year: number,
        alpha: string
    }[] = []
}
