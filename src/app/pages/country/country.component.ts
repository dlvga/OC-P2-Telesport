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
  public error!: string;

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
            return;
          }

          const countryName = params.get('countryName');
          const detailView = this.dataService.resolveCountryDetail(countryName, data);

          if (!detailView) {
            this.router.navigate(['/not-found']);
            return;
          }

          this.detailView = detailView;
        },
        error: (error: Error) => {
          this.error = error.message;
        },
      });
  }
}
