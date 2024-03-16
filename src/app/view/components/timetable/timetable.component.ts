import { Component, OnInit } from "@angular/core";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { CalendarDataBrokerService } from "../../../services/calendar-data/calendar-data-broker.service";
import { CalendarDataEntry } from "../../../services/calendar-data/data-entries/calendar-data-entry";
import { CalendarFilterService } from "../../../services/calendar-filter/calendar-filter.service";
import dayjs from "dayjs";
import { TimetableSlotComponent } from "./timetable-slot/timetable-slot.component";
import { NgbDatepicker, NgbDateStruct, NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { merge } from "rxjs";

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

export class TimetableComponent implements OnInit {

    protected readonly dayjs = dayjs;
    protected readonly days: number[] = [1, 2, 3, 4, 5, 6, 7];
    protected readonly lessonTimes: string[] = ["8:00", "8:55", "10:00", "10:55", "11:50", "12:45", "13:40", "14:35", "15:30", "16:25", "17:20", "18:05"];

    protected data: CalendarDataEntry[] = [];

    protected selectedDate: dayjs.Dayjs = dayjs();

    // -1 nothing selected or invalid, 0 class selected, 1 teacher selected, 2 room selected
    protected lessonDisplayType: number = -1;

    /**
     * Constructor.
     */
    constructor(protected broker: CalendarDataBrokerService,
                protected filter: CalendarFilterService) {
    }

    /**
     * NgOnInit.
     */
    ngOnInit(): void {
        merge(this.filter.onChanged, this.broker.onInitialized).subscribe((_) => {
            this.updateData();
        });
    }

    /**
     * Updates the calendar data.
     */
    private updateData(): void {

        // Make sure a filter is set, otherwise we would load all data
        if (this.filter.hasCurrentFilter()) {
            this.updateLessonDisplayType();
            const data = this.broker.query().week({
                year: this.selectedDate.year(),
                month: this.selectedDate.month() + 1,
                day: this.selectedDate.date()
            });
            this.data = data.export();
        } else {
            this.data = [];
        }

    }

    /**
     * Updates the lesson display type.
     */
    protected updateLessonDisplayType(): void {
        if (Object.keys(this.filter.currentFilterSequence).includes("class")) {
            this.lessonDisplayType = 0;
        } else if (Object.keys(this.filter.currentFilterSequence).includes("teacher") || Object.keys(this.filter.currentFilterSequence).includes("abbr")) {
            this.lessonDisplayType = 1;
        } else if (Object.keys(this.filter.currentFilterSequence).includes("room")) {
            this.lessonDisplayType = 2;
        }
    }

    /**
     * Gets a calendar data entry by its lesson index and day index.
     * Both indices are 0-based.
     */
    protected getCalendarDataEntries(lessonIndex: number, dayIndex: number): CalendarDataEntry[] {
        return this.data.filter(lesson => lesson.index == lessonIndex + 1 && lesson.datetime?.day() == dayIndex + 1);
    }

    /**
     * Navigate an amount of days in the calendar.
     * @param days
     * @protected
     */
    protected navigateDays(days: number): void {

        this.selectedDate = dayjs(this.selectedDate).add(days, "day");

        if (this.filter.hasCurrentFilter()) {
            this.filter.week({
                year: this.selectedDate.year(),
                month: this.selectedDate.month() + 1,
                day: this.selectedDate.date()
            });
        }

    }

    /**
     * Gets the CSS class that determines whether the day should be shown or not.
     */
    protected getDayCssClass(dayIndex: number): string {

        if (this.selectedDate.isSame(this.selectedDate.startOf("week").add(dayIndex, "days"), "date")) {
            if (dayIndex >= 5) {
                return "d-md-none"
            } else {
                return "";
            }
        } else {
            if (dayIndex >= 5) {
                return "d-none";
            } else {
                return "d-none d-md-block";
            }
        }

    }

    /**
     * Opens the print dialog.
     */
    protected printPage() {
        window.print();
    }

    /**
     * Copies the current URL to the clipboard.
     */
    protected copyUrl() {
        navigator.clipboard.writeText(window.location.href);
    }

}



