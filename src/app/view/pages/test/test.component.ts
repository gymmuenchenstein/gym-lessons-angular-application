import { Component } from '@angular/core';
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {CalendarFilterService} from "../../../services/calendar-filter/calendar-filter.service";
import {FloorplanComponent} from "../../components/floorplan-map/floorplan/floorplan.component";

@Component({
  selector: 'app-test',
  standalone: true,
    imports: [
        FloorplanComponent
    ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

    constructor(private broker: CalendarDataBrokerService, private filter: CalendarFilterService) {
        this.broker.onInitialized.subscribe(() => {
            console.log(this.broker.unique());
            this.filter.day({year:2024, month:1, day:23}).teacher({teacher: "Steiner Janik"});
            console.log(this.broker.query().export());
        })
    }

}
