import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import dayjs from "dayjs";
import "dayjs/locale/de-ch.js";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss"
})
export class AppComponent {
    constructor() {
        dayjs.locale("de-ch");
    }
}
