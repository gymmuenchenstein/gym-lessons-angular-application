import {Temporal} from "@js-temporal/polyfill";
import Duration = Temporal.Duration;
import {CalendarDataClass} from "./calendar-data-class";
import PlainDateTime = Temporal.PlainDateTime;

export interface CalendarDataEntry {
    index: number,
    teacher: string,
    abbr: string,
    room: string,
    lesson: string,
    class: CalendarDataClass,
    datetime: PlainDateTime
    duration: Duration
}
