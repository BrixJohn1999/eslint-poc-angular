import { gql } from 'apollo-angular';

export const GET_USER_WIDGETS = gql`
  query GetUserWidgets($sessionToken: String!) {
    userWidgets(sessionToken: $sessionToken) {
      result {
        widgetsOrderId
        widgetsLocation
        region
        startDate
        endDate
        isDateSearch
        widgetsId
        widgetsTitle
        apiUrl
        showDate
        showRegion
        widgetsType
      }
    }
  }
`;

export const GET_ACCESSIBLE_WIDGETS = gql`
  query GetAccessibleWidgets($sessionToken: String!) {
    accessibleWidgets(sessionToken: $sessionToken) {
      result {
        widgetsOrderId
        widgetsLocation
        region
        startDate
        endDate
        isDateSearch
        widgetsId
        widgetsTitle
        apiUrl
        showDate
        showRegion
        widgetsType
      }
    }
  }
`;
