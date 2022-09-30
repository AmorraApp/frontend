const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');

const {
  API_HOST,
  API_PORT,
  WEBPACK_HOST: host,
  WEBPACK_PORT: port,
  WDS_SOCKET_HOST: sockHost,
  WDS_SOCKET_PATH: sockPath,
  WDS_SOCKET_PORT: sockPort,
} = require('./dotenv');


// WebpackDevServer 2.4.3 introduced a security fix that prevents remote
// websites from potentially accessing local content through DNS rebinding:
// https://github.com/webpack/webpack-dev-server/issues/887
// https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
// However, it made several existing use cases such as development in cloud
// environment or subdomains in development significantly more complicated:
// https://github.com/facebook/create-react-app/issues/2271
// https://github.com/facebook/create-react-app/issues/2233
// While we're investigating better solutions, for now we will take a
// compromise. Since our WDS configuration only serves files in the `public`
// folder we won't consider accessing them a vulnerability. However, if you
// use the `proxy` feature, it gets more dangerous because it can expose
// remote code execution vulnerabilities in backends like Django and Rails.
// So we will disable the host check normally, but enable it if you have
// specified the `proxy` setting. Finally, we let you override it if you
// really know what you're doing with a special environment variable.
// Note: ["localhost", ".localhost"] will support subdomains - but we might
// want to allow setting the allowedHosts manually for more complex setups
exports.allowedHosts = 'all';

exports.headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

// Enable gzip compression of generated files.
exports.compress = true;

exports.static = {
  // By default WebpackDevServer serves physical files from current directory
  // in addition to all the virtual build products that it serves from memory.
  // This is confusing because those files won’t automatically be available in
  // production build folder unless we copy them. However, copying the whole
  // project directory is dangerous because we may expose sensitive files.
  // Instead, we establish a convention that only files in `public` directory
  // get served. Our build script will copy `public` into the `dist` folder.
  // In `index.html`, you can get URL of `public` folder with %DEFAULT_SEGMENT%:
  // <link rel="icon" href="%DEFAULT_SEGMENT%/favicon.ico">
  // In JavaScript code, you can access it with `process.env.DEFAULT_SEGMENT`.
  // Note that we only recommend to use `public` folder as an escape hatch
  // for files like `favicon.ico`, `manifest.json`, and libraries that are
  // for some reason broken when imported through webpack. If you just want to
  // use an image, put it in `src` and `import` it from JavaScript instead.
  directory: paths.public,
  publicPath: [ '/' ],
  // By default files from `contentBase` will not trigger a page reload.
  watch: {
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebook/create-react-app/issues/293
    // src/node_modules is not ignored to support absolute imports
    // https://github.com/facebook/create-react-app/issues/1065
    ignored: ignoredFiles(paths.src),
  },
};

exports.server = 'http';

exports.client = {
  webSocketURL: {
    // Enable custom sockjs pathname for websocket connection to hot reloading server.
    // Enable custom sockjs hostname, pathname and port for websocket connection
    // to hot reloading server.
    hostname: sockHost,
    pathname: sockPath,
    port: sockPort,
  },
  overlay: {
    errors: true,
    warnings: false,
  },
};

// Enable hot-reloading
exports.hot = true;

// Enable automatic browser opening when compilation finishes
exports.open = true;

exports.devMiddleware = {
  // It is important to tell WebpackDevServer to use the same "publicPath" path as
  // we specified in the webpack config. When homepage is '.', default to serving
  // from the root.
  // remove last slash so user can land on `/test` instead of `/test/`
  publicPath: '/',
};

exports.host = host;

exports.port = port;

exports.historyApiFallback = {
  // Paths with dots should still use the history fallback.
  // See https://github.com/facebook/create-react-app/issues/387.
  disableDotRule: true,
  index: '/',
};

exports.proxy = {
  context: [ '**' ],
  target: `http://${API_HOST}:${API_PORT}`,
  logLevel: 'debug',
};

exports.setupMiddlewares = function (middlewares, devServer) {
  // Keep `evalSourceMapMiddleware`
  // middlewares before `redirectServedPath` otherwise will not have any effect
  // This lets us fetch source contents from webpack for the error overlay
  middlewares.unshift(evalSourceMapMiddleware(devServer));

  // Redirect to `DEFAULT_SEGMENT` or `homepage` from `package.json` if url not match
  middlewares.push(redirectServedPath('/'));

  // This service worker file is effectively a 'no-op' that will reset any
  // previous service worker registered for the same host:port combination.
  // We do this in development to avoid hitting the production cache if
  // it used the same host and port.
  // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
  middlewares.push(noopServiceWorkerMiddleware('/'));

  return middlewares;
};
