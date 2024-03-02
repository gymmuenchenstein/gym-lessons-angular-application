import {
    AfterViewInit,
    Component,
    ElementRef, HostListener, inject,
    Input, OnChanges, QueryList,
    SimpleChanges,
    ViewChild, ViewChildren, ViewEncapsulation
} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {CalendarFilterService} from "../../../../services/calendar-filter/calendar-filter.service";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {CalendarDataBrokerService} from "../../../../services/calendar-data/calendar-data-broker.service";

@Component({
    selector: 'app-floorplan',
    standalone: true,
    imports: [
        NgForOf,
        NgOptimizedImage
    ],
    templateUrl: './floorplan.component.html',
    styleUrl: './floorplan.component.scss',
    encapsulation: ViewEncapsulation.ShadowDom
})
export class FloorplanComponent implements AfterViewInit, OnChanges {
    @Input() selectedRoom: string = "";

    @ViewChild('floorPlan') rootEl!: ElementRef<HTMLElement>;
    @ViewChildren('room') roomEls!: QueryList<ElementRef>;

    private offcanvasService = inject(NgbOffcanvas);

    constructor(private broker: CalendarDataBrokerService, private filter: CalendarFilterService) {

    }

    ngAfterViewInit() {
        this.selectRoom(this.selectedRoom);

        for (const roomEl of this.roomEls) {
            roomEl.nativeElement.addEventListener('click', (event: MouseEvent) => {
                this.offcanvasService.dismiss();

                const selectedRoom = this.getRoomId(roomEl.nativeElement.id)
                if (this.broker.unique().rooms.includes(selectedRoom)) {
                    this.filter.clear(false);
                    this.filter.room({room: selectedRoom});
                }
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedRoom'] === undefined || changes['selectedRoom'].firstChange) return;
        this.selectRoom(changes['selectedRoom'].currentValue);
    }

    private selectRoom(room: string) {
        for (const roomEl of this.roomEls) {
            const ruum = roomEl.nativeElement.id.split("-");
            if (ruum[ruum.length - 1].slice(0, ruum[ruum.length - 1].length > 3 ? 2 : 1) == room.slice(0, room.length > 3 ? 2 : 1))
                roomEl.nativeElement.style.opacity = "0.9";
            if (ruum[ruum.length - 1] == room)
                roomEl.nativeElement.style.fill = "var(--accent-color)";
        }
    }

    private getRoomId(id: string) {
        const result = [...id.matchAll(/room-(.+)/g)];
        if (result[0] != undefined)
            return result[0][1];
        else
            return "";
    }
}
