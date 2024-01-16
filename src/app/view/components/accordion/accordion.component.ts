import {Component, Input} from '@angular/core';
import {JsonPipe, NgIf} from "@angular/common";

export type AccordionData = { label: string, action?: () => void, nestedData?: AccordionData[] };

@Component({
    selector: 'app-accordion[data]',
    standalone: true,
    imports: [
        NgIf,
        JsonPipe
    ],
    templateUrl: './accordion.component.html',
    styleUrl: './accordion.component.scss'
})
export class AccordionComponent {

    @Input() data: AccordionData | undefined;

    protected showNestedData: boolean = false;

}
