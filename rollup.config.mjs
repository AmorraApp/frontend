/* global process */

import path from 'path';
import { promises as fs } from 'fs';
// import analyzer from 'rollup-plugin-analyzer';
import html from '@rollup/plugin-html';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import svg from 'rollup-plugin-react-svg';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import sizes from 'rollup-plugin-sizes';
import rem2px from 'postcss-rem-to-pixel';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import dotenv from './dotenv.mjs';
import template from './src/html-template.js';

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const req = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const babelconfig = req('./babel.config.json');

function resolve (...args) {
  args = args.filter(Boolean);

  if (args.length === 1) {
    try {
      const fpath = req.resolve(...args);
      if (fpath) return fpath;
    } catch (e) {
      // do nothing
    }
  }
  const fpath = args.shift();
  if (!fpath) return path.resolve(__dirname, 'src');
  return path.resolve(__dirname, 'src', fpath, ...args);
}

const PROD = process.env.NODE_ENV === 'production';

const plugins = [
  // analyzer(),
  html({ template }),
  PROD && sizes({ ignoreEmpty: true, details: false }),
  alias({
    entries: [
      { find: 'common', replacement: resolve('common') },
      { find: 'vm', replacement: resolve('common/fills/null') }, // this fixes an issue with UUID
      { find: 'object-assign', replacement: resolve('common/fills/object-assign.cjs') }, // common lib that we don't actually need
    ],
  }),
  replace({
    preventAssignment: true,
    values: {
      '__ENV_PROD__': JSON.stringify(PROD),
      '__ENV_DEV__': JSON.stringify(!PROD),
      ...dotenv,
    },
  }),
  postcss({
    extract: false,
    inject: true,
    modules: true,
    minimize: PROD,
    autoModules: false,
    use: [ 'sass', [ 'prepend', { files: [ resolve('styles/index.scss') ] } ] ],
    plugins: [
      postcssUrl(),
      postcssImport(),
      rem2px({
        rootValue: 14,
        propList: [ '*' ],
        mediaQuery: true,
      }),
    ],
    loaders: [
      {
        name: 'prepend',
        test: /\.(scss)$/,
        async process ({ code }) {
          const { files = [] } = this.options;
          const contents = await Promise.all(files.map((f) => fs.readFile(f), { encoding: 'utf8' }));
          contents.push(code);
          return { code: contents.join('\n\n'), map: undefined };
        },
      },
    ],
  }),
  json(),
  svg(),
  nodeResolve({ browser: true, preferBuiltins: false, extensions: [ '.mjs', '.js', '.json', '.jsx' ] }),
  commonjs({
    include: 'node_modules/**',
    sourceMap: false,
  }),
  babel(babelconfig),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    terser({ output: { comments: false } }),
  );
}

const moduleMatch = /node_modules\/([^/]+)\//;

const INPUT = process.env.BUILD_TARGET || 'index';

const config = {
  onwarn: (warning) => {
    // Skip certain warnings

    // should intercept ... but doesn't in some rollup versions
    if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

    const ignoredCircular = [
      '@aws-amplify/core',
    ];

    if (warning.code === 'CIRCULAR_DEPENDENCY' && ignoredCircular.some((d) => warning.importer.includes(d))) {
      return;
    }

    // console.warn everything else
    console.warn( warning.message ); // eslint-disable-line no-console
  },
  manualChunks: (id) => {
    const [ , nodeModule ] = id.match(moduleMatch) || [];
    if (nodeModule) {
      if (
        nodeModule.includes('react')
        || nodeModule.includes('prop-types')
        || nodeModule.includes('history')
        || nodeModule.includes('scheduler')
        || nodeModule.includes('style-inject')
        || nodeModule.includes('mobx')
      ) return 'react';
    }
    // if (id.includes('react/common/')) return 'common';
  },
  plugins,
  input: `./src/${INPUT}.js`,
  preserveEntrySignatures: false,
  output: [
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: !PROD,
      entryFileNames: "[name]_[hash].js",
      chunkFileNames: "[name]_[hash].js",
    },
  ],
  treeshake: true,
  watch: {
    exclude: 'node_modules/**',
  },
};

export default config;
