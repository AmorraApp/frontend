import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ms from 'ms';
import useMemoObject from '@twipped/hooks/useMemoObject';
import useDerivedState from '@twipped/hooks/useDerivedState';
import mockToken from './mock-token';
import { AuthContext } from './context';

// eslint-disable-next-line jsdoc/require-jsdoc
function dateDependency (input) {
  return input instanceof Date ? input.valueOf() : input;
}

export const ACCOUNT_ID = '00000000-0000-0000-0000-000000000000';

/**
 * Mock authentication data provider for testing authentication states.
 *
 * @param {Object}  props
 * @param {boolean} props.authenticated Must be true for a user to be logged in.
 * @param {string}  props.accountid Defaults to an all zeros UUID
 * @param {string|number|Date}  props.tokenExpiration How long the token should be valid.
 * Defaults to 10 minutes after component mount time.
 * @param {string|number|Date}  props.tokenAge How long ago should the token have been created.
 * Defaults to 10 minutes before component mount time.
 * @param {Function}  props.onLogin
 * @param {Function}  props.onLogout
 * @param {Function}  props.onCallback
 * @param {Function}  props.onPasswordReset
 * @param {Function}  props.onSetAuthentication
 * @param {Element|Function}  props.children
 * @component
 */
export default function MockAuthentication ({
  authenticated = false,
  accountid = ACCOUNT_ID,
  tokenExpiration = '10m',
  tokenAge = '10m',
  onLogin,
  onLogout,
  onCallback,
  onPasswordReset,
  onSetAuthentication,
  children,
}) {
  const exp = useMemo(() => {
    if (typeof tokenExpiration === 'string') {
      return Math.floor(Date.now() / 1000) + (ms(tokenExpiration) / 1000);
    }
    if (typeof tokenExpiration === 'number') {
      return Math.floor(Date.now() / 1000) + tokenExpiration;
    }
    if (tokenExpiration instanceof Date) {
      return Math.floor(tokenExpiration.valueOf() / 1000);
    }

    throw new Error('Unrecognized value for "tokenExpiration"');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dateDependency(tokenExpiration) ]);

  const login = useCallback((...args) => {
    if (onLogin) onLogin(...args);
  }, [ onLogin ]);

  const logout = useCallback((...args) => {
    if (onLogout) onLogout(...args);
  }, [ onLogout ]);

  const callback = useCallback((...args) => {
    if (onCallback) onCallback(...args);
  }, [ onCallback ]);

  const resetPassword = useCallback(async (...args) => {
    if (onPasswordReset) return onPasswordReset(...args);
  }, [ onPasswordReset ]);

  const accessToken = useMemo(() => (
    authenticated ?
      mockToken(
        { type: 'idToken', age: tokenAge },
        { accountid, exp }
      )
      : null
  ), [ authenticated, accountid, exp, tokenAge ]);

  const [ authentication, setAuthenticationState, getAuthenticationState ] = useDerivedState(() => ({
    accessToken,
    expiresAt: exp * 1000,
    accountid,
    authenticated,
  }), [ accessToken, exp, accountid ]);

  const setAuthentication = useCallback((state) => {
    if (onSetAuthentication) {
      onSetAuthentication(state);
    }

    setAuthenticationState({
      ...getAuthenticationState(),
      ...state,
    });
  }, [ onSetAuthentication, setAuthenticationState, getAuthenticationState ]);

  const context = useMemoObject({
    ...authentication,
    login,
    logout,
    callback,
    resetPassword,
    authentication,
    setAuthentication,
  });

  // if we receive a function, execute it and pass in the client
  if (typeof children === 'function') {
    // eslint-disable-next-line no-param-reassign
    children = children(context);
  }

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
MockAuthentication.propTypes = {
  authenticated: PropTypes.bool,
  accountid: PropTypes.string,
  tokenExpiration: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  tokenAge: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onCallback: PropTypes.func,
  onSetAuthentication: PropTypes.func,
  onPasswordReset: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
};
