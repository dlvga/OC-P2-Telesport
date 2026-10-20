import { Component, inject, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService
      .loadOlympics()
      .pipe(take(1))
      .subscribe();
  }
}
