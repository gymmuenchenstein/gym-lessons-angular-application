import {Component, inject, TemplateRef} from '@angular/core';
import {NgForOf} from "@angular/common";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {CalendarDataEntry} from "../../../services/calendar-data/data-entries/calendar-data-entry";
import {elementAt} from "rxjs";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {DetailsComponent} from "../details/details.component";

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
    protected days: number[] = [1,2,3,4,5];

    private offcanvasService = inject(NgbOffcanvas);

    openEnd() {
        this.offcanvasService.open(DetailsComponent, { position: 'end' });
    }
    constructor(protected broker: CalendarDataBrokerService) {
        this.broker.onInitialized.subscribe(() => {
                const data = this.broker.query()
                    .week({year: 2024, month: 5, day: 13})
                    .class({class: "M2g"})
                this.data = data.export()
            console.log(this.data);
               //this.loopdays();
            }
        )
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



