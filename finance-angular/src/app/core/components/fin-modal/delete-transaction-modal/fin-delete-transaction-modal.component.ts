import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DeleteTransactionOptions } from "src/app/enums/delete-transaction-options.enum";
import { FinFormsModule } from "src/app/shared/fin-forms/fin-forms.module";

@Component({
    selector: "fin-delete-transaction-modal",
    imports: [CommonModule, FinFormsModule, MatIconModule],
    templateUrl: "./fin-delete-transaction-modal.component.html",
    styleUrl: "./fin-delete-transaction-modal.component.scss"
})
export class FinDeleteTransactionModalComponent {
    readonly data = inject(MAT_DIALOG_DATA);
    readonly options = DeleteTransactionOptions;
    readonly option = signal<DeleteTransactionOptions>(DeleteTransactionOptions.CURRENT);

    private readonly dialog = inject(MatDialogRef<FinDeleteTransactionModalComponent>);

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
