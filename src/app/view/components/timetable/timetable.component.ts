import {Component, inject, TemplateRef} from '@angular/core';
import {NgForOf} from "@angular/common";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {CalendarDataEntry} from "../../../services/calendar-data/data-entries/calendar-data-entry";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {DetailsComponent} from "../details/details.component";
import {CalendarFilterService} from "../../../services/calendar-filter/calendar-filter.service";

// @ts-ignore
@Component({
    selector: 'app-timetable',
    standalone: true,
    imports: [
        NgForOf
    ],
    templateUrl: './timetable.component.html',
    styleUrl: './timetable.component.scss'
})

export class TimetableComponent {
    protected data: CalendarDataEntry[] = [];
    protected lessonindices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    protected lessontimes = [ "8:00", "8:55", "10:00", "10:55", "11:50", "12:45", "13:40", "14:35", "15:30", "16:25", "17:20" ]
    protected weekdays = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" ]
    protected days: number[] = [1, 2, 3, 4, 5];

    private offcanvasService = inject(NgbOffcanvas);

    openEnd() {
        this.offcanvasService.open(DetailsComponent, {position: 'end'});
    }

    constructor(protected broker: CalendarDataBrokerService, protected filter: CalendarFilterService) {
        this.broker.onInitialized.subscribe(() => {
                const data = this.broker.query()
                    .week({year: 2024, month: 5, day: 13})
                    .class({class: "M2g"})
                this.data = data.export()
            }
        )
        this.filter.onChanged.subscribe(() => {
                const data = this.broker.query().week({year: 2024, month: 5, day: 13})
                this.data = data.export()
            }
        )
        setTimeout(() => {
            this.filter.teacher({teacher: "Steiner Janik"})
        }, 1500)
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
    getdatabylessenindex(index: number, day: any) {
        return this.data.filter(lesson => lesson.index == index && lesson.datetime?.day() == day);
    }
}



