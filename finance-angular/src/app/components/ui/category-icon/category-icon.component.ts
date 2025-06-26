import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Category } from "src/app/models/category";

@Component({
    selector: "category-icon",
    imports: [MatIconModule, MatIconModule, MatTooltipModule],
    templateUrl: "./category-icon.component.html",
    styleUrl: "./category-icon.component.scss"
})
export class CategoryIconComponent {
    @Input({ required: true }) category: Category;
    @Input() size: "normal" | "small" = "normal";
}
