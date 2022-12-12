import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      username
      email
      savedBooks {
        description
        bookId
        image
        link
        title
        authors
      }
    }
  }
`;
