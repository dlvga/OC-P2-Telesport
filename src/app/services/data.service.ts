import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { CountryDetailView } from '../models/country-detail-view';
import { DashboardView } from '../models/dashboard-view';
import { LineChartData, PieChartData } from '../models/chart-data';
import { Indicator } from '../models/indicator';
import { Olympic } from '../models/olympic';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly olympicsSubject = new BehaviorSubject<Olympic[] | null>(null);

  constructor(private http: HttpClient) {}

  loadOlympics(): Observable<Olympic[] | null> {
    const olympics = this.olympicsSubject.value;

    if (olympics !== null) {
      return of(olympics);
    }

    return this.http.get<Olympic[]>('./assets/mock/olympic.json').pipe(
      tap((data) => this.olympicsSubject.next(data)),
      catchError((err) => {
        this.olympicsSubject.error(err);
        return throwError(() => err);
      })
    );
  }

  getOlympics(): Observable<Olympic[] | null> {
    return this.olympicsSubject.asObservable();
  }

  getDashboardView(): Observable<DashboardView | null> {
    return this.getOlympics().pipe(
      map((olympics) => (olympics === null || olympics.length === 0 ? null : this.buildDashboardView(olympics)))
    );
  }

  resolveCountryDetail(countryName: string | null, olympics: Olympic[]): CountryDetailView | null {
    if (!countryName || olympics.length === 0) {
      return null;
    }

    const olympic = olympics.find((entry) => entry.country === countryName);
    if (!olympic) {
      return null;
    }

    return this.buildCountryDetailView(olympic);
  }

  private buildDashboardView(olympics: Olympic[]): DashboardView {
    const totalCountries = olympics.length;
    const totalJOs = new Set(
      olympics.flatMap((olympic) => olympic.participations.map((participation) => participation.year))
    ).size;

    const indicators: Indicator[] = [
      { label: 'Number of countries', value: totalCountries },
      { label: 'Number of JOs', value: totalJOs },
    ];

    const pieChart: PieChartData = {
      labels: olympics.map((olympic) => olympic.country),
      values: olympics.map((olympic) => this.totalMedalsForCountry(olympic)),
    };

    return { indicators, pieChart };
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

  private totalMedalsForCountry(olympic: Olympic): number {
    return olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0);
  }
}
