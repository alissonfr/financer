import { inject, Injectable } from "@angular/core";
import { DateControlService } from "@services/date-control.service";
import { HttpService } from "@services/http.service";
import { Observable } from "rxjs";
import { FinancialReportDTO } from "src/app/models/financial-report";
import { environment } from "src/environments/environment";

@Injectable({ 
    providedIn: "root" 
})
export class ReportService {
    private readonly PATH = `${environment.API_URL}v1/reports`;
    private http = inject(HttpService);
    private dateControlService = inject(DateControlService);

    getFinancialReport(): Observable<FinancialReportDTO> {
        return this.http.get<FinancialReportDTO>(this.PATH, { 
            month: this.dateControlService.monthIndex.value + 1, 
            year: this.dateControlService.year.value 
        });
    }
}