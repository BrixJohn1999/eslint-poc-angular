import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { StatisticsArgs } from '../gql/args/statistics.args';
import { ReplaySubject } from 'rxjs';
import { StatisticsResponse } from '../gql/response/statistics.response';
import {
  GET_BUILDING_MEASURED_STATISTICS,
  GET_OBTAINED_OPPORTUNITY_STATISTICS,
  GET_STATISTICS,
} from '../gql/query/statistics.query';

@Injectable()
export class StatisticsService {
  private statisticsData = new ReplaySubject<any>(1);
  statisticsData$ = this.statisticsData.asObservable();

  constructor(private apollo: Apollo) {}

  setStatisticsData(data: any) {
    this.statisticsData.next(data);
  }

  async getStatisticsData(statisticsArgs: StatisticsArgs) {
    let query = GET_STATISTICS;
    if (statisticsArgs.reportStatusId !== undefined) {
      query = GET_BUILDING_MEASURED_STATISTICS;
    }

    if (statisticsArgs.startMonth !== undefined) {
      query = GET_OBTAINED_OPPORTUNITY_STATISTICS;
    }

    const result = await this.apollo
      .watchQuery<StatisticsResponse>({
        query,
      })
      .refetch(statisticsArgs);
    return result.data.statisticsData.result;
  }
}
