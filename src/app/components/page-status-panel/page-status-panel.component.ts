import { Component, Input } from '@angular/core';

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
}
