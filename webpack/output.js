const { relative } = require('path');
const paths = require('./paths');
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEV = !IS_PROD;

// The build folder.
exports.path = paths.output;

// Add /* filename */ comments to generated require()s in the output.
exports.pathinfo = !IS_PROD;

// There will be one main bundle, and one file per asynchronous chunk.
// In development, it does not produce real files.
exports.filename = IS_PROD
  ? 'static/js/[name].[contenthash:8].js'
  : IS_DEV && 'static/js/bundle.js';

// There are also additional JS chunk files if you use code splitting.
exports.chunkFilename = IS_PROD
  ? 'static/js/[name].[contenthash:8].chunk.js'
  : IS_DEV && 'static/js/[name].chunk.js';

exports.assetModuleFilename = IS_PROD
  ? 'static/media/[name].[hash][ext]'
  : IS_DEV && 'static/media/[name][ext]';

// webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
// We inferred the "public path" (such as / or /my-project) from homepage.
exports.publicPath = '/';

// Point sourcemap entries to original disk location (format as URL on Windows)
exports.devtoolModuleFilenameTemplate = IS_PROD
  ? (info) => relative(paths.src, info.absoluteResourcePath).replace(/\\/g, '/')
  : (info) => paths.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
