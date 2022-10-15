import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';

import useMemoObject from '@twipped/hooks/useMemoObject';
import useLocalStorage from '@twipped/hooks/useLocalStorage';
import useAsyncCallback from '@twipped/hooks/useAsyncCallback';
import useAsyncEffect from '@twipped/hooks/useAsyncEffect';
import usePrevious from '@twipped/hooks/usePrevious';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { AuthContext } from './context';

export const LS_ACCESS_TOKEN = 'accessToken';
export const LS_REDIRECT_AFTER_LOGIN = 'redirectAfterLogin';

/**
 * Authentication context provider and state management component
 *
 * @param {Object} props
 * @param {Object} props.auth0config Auth0 configuration data.
 * @param {string} props.auth0config.clientID
 * @param {string} props.auth0config.domain
 * @param {string} props.auth0config.audience
 * @param {string} props.auth0config.connection
 * @param {string} props.auth0config.scope
 * @param {Function} props.onCredentialsChange Callback invoked when the access token changes
 *
 * @param {string|Function} props.redirectUri Override for the default redirect URL
 * @param {Element} props.fallback Elements to display while loading
 * @param {Object|Array} props.children
 *
 * @component
 */
export function AuthProvider (props) {
  const {
    domain,
    clientId,
    audience,
    scope = 'read:current_user',
  } = props;

  return (
    <Auth0Provider
      clientId={clientId}
      domain={domain}
      audience={audience}
      scope={scope}
      redirectUri={window.location.origin}
    >
      <AuthInternal {...props} />
    </Auth0Provider>
  );
}

function AuthInternal ({
  audience,
  scope = 'read:current_user',
  onCredentialsChange,
  fallback,
  children,
}) {
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    loginWithRedirect,
    logout: auth0logout,
  } = useAuth0();
  const [ loadingToken, setLoadingToken ] = useState(false);
  const [ accessToken, setAccessToken ] = useLocalStorage(LS_ACCESS_TOKEN);
  const previousAccessToken = usePrevious(accessToken);

  // If the user is logged in but we don't have an access token in localstorage,
  // go fetch that token and put it there.
  useAsyncEffect(async () => {
    if (isLoading || !isAuthenticated || accessToken) return;

    setLoadingToken(true);
    const token = await getAccessTokenSilently({
      audience,
      scope,
    });
    setAccessToken(token);
    setLoadingToken(false);
  }, [
    isLoading,
    isAuthenticated,
    accessToken,
  ]);

  const signup = useAsyncCallback(async (returnTo) => {
    window.localStorage.setItem(LS_REDIRECT_AFTER_LOGIN, returnTo);
    await loginWithRedirect({
      screen_hint: 'signup',
    });
  });

  const login = useAsyncCallback(async (returnTo) => {
    window.localStorage.setItem(LS_REDIRECT_AFTER_LOGIN, returnTo);
    await loginWithRedirect();
  });

  const logout = useCallback(() => {
    setAccessToken();
    auth0logout({ returnTo: window.location.origin });
  }, [ auth0logout, setAccessToken ]);

  const context = useMemoObject({
    authenticated: isAuthenticated && accessToken,
    user,
    accessToken,
    signup,
    login,
    logout,
  });

  useEffect(() => {
    onCredentialsChange && onCredentialsChange(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ accessToken, previousAccessToken ]);

  // still loading credentials, display a loading screen or nothing
  if (isLoading || loadingToken) {
    if (fallback) return fallback;
    return null;
  }

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}


AuthInternal.propTypes = AuthProvider.propTypes = {
  clientId: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  audience: PropTypes.string.isRequired,
  connection: PropTypes.string,
  scope: PropTypes.string,
  onCredentialsChange: PropTypes.func,
  children: PropTypes.node,
};
