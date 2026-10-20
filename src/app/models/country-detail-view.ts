import { Indicator } from './indicator';
import { LineChartData } from './chart-data';

export interface CountryDetailView {
  title: string;
  indicators: Indicator[];
  lineChart: LineChartData;
}
