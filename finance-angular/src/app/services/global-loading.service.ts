import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class GlobalLoadingService {
    readonly loading = signal(false);

    start(): void {
        this.loading.set(true);
    }

    end(): void {
        this.loading.set(false);
    }
}
