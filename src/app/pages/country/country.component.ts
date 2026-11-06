import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { LineChartData } from '../../models/chart-data';
import { CountryDetailView } from '../../models/country-detail-view';
import { DataLoadStatus } from '../../models/data-load-status';
import { Indicator } from '../../models/indicator';
import { Olympic } from '../../models/olympic';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public readonly errorMessage = 'Unable to load the country information. Please try again later.';

  public detailView: CountryDetailView | null = null;
  public pageState: DataLoadStatus = 'loading';

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const countryId = this.dataService.parseCountryRouteId(this.route.snapshot.paramMap.get('id'));

    if (countryId === null) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.dataService.getLoadStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        this.pageState = status;
      });

    this.dataService.getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((olympics) => {
        if (!olympics) {
          return;
        }

        const olympic = olympics.find((entry) => entry.id === countryId);
        if (!olympic) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.pageState = 'ready';
        this.detailView = this.buildCountryDetailView(olympic);
      });
  }

  private buildCountryDetailView(olympic: Olympic): CountryDetailView {
    const totalEntries = olympic.participations.length;
    const totalMedals = olympic.participations.reduce(
      (acc, participation) => acc + participation.medalsCount,
      0
    );
    const totalAthletes = olympic.participations.reduce(
      (acc, participation) => acc + participation.athleteCount,
      0
    );

    const indicators: Indicator[] = [
      { label: 'Number of entries', value: totalEntries },
      { label: 'Total Number of medals', value: totalMedals },
      { label: 'Total Number of athletes', value: totalAthletes },
    ];

    const lineChart: LineChartData = {
      labels: olympic.participations.map((participation) => participation.year),
      values: olympic.participations.map((participation) => participation.medalsCount),
    };

    return {
      title: olympic.country,
      indicators,
      lineChart,
    };
  }
}
