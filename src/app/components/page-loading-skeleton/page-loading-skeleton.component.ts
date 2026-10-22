import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-loading-skeleton',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './page-loading-skeleton.component.html',
  styleUrl: './page-loading-skeleton.component.scss',
})
export class PageLoadingSkeletonComponent {
  @Input() statusMessage = 'Loading data';
  @Input() showIntroLine = false;
  @Input() kpiCount = 2;

  get kpiPlaceholders(): number[] {
    const count = Math.max(0, Math.floor(this.kpiCount));
    return Array.from({ length: count }, (_, index) => index);
  }
}
