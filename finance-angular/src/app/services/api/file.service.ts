import { inject, Injectable } from "@angular/core";
import { CacheService } from "@services/cache.service";
import { environment } from "src/environments/environment";

@Injectable({ 
    providedIn: "root" 
})
export class FileService {
    private readonly PATH = `${environment.API_URL}v1/files/`;
    private readonly cacheService = inject(CacheService<string>);

    async get(url: string): Promise<string> {
        if(this.cacheService.get(url)) {
            return this.cacheService.get(url);
        }
        
        const response = await fetch(`${this.PATH}${url}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const blob = await response.blob();
        const logoUrl: string = URL.createObjectURL(blob);
        this.cacheService.set(url, logoUrl);
        return logoUrl;
    }
}
