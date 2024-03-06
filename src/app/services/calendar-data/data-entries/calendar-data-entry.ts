import {CalendarDataClassDepartment} from "./calendar-data-class-department";
import {Duration} from "dayjs/plugin/duration";
import {Dayjs} from "dayjs";

export class CalendarDataEntry {
    index: number = 0
    teachers: {
        surname: string,
        name: string,
        abbr: string
    }[] = []
    room: string = ""
    lesson: {
        full: string,
        short: string
    } = { full: "", short: "" }
    classes: {
        full: string,
        department: CalendarDataClassDepartment,
        year: number,
        alpha: string
    }[] = []
    datetime: Dayjs | undefined
    duration: Duration | undefined
}
