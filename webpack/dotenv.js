const fs = require('fs');
const { parse } = require('dotenv');
const path = require('path');
const AJV = require('ajv');
const addFormats = require('ajv-formats');
const envSchema = require('env-schema');

const { separator } = envSchema.keywords;

const ajv = new AJV({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true,
  addUsedSchema: false,
  keywords: [ separator ],
});
addFormats(ajv);

const NODE_ENV = process.env.NODE_ENV || 'development';

const files = [
  '.env',
  '.env.local',
  `.env.${NODE_ENV}`,
  `.env.${NODE_ENV}.local`,
];

const contents = files.map((envFile) => {
  try {
    const file = fs.readFileSync(path.resolve(__dirname, '..', envFile));
    return parse(file);
  } catch (e) {
    return null;
  }
}).filter(Boolean);


const ENV = envSchema({
  ajv,
  data: Object.assign(process.env, ...contents),
  schema: {
    type: 'object',
    properties: {
      NODE_ENV: {
        type: 'string',
        enum: [
          'test',
          'development',
          'production',
        ],
        default: 'development',
      },
      DEPLOY_ENV: {
        type: 'string',
        enum: [
          'local',
          'test',
          'lambda',
          'process',
        ],
      },
      LOG_LEVEL: {
        type: 'string',
        enum: [
          'none',
          'fatal',
          'error',
          'warn',
          'info',
          'debug',
          'trace',
        ],
        default: 'info',
      },
      API_HOST: {
        type: 'string',
        format: 'hostname',
      },
      API_PORT: {
        type: 'integer',
      },
      PUBLIC_URL: {
        type: 'string',
        format: 'url',
        default: 'https://amorra.us',
      },
      GRAPHQL_ENDPOINT: {
        type: 'string',
        default: '/v1/graphql',
      },
      AUTH0_DOMAIN: {
        type: 'string',
        format: 'hostname',
      },
      AUTH0_CLIENTID: {
        type: 'string',
        minLength: 32,
      },
      USE_REACT_REFRESH: {
        type: 'boolean',
        default: NODE_ENV !== 'production',
      },
    },
    required: [
      'DEPLOY_ENV',
      'AUTH0_DOMAIN',
      'AUTH0_CLIENTID',
      'GRAPHQL_ENDPOINT',
    ],
  },
});


module.exports = exports = ENV;

const {
  DEPLOY_ENV,
  GRAPHQL_ENDPOINT,
  AUTH0_DOMAIN,
  AUTH0_CLIENTID,
} = ENV;

ENV.BUILD_ENV = {
  NODE_ENV,
  DEPLOY_ENV,
  GRAPHQL_ENDPOINT,
  AUTH0_DOMAIN,
  AUTH0_CLIENTID,
};

