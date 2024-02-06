import {Injectable} from '@angular/core';
import {CalendarDataQuery} from "../calendar-data/calendar-data-query";

@Injectable({
    providedIn: 'root'
})
export class CalendarFilterService {

    private currentFilterSequence: {[key: string]: any} = {}
    
    day(args: { year: number, month: number, day: number }) {
        this.currentFilterSequence['day'] = args;
        return this;
    }

    week(args: { year: number, month: number, day: number }) {
        this.currentFilterSequence['week'] = args;
        return this;
    }

    month(args: { year: number, month: number }) {
        this.currentFilterSequence['month'] = args;
        return this;
    }

    class(args: { class: string }) {
        this.currentFilterSequence['class'] = args;
        return this;
    }

    abbr(args: { abbr: string }) {
        this.currentFilterSequence['abbr'] = args;
        return this;
    }

    lesson(args: { lesson: string }) {
        this.currentFilterSequence['lesson'] = args;
        return this;
    }

    teacher(args: { teacher: string }) {
        this.currentFilterSequence['teacher'] = args;
        return this;
    }

    clear() {
        this.currentFilterSequence = {}
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
