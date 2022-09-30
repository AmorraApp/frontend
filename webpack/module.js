const MODULE_CSS = require('./module-css');
const paths = require('./paths');
const IS_PROD = process.env.NODE_ENV === 'production';
const BABEL_CONFIG = require('../babel.config.json');
const ENV = require('./dotenv');

exports.strictExportPresence = true;

exports.rules = [
  // Handle node_modules packages that contain sourcemaps
  {
    enforce: 'pre',
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    test: /\.(js|mjs|jsx|ts|tsx|css)$/,
    loader: 'source-map-loader',
  },

  // Javascript Files
  {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    enforce: 'pre',
    type: 'javascript/auto',
    resolve: {
      fullySpecified: false,
    },
    parser: { requireEnsure: false },
    use: [
      // Strip out any dev blocks if we're in production mode
      IS_PROD && {
        loader: 'webpack-strip-block',
        options: {
          start: 'DEV-START',
          end: 'DEV-END',
        },
      },
    ].filter(Boolean),
    include: paths.src,
  },

  {
    // "oneOf" will traverse all following loaders until one will
    // match the requirements. When no loader matches it will fall
    // back to the "file" loader at the end of the loader list.
    oneOf: [
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      // A missing `test` is equivalent to a match.
      {
        test: [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
      },

      // Process SVG files into react components
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [ { removeViewBox: false } ],
              },
              titleProp: true,
              ref: true,
            },
          },
        ],
        issuer: {
          and: [ /\.(ts|tsx|js|jsx|md|mdx)$/ ],
        },
      },

      // Process application JS with Babel.
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.src,
        loader: 'babel-loader',
        options: {
          ...BABEL_CONFIG,
          plugins: [ ENV.USE_REACT_REFRESH && 'react-refresh/babel' ].filter(Boolean),

          babelrc: true,
          compact: IS_PROD,

          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
          cacheCompression: false,

          // Babel sourcemaps are needed for debugging into node_modules
          // code.  Without the options below, debuggers like VSCode
          // show incorrect code and set breakpoints on the wrong lines.
          sourceMaps: true,
          inputSourceMap: true,
        },
      },

      // Process any JS outside of the app with Babel.
      // Unlike the application JS, we only compile the standard ES features.
      {
        test: /\.(js|mjs)$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        loader: 'babel-loader',
        options: {
          ...BABEL_CONFIG,

          babelrc: true,
          compact: false,

          cacheDirectory: true,
          cacheCompression: false,

          // Babel sourcemaps are needed for debugging into node_modules
          // code.  Without the options below, debuggers like VSCode
          // show incorrect code and set breakpoints on the wrong lines.
          sourceMaps: true,
          inputSourceMap: true,
        },
      },

      ...MODULE_CSS,

      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      // This loader doesn't use a "test" so it will catch all modules
      // that fall through the other loaders.
      {
        // Exclude `js` files to keep "css" loader working as it injects
        // its runtime that would otherwise be processed through "file" loader.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        exclude: [ /^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/ ],
        type: 'asset/resource',
      },

      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
].filter(Boolean);

