import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { Olympic } from '../../models/olympic';

@Component({
  selector: 'app-medal-chart',
  standalone: true,
  imports: [],
  templateUrl: './medal-chart.component.html',
  styleUrl: './medal-chart.component.scss'
})
export class MedalChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() olympics: Olympic[] = [];
  @Output() countrySelected = new EventEmitter<string>();
  @ViewChild('medalChart') private canvas?: ElementRef<HTMLCanvasElement>;

  private pieChart?: Chart<'pie', number[], string>;
  private viewReady = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['olympics'] && this.viewReady) {
      this.buildChart();
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.pieChart?.destroy();
  }

  private buildChart(): void {
    if (!this.canvas || this.olympics.length === 0) {
      return;
    }

    const countries = this.olympics.map((olympic) => olympic.country);
    const medals = this.olympics.map((olympic) =>
      olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0)
    );

    this.pieChart?.destroy();
    this.pieChart = new Chart(this.canvas.nativeElement, {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Medals',
            data: medals,
            backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (event) => {
          if (!event.native || !this.pieChart) {
            return;
          }

          const points = this.pieChart.getElementsAtEventForMode(
            event.native,
            'point',
            { intersect: true },
            true
          );

          if (!points.length) {
            return;
          }

          const countryName = this.pieChart.data.labels?.[points[0].index];
          if (typeof countryName === 'string' && countryName.length > 0) {
            this.countrySelected.emit(countryName);
          }
        },
      },
    });
  }
}
