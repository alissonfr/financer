import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "@services/api/auth.service";
import { ThemeSwitcher } from "@utils/theme-switcher";
import { filter } from "rxjs/operators";
import { DateViewComponent } from "../date-view/date-view.component";

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

    change(): void {
        const currentTheme = this.themeSwitcher.theme();
        this.themeSwitcher.changeTo(currentTheme === "light" ? "dark" : "light");
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(["/auth/login"]);
    }
}
