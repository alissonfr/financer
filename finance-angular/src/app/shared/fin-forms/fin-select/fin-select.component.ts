import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { first } from "rxjs";
import { FinInputComponent } from "../fin-input/fin-input.component";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SelectItem = any;

@Component({
    selector: "fin-select",
    imports: [CommonModule, FinInputComponent, ReactiveFormsModule, MatIconModule],
    templateUrl: "./fin-select.component.html",
    styleUrl: "./fin-select.component.scss"
})
export class FinSelectComponent {
    @Input({ required: true }) items: SelectItem[] = [];
    @Input({ required: true }) displayProperty: string;
    @Input({ required: true }) formGroup: FormGroup;
    @Input({ required: true }) controlName: string;
    @Input() label: string;

    @Output() addNewItem = new EventEmitter<string>();

    @ViewChild(FinInputComponent) input: FinInputComponent;
    @ViewChild(FinInputComponent, { static: true, read: ElementRef }) inputRef: ElementRef;

    isDropdownOpen = false;

    searchFormGroup = new FormGroup({
        searchControl: new FormControl(""),
    });

    ngOnInit(): void {
        const propInput = this.formGroup.get(this.controlName);
        this.setInitialValue();
        
        if(propInput?.hasValidator(Validators.required)) {
            propInput?.events.subscribe(() => {
                if(propInput?.invalid && propInput?.touched) {
                    this.inputRef.nativeElement.classList.add("ng-touched", "ng-invalid");
                } else {
                    this.inputRef.nativeElement.classList.remove("ng-touched", "ng-invalid");
                }
            });
        }
    }

    setInitialValue(): void {
        this.formGroup.get(this.controlName)?.valueChanges.pipe(first()).subscribe(value => this.selectItem(value));
    }

    selectItem(item: SelectItem): void {
        this.input.writeValue(item[this.displayProperty]);
        this.formGroup.get(this.controlName)?.setValue(item);
        this.isDropdownOpen = false;
    }

    openDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown(): void {
        this.isDropdownOpen = false;
    }

}
