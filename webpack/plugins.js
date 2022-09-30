const DefinePlugin = require('webpack/lib/DefinePlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

const paths = require('./paths');

const ENV = require('./dotenv');
const IS_PROD = process.env.NODE_ENV === 'production';


module.exports = exports = [
  // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appHtml,
    ...(IS_PROD
      ? {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }
      : null
    ),
  }),

  // Inlines the webpack runtime script. This script is too small to warrant
  // a network request.
  // https://github.com/facebook/create-react-app/issues/5358
  IS_PROD && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [ /runtime-.+[.]js/ ]),

  // Makes some environment variables available in index.html.
  // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
  // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
  // It will be an empty string unless you specify "homepage"
  // in `package.json`, in which case it will be the pathname of that URL.
  new InterpolateHtmlPlugin(HtmlWebpackPlugin, ENV),

  new FaviconsWebpackPlugin(paths.resolve('assets/favicon.png')),

  // This gives some necessary context to module not found errors, such as
  // the requesting resource.
  new ModuleNotFoundPlugin(paths.root),

  // Makes some environment variables available to the JS code, for example:
  // `if (process.env.NODE_ENV === 'production') { ... }`
  // It is absolutely essential that NODE_ENV is set to production during a
  // production build. Otherwise React will be compiled in the very slow
  // development mode.
  new DefinePlugin({
    ...escapeForBundling(ENV.BUILD_ENV),
    'process.env.BUILD_ENV': JSON.stringify(ENV.BUILD_ENV),
  }),

  // Watcher doesn't work well if you mistype casing in a path so we use
  // a plugin that prints an error when you attempt to do this.
  // See https://github.com/facebook/create-react-app/issues/240
  !IS_PROD && new CaseSensitivePathsPlugin(),

  ENV.USE_REACT_REFRESH && new ReactRefreshWebpackPlugin({
    overlay: false,
  }),

  new CopyPlugin({
    patterns: [
      { from: 'public' },
    ],
  }),

  IS_PROD && new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  }),

  // Generate an asset manifest file with the following content:
  // - "files" key: Mapping of all asset filenames to their corresponding
  //   output file so that tools can pick it up without having to parse
  //   `index.html`
  // - "entrypoints" key: Array of files which are included in `index.html`,
  //   can be used to reconstruct the HTML if necessary
  new WebpackManifestPlugin({
    fileName: 'static/manifest.json',
    publicPath: '/',
    writeToFileEmit: true,
    generate: (seed, files, entrypoints) => {
      const manifestFiles = files.reduce((manifest, file) => {
        // eslint-disable-next-line no-param-reassign
        manifest[file.name] = file.path;
        return manifest;
      }, { ...seed });

      const chunks = files.reduce((arr, file) => {
        if (file.isChunk) arr.push(file.path);
        return arr;
      }, []);

      const entryPointFilterer = Object.entries(entrypoints).reduce((acc, e) => {
        const [ name, entryPointFiles ] = e;
        return {
          ...acc,
          [name]: entryPointFiles.filter(
            (fileName) => !fileName.endsWith('.map') && !fileName.endsWith('.hot-update.js')
          ).map((ep) => `/${ep}`),
        };
      }, {});

      return {
        files: manifestFiles,
        chunks,
        entrypoints: entryPointFilterer,
      };
    },
  }),

].filter(Boolean);


function escapeForBundling (input, { prefix = 'process.env.', suffix = '' } = {}) {
  return Object.fromEntries(
    Object.entries(input).map(
      ([ key, value ]) => [ `${prefix}${key}${suffix}`, JSON.stringify(value) ]
    )
  );
}
