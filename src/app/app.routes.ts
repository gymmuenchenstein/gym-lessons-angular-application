import { Routes } from "@angular/router";
import { MainComponent } from "./view/pages/main/main.component";
import { TestComponent } from "./view/pages/test/test.component";

export const routes: Routes = [{
    path: "",
    component: MainComponent
}, {
    path: "test",
    component: TestComponent
}, {
    path: "**",
    redirectTo: ""
}];
