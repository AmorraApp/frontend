
const BUILD_ENV = process.env.BUILD_ENV;

const ENV = {
  ...BUILD_ENV,
  ...window.ENV,
};

export const GQL_ENDPOINT = '/v1/';

export default ENV;
