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
            //console.log(this.broker.unique());
            const x = this.broker.query().day({year:2024, month:5, day:15}).abbr({abbr: "Gt"}).export();
            //console.log(x);
        })
    }

}
