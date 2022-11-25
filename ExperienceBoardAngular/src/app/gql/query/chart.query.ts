import { gql } from 'apollo-angular';

export const GET_MEASUREMENT_STATUS_CHART = gql`
  query GetMeasurementStatusChart(
    $userId: Int!
    $apiUrl: String!
    $sessionToken: String!
  ) {
    chartData(userId: $userId, apiUrl: $apiUrl, sessionToken: $sessionToken) {
      message
      statusCode
      result {
        title
        type
        values {
          total
          status {
            finalized
            inProcess
            notMeasured
          }
        }
      }
    }
  }
`;

export const GET_MEASUREMENT_BY_PROPERTY_TYPE_CHART = gql`
  query GetMeasurementByPropertyTypeChart(
    $userId: Int!
    $apiUrl: String!
    $sessionToken: String!
  ) {
    chartData(userId: $userId, apiUrl: $apiUrl, sessionToken: $sessionToken) {
      message
      statusCode
      result {
        title
        type
        values {
          total
          status {
            Office
            Industrial
            Retail
            Technology
            Warehouse
            Hotel
            Medical
          }
        }
      }
    }
  }
`;
