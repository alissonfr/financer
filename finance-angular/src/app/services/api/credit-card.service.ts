import { inject, Injectable, signal } from "@angular/core";
import { HttpParams } from "@interfaces/http-params.type";
import { DateControlService } from "@services/date-control.service";
import { HttpService } from "@services/http.service";
import { finalize, forkJoin, Observable, Subject, switchMap } from "rxjs";
import { CreditCard } from "src/app/models/credit-card";
import { CreditCardWithTransactions } from "src/app/models/credit-card-with-transactions";
import { environment } from "src/environments/environment";
import { FileService } from "./file.service";

@Injectable({ 
    providedIn: "root" 
})
export class CreditCardService {
    private readonly PATH = `${environment.API_URL}v1/credit-cards`;
    private http = inject(HttpService);
    private dateControlService = inject(DateControlService);
    private readonly fileService = inject(FileService);

    private transactionUpdatedSubject = new Subject<void>();
    transactionUpdated$ = this.transactionUpdatedSubject.asObservable();

    readonly isLoading = signal<boolean>(false);

    constructor() {
        this.dateControlService.dateChanged.subscribe(() => {
            this.notifyTransactionUpdated();
        });
    }

    private withLoading<T>(obs: Observable<T>): Observable<T> {
        this.isLoading.set(true);
        return obs.pipe(finalize(() => this.isLoading.set(false)));
    }

    find(params?: HttpParams): Observable<CreditCard[]> {
        return this.withLoading(
            this.http.get<CreditCard[]>(this.PATH, params).pipe(
                switchMap((cards) => {
                    const updatedCards$ = cards.map((card) => 
                        this.fileService.get(card.issuer.logoUrl).then((logoUrl) => ({
                            ...card,
                            issuer: {
                                ...card.issuer,
                                logoUrl
                            }
                        }))
                    );
                    return forkJoin(updatedCards$);
                })
            )
        );
    }

    findWithTransactions(params?: HttpParams): Observable<CreditCardWithTransactions[]> {
        const query = { ...params, month: this.dateControlService.monthIndex.value + 1, year: this.dateControlService.year.value };
        return this.withLoading(
            this.http.get<CreditCardWithTransactions[]>(`${this.PATH}/transactions`, query)
        );
    }

    get(id: number): Observable<CreditCard> {
        return this.withLoading(
            this.http.get<CreditCard>(`${this.PATH}/${id}`)
        );
    }

    create(bankAccount: Partial<CreditCard>): Observable<CreditCard> {
        return this.withLoading(
            this.http.post<CreditCard>(this.PATH, bankAccount)
                .pipe(finalize(() => this.notifyTransactionUpdated()))
        );
    }

    update(id: number, bankAccount: Partial<CreditCard>): Observable<CreditCard> {
        return this.withLoading(
            this.http.put<CreditCard>(`${this.PATH}/${id}`, bankAccount)
                .pipe(finalize(() => this.notifyTransactionUpdated()))
        );
    }

    delete(id: number): Observable<void> {
        return this.withLoading(
            this.http.delete<void>(`${this.PATH}/${id}`)
                .pipe(finalize(() => this.notifyTransactionUpdated()))
        );
    }

    private notifyTransactionUpdated(): void {
        this.transactionUpdatedSubject.next();
    }
}
