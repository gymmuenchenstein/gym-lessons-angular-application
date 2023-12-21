import {EventEmitter, Injectable} from '@angular/core';
import csv from "csvtojson";
import {HttpClient} from "@angular/common/http";
import {CalendarDataConfig} from "./calendar-data-config";
import {RawCalendarDataEntry} from "./data-entries/raw-calendar-data-entry";
import {CalendarDataQuery} from "./calendar-data-query";

@Injectable({
    providedIn: 'root'
})
export class CalendarDataBrokerService {

    private config!: CalendarDataConfig;
    private raw!: RawCalendarDataEntry[];

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
        this.raw = await this.readAll(this.config.dataPath, this.config.entries.files, this.config.entries.fields);
    }

    private async readConfig() {
        return new Promise<CalendarDataConfig>((resolve) => {
            this.http.get("assets/calendar-data.config.json", {responseType: "json"}).subscribe(data => {
                resolve(data as CalendarDataConfig);
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
                csv({headers: fields}).fromString(table).then(entries => {
                    resolve(Object.values(entries));
                });
            });
        });
    }

    /**
     * This is a factory method; used to initialize a query object in order to select calendar data
     * @return CalendarDataQuery used for querying calendar data
     */
    query() {
        return new CalendarDataQuery(this.raw);
    }
}
