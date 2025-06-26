import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { CreditCardService } from "@services/api/credit-card.service";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { InputComponent } from "src/app/components/form/input/input.component";
import { CreditCard } from "src/app/models/credit-card";
import { ButtonComponent } from "../../components/form/button/button.component";
import { PageHeaderComponent } from "../../components/ui/page-header/page-header.component";
import { CreditCardModalComponent } from "./components/credit-card-modal/credit-card-modal.component";

@Component({
    selector: "credit-cards",
    imports: [CommonModule, MatIconModule, MatMenuModule, ReactiveFormsModule, PageHeaderComponent, ButtonComponent, InputComponent],
    templateUrl: "./credit-cards.component.html",
    styleUrl: "./credit-cards.component.scss"
}) 
export class CreditCardsComponent {
    creditCards: CreditCard[] = [];

    formGroup = new FormGroup({
        name: new FormControl(""),
    });

    private readonly creditCardService = inject(CreditCardService);
    private readonly toastService = inject(ToastService);
    private readonly dialog = inject(ModalService);

    ngOnInit(): void {
        this.find();
    }

    find(): void {
        this.creditCardService.find(this.formGroup.getRawValue()).subscribe({
            next: (creditCards) => this.creditCards = creditCards,
            error: e => this.toastService.error(e, "Erro ao obter cartões de crédito.")
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreditCardModalComponent);
        dialogRef.afterClosed().subscribe(() => this.find());
    }

    update(id?: number): void {
        const dialogRef = this.dialog.open(CreditCardModalComponent, { data: { id } });
        dialogRef.afterClosed().subscribe(() => this.find());
    }

    delete(account: CreditCard): void {
        const dialogRef = this.dialog.confirmDeletion({
            title: "Apagar cartão de crédito",
            message: `Você está prestes a apagar um cartão de crédito "${account.name}". Você tem certeza?`
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result) {
                this.creditCardService.delete(account.creditCardId).subscribe({
                    next: () => {
                        this.toastService.success("Cartão de crédito apagado com sucesso.");
                        this.find();
                    },
                    error: e => this.toastService.error(e, "Erro ao apagar cartão de crédito.")
                });
            }
            
        });
    }

    clear(): void {
        this.formGroup.reset();
        this.find();
    }
}
