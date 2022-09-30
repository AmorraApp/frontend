const { ROOT_DIR } = require('../for-client');
const clientConfig = require('./client');
const serverConfig = require('./server');

module.exports = {
  testSequencer: `${ROOT_DIR}/config/jest/sequencer.js`,
  projects: [
    clientConfig,
    serverConfig
  ]
};
