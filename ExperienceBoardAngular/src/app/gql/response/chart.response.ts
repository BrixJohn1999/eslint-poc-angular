import { PieChart } from 'src/app/model/chart.model';
export interface ChartResponse {
  chartData: ChartData;
}

interface ChartData {
  message: string;
  statusCode: number;
  result: PieChart;
}
