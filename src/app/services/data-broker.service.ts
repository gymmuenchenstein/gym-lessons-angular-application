import {EventEmitter, Injectable} from '@angular/core';
import csv from "csvtojson";
import {HttpClient} from "@angular/common/http";
import {DataConfig} from "./data-config";
import {RawDataEntry} from "./data-entries/raw-data-entry";
import {DataEntry} from "./data-entries/data-entry";
import {Temporal} from "@js-temporal/polyfill";

@Injectable({
    providedIn: 'root'
})
export class DataBrokerService {

    private path = `assets/data/1. Sem. Export für Upload SchulNetz, detailliert.txt`;
    private config!: DataConfig;
    private raw!: RawDataEntry[];

    onInitialized: EventEmitter<void> = new EventEmitter();

    constructor(private http: HttpClient) {
        this.init().then(() => {
            this.onInitialized.emit();
        });
    }

    private async init() {
        const uno = Date.now();

        this.config = await this.readConfig();

        const dos = Date.now();
        console.log(dos - uno);

        for (let i = 0; i < 1; i++) {
            this.raw = await this.readAll(this.config.dataPath, this.config.entries.files, this.config.entries.fields);
        }

        const tres = Date.now();
        console.log(tres - dos);

        const unraw = this.raw.filter((entry) => {
            return entry.abbr.toLowerCase() === "stj" && entry.day === 26;
        });

        const quatros = Date.now();
        console.log(quatros - tres);
    }

    private async readConfig() {
        return new Promise<DataConfig>((resolve) => {
            this.http.get("assets/data.config.json", {responseType: "json"}).subscribe(data => {
                resolve(data as DataConfig);
            });
        });
    }

    private async readAll(path: string, files: string[], fields: string[]) {
        return new Promise<RawDataEntry[]>(async (resolve) => {
            let data: RawDataEntry[] = [];
            for (const file of files) {
                await this.read("assets/" + path + file, fields).then(json => {
                    data = data.concat(json);
                });
            }
            resolve(data);
        });
    }

    private async read(path: string, fields: string[]) {
        return new Promise<RawDataEntry[]>((resolve) => {
            this.http.get(path, {responseType: "text"}).subscribe(table => {
                csv({headers: fields}).fromString(table).then(entries => {
                    resolve(Object.values(entries));
                });
            });
        });
    }

    //TODO
    /*select(filter) {

    }*/

    getInDay(searchArgs: { year: number, month: number, day: number }) {
        const raw = this.raw.filter((entry) => {
            return entry.day === searchArgs.day && entry.month === searchArgs.month && entry.year === searchArgs.year;
        });
        return this.convertToCleanData(raw);
    }

    getInWeek(searchArgs: { year: number, month: number, day?: number, weekOfYear?: number }) {
        const rootDate = Temporal.PlainDate.from(searchArgs);
        const startDate = rootDate.subtract({days: rootDate.dayOfWeek});
        const endDate = startDate.add(Temporal.Duration.from({weeks: 1}));

        const raw = this.raw.filter((entry) => {
            return (entry.day >= startDate.day && entry.month >= startDate.month && entry.year >= startDate.year) &&
                (entry.day >= endDate.day && entry.month >= endDate.month && entry.year >= endDate.year)
        });
        return this.convertToCleanData(raw);
    }

    getInMonth(searchArgs: { year: number, month: number }) {
        const raw = this.raw.filter((entry) => {
            return entry.month == searchArgs.month && entry.year >= searchArgs.year
        });
        return this.convertToCleanData(raw);
    }

    getLikeClass(searchArg: string) {
        const raw = this.raw.filter((entry) => {
            return entry.class.includes(searchArg);
        });
        return this.convertToCleanData(raw);
    }

    private convertToCleanData(raw: RawDataEntry[]) {
        const clean: DataEntry[] = [];

        let obj: DataEntry;
        for (const entry of raw) {
            obj = {
                index: entry.index,
                abbr: entry.abbr,
                room: entry.room,
                lesson: entry.lesson,
                class: entry.class,
                date: Temporal.PlainDate.from({
                    year: Number(entry.year),
                    month: Number(entry.month),
                    day: Number(entry.day)
                }),
                time: {
                    time: Temporal.PlainTime.from((String(entry.time).length == 3 ? "0" : "") + entry.time),
                    duration: Temporal.Duration.from({minutes: Number(entry.duration)})
                }
            }
            clean.push(obj);
        }

        return clean;
    }
}
