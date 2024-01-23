import {Component, inject, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {FloorplanComponent} from "../floorplan-map/floorplan/floorplan.component";

@Component({
  selector: 'app-details',
  standalone: true,
    imports: [
        FloorplanComponent
    ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
    private offcanvasService = inject(NgbOffcanvas);

    openEnd(content: TemplateRef<any>) {
        this.offcanvasService.open(content, { position: 'end' });
    }
}
