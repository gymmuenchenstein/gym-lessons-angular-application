import {AfterViewInit, Component, inject, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {CalendarDataEntry} from "../../../services/calendar-data/data-entries/calendar-data-entry";

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss'
})
export class DetailsComponent implements AfterViewInit {
    private offcanvasService = inject(NgbOffcanvas);

    entry: CalendarDataEntry | undefined;
    time: string = "";
    teachers: string = "";
    classes: string = "";

    constructor(private broker: CalendarDataBrokerService) {
        /*this.broker.onInitialized.subscribe(() => {
            this.broker.setSelectEntry(this.broker.query(false).day({day: 6, month: 2, year: 2024}).export()[0]);
        });*/
    }

    ngAfterViewInit() {
        this.broker.onInitialized.subscribe(() => {
            this.entry = this.broker.getSelectEntry();
            this.time = this.entry?.datetime?.hour() + ":" + this.entry?.datetime?.minute() + " - " + this.entry?.datetime?.add(this.entry?.duration != undefined ? this.entry?.duration : { minutes: 45 }).hour() + ":" + this.entry?.datetime?.add(this.entry?.duration != undefined ? this.entry?.duration : { minutes: 45 }).minute();
            this.teachers = "" + this.entry?.teachers.map(el => {
                return el.surname + " " + el.name
            }).join(", ");
            this.classes = "" + this.entry?.classes.map(el => {
                return el.full;
            }).join(", ");
        });
    }

    openEnd(content: TemplateRef<any>) {
        this.offcanvasService.open(content, {position: 'end'});
    }
}
