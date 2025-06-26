/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";

@Component({
    selector: "fin-textarea",
    imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule],
    templateUrl: "./textarea.component.html",
    styleUrl: "./textarea.component.scss",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextAreaComponent),
            multi: true,
        },
    ]
})
export class TextAreaComponent implements ControlValueAccessor {
    @Input() type = "text";
    @Input() name = "";
    @Input() placeholder = "";
    @Input() autocomplete = "off";
    @Input() initialValue: string;
    @Input() label: string;
    
    @Output() focus = new EventEmitter<void>();
    @Output() blur = new EventEmitter<void>();
    
    protected disabled: boolean;
    protected value = "";
    protected control: FormControl;
  
    onChanged: (value: string) => void;
    onTouched: () => void;
  
    writeValue(value: string): void {
        this.value = value ?? "";
    }
  
    registerOnChange(fn: (value: string) => void): void {
        this.onChanged = fn;
    }
  
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
  
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInputChange(event: Event): void {
        const value = (event.target as HTMLInputElement)?.value ?? "";
        this.value = value;
        this.onChanged(value);
    }

    onFocus(): void {
        this.focus.emit();
    }

    onBlur(): void {
        this.blur.emit();
        if (this.onTouched) {
            this.onTouched();
        }
    }
}
