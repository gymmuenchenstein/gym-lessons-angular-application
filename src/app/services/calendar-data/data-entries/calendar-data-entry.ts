import {Temporal} from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;
import PlainTime = Temporal.PlainTime;
import Duration = Temporal.Duration;
import {CalendarDataClass} from "./calendar-data-class";

export interface CalendarDataEntry {
    index: number,
    teacher: string,
    abbr: string,
    room: string,
    lesson: string,
    class: CalendarDataClass,
    date: PlainDate
    time: {
        time: PlainTime,
        duration: Duration
    }
}
