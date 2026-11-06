import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  input,
  output,
} from '@angular/core';
import { NgFor } from '@angular/common';
import Chart from 'chart.js/auto';
import { PieChartData } from '../../models/chart-data';

@Component({
  selector: 'app-medal-chart',
  standalone: true,
  imports: [NgFor],
  templateUrl: './medal-chart.component.html',
  styleUrl: './medal-chart.component.scss',
})
export class MedalChartComponent implements AfterViewInit, OnDestroy {
  chartData = input<PieChartData | null>(null);
  description = input('Medal chart by country.');
  countrySelected = output<number>();
  @ViewChild('medalChart') private canvas?: ElementRef<HTMLCanvasElement>;

  private pieChart?: Chart<'pie', number[], string>;
  private viewReady = false;

  constructor() {
    effect(() => {
      this.chartData();
      if (this.viewReady) {
        this.buildChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.pieChart?.destroy();
  }

  selectCountry(index: number): void {
    const countryId = this.chartData()?.countryIds[index];
    if (typeof countryId === 'number' && Number.isFinite(countryId)) {
      this.countrySelected.emit(countryId);
    }
  }

  private buildChart(): void {
    const chartData = this.chartData();
    if (!this.canvas || !chartData || chartData.labels.length === 0) {
      return;
    }

    this.pieChart?.destroy();
    this.pieChart = new Chart(this.canvas.nativeElement, {
      type: 'pie',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Medals',
            data: chartData.values,
            backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', '#d29922', '#94819d'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
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

          this.selectCountry(points[0].index);
        },
      },
    });
  }
}
