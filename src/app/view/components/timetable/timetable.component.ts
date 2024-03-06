import {Component, OnChanges, SimpleChanges} from "@angular/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {CalendarDataEntry} from "../../../services/calendar-data/data-entries/calendar-data-entry";
import {CalendarFilterService} from "../../../services/calendar-filter/calendar-filter.service";
import dayjs from "dayjs";
import {TimetableSlotComponent} from "./timetable-slot/timetable-slot.component";
import {NgbDatepicker, NgbDateStruct, NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";

@Component({
    selector: "app-timetable",
    standalone: true,
    imports: [
        NgForOf,
        NgClass,
        NgIf,
        TimetableSlotComponent,
        NgbDatepicker,
        FormsModule,
        NgbInputDatepicker
    ],
    templateUrl: "./timetable.component.html",
    styleUrl: "./timetable.component.scss"
})

export class TimetableComponent {

    protected readonly dayjs = dayjs;
    protected readonly days: number[] = [1, 2, 3, 4, 5];
    protected readonly lessonTimes: string[] = ["8:00", "8:55", "10:00", "10:55", "11:50", "12:45", "13:40", "14:35", "15:30", "16:25", "17:20", "18:05"];

    protected data: CalendarDataEntry[] = [];

    model!: NgbDateStruct;

    /**
     * Constructor.
     */
    constructor(protected broker: CalendarDataBrokerService,
                protected filter: CalendarFilterService) {

        this.model = { year: dayjs().year(), month: dayjs().month(), day: dayjs().day() }
        this.changedDate();

        this.filter.onChanged.subscribe(() => {
                if (this.model != undefined) {
                    const data = this.broker.query().week(this.model);
                    this.data = data.export();
                }
            }
        );
    }

    /**
     * Gets a calendar data entry by its lesson index and day index.
     * Both indices are 0-based.
     */
    protected getCalendarDataEntries(lessonIndex: number, dayIndex: number): CalendarDataEntry[] {
        return this.data.filter(lesson => lesson.index == lessonIndex + 1 && lesson.datetime?.day() == dayIndex + 1);
    }

    changedDate() {
        // Note: if the date is invalid, then the model is a string, otherwise it's an object
        if (this.model?.day != undefined && this.model?.month != undefined && this.model?.year != undefined)
            this.filter.week(this.model);
    }
}



