import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { AWS_REGION, COGNITO_APP_CLIENT_ID } from 'common/config';
import { warn } from 'common/utils';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { prompt } from 'common/ui/dialogs';

const AUTH_STATUS_LOADING = null;
const AUTH_STATUS_SIGNEDIN = true;
const AUTH_STATUS_SIGNEDOUT = false;

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

const AuthenticationContext = createContext();
AuthenticationContext.displayName = 'AuthenticationContext';

export function useAuthentication () {
  return useContext(AuthenticationContext) || false;
}

export function AuthenticationProvider ({ children }) {

  const [ { status, user }, setState ] = useState({ status: AUTH_STATUS_LOADING });

  const authWithEmail = useCallback(async (email, password) => {
    const { user } = signInWithEmail(email, password);
  });

  const context = {
    isAuthenticated: status,
    user,
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

// export const authenticateWithGoogle = () => Auth.federatedSignIn({ provider: 'Google' });
// export const authenticateWithFacebook = () => Auth.federatedSignIn({ provider: 'Facebook' });
// export const deauthenticate = () => Auth.signOut();


async function signUpWithEmail (email, password) {
  const command = new SignUpCommand({
    ClientId: COGNITO_APP_CLIENT_ID,
    Password: password,
    Username: email,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  });

  const { UserConfirmed: confirmed, UserSub: uuid } = await client.send(command);
  if (confirmed) return { email, uuid };

}


async function signInWithEmail (email, password) {
  let command = new InitiateAuthCommand({
    ClientId: COGNITO_APP_CLIENT_ID,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  do {
    const response = await client.send(command);
    const { AuthenticationResult, Session, ChallengeName, ChallengeParameters } = response;

    if (AuthenticationResult) return handleAuthResult(AuthenticationResult);

    if (ChallengeName) {
      command = await handleChallenge({ Session, ChallengeName, ChallengeParameters, USERNAME: email });
      continue;
    }
  } while (command);

  return false;
}

async function signinWithRefreshToken (RefreshToken) {
  let command = new InitiateAuthCommand({
    ClientId: COGNITO_APP_CLIENT_ID,
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    AuthParameters: {
      REFRESH_TOKEN: RefreshToken,
    },
  });

  do {
    const response = await client.send(command);
    const { AuthenticationResult, Session, ChallengeName, ChallengeParameters } = response;

    if (AuthenticationResult) return handleAuthResult(AuthenticationResult);

    if (ChallengeName) {
      command = await handleChallenge({ Session, ChallengeName, ChallengeParameters });
      continue;
    }
  } while (command);

  return false;
}

async function getUserWithAccessToken ( AccessToken ) {
  const { UserAttributes } = await client.send(new GetUserCommand({ AccessToken }));
  return UserAttributes;
}

async function handleAuthResult ({
  AccessToken,
  ExpiresIn,
  IdToken,
  RefreshToken,
  TokenType,
}) {
  const { user } = getUserWithAccessToken(AccessToken);
  console.log({
    UserAttributes: user,
    AccessToken,
    ExpiresIn,
    IdToken,
    RefreshToken,
    TokenType,
  });
  return {
    user,
    AccessToken,
    ExpiresIn,
    IdToken,
    RefreshToken,
    TokenType,
  };
}

async function handleChallenge ({ Session, ChallengeName, ChallengeParameters, USERNAME }) {
  switch (ChallengeName) {
  case 'NEW_PASSWORD_REQUIRED':
    return new RespondToAuthChallengeCommand({
      ClientId: COGNITO_APP_CLIENT_ID,
      Session,
      ChallengeName,
      ChallengeResponses: {
        USERNAME,
        NEW_PASSWORD: prompt({
          caption: 'Your password has been marked for replacement, please provide a new password.',
        }),
      },
    });

  case 'MFA_SETUP':
  case 'SMS_MFA':
  case 'PASSWORD_VERIFIER':
  case 'DEVICE_SRP_AUTH':
  case 'DEVICE_PASSWORD_VERIFIER':
  default:
    warn('Cognito requested an unsupported challenge type:', { ChallengeName, ChallengeParameters });
  }
}

