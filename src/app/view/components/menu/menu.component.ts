import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {
    NgbModule
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {CommonModule, JsonPipe} from "@angular/common";
import {debounceTime, distinctUntilChanged, map, Observable} from "rxjs";
import {CalendarDataBrokerService} from "../../../services/calendar-data/calendar-data-broker.service";
import {AccordionComponent, AccordionData} from "../accordion/accordion.component";
import {MenuService} from "../../../model/services/menu.service";
import {CalendarFilterService} from "../../../services/calendar-filter/calendar-filter.service";
import {Router} from "@angular/router";


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
            nestedData: [
                {
                    label: "1. Klassen",
                    nestedData: [],
                },
                {
                    label: "2. Klassen",
                    nestedData: [],
                },
                {
                    label: "3. Klassen",
                    nestedData: [],
                },
                {
                    label: "4. Klassen",
                    nestedData: [],
                }
            ],
        }, {
            label: "FMS-Klassen",
            nestedData: [
                {
                    label: "1. Klassen",
                    nestedData: [],
                },
                {
                    label: "2. Klassen",
                    nestedData: [],
                },
                {
                    label: "3. Klassen",
                    nestedData: [],
                },
                {
                    label: "Fachmaturitätsklassen",
                    nestedData: [],
                }
            ],
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
        nestedData: [
            {
                label: "Hauptgebäude",
                nestedData: [
                    {
                        label: "3. Untergeschoss",
                        nestedData: [],
                    },
                    {
                        label: "1. Untergeschoss",
                        nestedData: [],
                    },
                    {
                        label: "1. Stock",
                        nestedData: [],
                    },
                    {
                        label: "2. Stock",
                        nestedData: [],
                    },
                    {
                        label: "4. Stock",
                        nestedData: [],
                    },
                    {
                        label: "5. Stock",
                        nestedData: [],
                    },
                    {
                        label: "6. Stock",
                        nestedData: [],
                    },
                    {
                        label: "7. Stock",
                        nestedData: [],
                    },
                ],
            },
            {
                label: "Pavillon",
                nestedData: [
                    {
                        label: "Erdgeschoss",
                        nestedData: [],
                    },
                    {
                        label: "1. Stock",
                        nestedData: [],
                    },
                ],
            },
            {
                label: "Villa",
                nestedData: [],
            },
            {
                label: "Sportanlagen",
                nestedData: [
                    {
                        label: "Turnhalle",
                        nestedData: [],
                    },
                    {
                        label: "KuSpo",
                        nestedData: [],
                    },
                ],
            }
        ]
    };

    searchList: { label: string, action: () => void }[] = [];

    constructor(private broker: CalendarDataBrokerService,
                private filter: CalendarFilterService,
                protected menuService: MenuService,
                private router: Router) {

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
                action: () => this.openTimetable("class", s),
            }
        });

        this.searchList = this.searchList.concat(allNestedData);

        this.classData.nestedData![0].nestedData![0].nestedData = allNestedData.filter((s) => s.label.startsWith("M1"));
        this.classData.nestedData![0].nestedData![1].nestedData = allNestedData.filter((s) => s.label.startsWith("M2"));
        this.classData.nestedData![0].nestedData![2].nestedData = allNestedData.filter((s) => s.label.startsWith("M3"));
        this.classData.nestedData![0].nestedData![3].nestedData = allNestedData.filter((s) => s.label.startsWith("M4"));

        this.classData.nestedData![1].nestedData![0].nestedData = allNestedData.filter((s) => s.label.startsWith("F1"));
        this.classData.nestedData![1].nestedData![1].nestedData = allNestedData.filter((s) => s.label.startsWith("F2"));
        this.classData.nestedData![1].nestedData![2].nestedData = allNestedData.filter((s) => s.label.startsWith("F3"));
        this.classData.nestedData![1].nestedData![3].nestedData = allNestedData.filter((s) => s.label.startsWith("FM"));

        this.classData.nestedData![2].nestedData = allNestedData.filter((s) => !s.label.startsWith("M") && !s.label.startsWith("F"));

    }

    private getTeacherData(): void {

        const teachers = this.broker.unique().teachers;
        const nestedData = teachers.map((teacher) => {
            return {
                label: teacher.surname + ", " + teacher.name + " (" + teacher.abbr + ")",
                action: () => this.openTimetable("teacher", teacher),
            }
        });
        this.teacherData.nestedData = nestedData;

        this.searchList = this.searchList.concat(nestedData);

    }

    private getRoomData(): void {

        const rooms = this.broker.unique().rooms.filter(r => r).sort();
        const nestedData = rooms.map((room) => {
            return {
                label: room,
                action: () => this.openTimetable("room", room),
            }
        });

        this.searchList = this.searchList.concat(nestedData);

        this.roomData.nestedData![0].nestedData![0].nestedData = nestedData.filter((s) => s.label.startsWith("U3"));
        this.roomData.nestedData![0].nestedData![1].nestedData = nestedData.filter((s) => s.label.startsWith("U1") || s.label.startsWith("AU"));
        this.roomData.nestedData![0].nestedData![2].nestedData = nestedData.filter((s) => s.label.startsWith("1"));
        this.roomData.nestedData![0].nestedData![3].nestedData = nestedData.filter((s) => s.label.startsWith("2"));
        this.roomData.nestedData![0].nestedData![4].nestedData = nestedData.filter((s) => s.label.startsWith("4"));
        this.roomData.nestedData![0].nestedData![5].nestedData = nestedData.filter((s) => s.label.startsWith("5"));
        this.roomData.nestedData![0].nestedData![6].nestedData = nestedData.filter((s) => s.label.startsWith("6"));
        this.roomData.nestedData![0].nestedData![7].nestedData = nestedData.filter((s) => s.label.startsWith("7"));

        this.roomData.nestedData![1].nestedData![0].nestedData = nestedData.filter((s) => s.label.startsWith("P0"));
        this.roomData.nestedData![1].nestedData![1].nestedData = nestedData.filter((s) => s.label.startsWith("P1"));

        this.roomData.nestedData![2].nestedData = nestedData.filter((s) => s.label.startsWith("V"));

        this.roomData.nestedData![3].nestedData![0].nestedData = nestedData.filter((s) => s.label.startsWith("T"));
        this.roomData.nestedData![3].nestedData![1].nestedData = nestedData.filter((s) => s.label.startsWith("K"));

    }

    protected updateTimetable(event: Event) {
        if (this.model)
            this.model.action();
    }

    private openTimetable(type: "teacher" | "room" | "class", data: any): void {
        switch (type) {
            case "teacher":
                this.router.navigate(["selection", `abbr:${data.abbr}`]).then(
                    nav => {

                    }, err => {
                        this.filter.clear(false);
                        this.filter.teacher({teacher: data.surname + " " + data.name});
                    });
                break;
            case "room":
                this.router.navigate(["selection", `room:${data}`]).then(
                    nav => {

                    }, err => {
                        this.filter.clear(false);
                        this.filter.room({room: data});
                    });
                break;
            case "class":
                this.router.navigate(["selection", `class:${data}`]).then(
                    nav => {

                    },
                    err => {
                        this.filter.clear(false);
                        this.filter.class({class: data});
                    });
                ;
                break;
        }
    }

    formatter = (result: { label: string, action: () => void }) => result.label;

    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map((term) =>
                term === '' ? [] : this.searchList.filter((v) => v.label.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
            ),
        );
}
