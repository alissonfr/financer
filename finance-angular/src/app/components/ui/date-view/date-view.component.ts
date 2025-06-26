import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { DateControlService } from "@services/date-control.service";
import { ChevronComponent } from "src/app/components/ui/chevron/chevron.component";
import { MAXIMUM_YEAR, MONTHS } from "src/app/constants/date.constants";

@Component({
    selector: "date-view",
    imports: [CommonModule, MatIconModule, ChevronComponent],
    templateUrl: "./date-view.component.html"
}) 
export class DateViewComponent {
    dateControl = inject(DateControlService);
    showNextMonth = true;

    readonly months: string[] = MONTHS;
    showNextYear = true;
    currentMonth = new Date().getMonth() + 1;
    

    ngOnInit(): void {
        this.verifyMonth();
        this.verifyYear();
    }

    verifyMonth(): void {
        this.dateControl.monthIndex.subscribe((month) => {
            const year = this.dateControl.year.value;
            const now = new Date();
            const maxDate = new Date(now.getFullYear() + MAXIMUM_YEAR, now.getMonth());
    
            const selectedDate = new Date(year, month);
            
            this.showNextMonth = selectedDate < maxDate;
        });
    }

    verifyYear(): void {
        this.dateControl.year.subscribe(year => {
            const currentYear = new Date().getFullYear();
            const maxYear = currentYear + MAXIMUM_YEAR;
            this.showNextYear = year < maxYear;
        });
    }
}
