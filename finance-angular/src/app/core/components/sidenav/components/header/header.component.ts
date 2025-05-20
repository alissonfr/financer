import { Component, inject, signal } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { AuthService } from "@services/api/auth.service";
import { ThemeSwitcher } from "@utils/theme-switcher";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { DateViewComponent } from "./components/date-view/date-view.component";

@Component({
    selector: "header-component",
    imports: [CommonModule, MatIconModule, MatMenuModule, DateViewComponent],
    templateUrl: "./header.component.html",
    standalone: true
})
export class HeaderComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    protected readonly themeSwitcher = inject(ThemeSwitcher);

    private readonly allowedRoutes = ["/dashboard", "/bank-accounts", "/credit-cards"];
    showDateView = signal<boolean>(true);

    constructor() {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => 
                this.showDateView.set(this.allowedRoutes.some(route => event.urlAfterRedirects === route)));
    }

    public change() {
        const currentTheme = this.themeSwitcher.theme();
        this.themeSwitcher.changeTo(currentTheme === "light" ? "dark" : "light");
    }

    logout() {
        this.authService.logout();
        this.router.navigate(["/auth/login"]);
    }
}
