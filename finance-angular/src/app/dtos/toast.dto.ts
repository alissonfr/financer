import { ToastStatus } from "@interfaces/toast-status.type";

export class Toast {
    id: string;
    message: string;
    type?: ToastStatus;
}