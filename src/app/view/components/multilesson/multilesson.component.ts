import {Component, inject} from '@angular/core';
import {CalendarDataEntry} from "../../../services/calendar-data/data-entries/calendar-data-entry";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {NgForOf} from "@angular/common";
import {DetailsComponent} from "../details/details.component";

@Component({
  selector: 'app-multilesson',
  standalone: true,
    imports: [
        NgForOf
    ],
  templateUrl: './multilesson.component.html',
  styleUrl: './multilesson.component.scss'
})
export class MultilessonComponent {

    protected offcanvasService = inject(NgbOffcanvas);

    protected lessons: CalendarDataEntry[] = [];

    constructor(protected broker: CalendarDataBrokerService) {

    }

    setLessons(lessons: CalendarDataEntry[]) {
        this.lessons = lessons;
    }

    protected readonly DetailsComponent = DetailsComponent;
}
