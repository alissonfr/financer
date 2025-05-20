import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class GlobalLoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);

    start(): void {
        this.loadingSubject.next(true);
    }

    end(): void {
        this.loadingSubject.next(false);
    }

    isLoading(): Observable<boolean> {
        return this.loadingSubject.asObservable();
    }

}
