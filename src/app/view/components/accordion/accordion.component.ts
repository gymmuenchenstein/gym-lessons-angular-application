import {Component, Input} from '@angular/core';
import {JsonPipe, NgClass, NgIf} from "@angular/common";

export type AccordionData = { label: string, action?: () => void, nestedData?: AccordionData[] };

@Component({
    selector: 'app-accordion[data]',
    standalone: true,
    imports: [
        NgIf,
        JsonPipe,
        NgClass
    ],
    templateUrl: './accordion.component.html',
    styleUrl: './accordion.component.scss'
})
export class AccordionComponent {

    @Input() data: AccordionData | undefined;

    @Input() first: boolean = false;

    @Input() last: boolean = false;

    protected showNestedData: boolean = false;

    protected hasMoreNestedData(data: AccordionData): boolean {
        if (data.nestedData?.length) {
            return true;
        }
        return false;
    }

}
