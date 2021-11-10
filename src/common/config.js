/* global process */


// const isLocalhost = !!(
//   window.location.hostname === "localhost" ||
//   // [::1] is the IPv6 localhost address.
//   window.location.hostname === "[::1]" ||
//   // 127.0.0.1/8 is considered localhost for IPv4.
//   window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
// );

export const ENV = process.env.NODE_ENV;
export const AWS_REGION = process.env.AWS_DEFAULT_REGION;
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
export const COGNITO_APP_CLIENT_ID = process.env.COGNITO_APP_CLIENT_ID;
export const COGNITO_IDENTITY_POOL_ID = process.env.COGNITO_IDENTITY_POOL_ID;
export const COGNITO_LOGIN_URL = process.env.COGNITO_LOGIN_URL;
export const COGNITO_LOGOUT_URL = process.env.COGNITO_LOGOUT_URL;

// Amplify.configure({
//   Auth: {

//     // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
//     identityPoolId: COGNITO_IDENTITY_POOL_ID,

//     // REQUIRED - Amazon Cognito Region
//     region: AWS_REGION,

//     // OPTIONAL - Amazon Cognito Federated Identity Pool Region
//     // Required only if it's different from Amazon Cognito Region
//     identityPoolRegion: AWS_REGION,

//     // OPTIONAL - Amazon Cognito User Pool ID
//     userPoolId: COGNITO_USER_POOL_ID,

//     // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
//     userPoolWebClientId: COGNITO_APP_CLIENT_ID,

//     // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
//     mandatorySignIn: true,

//     // OPTIONAL - Configuration for cookie storage
//     // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
//     cookieStorage: {
//       // REQUIRED - Cookie domain (only required if cookieStorage is provided)
//       domain: isLocalhost ? 'localhost' : '.' + window.location.hostname,
//       // OPTIONAL - Cookie path
//       path: '/',
//       // OPTIONAL - Cookie expiration in days
//       expires: 365,
//       // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
//       sameSite: "strict",
//       // OPTIONAL - Cookie secure flag
//       // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
//       secure: !isLocalhost,
//     },

//     // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
//     authenticationFlowType: 'USER_PASSWORD_AUTH',

//     // OPTIONAL - Hosted UI configuration
//     oauth: {
//       domain: 'your_cognito_domain',
//       scope: [ 'phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin' ],
//       redirectSignIn: COGNITO_LOGIN_URL,
//       redirectSignOut: COGNITO_LOGOUT_URL,
//       responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
//     },
//   },
// });

// // You can get the current config object
// export const AuthConfig = Auth.configure();

