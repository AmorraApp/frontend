const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IS_PROD = process.env.NODE_ENV === 'production';
const paths = require('./paths');

// common function to get style loaders
function getStyleLoaders (cssOptions, preProcessor) {
  const loaders = [
    !IS_PROD && 'style-loader',
    IS_PROD && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: { publicPath: '/' },
    },
    {
      loader: 'css-loader',
      options: cssOptions,
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: 'resolve-url-loader',
        options: {
          sourceMap: true,
          root: paths.src,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
}

const CSS_REGEX = /\.css$/;
const CSS_MODULE_REGEX = /\.module\.css$/;

module.exports = exports = [
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader turns CSS into JS modules that inject <style> tags.
  // In production, we use MiniCSSExtractPlugin to extract that CSS
  // to a file, but in development "style" loader enables hot editing
  // of CSS.
  // By default we support CSS Modules with the extension .module.css
  {
    test: CSS_REGEX,
    exclude: CSS_MODULE_REGEX,
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: true,
      modules: {
        mode: 'icss',
      },
    }),
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
  },
  // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
  // using the extension .module.css
  {
    test: CSS_MODULE_REGEX,
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: true,
      modules: {
        mode: 'local',
        getLocalIdent: getCSSModuleLocalIdent,
      },
    }),
  },
];
