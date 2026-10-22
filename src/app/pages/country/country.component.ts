import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, EMPTY, map, switchMap, take } from 'rxjs';
import { CountryDetailView } from '../../models/country-detail-view';
import { DataLoadStatus } from '../../models/data-load-status';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public readonly introText =
    'View participation counts, medal totals, athletes, and medal trends for the selected country.';

  public readonly errorMessage = 'Unable to load the country information. Please try again later.';

  public detailView: CountryDetailView | null = null;
  public pageState: DataLoadStatus = 'loading';

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  onRetryLoad(): void {
    this.dataService.retryLoadOlympics().pipe(take(1)).subscribe();
  }

  ngOnInit() {
    combineLatest([
      this.route.paramMap.pipe(map((params) => this.dataService.parseCountryRouteId(params.get('id')))),
      this.dataService.getLoadStatus(),
    ])
      .pipe(
        switchMap(([countryId, status]) => this.handleRouteAndStatus(countryId, status)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (detailView) => {
          if (!detailView) {
            this.router.navigate(['/not-found']);
            return;
          }

          this.pageState = 'ready';
          this.detailView = detailView;
        },
      });
  }

  private handleRouteAndStatus(countryId: number | null, status: DataLoadStatus) {
    if (status === 'loading') {
      this.pageState = 'loading';
      this.detailView = null;
      return EMPTY;
    }

    if (status === 'error') {
      this.pageState = 'error';
      this.detailView = null;
      return EMPTY;
    }

    if (status === 'empty') {
      this.pageState = 'empty';
      this.detailView = null;
      return EMPTY;
    }

    if (countryId === null) {
      this.router.navigate(['/not-found']);
      return EMPTY;
    }

    return this.dataService.getCountryDetailView(countryId);
  }
}
