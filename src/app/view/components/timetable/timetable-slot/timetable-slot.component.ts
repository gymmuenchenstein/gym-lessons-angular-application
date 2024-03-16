import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Input, SimpleChanges, ViewChild } from "@angular/core";
import { CalendarDataEntry } from "../../../../services/calendar-data/data-entries/calendar-data-entry";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { DetailsComponent } from "../../details/details.component";
import { CalendarDataBrokerService } from "../../../../services/calendar-data/calendar-data-broker.service";
import { SwiperContainer } from "swiper/swiper-element";
import {NgIf} from "@angular/common";

@Component({
    selector: "app-timetable-slot[calendarDataEntries]",
    standalone: true,
    imports: [
        NgIf
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: "./timetable-slot.component.html",
    styleUrl: "./timetable-slot.component.scss"
})
export class TimetableSlotComponent {

    @Input() calendarDataEntries: CalendarDataEntry[] = [];
    @Input() displayType: number = -1;

    @ViewChild("swiperContainer", {static: false}) swiperContainer: ElementRef<SwiperContainer> | undefined;

    private offCanvasService: NgbOffcanvas = inject(NgbOffcanvas);

    /**
     * Constructor.
     */
    constructor(private broker: CalendarDataBrokerService) {}

    /**
     * Makes sure the swiper is redrawn if data changes.
     */
    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (simpleChanges["calendarDataEntries"]) {
            const oldValues: CalendarDataEntry[] | undefined = simpleChanges["calendarDataEntries"].previousValue;
            const newValues: CalendarDataEntry[] | undefined = simpleChanges["calendarDataEntries"].currentValue;
            if (oldValues?.length !== newValues?.length || JSON.stringify(oldValues) !== JSON.stringify(newValues)) {
                setTimeout(() => {
                    this.swiperContainer?.nativeElement?.swiper.update();
                });
            }
        }
    }

    /**
     * Gets the teachers of a lesson.
     * If there is more than one teacher, only the first one is shown.
     */
    protected getTeachersString(lesson: CalendarDataEntry): string {

        const teachers = lesson.teachers;
        if (teachers.length === 1) {
            return teachers[0].abbr;
        } else if (teachers.length > 1) {
            return "vd.";
        } else {
            return "–";
        }

    }

    /**
     * Gets the classes of a lesson.
     * If there is more than one teacher, only the first one is shown.
     */
    protected getClassString(lesson: CalendarDataEntry): string {

        const classes = lesson.classes;
        if (classes.length === 1) {
            return classes[0].full;
        } else if (classes.length > 1) {
            return "vd.";
        } else {
            return "–";
        }

    }

    /**
     * Opens the lesson details.
     */
    protected openDetails(entry: CalendarDataEntry): void {
        this.broker.setSelectEntry(entry);
        this.offCanvasService.open(DetailsComponent, {position: "end"});
    }

    /**
     * Slides to the previous lesson.
     */
    protected slidePrev(): void {
        this.swiperContainer?.nativeElement?.swiper.slidePrev();
    }

    /**
     * Slides to the next lesson.
     */
    protected slideNext(): void {
        this.swiperContainer?.nativeElement?.swiper.slideNext();
    }

}
