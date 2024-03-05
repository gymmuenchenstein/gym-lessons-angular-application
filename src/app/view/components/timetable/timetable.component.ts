import {Component, inject} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {CalendarDataEntry} from "../../../services/calendar-data/data-entries/calendar-data-entry";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {DetailsComponent} from "../details/details.component";
import {CalendarFilterService} from "../../../services/calendar-filter/calendar-filter.service";
import {MultilessonComponent} from "../multilesson/multilesson.component";
import dayjs from 'dayjs';

// @ts-ignore
@Component({
    selector: 'app-timetable',
    standalone: true,
    imports: [
        NgForOf,
        NgClass,
        NgIf
    ],
    templateUrl: './timetable.component.html',
    styleUrl: './timetable.component.scss'
})

export class TimetableComponent {

    protected readonly dayjs = dayjs;
    protected timestamp = {day: 0, month: 0, year: 0};
    protected rawdate: string = "";

    protected data: CalendarDataEntry[] = [];
    protected lessonindices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    protected lessontimes = ["8:00", "8:55", "10:00", "10:55", "11:50", "12:45", "13:40", "14:35", "15:30", "16:25", "17:20", "18:05"]
    protected days: number[] = [1, 2, 3, 4, 5];

    private offcanvasService = inject(NgbOffcanvas);

    openEnd() {
        this.offcanvasService.open(DetailsComponent, {position: 'end'});
    }

    openMultilesson(lessons: CalendarDataEntry[]) {
        const offcanvasRef = this.offcanvasService.open(MultilessonComponent, {position: 'end'});
        (offcanvasRef.componentInstance as MultilessonComponent).setLessons(lessons);
    }

    constructor(protected broker: CalendarDataBrokerService, protected filter: CalendarFilterService) {
        this.setDate(dayjs(Date()).format("YYYY-MM-DD"));
        /*this.broker.onInitialized.subscribe(() => {
                const data = this.broker.query()
                    .week({year: 2024, month: 5, day: 13})
                    .class({class: "M2g"})
                this.data = data.export()
            }
        )*/
        this.filter.onChanged.subscribe(() => {
                if (Object.keys(this.filter.currentFilterSequence).length >= 2 || !Object.keys(this.filter.currentFilterSequence).includes("week")) {
                    const data = this.broker.query().week({
                        year: this.timestamp.year,
                        month: this.timestamp.month,
                        day: this.timestamp.day
                    });
                    this.data = data.export();
                }
            }
        )
        /*setTimeout(() => {
            this.filter.teacher({teacher: "Steiner Janik"})
        }, 1500)*/
    }

    /*
        loopdays() {
            for (const entry of this.data) {
                if (entry.datetime !== undefined)
                    if (!this.days.includes(entry.datetime.day()))
                        this.days.push(entry.datetime.day())
            }
            console.log(this.days)
        }
    */
    isCollapsibleIndex(index: number, day: any) {
        const data = this.data.filter(lesson => lesson.index == index && lesson.datetime?.day() == day);
        if (data.length == 0)
            return 0;
        else if (data.length <= 3)
            return 1;
        else
            return 2;
    }

    getdatabylessenindex(index: number, day: any) {
        return this.data.filter(lesson => lesson.index == index && lesson.datetime?.day() == day);
    }

    applyDatetime($event: Event) {
        if (($event.target as HTMLInputElement).value != "")
            this.setDate(($event.target as HTMLInputElement).value);
    }

    skipWeek(amount: number) {
        const newDate = dayjs(this.rawdate).add(amount * 7, 'days')
        this.setDate(newDate.format("YYYY-MM-DD"));
    }

    setDate(date: string) {
        this.rawdate = date;
        this.timestamp.day = dayjs(date).day() + 1;
        this.timestamp.month = dayjs(date).month() + 1;
        this.timestamp.year = dayjs(date).year();
        console.log(this.rawdate);
        this.filter.week({year: this.timestamp.year, month: this.timestamp.month, day: this.timestamp.day});
    }
}



