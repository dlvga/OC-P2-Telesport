import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { Olympic } from '../../models/olympic';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-country-card',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss'
})
export class CountryCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() country: Olympic | null = null;
  @ViewChild('countryChart') private canvas?: ElementRef<HTMLCanvasElement>;

  public titlePage = '';
  public indicators: { label: string; value: number | string }[] = [];

  private lineChart?: Chart<'line', string[], number>;
  private viewReady = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['country']) {
      return;
    }

    this.updateIndicators();

    if (this.viewReady) {
      this.buildChartFromCountry();
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.buildChartFromCountry();
  }

  ngOnDestroy(): void {
    this.lineChart?.destroy();
  }

  private updateIndicators(): void {
    if (!this.country) {
      this.titlePage = '';
      this.indicators = [];
      return;
    }

    this.titlePage = this.country.country;
    const totalEntries = this.country.participations.length;
    const totalMedals = this.country.participations.reduce((acc, participation) => acc + participation.medalsCount, 0);
    const totalAthletes = this.country.participations.reduce((acc, participation) => acc + participation.athleteCount, 0);

    this.indicators = [
      { label: 'Number of entries', value: totalEntries },
      { label: 'Total Number of medals', value: totalMedals },
      { label: 'Total Number of athletes', value: totalAthletes },
    ];
  }

  private buildChartFromCountry(): void {
    if (!this.country) {
      return;
    }

    this.buildChart(
      this.country.participations.map((participation) => participation.year),
      this.country.participations.map((participation) => participation.medalsCount.toString())
    );
  }

  private buildChart(years: number[], medals: string[]): void {
    if (!this.canvas) {
      return;
    }

    this.lineChart?.destroy();
    this.lineChart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'medals',
            data: medals,
            backgroundColor: '#0b868f',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
