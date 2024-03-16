import { EventEmitter, Injectable } from "@angular/core";
import { CalendarDataQuery } from "../calendar-data/calendar-data-query";

@Injectable({
    providedIn: "root"
})
export class CalendarFilterService {

    private static readonly STORAGE_KEY = "CALENDAR_FILTER";

    currentFilterSequence: { [key: string]: any } = {};

    onChanged: EventEmitter<void> = new EventEmitter();

    constructor() {
        this.getFromStorage();
    }

    private getFromStorage(): void {
        const s = localStorage.getItem(CalendarFilterService.STORAGE_KEY);
        if (s) {
            this.currentFilterSequence = JSON.parse(s);
            this.onChanged.emit();
        }
    }

    private saveToStorage(): void {
        localStorage.setItem(CalendarFilterService.STORAGE_KEY, JSON.stringify(this.currentFilterSequence));
    }

    day(args: { year: number, month: number, day: number }, callChanged = true): CalendarFilterService {
        return this.changeFilter("day", args, callChanged);
    }

    week(args: { year: number, month: number, day: number }, callChanged = true): CalendarFilterService {
        return this.changeFilter("week", args, callChanged);
    }

    month(args: { year: number, month: number }, callChanged = true): CalendarFilterService {
        return this.changeFilter("month", args, callChanged);
    }

    class(args: { class: string }, callChanged = true): CalendarFilterService {
        return this.changeFilter("class", args, callChanged);
    }

    abbr(args: { abbr: string }, callChanged = true): CalendarFilterService {
        return this.changeFilter("abbr", args, callChanged);
    }

    lesson(args: { lesson: string }, callChanged = true): CalendarFilterService {
        return this.changeFilter("lesson", args, callChanged);
    }

    room(args: { room: string }, callChanged = true): CalendarFilterService {
        return this.changeFilter("room", args, callChanged);
    }

    teacher(args: { teacher: string }, callChanged = true): CalendarFilterService {
        return this.changeFilter("teacher", args, callChanged);
    }

    /**
     * Changes the current filter.
     */
    private changeFilter(property: string, value: any, callChanged: boolean = true): CalendarFilterService {

        this.currentFilterSequence[property] = value;
        this.saveToStorage();

        if (callChanged) {
            this.onChanged.emit();
        }

        return this;

    }

    clear(callChanged = true) {
        this.currentFilterSequence = {};
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    filter(query: CalendarDataQuery): CalendarDataQuery {
        for (const [key, args] of Object.entries(this.currentFilterSequence)) {
            if ((query as any)[key]) {
                (query as any)[key](args);
            }
        }
        return query;
    }

    /**
     * Checks if there is a current filter.
     */
    hasCurrentFilter(): boolean {
        return Object.keys(this.currentFilterSequence).length > 0;
    }

    /**
     * Gets the current filter name.
     */
    getCurrentFilterName(): string {

        if (!this.hasCurrentFilter()) {
            return "";
        }

        const a = this.currentFilterSequence[Object.keys(this.currentFilterSequence)[0]];
        const b = a ? a[Object.keys(this.currentFilterSequence)[0]] : "";
        return b || "";

    }

}
