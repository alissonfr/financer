import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { CategoryService } from "@services/api/category.service";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { InputComponent } from "src/app/components/form/input/input.component";
import { SelectComponent } from "src/app/components/form/select/select.component";
import { OperationLabels } from "src/app/enums/operation.enum";
import { Category } from "src/app/models/category";
import { ButtonComponent } from "../../components/form/button/button.component";
import { CategoryIconComponent } from "../../components/ui/category-icon/category-icon.component";
import { PageHeaderComponent } from "../../components/ui/page-header/page-header.component";
import { CategoryModalComponent } from "./components/bank-account-modal/category-modal.component";

@Component({
    selector: "categories",
    imports: [CommonModule, MatIconModule, MatMenuModule, ReactiveFormsModule, PageHeaderComponent, ButtonComponent, CategoryIconComponent, SelectComponent, InputComponent],
    templateUrl: "./categories.component.html",
    styleUrl: "./categories.component.scss"
}) 
export class BankAccountComponent {
    categories: Category[] = [];

    formGroup = new FormGroup({
        name: new FormControl(""),
        operation: new FormControl(""),
    });

    operations: {name: string, label: string}[] = Array.from(OperationLabels, ([name, label]) => ({ name, label }));

    get operationsLabels(): typeof OperationLabels {
        return OperationLabels;
    }

    private readonly categoryService = inject(CategoryService);
    private readonly toastService = inject(ToastService);
    private readonly dialog = inject(ModalService);

    ngOnInit(): void {
        this.find();
    }

    find(): void {
        this.categoryService.find(this.formGroup.getRawValue()).subscribe({
            next: (categories) => this.categories = categories,
            error: e => this.toastService.error(e, "Erro ao obter categorias.")
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CategoryModalComponent);
        dialogRef.afterClosed().subscribe(() => this.find());
    }

    update(id?: number): void {
        const dialogRef = this.dialog.open(CategoryModalComponent, { data: { id } });
        dialogRef.afterClosed().subscribe(() => this.find());
    }

    delete(category: Category): void {
        const dialogRef = this.dialog.confirmDeletion({
            title: "Apagar categoria",
            message: `Você está prestes a apagar a categoria "${category.name}". Você tem certeza?`
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result) {
                this.categoryService.delete(category.categoryId).subscribe({
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
}
