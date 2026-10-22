import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
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
export class MedalChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() chartData: PieChartData | null = null;
  @Input() description = 'Medal chart by country.';
  @Output() countrySelected = new EventEmitter<number>();
  @ViewChild('medalChart') private canvas?: ElementRef<HTMLCanvasElement>;

  private pieChart?: Chart<'pie', number[], string>;
  private viewReady = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && this.viewReady) {
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

  selectCountry(index: number): void {
    const countryId = this.chartData?.countryIds[index];
    if (Number.isFinite(countryId)) {
      this.countrySelected.emit(countryId);
    }
  }

  private buildChart(): void {
    if (!this.canvas || !this.chartData || this.chartData.labels.length === 0) {
      return;
    }

    this.pieChart?.destroy();
    this.pieChart = new Chart(this.canvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            label: 'Medals',
            data: this.chartData.values,
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
          if (!event.native || !this.pieChart || !this.chartData) {
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
