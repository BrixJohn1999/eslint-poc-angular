export interface StatisticsArgs {
  userId: number;
  region: string;
  apiUrl: string;
  sessionToken: any;
  reportStatusId?: number;
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  isDateSearch?: boolean;
}
