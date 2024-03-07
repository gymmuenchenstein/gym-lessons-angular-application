import {Component} from "@angular/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {CalendarDataEntry} from "../../../services/calendar-data/data-entries/calendar-data-entry";
import {CalendarFilterService} from "../../../services/calendar-filter/calendar-filter.service";
import dayjs from "dayjs";
import {TimetableSlotComponent} from "./timetable-slot/timetable-slot.component";

@Component({
    selector: "app-timetable",
    standalone: true,
    imports: [
        NgForOf,
        NgClass,
        NgIf,
        TimetableSlotComponent
    ],
    templateUrl: "./timetable.component.html",
    styleUrl: "./timetable.component.scss"
})

export class TimetableComponent {

    protected readonly dayjs = dayjs;
    protected readonly days: number[] = [1, 2, 3, 4, 5];
    protected readonly lessonTimes: string[] = ["8:00", "8:55", "10:00", "10:55", "11:50", "12:45", "13:40", "14:35", "15:30", "16:25", "17:20", "18:05"];

    // -1 nothing selected or invalid, 0 class selected, 1 teacher selected, 2 room selected
    protected lessonDisplayType: number = -1;

    protected data: CalendarDataEntry[] = [];

    /**
     * Constructor.
     */
    constructor(protected broker: CalendarDataBrokerService,
                protected filter: CalendarFilterService) {

        /*
        this.broker.onInitialized.subscribe(() => {
                const data = this.broker.query()
                    .week({year: 2024, month: 5, day: 13})
                    .class({class: "M2g"})
                this.data = data.export()
            }
        );

         */

        this.filter.onChanged.subscribe(() => {
                this.updateLessonDisplayType();
                const data = this.broker.query().week({year: 2024, month: 5, day: 13})
                this.data = data.export();
            }
        );

        /*setTimeout(() => {
            this.filter.teacher({teacher: "Steiner Janik"})
        }, 1500)*

         */
    }

    /**
     * Gets a calendar data entry by its lesson index and day index.
     * Both indices are 0-based.
     */
    protected getCalendarDataEntries(lessonIndex: number, dayIndex: number): CalendarDataEntry[] {
        return this.data.filter(lesson => lesson.index == lessonIndex + 1 && lesson.datetime?.day() == dayIndex + 1);
    }

    protected updateLessonDisplayType() {
        if (Object.keys(this.filter.currentFilterSequence).includes("class")) {
            this.lessonDisplayType = 0;
        } else if (Object.keys(this.filter.currentFilterSequence).includes("teacher") || Object.keys(this.filter.currentFilterSequence).includes("abbr")) {
            this.lessonDisplayType = 1;
        } else if (Object.keys(this.filter.currentFilterSequence).includes("room")) {
            this.lessonDisplayType = 2;
        } else {
            this.lessonDisplayType = -1;
        }
    }

}



