import { Indicator } from './indicator';
import { PieChartData } from './chart-data';

export interface DashboardView {
  indicators: Indicator[];
  pieChart: PieChartData;
}
