import {Temporal} from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;
import PlainTime = Temporal.PlainTime;
import Duration = Temporal.Duration;

export interface DataEntry {
    index: number,
    abbr: string,
    room: string,
    lesson: string,
    class: string,
    date: PlainDate
    time: {
        time: PlainTime,
        duration: Duration
    }
}
