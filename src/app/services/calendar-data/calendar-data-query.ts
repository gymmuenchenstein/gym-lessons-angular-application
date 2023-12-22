import {RawCalendarDataEntry} from "./data-entries/raw-calendar-data-entry";
import {CalendarDataEntry} from "./data-entries/calendar-data-entry";
import {Temporal} from "@js-temporal/polyfill";
import {CalendarDataClassDepartment} from "./data-entries/calendar-data-class-department";
import PlainDate = Temporal.PlainDate;
import {RawTeacherDataEntry} from "./data-entries/raw-teacher-data-entry";

export class CalendarDataQuery {

    private raw: RawCalendarDataEntry[];
    private teachers: RawTeacherDataEntry[];
    private readonly length: number;

    constructor(raw: RawCalendarDataEntry[], teachers: RawTeacherDataEntry[] = []) {
        this.raw = raw;
        this.length = raw.length;
        this.teachers = teachers;
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
        const startDate = rootDate.subtract({days: rootDate.dayOfWeek - 1});
        const endDate = startDate.add(Temporal.Duration.from({days: 6}));

        this.raw = this.raw.filter((entry) => {
            return (entry.day >= startDate.day && entry.month >= startDate.month && entry.year >= startDate.year) &&
                (entry.day <= endDate.day && entry.month <= endDate.month && entry.year <= endDate.year)
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
     * Filters all calendar entries by the condition of similarity to the teachers abbreviation
     * @param args lesson
     */
    lesson(args: { lesson: string }) {
        this.raw = this.raw.filter((entry) => {
            return entry.lesson.toLowerCase().includes(args.lesson.toLowerCase());
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
     * The returned list is empty if no filters have been applied previously.
     * <br>
     * ---
     * *Note: this step is done last since it is a serious bottleneck for large amounts of data*
     * @returns the cleaned calendar data, as in: combined duplicates / overlaps and readable datatype
     */
    export() {
        const clean: CalendarDataEntry[] = [];

        if (this.length <= this.raw.length) return [];

        // TODO: merge duplicate/overlapping entries

        let obj: CalendarDataEntry;
        for (const entry of this.raw) {
            const teacher = this.teachers.filter((teacher) => { return teacher.abbr == entry.abbr})[0];
            obj = {
                index: entry.index,
                teacher: {
                    surname: teacher.surname,
                    name: teacher.name,
                    abbr: entry.abbr
                },
                room: entry.room,
                lesson: entry.lesson,
                class: {
                    full: entry.class,
                    department: {
                        "m": CalendarDataClassDepartment.MA,
                        "f": CalendarDataClassDepartment.FMS
                    }[entry.class.toLowerCase().slice(0, 1)] as CalendarDataClassDepartment,
                    year: Number(entry.class.slice(1, 2)),
                    alpha: entry.class.slice(2, 3).toLowerCase()
                },
                datetime: Temporal.PlainDateTime.from({
                    year: Number(entry.year),
                    month: Number(entry.month),
                    day: Number(entry.day)
                }).withPlainTime(Temporal.PlainTime.from((String(entry.time).length === 3 ? '0' : '') + String(entry.time))),
                duration: Temporal.Duration.from({minutes: Number(entry.duration)})
            }
            clean.push(obj);
        }

        return clean;
    }
}
