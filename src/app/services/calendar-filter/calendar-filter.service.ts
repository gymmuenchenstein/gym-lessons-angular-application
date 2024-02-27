import {EventEmitter, Injectable} from '@angular/core';
import {CalendarDataQuery} from "../calendar-data/calendar-data-query";

@Injectable({
    providedIn: 'root'
})
export class CalendarFilterService {

    private currentFilterSequence: {[key: string]: any} = {}

    onChanged: EventEmitter<void> = new EventEmitter();

    day(args: { year: number, month: number, day: number }) {
        this.currentFilterSequence['day'] = args;
        this.onChanged.emit();
        return this;
    }

    week(args: { year: number, month: number, day: number }) {
        this.currentFilterSequence['week'] = args;
        this.onChanged.emit();
        return this;
    }

    month(args: { year: number, month: number }) {
        this.currentFilterSequence['month'] = args;
        this.onChanged.emit();
        return this;
    }

    class(args: { class: string }) {
        this.currentFilterSequence['class'] = args;
        this.onChanged.emit();
        return this;
    }

    abbr(args: { abbr: string }) {
        this.currentFilterSequence['abbr'] = args;
        this.onChanged.emit();
        return this;
    }

    lesson(args: { lesson: string }) {
        this.currentFilterSequence['lesson'] = args;
        this.onChanged.emit();
        return this;
    }

    teacher(args: { teacher: string }) {
        this.currentFilterSequence['teacher'] = args;
        this.onChanged.emit();
        return this;
    }

    clear() {
        this.currentFilterSequence = {}
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
}
