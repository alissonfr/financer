import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { BankAccountTransactionService } from "@services/api/bank-account-transaction.service";
import { BankAccountService } from "@services/api/bank-account.service";
import { CategoryService } from "@services/api/category.service";
import { PaymentMethodService } from "@services/api/payment-method.service";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { isFormInvalid } from "@utils/form-validator";
import { BankAccountModalComponent } from "@views/bank-accounts/components/bank-account-modal/bank-account-modal.component";
import { CategoryModalComponent } from "@views/categories/components/bank-account-modal/category-modal.component";
import { CreateOperationLabels, Operation, UpdateOperationLabels } from "src/app/enums/operation.enum";
import { TransactionStatus } from "src/app/enums/transaction-status.enum";
import { TransactionType } from "src/app/enums/transaction-type.enum";
import { BankAccount } from "src/app/models/bank-account";
import { BankAccountTransaction } from "src/app/models/bank-account-transaction";
import { Category } from "src/app/models/category";
import { PaymentMethod } from "src/app/models/payment-method";
import { CreditCardTransactionModalComponent } from "../../../components/modal/credit-card-transaction-modal/credit-card-transaction-modal.component";
import { AutocompleteComponent } from "../../form/autocomplete/autocomplete.component";
import { ButtonComponent } from "../../form/button/button.component";
import { InputComponent } from "../../form/input/input.component";
import { SelectComponent } from "../../form/select/select.component";
import { TextAreaComponent } from "../../form/textarea/textarea.component";

@Component({
    selector: "bank-account-transaction-modal",
    imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatMenuModule, MatDatepickerModule, SelectComponent, AutocompleteComponent, ButtonComponent, InputComponent, TextAreaComponent],
    templateUrl: "./bank-account-transaction-modal.component.html",
    styleUrl: "./bank-account-transaction-modal.component.scss"
})
export class BankAccountTransactionModalComponent {
    expanded = false;
    operations = Operation;
    types = TransactionType;
    formGroup: FormGroup = new FormGroup({
        bankAccountTransactionId: new FormControl(0),
        description: new FormControl("", [Validators.required]),
        date: new FormControl(new Date(), [Validators.required]),
        amount: new FormControl("", [Validators.required]),
        status: new FormControl(TransactionStatus.PENDING, [Validators.required]),
        operation: new FormControl("", [Validators.required]),
        category: new FormControl("", [Validators.required]),
        type: new FormControl(TransactionType.SINGLE, [Validators.required]),
        bankAccount: new FormControl("", [Validators.required]),
        paymentMethod: new FormControl("", [Validators.required]),
        notes: new FormControl(""),
    });
    
    bankAccounts: BankAccount[] = [];
    categories: Category[] = [];
    paymentMethods: PaymentMethod[] = [];

    protected readonly data = inject(MAT_DIALOG_DATA);
    private readonly modalService = inject(ModalService);
    private readonly dialog = inject(MatDialogRef<CategoryModalComponent>);
    private readonly bankAccountService = inject(BankAccountService);
    private readonly categoryService = inject(CategoryService);
    private readonly paymentMethodService = inject(PaymentMethodService);
    private readonly toastService = inject(ToastService);
    private readonly bankAccountTransactionService = inject(BankAccountTransactionService);

    get title(): string {
        const operation = this.data.operation as Operation;
        if(this.data?.id) return UpdateOperationLabels.get(operation) ?? "";
        return CreateOperationLabels.get(operation) ?? "";
    }

    get icon(): string {
        return this.data.operation ? "show_chart" : "credit_card";
    }

    get status(): typeof TransactionStatus{
        return TransactionStatus;
    }

    get operation(): Operation {
        return this.data.operation as Operation;
    }
    
    ngOnInit(): void {
        const operation = this.data.operation as Operation;
        this.formGroup.get("operation")?.patchValue(operation);
        this.findCategories(this.data.operation);
        this.findBankAccounts();
        this.findPaymentMethods();

        if(this.data?.id) this.get(this.data.id);
    }

    close(): void {
        this.dialog.close();
    }

    submit(): void {
        if(isFormInvalid(this.formGroup)) {
            this.toastService.invalidForm();
            return;
        }

        const transaction = this.formGroup.getRawValue() as unknown as BankAccountTransaction;
        if(transaction.bankAccountTransactionId) {
            this.update(transaction.bankAccountTransactionId, transaction);
        } else {
            this.create(transaction);
        }
    }

    createNewBankAccount(name: string): void {
        const modal = this.modalService.open(BankAccountModalComponent, { data: { name } });
        modal.afterClosed().subscribe(() => this.findBankAccounts());
    }

    createNewCategory(name: string): void {
        const modal = this.modalService.open(CategoryModalComponent, { data: { name } });
        modal.afterClosed().subscribe(() => this.findCategories());
    }

    changeOperation(operation: Operation): void {
        this.formGroup.get("operation")?.patchValue(operation);
        this.data.operation = operation;
        this.findCategories(operation);
    }

    changeType(event: Event, type: TransactionType): void {
        const checking = (event.target as HTMLInputElement)?.checked;
        if(!checking) {
            this.formGroup.removeControl("installments");
            return this.formGroup.get("type")?.patchValue(TransactionType.SINGLE);
        }

        if(type === TransactionType.IN_INSTALLMENTS) {
            this.formGroup.addControl("installments", new FormControl("", Validators.required));
        } else {
            this.formGroup.removeControl("installments");
        }

        this.formGroup.get("type")?.patchValue(type);
    }

    changeStatus(): void {
        const status = this.formGroup.get("status");
        if(status?.value === TransactionStatus.PAID) {
            status.patchValue(TransactionStatus.PENDING);
        } else {
            status?.patchValue(TransactionStatus.PAID);
        }
    }

    changeToCreditCard(): void {
        this.close();
        this.modalService.open(CreditCardTransactionModalComponent);
    }

    private findCategories(operation?: Operation): void {
        this.categoryService.find({ operation }).subscribe({
            next: (result) => this.categories = result,
            error: e => this.toastService.error(e, "Erro ao obter categorias.")
        });
    }

    private findBankAccounts(): void {
        this.bankAccountService.find().subscribe({
            next: (result) => this.bankAccounts = result,
            error: e => this.toastService.error(e, "Erro ao obter contas bancárias.")
        });
    }

    private findPaymentMethods(): void {
        this.paymentMethodService.find().subscribe({
            next: (result) => this.paymentMethods = result,
            error: e => this.toastService.error(e, "Erro ao obter métodos de pagamento.")
        });
    }

    private get(id: number): void {
        this.bankAccountTransactionService.get(id).subscribe({
            next: (result) => this.formGroup.setValue(result as unknown as never),
            error: e => this.toastService.error(e, "Erro ao obter métodos de pagamento.")
        });
    }

    private create(transaction: BankAccountTransaction): void {
        this.bankAccountTransactionService.create(transaction).subscribe({
            next: () => {
                this.toastService.success("Transação criada com sucesso.");
                this.close();
            },
            error: e => this.toastService.error(e, "Erro ao criar transação.")
        });
    }

    private update(id: number, transaction: BankAccountTransaction): void {
        this.bankAccountTransactionService.update(id, transaction).subscribe({
            next: () => {
                this.toastService.success("Transação atualizada com sucesso.");
                this.close();
            },
            error: e => this.toastService.error(e, "Erro ao atualizar transação.")
        });
    }
}
