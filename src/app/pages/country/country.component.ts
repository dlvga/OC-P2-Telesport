import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {combineLatest, filter} from 'rxjs';
import { Olympic } from '../../models/olympic';
import { DataServiceBehaviour } from '../../services/data.service-behaviour';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  public selectedCountry: Olympic | null = null;
  public error!: string;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataServiceBehaviour
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
          const selectedCountry = data.find((olympic: Olympic) => olympic.country === countryName);

          if (!selectedCountry) {
            this.router.navigate(['/not-found']);
            return;
          }

          this.selectedCountry = selectedCountry;
        },
        error: (error: Error) => {
          this.error = error.message;
        },
      });
  }
}
