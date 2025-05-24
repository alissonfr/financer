import { inject, Injectable } from "@angular/core";
import { HttpParams } from "@interfaces/http-params.type";
import { HttpService } from "@services/http.service";
import { firstValueFrom, Observable } from "rxjs";
import { Issuer } from "src/app/models/issuer";
import { environment } from "src/environments/environment";
import { FileService } from "./file.service";

@Injectable({ 
    providedIn: "root" 
})
export class IssuerService {
    private readonly PATH = `${environment.API_URL}v1/issuers`;
    private http = inject(HttpService);
    private readonly fileService = inject(FileService);

    async find(params?: HttpParams): Promise<Issuer[]> {
        const result = await firstValueFrom(this.http.get<Issuer[]>(this.PATH, params));
        return await Promise.all(
            result.map(async (issuer) => ({ ...issuer, logoUrl: await this.fileService.get(issuer.logoUrl) }))
        );
    }

    get(id: number): Observable<Issuer> {
        return this.http.get<Issuer>(`${this.PATH}/${id}`);
    }
}