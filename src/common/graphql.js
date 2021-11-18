
export { useQuery, useMutation, useLazyQuery, useApolloClient, gql } from "@apollo/client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import { GQL_ENDPOINT } from './config';

const httpLink = new HttpLink({
  uri: GQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = window.sessionStorage.getItem('jwt') || window.localStorage.getItem('jwt');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function GraphQLProvider ({ children }) {
  return (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );
}
