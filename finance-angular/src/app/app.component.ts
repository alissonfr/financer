import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterOutlet } from "@angular/router";
import { ThemeSwitcher } from "@utils/theme-switcher";
import { ToastComponent } from "src/app/components/ui/toast/toast.component";

@Component({
    selector: "app-root",
    imports: [CommonModule, RouterOutlet, ToastComponent, MatSnackBarModule],
    template: `
        <router-outlet /> 
        <fin-toast />
    `
})
export class AppComponent {
    readonly themeSwitcher = inject(ThemeSwitcher);
}
