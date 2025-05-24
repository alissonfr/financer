import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: "skeleton-loader",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./skeleton-loader.component.html",
    styleUrls: ["./skeleton-loader.component.scss"],
})
export class SkeletonLoaderComponent {
  @Input() image = false;
}
