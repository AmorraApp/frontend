import PropTypes from 'prop-types';
import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { gql, useQuery } from 'common/graphql';

export const AUTH_STATUS_LOADING = null;
export const AUTH_STATUS_SIGNEDIN = true;
export const AUTH_STATUS_SIGNEDOUT = false;

export const ROLE_ADMIN = 'ADMIN';
export const ROLE_MODERATOR = 'MODERATOR';
export const ROLE_REVIEWER = 'REVIEWER';
export const ROLE_USER = 'USER';
export const ROLE_PUBLIC = 'PUBLIC';

export const ROLES = {
  [ROLE_ADMIN]:     ROLE_ADMIN,
  [ROLE_MODERATOR]: ROLE_MODERATOR,
  [ROLE_REVIEWER]:  ROLE_REVIEWER,
  [ROLE_USER]:      ROLE_USER,
  [ROLE_PUBLIC]:    ROLE_PUBLIC,
};

const LEVELS_THRESHOLD = {
  [ROLE_ADMIN]:     100,
  [ROLE_MODERATOR]: 75,
  [ROLE_REVIEWER]:  50,
  [ROLE_USER]:      10,
  [ROLE_PUBLIC]:    0,
};

export function roleCheck (needed, has) {
  const neededLevel = LEVELS_THRESHOLD[needed] || 0;
  const hasLevel = LEVELS_THRESHOLD[has] || 0;
  return neededLevel >= hasLevel;
}


const AuthenticationContext = createContext();
AuthenticationContext.displayName = 'AuthenticationContext';

export function useAuthentication () {
  return useContext(AuthenticationContext) || false;
}

const gGET_CURRENT_USER = gql`

`;

export function AuthenticationProvider ({ children }) {

  const token = window.sessionStorage.getItem('jwt') || window.localStorage.getItem('jwt');

  const { loading, error, data, refetch } = useQuery(gGET_CURRENT_USER);


  const context = {
    isAuthenticated: !!token,
    token,
  };

  return (
    <AuthenticationContext.Provider value={context}>{children}</AuthenticationContext.Provider>
  );
}

export function IsAuthenticated ({ children }) {
  const { isAuthenticated } = useAuthentication();
  return isAuthenticated ? children : null;
}

export function IsNotAuthenticated ({ children }) {
  const { isAuthenticated } = useAuthentication();
  return isAuthenticated ? null : children;
}

import { Route } from 'react-router-dom';
import UnauthorizedRoute from '../routes/unauthorized';
export const PrivateRoute = ({ role: roleNeeded = ROLE_USER, fallback, element, children, ...rest }) => (
  <Route
    {...rest}
    render={() => {
      const { role } = useAuthentication();

      if (roleCheck(roleNeeded, role)) {
        return element || children;
      }

      return fallback || <UnauthorizedRoute />;
    }}
  />
);
PrivateRoute.propTypes = {
  ...Route.propTypes,
  role: PropTypes.oneOf(Object.values(ROLES)),
};
