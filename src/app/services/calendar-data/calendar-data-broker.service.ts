import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CalendarDataConfig} from "./calendar-data-config";
import {RawCalendarDataEntry} from "./data-entries/raw-calendar-data-entry";
import {CalendarDataQuery} from "./calendar-data-query";
import {RawTeacherDataEntry} from "./data-entries/raw-teacher-data-entry";
import {CalendarDataUniques} from "./data-entries/calendar-data-uniques";
import {CalendarFilterService} from "../calendar-filter/calendar-filter.service";
import {CalendarDataEntry} from "./data-entries/calendar-data-entry";

@Injectable({
    providedIn: 'root'
})
export class CalendarDataBrokerService {

    private config: CalendarDataConfig | undefined;
    private teachers: RawTeacherDataEntry[] = [];
    private raw: RawCalendarDataEntry[] = [];
    private uniques: CalendarDataUniques = new CalendarDataUniques();

    private selectedEntry: CalendarDataEntry | undefined

    /**
     * Emitted when the service has received and parsed the calendar data
     */
    onInitialized: EventEmitter<void> = new EventEmitter();

    constructor(private http: HttpClient, private filter: CalendarFilterService) {
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
                    if (!this.uniques.teachers.find(unique => {
                        return unique.abbr === dat.abbr
                    })) {
                        this.uniques.teachers.push({surname: dat.surname, name: dat.name, abbr: dat.abbr});
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
                    if (!Number.isNaN(Number(dat.index))) {
                        if (!this.uniques.indices.find(unique => {
                            return unique == dat.index
                        })) {
                            this.uniques.indices.push(Number(dat.index));
                        }
                    }
                    if (dat.room.length > 0) {
                        if (!this.uniques.rooms.find(unique => {
                            return unique === dat.room
                        })) {
                            this.uniques.rooms.push(dat.room);
                        }
                    }
                    if (dat.lesson.length > 0) {
                        if (!this.uniques.lessons.find(unique => {
                            return unique === dat.lesson
                        })) {
                            this.uniques.lessons.push(dat.lesson);
                        }
                    }
                    if (dat.class.length > 0) {
                        if (!this.uniques.classes.find(unique => {
                            return unique === dat.class
                        })) {
                            this.uniques.classes.push(dat.class);
                        }
                    }
                }
                this.uniques.complete();
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
    query(useFilter: boolean = true) {
        let query = new CalendarDataQuery(this.raw, this.teachers);
        if (useFilter)
            query = this.filter.filter(query);
        return query;
    }

    /**
     * Used for getting unique id-like fields
     */
    unique() {
        return this.uniques;
    }

    getSelectEntry() {
        return this.selectedEntry
    }

    setSelectEntry(entry: CalendarDataEntry) {
        this.selectedEntry = entry
    }
}
