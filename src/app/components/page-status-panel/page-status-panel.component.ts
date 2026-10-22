import { Component, EventEmitter, Input, Output } from '@angular/core';

export type PageStatusVariant = 'empty' | 'error';

@Component({
  selector: 'app-page-status-panel',
  standalone: true,
  imports: [],
  templateUrl: './page-status-panel.component.html',
  styleUrl: './page-status-panel.component.scss',
})
export class PageStatusPanelComponent {
  @Input() variant: PageStatusVariant = 'empty';
  @Input() message = 'No data available';
  @Input() retryLabel = 'Try again';
  @Input() retryAriaLabel = 'Try again';

  @Output() retry = new EventEmitter<void>();

  onRetryClick(): void {
    this.retry.emit();
  }
}
