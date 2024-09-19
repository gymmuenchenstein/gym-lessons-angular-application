import {Injectable} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import dayjs, {Dayjs} from "dayjs";
import {CalendarDataBrokerService} from "./calendar-data/calendar-data-broker.service";

@Injectable({
    providedIn: 'root'
})
export class RoutingHelperService {

    constructor(private router: Router, private broker: CalendarDataBrokerService) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                console.log(event);
            }
        })
    }

    public route(planRoute: string, date: Dayjs | undefined = undefined) {
        if (planRoute.length == 0)
            planRoute = this.broker.unique().plans[0].route;
        if (date == undefined)
            date = dayjs()
        this.router.navigate([planRoute, date.format("YYYY-MM-DD")]).then();
        return this;
    }
}
