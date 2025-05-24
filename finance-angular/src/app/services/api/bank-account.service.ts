import { inject, Injectable } from "@angular/core";
import { HttpParams } from "@interfaces/http-params.type";
import { HttpService } from "@services/http.service";
import { Observable } from "rxjs";
import { BankAccount } from "src/app/models/bank-account";
import { environment } from "src/environments/environment";

@Injectable({ 
    providedIn: "root" 
})
export class BankAccountService {
    private readonly PATH = `${environment.API_URL}v1/bank-accounts`;
    private http = inject(HttpService);

    find(params?: HttpParams): Observable<BankAccount[]> {
        return this.http.get<BankAccount[]>(this.PATH, params);
    }

    get(id: number): Observable<BankAccount> {
        return this.http.get<BankAccount>(`${this.PATH}/${id}`);
    }

    create(bankAccount: Partial<BankAccount>): Observable<BankAccount> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { bankAccountId, ...data } = bankAccount;
        return this.http.post<BankAccount>(this.PATH, data);
    }

    update(id: number, bankAccount: Partial<BankAccount>): Observable<BankAccount> {
        return this.http.put<BankAccount>(`${this.PATH}/${id}`, bankAccount); 
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.PATH}/${id}`);
    }
}