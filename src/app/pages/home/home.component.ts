import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';
import { PieChartData } from '../../models/chart-data';
import { DataLoadStatus } from '../../models/data-load-status';
import { Indicator } from '../../models/indicator';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public readonly errorMessage = 'Unable to load the Olympic data. Please try again later.';

  public titlePage = 'Medals per Country';
  public indicators: Indicator[] = [];
  public pieChart: PieChartData | null = null;
  public chartDescription = '';
  public pageState: DataLoadStatus = 'loading';

  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    combineLatest([this.dataService.getLoadStatus(), this.dataService.getDashboardView()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([status, view]) => {
          if (status === 'loading') {
            this.pageState = 'loading';
            return;
          }

          if (status === 'error') {
            this.pageState = 'error';
            return;
          }

          if (status === 'empty') {
            this.pageState = 'empty';
            return;
          }

          if (!view) {
            this.pageState = 'empty';
            return;
          }

          this.pageState = 'ready';
          this.indicators = view.indicators;
          this.pieChart = view.pieChart;
          this.chartDescription = this.buildChartDescription(view.pieChart);
        },
      });
  }

  onCountrySelected(countryId: number): void {
    this.router.navigate(['country', countryId]);
  }

  onRetryLoad(): void {
    this.dataService.retryLoadOlympics().pipe(take(1)).subscribe();
  }

  private buildChartDescription(chart: PieChartData): string {
    const parts = chart.labels.map((label, index) => `${label}: ${chart.values[index]} medals`);
    return `Pie chart of medals by country. ${parts.join('. ')}.`;
  }
}
