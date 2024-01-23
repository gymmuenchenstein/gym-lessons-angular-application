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
            if (roomEl.nativeElement.id.endsWith(room))
                roomEl.nativeElement.style.fill = "red";
        }
    }
}
