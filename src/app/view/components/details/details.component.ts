import {Component, inject, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {FloorplanComponent} from "../floorplan-map/floorplan/floorplan.component";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {CalendarDataEntry} from "../../../services/calendar-data/data-entries/calendar-data-entry";
import dayjs from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import {join} from "@angular/compiler-cli";

@Component({
  selector: 'app-details',
  standalone: true,
    imports: [
        FloorplanComponent
    ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
    private offcanvasService = inject(NgbOffcanvas);

    protected entry!: CalendarDataEntry
    protected time: string = "";
    protected room: string = "";

    constructor(protected broker: CalendarDataBrokerService) {
    }

    openEnd(content: TemplateRef<any>) {
        this.offcanvasService.open(content, { position: 'end' });

        this.broker.setSelectEntry(this.broker.query().abbr({abbr: "Aa"}).export()[0])

        const durationEntry = this.broker.getSelectEntry();
        if (durationEntry !== undefined)
            this.entry = durationEntry;

        let duration = dayjs.duration({minutes: 45});
        if (durationEntry?.duration !== undefined)
            duration = durationEntry.duration;
        this.time = this.broker.getSelectEntry()?.datetime?.hour() + ":" + this.broker.getSelectEntry()?.datetime?.minute() + " - " + this.broker.getSelectEntry()?.datetime?.add(duration).hour() + ":" + this.broker.getSelectEntry()?.datetime?.add(duration).minute();

        const room = this.broker.getSelectEntry()?.room;
        this.room = room != undefined ? room : "";

    }

    protected readonly CalendarDataEntry = CalendarDataEntry;
    protected readonly join = join;
}
