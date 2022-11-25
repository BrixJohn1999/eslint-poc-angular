import { gql } from 'apollo-angular';

export const GET_SESSION = gql`
  query {
    getSession {
      statusCode
      message
      result {
        UserId
        UserName
        Role
        Email
      }
    }
  }
`;
