import { Component } from '@angular/core';
import { TimetableComponent } from "../../components/timetable/timetable.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MenuComponent } from "../../components/menu/menu.component";
import { DetailsComponent } from "../../components/details/details.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-main',
  standalone: true,
    imports: [
        TimetableComponent,
        NavbarComponent,
        MenuComponent,
        DetailsComponent,
        NgClass
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
