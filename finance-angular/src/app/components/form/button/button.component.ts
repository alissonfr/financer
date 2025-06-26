/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { GlobalLoadingService } from "@services/global-loading.service";

@Component({
    selector: "fin-button",
    imports: [CommonModule, MatIconModule],
    templateUrl: "./button.component.html",
    styleUrls: ["./button.component.scss"]
})
export class ButtonComponent {
  @Input() class = "";
  @Input() size: "normal" | "large" = "normal";
  @Input() color: "primary" | "secondary" | "outlined" | "cancel" | "plain" = "primary";
  @Input() disabled = false;
  @Input() startIcon?: string;
  @Output() click = new EventEmitter<void>();

  protected globalLoadingService = inject(GlobalLoadingService);

  get classes(): string {
      return `${this.size} ${this.color} ${this.class}`;
  }

  async handleClick(event: MouseEvent): Promise<void> {
      event.stopPropagation();
      event.preventDefault();

      const isLoading = this.globalLoadingService.loading();

      if (this.disabled || isLoading) {
          return;
      }

      this.click.emit();
  }

}
