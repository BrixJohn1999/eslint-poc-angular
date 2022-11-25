import { gql } from 'apollo-angular';

export const GET_REPORTS_SUMMARY = gql`
  query GetReportsSummary(
    $userId: Int!
    $apiUrl: String!
    $sessionToken: String!
  ) {
    summaryData(userId: $userId, apiUrl: $apiUrl, sessionToken: $sessionToken) {
      message
      statusCode
      result {
        title
        type
        values
      }
    }
  }
`;
