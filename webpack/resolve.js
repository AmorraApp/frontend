const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');

const reactRefreshRuntimeEntry = require.resolve('react-refresh/runtime');
const reactRefreshWebpackPluginRuntimeEntry = require.resolve(
  '@pmmmwh/react-refresh-webpack-plugin'
);

// This allows you to set a fallback for where webpack should look for modules.
// We placed these paths second because we want `node_modules` to "win"
// if there are any conflicts. This matches Node resolution mechanism.
// https://github.com/facebook/create-react-app/issues/253
exports.modules = [ 'node_modules' ];

// These are the reasonable defaults supported by the Node ecosystem.
// We also include JSX as a common component filename extension to support
// some tools, although we do not recommend using it, see:
// https://github.com/facebook/create-react-app/issues/290
// `web` extension prefixes have been added for better support
// for React Native Web.
exports.extensions = [
  '.js',
  '.mjs',
  '.cjs',
  '.json',
];

exports.alias = {
  '#src': paths.src,
};

exports.plugins = [
  // Prevents users from importing files from outside of src/ (or node_modules/).
  // This often causes confusion because we only process files within src/ with babel.
  // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
  // please link the files into your node_modules/ and let module-resolution kick in.
  // Make sure your source files are compiled, as they will not be processed in any way.
  new ModuleScopePlugin(paths.src, [
    paths.root,
    reactRefreshRuntimeEntry,
    reactRefreshWebpackPluginRuntimeEntry,
  ]),
];
