import {EventEmitter, Injectable} from '@angular/core';
import {CalendarDataQuery} from "../calendar-data/calendar-data-query";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class CalendarFilterService {

    currentFilterSequence: { [key: string]: any } = {}

    onChanged: EventEmitter<void> = new EventEmitter();

    constructor(private router: Router, private route: ActivatedRoute) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.parseRoute();
            }
        });
    }

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

    private parseRoute() {
        const filter = this.route.firstChild?.snapshot.paramMap.get("filter");
        let hasChanged = false;
        if (filter != null) {
            for (const keyvalueEntry of filter.split(",")) {
                const keyvalue = keyvalueEntry.split(":");
                if (keyvalue[0] == "class") {
                    this.class({class: keyvalue[1]}, false);
                    hasChanged = true;
                } else if (keyvalue[0] == "abbr") {
                    this.abbr({abbr: keyvalue[1]}, false);
                    hasChanged = true;
                } else if (keyvalue[0] == "lesson") {
                    this.lesson({lesson: keyvalue[1]}, false);
                    hasChanged = true;
                } else if (keyvalue[0] == "abbr") {
                    this.abbr({abbr: keyvalue[1]}, false);
                    hasChanged = true;
                } else if (keyvalue[0] == "room") {
                    this.room({room: keyvalue[1]}, false);
                    hasChanged = true;
                } else if (keyvalue[0] == "teacher") {
                    this.teacher({teacher: keyvalue[1]}, false);
                    hasChanged = true;
                }
            }
        }
    }
}
