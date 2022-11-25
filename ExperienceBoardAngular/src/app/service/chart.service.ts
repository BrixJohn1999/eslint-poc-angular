import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ChartArgs } from '../gql/args/chart.args';
import {
  GET_MEASUREMENT_BY_PROPERTY_TYPE_CHART,
  GET_MEASUREMENT_STATUS_CHART,
} from '../gql/query/chart.query';
import { ChartResponse } from '../gql/response/chart.response';

@Injectable()
export class ChartService {
  constructor(private apollo: Apollo) {}

  async getChartData(chartArgs: ChartArgs, widgetsId: number) {
    let query: any;
    if (widgetsId === 7) query = GET_MEASUREMENT_STATUS_CHART;
    else if (widgetsId === 545) query = GET_MEASUREMENT_BY_PROPERTY_TYPE_CHART;
    const result = await this.apollo
      .watchQuery<ChartResponse>({
        query,
      })
      .refetch(chartArgs);
    return result.data.chartData.result;
  }
}
