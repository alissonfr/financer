import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { BankAccountService } from "@services/api/bank-account.service";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { InputComponent } from "src/app/components/form/input/input.component";
import { BankAccount } from "src/app/models/bank-account";
import { ButtonComponent } from "../../components/form/button/button.component";
import { PageHeaderComponent } from "../../components/ui/page-header/page-header.component";
import { BankAccountModalComponent } from "./components/bank-account-modal/bank-account-modal.component";

@Component({
    selector: "bank-accounts",
    imports: [CommonModule, MatIconModule, MatMenuModule, ReactiveFormsModule, PageHeaderComponent, ButtonComponent, InputComponent],
    templateUrl: "./bank-accounts.component.html",
    styleUrl: "./bank-accounts.component.scss"
}) 
export class BankAccountComponent {
    bankAccounts: BankAccount[] = [];

    formGroup = new FormGroup({
        name: new FormControl(""),
    });

    private readonly bankAccountService = inject(BankAccountService);
    private readonly toastService = inject(ToastService);
    private readonly dialog = inject(ModalService);

    ngOnInit(): void {
        this.find();
    }

    find(): void {
        this.bankAccountService.find(this.formGroup.getRawValue()).subscribe({
            next: (bankAccounts) => this.bankAccounts = bankAccounts,
            error: e => this.toastService.error(e, "Erro ao obter contas bancárias.")
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(BankAccountModalComponent);
        dialogRef.afterClosed().subscribe(() => this.find());
    }

    update(id?: number): void {
        const dialogRef = this.dialog.open(BankAccountModalComponent, { data: { id } });
        dialogRef.afterClosed().subscribe(() => this.find());
    }

    delete(account: BankAccount): void {
        const dialogRef = this.dialog.confirmDeletion({
            title: "Apagar conta bancária",
            message: `Você está prestes a apagar a conta bancária "${account.name}". Você tem certeza?`
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result) {
                this.bankAccountService.delete(account.bankAccountId).subscribe({
                    next: () => {
                        this.toastService.success("Conta bancária apagada com sucesso.");
                        this.find();
                    },
                    error: e => this.toastService.error(e, "Erro ao apagar conta bancária.")
                });
            }
            
        });
    }

    clear(): void {
        this.formGroup.reset();
        this.find();
    }

    isExpense(totalAmount: string): boolean {
        return parseFloat(totalAmount) < 0;
    }
}
