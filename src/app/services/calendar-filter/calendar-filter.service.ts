import {EventEmitter, Injectable} from '@angular/core';
import {CalendarDataQuery} from "../calendar-data/calendar-data-query";

@Injectable({
    providedIn: 'root'
})
export class CalendarFilterService {

    private currentFilterSequence: { [key: string]: any } = {}

    onChanged: EventEmitter<void> = new EventEmitter();

    day(args: { year: number, month: number, day: number }, callChanged = true) {
        this.currentFilterSequence['day'] = args;
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    week(args: { year: number, month: number, day: number }, callChanged = true) {
        this.currentFilterSequence['week'] = args;
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    month(args: { year: number, month: number }, callChanged = true) {
        this.currentFilterSequence['month'] = args;
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    class(args: { class: string }, callChanged = true) {
        this.currentFilterSequence['class'] = args;
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    abbr(args: { abbr: string }, callChanged = true) {
        this.currentFilterSequence['abbr'] = args;
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    lesson(args: { lesson: string }, callChanged = true) {
        this.currentFilterSequence['lesson'] = args;
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    room(args: { room: string }, callChanged = true) {
        this.currentFilterSequence['room'] = args;
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    teacher(args: { teacher: string }, callChanged = true) {
        this.currentFilterSequence['teacher'] = args;
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    clear(callChanged = true) {
        this.currentFilterSequence = {}
        if (callChanged)
            this.onChanged.emit();
        return this;
    }

    filter(query: CalendarDataQuery) {
        for (const [key, args] of Object.entries(this.currentFilterSequence)) {
            if ((query as any)[key]) {
                (query as any)[key](args);
            }
        }
        return query
    }

    /**
     * Checks if there is a current filter.
     */
    hasCurrentFilter(): boolean {
        return Object.keys(this.currentFilterSequence).length > 0;
    }

}
