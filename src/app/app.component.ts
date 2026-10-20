import {Component, inject, OnInit} from '@angular/core';
import { DataServiceBehaviour } from './services/data.service-behaviour';
import {take} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  private readonly dataService = inject(DataServiceBehaviour);

  constructor() {
  }

  ngOnInit(): void {
    this.dataService.loadOlympics()
      .pipe(take(1))
      .subscribe();
  }

}
