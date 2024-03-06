import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Input, ViewChild } from "@angular/core";
import { CalendarDataEntry } from "../../../../services/calendar-data/data-entries/calendar-data-entry";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { DetailsComponent } from "../../details/details.component";
import { CalendarDataBrokerService } from "../../../../services/calendar-data/calendar-data-broker.service";
import { SwiperContainer } from "swiper/swiper-element";

@Component({
    selector: "app-timetable-slot[calendarDataEntries]",
    standalone: true,
    imports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: "./timetable-slot.component.html",
    styleUrl: "./timetable-slot.component.scss"
})
export class TimetableSlotComponent {

    @Input() calendarDataEntries: CalendarDataEntry[] = [];

    private offCanvasService: NgbOffcanvas = inject(NgbOffcanvas);

    /**
     * Constructor.
     */
    constructor(private broker: CalendarDataBrokerService) {}

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
     * Opens the lesson details.
     */
    protected openDetails(entry: CalendarDataEntry): void {
        this.broker.setSelectEntry(entry);
        this.offCanvasService.open(DetailsComponent, {position: "end"});
    }

}
