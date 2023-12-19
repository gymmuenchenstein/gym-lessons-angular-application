import { Component } from '@angular/core';
import {DataBrokerService} from "../../../services/data-broker.service";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

    constructor(private databroker: DataBrokerService) {

    }

}
