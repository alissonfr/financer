// toast.service.ts
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { ToastStatus } from "@interfaces/toast-status.type";
import { Toast } from "../dtos/toast.dto";



const INVALID_FORM_MSG = "Preencha todos os campos corretamente.";

@Injectable({
    providedIn: "root",
})
export class ToastService {
    readonly toasts = signal<Toast[]>([]);

    invalidForm(duration: number = 3000): void {
        this.warning(INVALID_FORM_MSG, duration);
    }

    success(message: string, duration: number = 3000): void {
        this.addToast("success", message, duration);
    }

    error(e: HttpErrorResponse, message: string, duration: number = 3000): void {
        this.addToast("error", e?.error?.message?.message || message, duration);
    }

    info(message: string, duration: number = 3000): void {
        this.addToast("info", message, duration);
    }

    warning(message: string, duration: number = 3000): void {
        this.addToast("warning", message, duration);
    }

    removeToast(id: string): void {
        this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
    }

    private addToast(type: ToastStatus, message: string, duration: number): void {
        const id = crypto.randomUUID();
        const newToast: Toast = { id, message, type };
        this.toasts.update(toasts => [...toasts, newToast]);
        setTimeout(() => this.removeToast(id), duration);
    }
}
