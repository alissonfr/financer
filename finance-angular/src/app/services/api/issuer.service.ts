import { inject, Injectable } from "@angular/core";
import { HttpService } from "@services/http.service";
import { firstValueFrom, Observable } from "rxjs";
import { environment } from "src/app/environment";
import { Issuer } from "src/app/models/issuer.";
import { FileService } from "./file.service";

@Injectable({ 
    providedIn: "root" 
})
export class IssuerService {
    private readonly PATH = `${environment.API_URL}v1/issuers`;
    private http = inject(HttpService);
    private readonly fileService = inject(FileService);

    async find(params?: Record<string, string | number | null | undefined>): Promise<Issuer[]> {
        const result = await firstValueFrom(this.http.get<Issuer[]>(this.PATH, params));
        return await Promise.all(result.map(async (issuer) => ({ ...issuer, logoUrl: await this.fileService.get(issuer.logoUrl) })));
    }

    get(id: number): Observable<Issuer> {
        return this.http.get<Issuer>(`${this.PATH}/${id}`);
    }
}