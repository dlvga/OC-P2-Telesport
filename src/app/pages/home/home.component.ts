import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { PieChartData } from '../../models/chart-data';
import { Indicator } from '../../models/indicator';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public titlePage = 'Medals per Country';
  public indicators: Indicator[] = [];
  public pieChart: PieChartData | null = null;
  public error!: string;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.dataService
      .getDashboardView()
      .pipe(
        filter((view): view is NonNullable<typeof view> => view !== null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (view) => {
          this.indicators = view.indicators;
          this.pieChart = view.pieChart;
        },
        error: (error: Error) => {
          this.error = error.message;
        },
      });
  }

  onCountrySelected(countryName: string): void {
    this.router.navigate(['country', countryName]);
  }
}
