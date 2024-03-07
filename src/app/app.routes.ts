import {Routes} from "@angular/router";
import {MainComponent} from "./view/pages/main/main.component";
import {TestComponent} from "./view/pages/test/test.component";

export const routes: Routes = [
    {
        path: "test",
        component: TestComponent
    }, {
        path: "selection/:filter",
        component: MainComponent
    }, {
        path: "",
        component: MainComponent
    }, {
        path: "**",
        redirectTo: ""
    }];
