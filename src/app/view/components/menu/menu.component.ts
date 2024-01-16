import {Component} from '@angular/core';
import {
    NgbAccordionBody,
    NgbAccordionButton, NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem, NgbModule
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {CommonModule, JsonPipe, NgForOf} from "@angular/common";
import {debounceTime, distinctUntilChanged, map, Observable, OperatorFunction} from "rxjs";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {AccordionComponent, AccordionData} from "../accordion/accordion.component";

const states = [
    'Alabama',
    'Alaska',
    'American Samoa',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District Of Columbia',
    'Federated States Of Micronesia',
    'Florida',
    'Georgia',
    'Guam',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Marshall Islands',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Northern Mariana Islands',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Palau',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virgin Islands',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
];


@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
        NgbModule, FormsModule, JsonPipe, CommonModule, AccordionComponent
    ],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {
    model: any;

    classData: AccordionData = {
        label: "Klassen",
        nestedData: [{
            label: "Maturitätsklassen",
            nestedData: [],
        }, {
            label: "Fachmaturitätsklassen",
            nestedData: [],
        }, {
            label: "Andere",
            nestedData: [],
        }]
    };

    teacherData: AccordionData = {
        label: "Lehrpersonen",
        nestedData: []
    };

    roomData: AccordionData = {
        label: "Räume",
        nestedData: []
    };

    constructor(private broker: CalendarDataBrokerService) {

        this.broker.onInitialized.subscribe(() => {

            // Get all classes
            this.getClassData();

            // Get all teachers
            this.getTeacherData();

            // Get all rooms
            this.getRoomData();

        });

    }

    private getClassData(): void {

        const allClassesData = this.broker.unique().classes.filter(c => c).sort();
        const allNestedData = allClassesData.map((s) => {
            return {
                label: s,
                action: () => this.openTimetable(s),
            }
        });

        this.classData.nestedData![0].nestedData = allNestedData.filter((s) => s.label.startsWith("M"));
        this.classData.nestedData![1].nestedData = allNestedData.filter((s) => s.label.startsWith("F"));
        this.classData.nestedData![2].nestedData = allNestedData.filter((s) => !s.label.startsWith("M") && !s.label.startsWith("F"));

    }

    private getTeacherData(): void {

        const teachers = this.broker.unique().teachers;
        this.teacherData.nestedData = teachers.map((teacher) => {
            return {
                label: teacher.surname + ", " + teacher.name + " (" + teacher.abbr + ")",
                action: () => this.openTimetable(teacher),
            }
        });

    }

    private getRoomData(): void {

        const rooms = this.broker.unique().rooms.filter(r => r).sort();
        this.roomData.nestedData = rooms.map((room) => {
            return {
                label: room,
                action: () => this.openTimetable(room),
            }
        });

    }

    private openTimetable(data: any): void {
        console.log(data);
    }

    formatter = (result: string) => result.toUpperCase();

    search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map((term) =>
                term === '' ? [] : states.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
            ),
        );
}
