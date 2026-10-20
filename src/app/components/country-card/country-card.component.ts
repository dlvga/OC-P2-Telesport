import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { CountryDetailView } from '../../models/country-detail-view';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-country-card',
  standalone: true,
  imports: [HeaderComponent, NgIf],
  templateUrl: './country-card.component.html',
  styleUrl: './country-card.component.scss',
})
export class CountryCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() detailView: CountryDetailView | null = null;
  @ViewChild('countryChart') private canvas?: ElementRef<HTMLCanvasElement>;

  private lineChart?: Chart<'line', number[], number>;
  private viewReady = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['detailView'] && this.viewReady) {
      this.buildChart();
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.lineChart?.destroy();
  }

  private buildChart(): void {
    if (!this.canvas || !this.detailView || this.detailView.lineChart.labels.length === 0) {
      return;
    }

    const { labels, values } = this.detailView.lineChart;

    this.lineChart?.destroy();
    this.lineChart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'medals',
            data: values,
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
