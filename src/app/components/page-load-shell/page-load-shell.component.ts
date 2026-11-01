import { Component, Input } from '@angular/core';
import { DataLoadStatus } from '../../models/data-load-status';
import { PageLoadingSkeletonComponent } from '../page-loading-skeleton/page-loading-skeleton.component';
import { PageStatusPanelComponent } from '../page-status-panel/page-status-panel.component';

@Component({
  selector: 'app-page-load-shell',
  standalone: true,
  imports: [PageLoadingSkeletonComponent, PageStatusPanelComponent],
  templateUrl: './page-load-shell.component.html',
  styleUrl: './page-load-shell.component.scss',
})
export class PageLoadShellComponent {
  @Input({ required: true }) loadState!: DataLoadStatus;
  @Input() loadingStatusMessage = 'Loading data';
  @Input() showIntroLine = false;
  @Input() kpiCount = 2;
  @Input() emptyMessage = 'No data available';
  @Input() errorMessage = 'Unable to load data. Please try again later.';
}
