import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { BankAccountTransactionService } from "@services/api/bank-account-transaction.service";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { debounceTime } from "rxjs";
import { InputComponent } from "src/app/components/form/input/input.component";
import { SelectComponent } from "src/app/components/form/select/select.component";
import { BankAccountTransactionModalComponent } from "src/app/components/modal/bank-account-transaction-modal/bank-account-transaction-modal.component";
import { DeleteTransactionOptions } from "src/app/enums/delete-transaction-options.enum";
import { Operation } from "src/app/enums/operation.enum";
import { TransactionStatus } from "src/app/enums/transaction-status.enum";
import { TransactionType } from "src/app/enums/transaction-type.enum";
import { BankAccountTransaction } from "src/app/models/bank-account-transaction";
import { CategoryIconComponent } from "../../../../components/ui/category-icon/category-icon.component";
import { SkeletonLoaderComponent } from "../../../../components/ui/skeleton-loader/skeleton-loader.component";

@Component({
    selector: "bank-account-transactions",
    imports: [CommonModule, MatIconModule, MatMenuModule, ReactiveFormsModule, SkeletonLoaderComponent, CategoryIconComponent, SelectComponent, InputComponent],
    templateUrl: "./bank-account-transactions.component.html"
})
export class BankAccountTransactionsComponent {
    bankAccountTransactions: BankAccountTransaction[] = [];

    protected readonly bankAccountTransactionService = inject(BankAccountTransactionService);
    private readonly dialog = inject(ModalService);
    private readonly toastService = inject(ToastService);

    formGroup = new FormGroup({
        search: new FormControl(""),
        sort: new FormControl({ label: "", value: "" }),
    });

    sort: {label: string, value: string}[] = [
        { label: "Ordenar por Data", value: "date" },
        { label: "Ordenar por Valor", value: "amount" },
    ];

    get operations(): typeof Operation {
        return Operation;
    }

    get transactionStatus(): typeof TransactionStatus {
        return TransactionStatus;
    }

    get transactionType(): typeof TransactionType {
        return TransactionType;
    }

    ngOnInit(): void {
        this.loadTransactions();
        this.bankAccountTransactionService.transactionUpdated$.subscribe(() => this.loadTransactions());
        this.formGroup.valueChanges.pipe(debounceTime(500)).subscribe(() => this.loadTransactions());
    }

    changeStatus(id: number): void {
        this.bankAccountTransactionService.updateStatus(id).subscribe({
            error: (e) => this.toastService.error(e, "Erro ao obter transações.")
        });
    }

    delete(transaction: BankAccountTransaction): void {
        if(transaction.type === TransactionType.SINGLE) {
            this.deleteSingleTransaction(transaction);
            return;
        }

        this.deleteRecurringTransaction(transaction);
    }

    private deleteRecurringTransaction(transaction: BankAccountTransaction): void {
        const dialogRef = this.dialog.deleteTransaction(transaction);
        dialogRef.afterClosed().subscribe((result) => {
            if(!result) return;

            this.bankAccountTransactionService.delete(transaction.bankAccountTransactionId, result as DeleteTransactionOptions).subscribe({
                next: () => {
                    this.toastService.success("Transações apagadas com sucesso.");
                    this.loadTransactions();
                },
                error: e => this.toastService.error(e, "Erro ao apagar transações.")
            });
        });
    }
    
    private deleteSingleTransaction(transaction: BankAccountTransaction): void {
        const dialogRef = this.dialog.confirmDeletion({
            title: "Apagar transação",
            message: `Você está prestes a apagar a transação "${transaction.description}". Você tem certeza?`
        });
        dialogRef.afterClosed().subscribe(result => {
            if(!result) return;
            this.bankAccountTransactionService.delete(transaction.bankAccountTransactionId).subscribe({
                next: () => {
                    this.toastService.success("Transação apagada com sucesso.");
                    this.loadTransactions();
                },
                error: e => this.toastService.error(e, "Erro ao apagar transação.")
            });
            
                
        });
    }

    update(transaction: BankAccountTransaction): void {
        const dialogRef = this.dialog.open(BankAccountTransactionModalComponent, { data: { 
            operation: transaction.operation, 
            id: transaction.bankAccountTransactionId
        }});
        dialogRef.afterClosed().subscribe(() => this.loadTransactions());
    }
    
    private loadTransactions(): void {
        const filters = { 
            sort: this.formGroup.value?.sort?.value,
            search: this.formGroup.value?.search
        };
        this.bankAccountTransactionService.find(filters).subscribe({
            next: (result) => this.bankAccountTransactions = result,
            error: (e) => this.toastService.error(e, "Erro ao obter transações.")
        });
    }
}
