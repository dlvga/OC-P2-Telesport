import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { Olympic } from '../../models/olympic';
import { DataServiceBehaviour } from '../../services/data.service-behaviour';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics: Olympic[] = [];
  public titlePage = 'Medals per Country';
  public indicators: { label: string; value: number | string }[] = [];
  public error!: string;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router, private dataService: DataServiceBehaviour) {}

  ngOnInit() {
    this.dataService
      .getOlympics()
      .pipe(
        filter((data): data is Olympic[] => data !== null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          if (data.length === 0) {
            return;
          }

          this.olympics = data;
          const totalCountries = data.length;
          const totalJOs = Array.from(
            new Set(data.flatMap((olympic) => olympic.participations.map((participation) => participation.year)))
          ).length;

          this.indicators = [
            { label: 'Number of countries', value: totalCountries },
            { label: 'Number of JOs', value: totalJOs },
          ];
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
