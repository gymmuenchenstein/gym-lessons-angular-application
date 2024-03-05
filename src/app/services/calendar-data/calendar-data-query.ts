import {RawCalendarDataEntry} from "./data-entries/raw-calendar-data-entry";
import {CalendarDataEntry} from "./data-entries/calendar-data-entry";
import {CalendarDataClassDepartment} from "./data-entries/calendar-data-class-department";
import {RawTeacherDataEntry} from "./data-entries/raw-teacher-data-entry";
import dayjs from "dayjs";
import dayjsObjectSupport from "dayjs/plugin/objectSupport";
import dayjsDuration from "dayjs/plugin/duration";
import {CalendarFilterService} from "../calendar-filter/calendar-filter.service";

dayjs.extend(dayjsObjectSupport);
dayjs.extend(dayjsDuration);

export class CalendarDataQuery {

    private raw: RawCalendarDataEntry[];
    private teachers: RawTeacherDataEntry[];

    private useFilter: boolean;
    private filter: CalendarFilterService;

    constructor(raw: RawCalendarDataEntry[], teachers: RawTeacherDataEntry[] = [], useFilter = true, filter: CalendarFilterService) {
        this.raw = raw;
        this.teachers = teachers;

        this.useFilter = useFilter;
        this.filter = filter;
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
        args.month=args.month-1
        const rootDate = dayjs(args);
        const startDate = rootDate.subtract({days: rootDate.day()-1 });
        const endDate = startDate.add(dayjs.duration({days: 6}));

        this.raw = this.raw.filter((entry) => {
            const entrydate=dayjs({year:entry.year,month:entry.month-1,date:entry.day,hour:12});
            return entrydate.isAfter(startDate) && entrydate.isBefore(endDate);
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
     * Filters all calendar entries by the lesson name
     * @param args lesson
     */
    lesson(args: { lesson: string }) {
        this.raw = this.raw.filter((entry) => {
            return entry.lesson.toLowerCase().includes(args.lesson.toLowerCase());
        });
        return this;
    }

    /**
     * Filters all calendar entries by room
     * @param args room
     */
    room(args: { room: string }) {
        this.raw = this.raw.filter((entry) => {
            return entry.room.toLowerCase().includes(args.room.toLowerCase());
        });
        return this;
    }

    /**
     * Filters all calendar entries by the condition of similarity to the teachers name
     * @param args the teachers name
     */
    teacher(args: { teacher: string }) {
        this.raw = this.raw.filter((entry) => {
            const teachers = this.teachers.filter(value => {
                return (value.surname + value.name).toLowerCase().includes(args.teacher.replaceAll(" ", "").toLowerCase());
            });
            for (const teacher of teachers) {
                const valid = teacher.abbr === entry.abbr;
                if (valid)
                    return true;
            }
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
        if (this.useFilter)
            this.filter.filter(this);

        let clean: CalendarDataEntry[] = [];

        let obj: CalendarDataEntry;
        for (const entry of this.raw) {
            const teacher = this.teachers.filter((teacher) => {
                return teacher.abbr == entry.abbr
            })[0];
            obj = {
                index: entry.index,
                teachers: [{
                    surname: teacher?.surname,
                    name: teacher?.name,
                    abbr: entry.abbr
                }],
                room: entry.room,
                lesson: entry.lesson,
                classes: [{
                    full: entry.class,
                    department: {
                        "m": CalendarDataClassDepartment.MA,
                        "f": CalendarDataClassDepartment.FMS
                    }[entry.class.toLowerCase().slice(0, 1)] as CalendarDataClassDepartment,
                    year: Number(entry.class.slice(1, 2)),
                    alpha: entry.class.slice(2, 3).toLowerCase()
                }],
                datetime: dayjs({
                    year: Number(entry.year),
                    month: Number(entry.month)-1,
                    day: Number(entry.day),
                    minute: Number(String(entry.time).slice(String(entry.time).length - 2, String(entry.time).length)),
                    hour: Number(String(entry.time).slice(0, String(entry.time).length - 2)),
                }),
                duration: dayjs.duration({minutes: Number(entry.duration)})
            }

            const duplicate = clean.find((duplicate) => {
                return duplicate.index == obj.index && duplicate.room == obj.room && duplicate.lesson == obj.lesson;
            });
            if (duplicate !== undefined) {
                clean = clean.map((enteredEntry) => {
                    if (enteredEntry.index == obj.index && enteredEntry.room == obj.room && enteredEntry.lesson == obj.lesson) {
                        for (const classes of obj.classes) {
                            if (enteredEntry.classes.find((enteredClass) => {
                                return enteredClass.full === classes.full
                            }) === undefined && classes.full !== "")
                                enteredEntry.classes.push(classes);
                        }
                        for (const teacher of obj.teachers) {
                            if (enteredEntry.teachers.find((enteredTeacher) => {
                                return enteredTeacher.abbr === teacher.abbr
                            }) === undefined && teacher.abbr !== undefined)
                                enteredEntry.teachers.push(teacher);
                        }
                    }
                    return enteredEntry;
                });
            } else {
                clean.push(obj);
            }
        }

        return clean;
    }
}
