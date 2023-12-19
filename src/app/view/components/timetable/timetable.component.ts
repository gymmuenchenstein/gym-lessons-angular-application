import { Component } from '@angular/core';
import {TimetableDayComponent} from "./timetable-day/timetable-day.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-timetable',
  standalone: true,
    imports: [
        TimetableDayComponent,
        NgForOf
    ],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss'
})
export class TimetableComponent {

    Montag=[["M","lession M _1"]]
    Dienstag=[["M","lession M _1"],["D","lession M _2"],["D","lession M _2"]]

    entries: any[][] =[[this.Montag,"Montag"], [this.Dienstag,"Dienstag"]]

}
