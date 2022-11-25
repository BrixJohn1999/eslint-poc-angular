import { gql } from 'apollo-angular';

export const GET_STATISTICS = gql`
  query GetTotalBuildingsStatistics(
    $userId: Int!
    $region: String!
    $apiUrl: String!
    $sessionToken: String!
  ) {
    statisticsData(
      userId: $userId
      region: $region
      apiUrl: $apiUrl
      sessionToken: $sessionToken
    ) {
      result {
        title
        type
        value
        status
        region
      }
    }
  }
`;

// export const GET_TOTAL_OPPORTUNITY_SQFT_STATISTICS = gql`
//   query GetTotalOpportunitySqftStatistics(
//     $userId: Int!
//     $region: String!
//     $apiUrl: String!
//     $sessionToken: String!
//   ) {
//     statisticsData(
//       userId: $userId
//       region: $region
//       apiUrl: $apiUrl
//       sessionToken: $sessionToken
//     ) {
//       message
//       statusCode
//       result {
//         title
//         type
//         value
//         status
//         region
//       }
//     }
//   }
// `;

export const GET_OBTAINED_OPPORTUNITY_STATISTICS = gql`
  query GetObtainedOpportunityStatistics(
    $userId: Int!
    $region: String!
    $apiUrl: String!
    $sessionToken: String!
    $startMonth: Int!
    $startYear: Int!
    $endMonth: Int!
    $endYear: Int!
    $isDateSearch: Boolean!
  ) {
    statisticsData(
      userId: $userId
      region: $region
      apiUrl: $apiUrl
      sessionToken: $sessionToken
      startMonth: $startMonth
      startYear: $startYear
      endMonth: $endMonth
      endYear: $endYear
      isDateSearch: $isDateSearch
    ) {
      message
      statusCode
      result {
        title
        type
        value
        status
        region
      }
    }
  }
`;

export const GET_BUILDING_MEASURED_STATISTICS = gql`
  query GetBuildingMeasuredStatistics(
    $userId: Int!
    $region: String!
    $apiUrl: String!
    $sessionToken: String!
    $reportStatusId: Int!
  ) {
    statisticsData(
      userId: $userId
      region: $region
      apiUrl: $apiUrl
      sessionToken: $sessionToken
      reportStatusId: $reportStatusId
    ) {
      message
      statusCode
      result {
        title
        type
        value
        status
        region
      }
    }
  }
`;

// export const GET_TOTAL_OPPORTUNITY_VALUE_STATISTICS = gql`
//   query GetTotalOpportunityValueStatistics(
//     $userId: Int!
//     $region: String!
//     $apiUrl: String!
//     $sessionToken: String!
//   ) {
//     statisticsData(
//       userId: $userId
//       region: $region
//       apiUrl: $apiUrl
//       sessionToken: $sessionToken
//     ) {
//       message
//       statusCode
//       result {
//         title
//         type
//         value
//         status
//         region
//       }
//     }
//   }
// `;

// export const GET_TOTAL_OPPORTUNITY_PERCENT_STATISTICS = gql`
//   query GetTotalOpportunityPercentStatistics(
//     $userId: Int!
//     $region: String!
//     $apiUrl: String!
//     $sessionToken: String!
//   ) {
//     statisticsData(
//       userId: $userId
//       region: $region
//       apiUrl: $apiUrl
//       sessionToken: $sessionToken
//     ) {
//       message
//       statusCode
//       result {
//         title
//         type
//         value
//         status
//         region
//       }
//     }
//   }
// `;
