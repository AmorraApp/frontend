const output = require('./output');
const optimization = require('./optimization');
const resolveConfig = require('./resolve');
const wpModule = require('./module');
const plugins = require('./plugins');
const devServer = require('./dev-server');

const paths = require('./paths');
const ENV = require('./dotenv');
const IS_PROD = process.env.NODE_ENV === 'production';

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = exports = {
  target: [ 'browserslist' ],
  mode: IS_PROD ? 'production' : 'development',

  // Stop compilation early in production
  bail: IS_PROD,

  devtool: IS_PROD ? 'source-map' : 'cheap-module-source-map',

  devServer,

  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  entry: paths.input,
  output,
  infrastructureLogging: {
    level: ENV.INFRA_LOG_LEVEL,
    debug: '*',
  },
  optimization,
  resolve: resolveConfig,
  module: wpModule,
  plugins,
  // Turn off performance processing because we utilize
  // our own hints via the FileSizeReporter
  performance: false,
};
