import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import dayjs from "dayjs";
import "dayjs/locale/de-ch.js";
import { register } from "swiper/element/bundle";
import {CalendarFilterService} from "./services/calendar-filter/calendar-filter.service";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss"
})
export class AppComponent {
    constructor(private filter: CalendarFilterService) {
        dayjs.locale("de-ch");
        register();
        filter.onChanged.subscribe(() => {
            window.scroll(0,0);
        });
    }
}
