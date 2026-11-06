import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { PieChartData } from '../../models/chart-data';
import { DataLoadStatus } from '../../models/data-load-status';
import { Indicator } from '../../models/indicator';
import { Olympic } from '../../models/olympic';
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
  public pageState = signal<DataLoadStatus>('loading');

  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    combineLatest([this.dataService.getLoadStatus(), this.dataService.getOlympics()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([status, olympics]) => {
          if (status !== 'ready') {
            this.pageState.set(status);
            return;
          }

          if (!olympics || olympics.length === 0) {
            this.pageState.set('empty');
            return;
          }

          this.pageState.set('ready');
          this.indicators = this.buildIndicators(olympics);
          this.pieChart = this.buildPieChart(olympics);
          this.chartDescription = this.buildChartDescription(this.pieChart);
        },
      });
  }

  onCountrySelected(countryId: number): void {
    this.router.navigate(['country', countryId]);
  }

  private buildIndicators(olympics: Olympic[]): Indicator[] {
    const totalCountries = olympics.length;
    const totalJOs = new Set(
      olympics.flatMap((olympic) => olympic.participations.map((participation) => participation.year))
    ).size;

    return [
      { label: 'Number of countries', value: totalCountries },
      { label: 'Number of JOs', value: totalJOs },
    ];
  }

  private buildPieChart(olympics: Olympic[]): PieChartData {
    return {
      labels: olympics.map((olympic) => olympic.country),
      values: olympics.map((olympic) => this.totalMedalsForCountry(olympic)),
      countryIds: olympics.map((olympic) => olympic.id),
    };
  }

  private totalMedalsForCountry(olympic: Olympic): number {
    return olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0);
  }

  private buildChartDescription(chart: PieChartData): string {
    const parts = chart.labels.map((label, index) => `${label}: ${chart.values[index]} medals`);
    return `Pie chart of medals by country. ${parts.join('. ')}.`;
  }
}
