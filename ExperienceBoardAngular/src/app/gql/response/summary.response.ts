import { Summary } from 'src/app/model/summary.model';

export interface SummaryReponse {
  summaryData: SummaryData;
}

interface SummaryData {
  message: string;
  statusCode: number;
  result: Summary;
}
