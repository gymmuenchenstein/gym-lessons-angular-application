import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CalendarDataConfig} from "./calendar-data-config";
import {RawCalendarDataEntry} from "./data-entries/raw-calendar-data-entry";
import {CalendarDataQuery} from "./calendar-data-query";
import {RawTeacherDataEntry} from "./data-entries/raw-teacher-data-entry";

@Injectable({
    providedIn: 'root'
})
export class CalendarDataBrokerService {

    private config!: CalendarDataConfig;
    private teachers!: RawTeacherDataEntry[];
    private raw!: RawCalendarDataEntry[];

    /**
     * Emitted when the service has received and parsed the calendar data
     */
    onInitialized: EventEmitter<void> = new EventEmitter();

    constructor(private http: HttpClient) {
        this.init().then(() => {
            this.onInitialized.emit();
            console.log("initialized", Date.now());
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
                resolve(this.csv(fields, /[,;|\t]/gsm, table) as RawTeacherDataEntry[]);
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
                resolve(this.csv(fields, /[,;|\t]/gsm, table) as RawCalendarDataEntry[]);
            });
        });
    }

    csv(fields: string[], delimiter: RegExp, csvContents: string) {
        return csvContents
            .trim()
            .split(/[\n|\r]/)
            .map(row => {
                let objectEntries: { [key: string]: any } = {}
                const rowEntries = row.split(delimiter)
                for (let i = 0; i < rowEntries.length; i++) {
                    objectEntries[fields[i]] = rowEntries[i];
                }
                return objectEntries
            })
    }

    /**
     * This is a factory method; used to initialize a query object in order to select calendar data
     * @return CalendarDataQuery used for querying calendar data
     */
    query() {
        return new CalendarDataQuery(this.raw, this.teachers);
    }
}
