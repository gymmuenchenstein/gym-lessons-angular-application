import {Component} from '@angular/core';
import {MenuService} from "../../../model/services/menu.service";
import { CalendarFilterService } from "../../../services/calendar-filter/calendar-filter.service";

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    constructor(protected menuService: MenuService,
                protected calendarFilterService: CalendarFilterService) {
    }

}
