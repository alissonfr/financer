import { inject, Injectable, signal } from "@angular/core";
import { HttpParams } from "@interfaces/http-params.type";
import { DateControlService } from "@services/date-control.service";
import { HttpService } from "@services/http.service";
import { formatDateHourToNow } from "@utils/parsers";
import { finalize, Observable, Subject } from "rxjs";
import { DeleteTransactionOptions } from "src/app/enums/delete-transaction-options.enum";
import { BankAccountTransaction } from "src/app/models/bank-account-transaction";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class BankAccountTransactionService {
    private readonly PATH = `${environment.API_URL}v1/bank-account-transactions`;

    private readonly http = inject(HttpService);
    private readonly dateControlService = inject(DateControlService);

    private readonly transactionUpdatedSubject = new Subject<void>();
    readonly transactionUpdated$ = this.transactionUpdatedSubject.asObservable();
    readonly isLoading = signal<boolean>(false);

    constructor() {
        this.dateControlService.dateChanged.subscribe(() => this.notifyTransactionUpdated());
    }

    private withLoading<T>(obs: Observable<T>): Observable<T> {
        this.isLoading.set(true);
        return obs.pipe(finalize(() => this.isLoading.set(false)));
    }

    private withLoadingAndNotify<T>(obs: Observable<T>): Observable<T> {
        return this.withLoading(obs).pipe(finalize(() => this.notifyTransactionUpdated()));
    }

    private notifyTransactionUpdated(): void {
        this.transactionUpdatedSubject.next();
    }

    find(params?: HttpParams): Observable<BankAccountTransaction[]> {
        const query = {
            ...params,
            month: this.dateControlService.monthIndex.value + 1,
            year: this.dateControlService.year.value
        };

        return this.withLoading(this.http.get<BankAccountTransaction[]>(this.PATH, query));
    }

    get(id: number): Observable<BankAccountTransaction> {
        return this.withLoading(this.http.get<BankAccountTransaction>(`${this.PATH}/${id}`));
    }

    create(transaction: Partial<BankAccountTransaction>): Observable<BankAccountTransaction> {
        if (transaction.date) {
            transaction.date = formatDateHourToNow(transaction.date);
        }

        return this.withLoadingAndNotify(this.http.post<BankAccountTransaction>(this.PATH, transaction));
    }

    update(id: number, transaction: Partial<BankAccountTransaction>): Observable<BankAccountTransaction> {
        return this.withLoadingAndNotify(this.http.put<BankAccountTransaction>(`${this.PATH}/${id}`, transaction));
    }

    delete(id: number, option?: DeleteTransactionOptions): Observable<void> {
        return this.withLoadingAndNotify(this.http.delete<void>(`${this.PATH}/${id}`, { option }));
    }

    updateStatus(id: number): Observable<BankAccountTransaction> {
        return this.withLoadingAndNotify(this.http.put<BankAccountTransaction>(`${this.PATH}/${id}/status`, {}));
    }
}
