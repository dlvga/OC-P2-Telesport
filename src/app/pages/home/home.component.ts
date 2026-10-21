import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { PieChartData } from '../../models/chart-data';
import { Indicator } from '../../models/indicator';
import { DataService } from '../../services/data.service';

type DashboardPageState = 'loading' | 'ready' | 'empty' | 'error';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public readonly introText =
    'TeleSport offers you an overview of the Olympic medals won by each country across all editions.';

  public titlePage = 'Medals per Country';
  public indicators: Indicator[] = [];
  public pieChart: PieChartData | null = null;
  public chartDescription = '';
  public pageState: DashboardPageState = 'loading';
  public errorMessage = '';

  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.dataService
      .getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (data === null) {
            this.pageState = 'loading';
            return;
          }

          if (data.length === 0) {
            this.pageState = 'empty';
          }
        },
        error: () => {
          this.pageState = 'error';
          this.errorMessage = 'Unable to load the Olympic data.';
        },
      });

    this.dataService
      .getDashboardView()
      .pipe(
        filter((view): view is NonNullable<typeof view> => view !== null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (view) => {
          this.pageState = 'ready';
          this.indicators = view.indicators;
          this.pieChart = view.pieChart;
          this.chartDescription = this.buildChartDescription(view.pieChart);
        },
        error: () => {
          this.pageState = 'error';
          this.errorMessage = 'Unable to load the Olympic data.';
        },
      });
  }

  onCountrySelected(countryId: number): void {
    this.router.navigate(['country', countryId]);
  }

  private buildChartDescription(chart: PieChartData): string {
    const parts = chart.labels.map((label, index) => `${label}: ${chart.values[index]} medals`);
    return `Pie chart of medals by country. ${parts.join('. ')}.`;
  }
}
