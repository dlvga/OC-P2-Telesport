import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter } from 'rxjs';
import { CountryDetailView } from '../../models/country-detail-view';
import { Olympic } from '../../models/olympic';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public detailView: CountryDetailView | null = null;
  public errorMessage = '';

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    combineLatest([
      this.route.paramMap,
      this.dataService
        .getOlympics()
        .pipe(filter((data): data is Olympic[] => data !== null)),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([params, data]) => {
          if (data.length === 0) {
            this.router.navigate(['/not-found']);
            return;
          }

          const countryId = Number(params.get('id'));
          const detailView = this.dataService.resolveCountryDetailById(countryId, data);

          if (!detailView) {
            this.router.navigate(['/not-found']);
            return;
          }

          this.detailView = detailView;
        },
        error: () => {
          this.errorMessage = 'Unable to load the country\'s information.';
        },
      });
  }
}
