import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { CountryDetailView } from '../models/country-detail-view';
import { DashboardView } from '../models/dashboard-view';
import { DataLoadStatus } from '../models/data-load-status';
import { LineChartData, PieChartData } from '../models/chart-data';
import { Indicator } from '../models/indicator';
import { Olympic } from '../models/olympic';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly olympicsSubject = new BehaviorSubject<Olympic[] | null>(null);
  private readonly loadStatusSubject = new BehaviorSubject<DataLoadStatus>('loading');

  constructor(private http: HttpClient) {}

  loadOlympics(): Observable<Olympic[] | null> {
    const cached = this.olympicsSubject.value;
    if (cached !== null) {
      this.loadStatusSubject.next(cached.length === 0 ? 'empty' : 'ready');
      return of(cached);
    }

    if (this.loadStatusSubject.value === 'error') {
      return of(null);
    }

    this.loadStatusSubject.next('loading');

    const olympicUrl = environment.simulateOlympicsLoadError
      ? './assets/mock/olympic-missing-for-test.json'
      : './assets/mock/olympic.json';

    return this.http.get<Olympic[]>(olympicUrl).pipe(
      tap((data) => {
        if (data.length === 0) {
          this.olympicsSubject.next([]);
          this.loadStatusSubject.next('empty');
          return;
        }

        this.olympicsSubject.next(data);
        this.loadStatusSubject.next('ready');
      }),
      catchError(() => {
        this.olympicsSubject.next(null);
        this.loadStatusSubject.next('error');
        return of(null);
      })
    );
  }

  getLoadStatus(): Observable<DataLoadStatus> {
    return this.loadStatusSubject.asObservable();
  }

  getOlympics(): Observable<Olympic[] | null> {
    return this.olympicsSubject.asObservable();
  }

  getDashboardView(): Observable<DashboardView | null> {
    return this.getOlympics().pipe(
      map((olympics) =>
        olympics === null || olympics.length === 0 ? null : this.buildDashboardView(olympics)
      )
    );
  }

  getCountryDetailView(countryId: number): Observable<CountryDetailView | null> {
    return this.getOlympics().pipe(
      map((olympics) => {
        if (olympics === null || olympics.length === 0) {
          return null;
        }

        return this.resolveCountryDetailById(countryId, olympics);
      })
    );
  }

  private resolveCountryDetailById(countryId: number, olympics: Olympic[]): CountryDetailView | null {
    if (!Number.isFinite(countryId) || olympics.length === 0) {
      return null;
    }

    const olympic = olympics.find((entry) => entry.id === countryId);
    if (!olympic) {
      return null;
    }

    return this.buildCountryDetailView(olympic);
  }

  parseCountryRouteId(idParam: string | null): number | null {
    if (idParam === null || idParam.trim() === '') {
      return null;
    }

    const countryId = Number(idParam);
    return Number.isFinite(countryId) ? countryId : null;
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
      countryIds: olympics.map((olympic) => olympic.id),
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
