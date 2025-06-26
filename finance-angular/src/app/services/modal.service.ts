import { ComponentType } from "@angular/cdk/portal";
import { Injectable, inject } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ConfirmDeleteModalComponent } from "src/app/components/modal/confirm-delete-modal/confirm-delete-modal.component";
import { DeleteTransactionModalComponent } from "src/app/components/modal/delete-transaction-modal/delete-transaction-modal.component";
import { BankAccountTransaction } from "../models/bank-account-transaction";

@Injectable({
    providedIn: "root",
})
export class ModalService {
    private readonly dialog = inject(MatDialog);


    open<T, R = unknown>(component: ComponentType<T>, config?: MatDialogConfig): MatDialogRef<T, R> {
        return this.dialog.open(component, { minWidth: "40%", ...config });
    }

    confirmDeletion(data: { title: string, message: string }): MatDialogRef<ConfirmDeleteModalComponent> {
        return this.open(ConfirmDeleteModalComponent, { width: "400px", height: "300px", data: { ...data }, maxWidth: "400px" });
    }

    deleteTransaction(transaction: BankAccountTransaction): MatDialogRef<DeleteTransactionModalComponent> {
        return this.open(DeleteTransactionModalComponent, { width: "500px", height: "450px", data: { transaction }, maxWidth: "500px" });
    }

    closeAll(): void {
        this.dialog.closeAll();
    }
}
