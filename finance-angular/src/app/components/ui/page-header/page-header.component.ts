import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ButtonComponent } from "../../form/button/button.component";

@Component({
    selector: "page-header",
    imports: [MatIconModule, ButtonComponent],
    templateUrl: "./page-header.component.html",
    styleUrl: "./page-header.component.scss"
})
export class PageHeaderComponent {
    @Input({ required: true }) title: string;
    @Input({ required: true }) icon: string;
    @Output() newClick = new EventEmitter<void>();

    handleClick(): void {
        this.newClick.emit();
    }
}
