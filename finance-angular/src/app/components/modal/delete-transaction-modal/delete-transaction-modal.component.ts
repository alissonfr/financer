import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DeleteTransactionOptions } from "src/app/enums/delete-transaction-options.enum";
import { ButtonComponent } from "../../form/button/button.component";

@Component({
    selector: "delete-transaction-modal",
    imports: [CommonModule, MatIconModule, ButtonComponent],
    templateUrl: "./delete-transaction-modal.component.html",
    styleUrl: "./delete-transaction-modal.component.scss"
})
export class DeleteTransactionModalComponent {
    readonly data = inject(MAT_DIALOG_DATA);
    readonly options = DeleteTransactionOptions;
    readonly option = signal<DeleteTransactionOptions>(DeleteTransactionOptions.CURRENT);

    private readonly dialog = inject(MatDialogRef<DeleteTransactionModalComponent>);

    close(): void {
        this.dialog.close(false);
    }

    confirm(): void {
        this.dialog.close(this.option);
    }

    changeOption(option: DeleteTransactionOptions): void {
        this.option.set(option);
    }
}
