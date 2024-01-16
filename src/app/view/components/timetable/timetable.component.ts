import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";

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

    Montag=[["M","_1"],["M","_2"]]
    Dienstag=[["M","_1"],["M","_2"]]

    entries: any[][] =[[this.Montag,"Montag"], [this.Dienstag,"Dienstag"]]

}
