import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@services/api/auth.service";
import { ToastService } from "@services/toast.service";
import { isFormInvalid } from "@utils/form-validator";
import { InputComponent } from "src/app/components/form/input/input.component";
import { LoginRequest } from "src/app/dtos/login-request.dto";
import { ButtonComponent } from "../../../components/form/button/button.component";

@Component({
    selector: "login",
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
    templateUrl: "./login.component.html"
})
export class LoginComponent {
    formGroup = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
    });

    private authService = inject(AuthService);
    private router = inject(Router);
    private toastService = inject(ToastService);

    onSubmit(): void {
        if(isFormInvalid(this.formGroup)) {
            this.toastService.invalidForm();
            return;
        }

        this.authService.login(this.formGroup.value as LoginRequest)
            .subscribe({
                next: () => this.router.navigate(["/dashboard"]),
                error: e => this.toastService.error(e, "Erro ao realizar login."),
            });
    }

}
