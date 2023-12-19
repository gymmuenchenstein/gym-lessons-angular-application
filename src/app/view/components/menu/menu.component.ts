import { Component } from '@angular/core';
import {
    NgbAccordionBody,
    NgbAccordionButton, NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem, NgbModule
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-menu',
  standalone: true,
    imports: [
        NgbModule
    ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
