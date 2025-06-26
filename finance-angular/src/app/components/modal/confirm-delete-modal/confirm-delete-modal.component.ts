import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ButtonComponent } from "../../form/button/button.component";

@Component({
    selector: "confirm-delete-modal",
    imports: [CommonModule, ButtonComponent, MatIconModule],
    templateUrl: "./confirm-delete-modal.component.html",
    styleUrl: "./confirm-delete-modal.component.scss"
})
export class ConfirmDeleteModalComponent {
    readonly data = inject(MAT_DIALOG_DATA);
    
    private readonly dialog = inject(MatDialogRef<ConfirmDeleteModalComponent>);

    close(): void {
        this.dialog.close(false);
    }

    confirm(): void {
        this.dialog.close(true);
    }
}
