import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { DataLoadStatus } from '../models/data-load-status';
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

    return this.fetchOlympicsFromHttp();
  }

  private fetchOlympicsFromHttp(): Observable<Olympic[] | null> {
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

  parseCountryRouteId(idParam: string | null): number | null {
    if (idParam === null || idParam.trim() === '') {
      return null;
    }

    const countryId = Number(idParam);
    return Number.isFinite(countryId) ? countryId : null;
  }
}
