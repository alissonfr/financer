import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ModalService } from "@services/modal.service";
import { ThemeSwitcher } from "@utils/theme-switcher";
import { CreditCardTransactionModalComponent } from "src/app/components/modal/credit-card-transaction-modal/credit-card-transaction-modal.component";
import { SidenavItems } from "src/app/constants/sidenav-items";
import { SidenavItem } from "src/app/dtos/sidenav-item.dto";
import { Operation } from "src/app/enums/operation.enum";
import { ButtonComponent } from "../../form/button/button.component";
import { BankAccountTransactionModalComponent } from "../../modal/bank-account-transaction-modal/bank-account-transaction-modal.component";
import { HeaderComponent } from "../header/header.component";

@Component({
    selector: "sidenav",
    imports: [    
        CommonModule, 
        MatIconModule, 
        MatSidenavModule, 
        HeaderComponent, 
        MatListModule, 
        RouterLink, 
        RouterLinkActive, 
        RouterOutlet,
        MatMenuModule,
        ButtonComponent
    ],
    templateUrl: "./sidenav.component.html",
    styleUrl: "./sidenav.component.scss"
})
export class SidenavComponent {
    @ViewChild(MatSidenav) sidenav: MatSidenav;
    isMobile = true;
    isCollapsed = true;
    items: SidenavItem[] = SidenavItems;
    operation = Operation;

    readonly LOGO_URL = "assets/img/logo-dark.svg";
    readonly DARK_LOGO_URL = "assets/img/logo-light.svg";
    readonly themeSwitcher = inject(ThemeSwitcher);
    private readonly dialog = inject(ModalService);
    private readonly _breakpointObserver = inject(BreakpointObserver);
    private readonly _router = inject(Router);

    ngOnInit(): void {
        this._watchBreakpoint();
    }

    isCurrentRoute(route: string): boolean {
        return this._router.url === route;
    }

    toggleMenu(): void {
        if(this.isMobile){
            this.sidenav.toggle();
            this.isCollapsed = false;
        } else {
            this.sidenav.open();
            this.isCollapsed = !this.isCollapsed;
        }
    }

    createTransaction(operation: Operation): void {
        this.dialog.open(BankAccountTransactionModalComponent, { data: { operation } });
    }

    createCreditCardTransaction(): void {
        this.dialog.open(CreditCardTransactionModalComponent);
    }

    private _watchBreakpoint(): void {
        this._breakpointObserver.observe(["(max-width: 1024px)"])
            .subscribe((screenSize: BreakpointState) => this.isMobile = screenSize.matches);
    }
}
