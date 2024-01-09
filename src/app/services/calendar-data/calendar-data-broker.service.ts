import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CalendarDataConfig} from "./calendar-data-config";
import {RawCalendarDataEntry} from "./data-entries/raw-calendar-data-entry";
import {CalendarDataQuery} from "./calendar-data-query";
import {RawTeacherDataEntry} from "./data-entries/raw-teacher-data-entry";
import {CalendarDataClassDepartment} from "./data-entries/calendar-data-class-department";
import {CalendarDataUniques} from "./data-entries/calendar-data-uniques";

@Injectable({
    providedIn: 'root'
})
export class CalendarDataBrokerService {

    private config!: CalendarDataConfig;
    private teachers!: RawTeacherDataEntry[];
    private raw!: RawCalendarDataEntry[];
    private uniques: CalendarDataUniques = new CalendarDataUniques();

    /**
     * Emitted when the service has received and parsed the calendar data
     */
    onInitialized: EventEmitter<void> = new EventEmitter();

    constructor(private http: HttpClient) {
        this.init().then(() => {
            this.onInitialized.emit();
        });
    }

    private async init() {
        this.config = await this.readConfig();
        this.teachers = await this.readTeachers("assets/" + this.config.dataPath + this.config.teachers.file, this.config.teachers.fields);
        this.raw = await this.readAll(this.config.dataPath, this.config.entries.files, this.config.entries.fields);
    }

    private async readConfig() {
        return new Promise<CalendarDataConfig>((resolve) => {
            this.http.get("assets/calendar-data.config.json", {responseType: "json"}).subscribe(data => {
                resolve(data as CalendarDataConfig);
            });
        });
    }

    private async readTeachers(path: string, fields: string[]) {
        return new Promise<RawTeacherDataEntry[]>((resolve) => {
            this.http.get(path, {responseType: "text"}).subscribe(table => {
                const data = this.csv(fields, /[,;|\t]/gsm, table) as RawTeacherDataEntry[];
                for (const dat of data) {
                    if (!this.uniques.teachers.find(unique => { return unique.abbr === dat.abbr })) {
                        this.uniques.teachers.push({ abbr: dat.abbr, name: dat.name, surname: dat.surname });
                    }
                }
                resolve(data);
            });
        });
    }

    private async readAll(path: string, files: string[], fields: string[]) {
        return new Promise<RawCalendarDataEntry[]>(async (resolve) => {
            let data: RawCalendarDataEntry[] = [];
            for (const file of files) {
                await this.read("assets/" + path + file, fields).then(json => {
                    data = data.concat(json);
                });
            }
            resolve(data);
        });
    }

    private async read(path: string, fields: string[]) {
        return new Promise<RawCalendarDataEntry[]>((resolve) => {
            this.http.get(path, {responseType: "text"}).subscribe(table => {
                const data = this.csv(fields, /[,;|\t]/gsm, table) as RawCalendarDataEntry[];
                for (const dat of data) {
                    if (!this.uniques.indices.find(unique => { return unique === dat.index })) {
                        this.uniques.indices.push(dat.index);
                    }
                    if (!this.uniques.rooms.find(unique => { return unique === dat.room })) {
                        this.uniques.rooms.push(dat.room);
                    }
                    if (!this.uniques.lessons.find(unique => { return unique === dat.lesson })) {
                        this.uniques.lessons.push(dat.lesson);
                    }
                    if (!this.uniques.classes.find(unique => { return unique.full === dat.class })) {
                        this.uniques.classes.push({
                            full: dat.class,
                            department: {
                                "m": CalendarDataClassDepartment.MA,
                                "f": CalendarDataClassDepartment.FMS
                            }[dat.class.toLowerCase().slice(0, 1)] as CalendarDataClassDepartment,
                            year: Number(dat.class.slice(1, 2)),
                            alpha: dat.class.slice(2, 3).toLowerCase()
                        });
                    }
                }
                resolve(data);
            });
        });
    }

    csv(fields: string[], delimiter: RegExp, csvContents: string) {
        return csvContents
            .trim()
            .split(/\n/)
            .map(row => {
                let objectEntries: { [key: string]: any } = {}
                const rowEntries = row.split(delimiter)
                for (let i = 0; i < rowEntries.length; i++) {
                    if (fields[i].length > 0)
                        objectEntries[fields[i]] = rowEntries[i].replace(/\r/, "");
                }
                return objectEntries
            });
    }

    /**
     * This is a factory method; used to initialize a query object in order to select calendar data
     * @return CalendarDataQuery used for querying calendar data
     */
    query() {
        return new CalendarDataQuery(this.raw, this.teachers);
    }

    /**
     * Used for getting unique id-like fields
     */
    unique() {
        return this.uniques;
    }
}
