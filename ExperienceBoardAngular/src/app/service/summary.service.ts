import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SummaryArgs } from '../gql/args/summary.args';
import { GET_REPORTS_SUMMARY } from '../gql/query/summary.query';
import { SummaryReponse } from '../gql/response/summary.response';
@Injectable()
export class SummaryService {
  constructor(private apollo: Apollo) {}

  async getSummaryData(summaryArgs: SummaryArgs) {
    const query = GET_REPORTS_SUMMARY;
    const result = await this.apollo
      .watchQuery<SummaryReponse>({
        query,
      })
      .refetch(summaryArgs);
    return result.data.summaryData.result;
  }
}
