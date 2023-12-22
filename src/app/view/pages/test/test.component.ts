import { Component } from '@angular/core';
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

    constructor(private broker: CalendarDataBrokerService) {
        this.broker.onInitialized.subscribe(() => {
            console.log(this.broker.query().month({year:2024, month:1}).class({class: "M2g"}).abbr({abbr: "Sü"}).export());
        })
    }

}
