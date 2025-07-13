import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ToastService } from "@services/toast.service";

@Component({
    selector: "fin-toast",
    imports: [CommonModule, MatIconModule],
    templateUrl: "./toast.component.html",
    styleUrl: "./toast.component.scss"
})
export class ToastComponent {
    readonly toastService = inject(ToastService);
  
    removeToast(id: string): void {
        this.toastService.removeToast(id);
    }
}
