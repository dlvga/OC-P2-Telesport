import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { Olympic } from '../models/olympic';

@Injectable({ providedIn: 'root' })
export class DataServiceBehaviour {
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
}
