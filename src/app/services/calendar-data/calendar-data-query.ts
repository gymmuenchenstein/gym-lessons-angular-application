import {RawCalendarDataEntry} from "./data-entries/raw-calendar-data-entry";
import {CalendarDataEntry} from "./data-entries/calendar-data-entry";
import {Temporal} from "@js-temporal/polyfill";

export class CalendarDataQuery {

    private raw: RawCalendarDataEntry[];

    constructor(raw: RawCalendarDataEntry[]) {
        this.raw = raw;
    }

    /**
     * Filters all calendar entries by the condition of the exact day
     * @param args year, month and day
     */
    day(args: { year: number, month: number, day: number }) {
        this.raw = this.raw.filter((entry) => {
            return entry.day == args.day && entry.month == args.month && entry.year == args.year;
        });
        return this;
    }

    /**
     * Filters all calendar entries by the condition of the same week (of year)
     * @param args year, month and day (any day of the week)
     */
    week(args: { year: number, month: number, day: number }) {
        const rootDate = Temporal.PlainDate.from(args);
        const startDate = rootDate.subtract({days: rootDate.dayOfWeek});
        const endDate = startDate.add(Temporal.Duration.from({weeks: 1}));

        this.raw = this.raw.filter((entry) => {
            return (entry.day >= startDate.day && entry.month >= startDate.month && entry.year >= startDate.year) &&
                (entry.day >= endDate.day && entry.month >= endDate.month && entry.year >= endDate.year)
        });
        return this;
    }

    /**
     * Filters all calendar entries by the condition of being in the month
     * @param args year and month
     */
    month(args: { year: number, month: number }) {
        this.raw.filter((entry) => {
            return entry.month == args.month && entry.year >= args.year
        });
        return this;
    }

    /**
     * Filters all calendar entries by the condition of similarity to the class
     * @param args class
     */
    class(args: { class: string }) {
        this.raw = this.raw.filter((entry) => {
            return entry.class.includes(args.class);
        });
        return this;
    }

    /**
     * Filters all calendar entries by the condition of similarity to the teachers abbreviation
     * @param args class
     */
    abbr(args: { abbr: string }) {
        this.raw = this.raw.filter((entry) => {
            return entry.abbr.toLowerCase().includes(args.abbr.toLowerCase());
        });
        return this;
    }

    /**
     * Filters all calendar entries by the condition of similarity to the teachers name
     * @param args the teachers name
     */
    teacher(args: { teacher: string }) {
        // TODO
        this.raw = this.raw.filter((entry) => {
            return false;
        });
        return this;
    }

    /**
     * When the calendar data has been filtered, this method is used to export it to a more readable format.
     * <br>
     * ---
     * *Note: this step is done last since it is a serious bottleneck for large amounts of data*
     * @returns the cleaned calendar data, as in: combined duplicates / overlaps and readable datatype
     */
    export() {
        const clean: CalendarDataEntry[] = [];

        // TODO: merge duplicate/overlapping entries

        let obj: CalendarDataEntry;
        for (const entry of this.raw) {
            obj = {
                index: entry.index,
                abbr: entry.abbr,
                room: entry.room,
                lesson: entry.lesson,
                class: entry.class,
                date: Temporal.PlainDate.from({
                    year: Number(entry.year),
                    month: Number(entry.month),
                    day: Number(entry.day)
                }),
                time: {
                    time: Temporal.PlainTime.from((String(entry.time).length == 3 ? "0" : "") + entry.time),
                    duration: Temporal.Duration.from({minutes: Number(entry.duration)})
                }
            }
            clean.push(obj);
        }

        return clean;
    }
}
