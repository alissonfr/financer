import { ToastStatus } from "@interfaces/toast-status.type";

export interface Toast {
    id: string;
    message: string;
    type?: ToastStatus;
}