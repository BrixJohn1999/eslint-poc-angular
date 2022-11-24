import { Statistics } from 'src/app/model/statistics.model';

export interface StatisticsResponse {
  statisticsData: StatisticsData;
}

interface StatisticsData {
  message: string;
  statusCode: number;
  result: Statistics;
}
