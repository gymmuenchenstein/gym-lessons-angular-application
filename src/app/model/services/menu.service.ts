import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    isAlwaysVisible: boolean = false;

    constructor() {
    }
}
