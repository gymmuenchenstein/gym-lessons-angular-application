import {
    AfterViewInit,
    Component,
    ElementRef,
    Input, OnChanges, QueryList,
    SimpleChanges,
    ViewChild, ViewChildren, ViewEncapsulation
} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";

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

    constructor() {

    }

    ngAfterViewInit() {
        this.selectRoom(this.selectedRoom);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedRoom'] === undefined || changes['selectedRoom'].firstChange) return;
        this.selectRoom(changes['selectedRoom'].currentValue);
    }

    private selectRoom(room: String) {
        for (const roomEl of this.roomEls) {
            const ruum = roomEl.nativeElement.id.split("-");
            if (ruum[ruum.length - 1].slice(0, ruum[ruum.length - 1].length > 3 ? 2 : 1) == room.slice(0, room.length > 3 ? 2 : 1))
                roomEl.nativeElement.style.opacity = "0.9";
            if (ruum[ruum.length - 1] == room)
                roomEl.nativeElement.style.fill = "red";
        }
    }

}
