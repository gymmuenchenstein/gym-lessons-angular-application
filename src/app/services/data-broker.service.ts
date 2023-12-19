import {Injectable} from '@angular/core';
import csv from "csvtojson";
import {HttpClient} from "@angular/common/http";
import {DataConfig} from "./data-config";

@Injectable({
    providedIn: 'root'
})
export class DataBrokerService {

    private path = `assets/data/1. Sem. Export für Upload SchulNetz, detailliert.txt`;
    private config!: DataConfig;

    constructor(private http: HttpClient) {
        this.init().then();
    }

    private async init() {
        this.config = await this.readConfig();
        //const dataRaw = this.readAll(this.config.dataPath, this.config.entries.files, this.config.entries.fields);
    }

    private async readConfig() {
        return new Promise<DataConfig>((resolve) => {
            this.http.get("assets/data.config.json", {responseType: "json"}).subscribe(data => {
                resolve(data as DataConfig);
            });
        });
    }

    private readAll(path: string, files: string[], fields: string[]): {[key: string]: any} {
        let data: any = {};
        for (const file of files) {
            data[file] = this.read("assets/" + path + file, fields);
        }
        return data;
    }

    private read(path: string, fields: string[]) {
        return new Promise<any>((resolve) => {
            this.http.get(path, {responseType: 'text'}).subscribe(data => {
                csv({headers: fields}).fromString(data).then(json => {
                    resolve(json);
                });
            });
        });
    }
}
