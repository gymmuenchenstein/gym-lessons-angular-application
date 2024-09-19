import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from "@angular/router";
import dayjs, {Dayjs} from "dayjs";
import {CalendarDataBrokerService} from "./calendar-data/calendar-data-broker.service";

@Injectable({
    providedIn: 'root'
})
export class RoutingHelperService {

    currentPlan: string = "";
    currentDate: Dayjs = dayjs();

    onInitialized: EventEmitter<void> = new EventEmitter();

    constructor(private router: Router, private route: ActivatedRoute, private broker: CalendarDataBrokerService) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.onInitialized.emit();

                const routePlan = this.route.snapshot.queryParams['plan'];
                this.currentPlan = routePlan;
                const routeDate = this.route.snapshot.queryParams['plan'];
                this.currentDate = dayjs(routeDate);
            }
        });
    }

    public setRoute(planRoute: string, date: Dayjs | undefined = undefined) {
        if (date == undefined)
            date = dayjs()

        this.router.navigate([planRoute, date.format("YYYY-MM-DD")]).then();
        return this;
    }

    public getPlan() {
        return this.currentPlan;
    }

    public getDate() {
        return this.currentDate;
    }
}
