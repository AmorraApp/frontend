/* global process */

import path from 'path';
import { promises as fs } from 'fs';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import svg from 'rollup-plugin-react-svg';
import json from '@rollup/plugin-json';
import postcss from './rollup/postcss.mjs';
import { terser } from 'rollup-plugin-terser';
import sizes from 'rollup-plugin-sizes';
import rem2px from 'postcss-rem-to-pixel';

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const req = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  if (!fpath) return __dirname;
  return path.resolve(__dirname, fpath, ...args);
}

const PROD = process.env.NODE_ENV === 'production';

/*
  PLACE NEW REACT APPLICATIONS HERE
 */
const entries = {
  'autoqc-checklist-tab': 'autoqc-checklist-tab/entry.js',
  showroom: 'showroom/entry.js',
  autoqceditor: 'autoqceditor/entry.js',
  propscan: 'propscan/entry.js',
};

/*
  PLACE DEVELOPMENT ONLY APPLICATIONS HERE
  These entries will not be included in a default build.
 */
const targetedEntries = {
  kalendae: 'kalendae/entry.js',
  testbed: 'testbed/entry.js',
  laminar: 'laminar/entry.js',
};

let input = entries;
if (process.env.BUILD_TARGET) {
  const buildTarget = entries[process.env.BUILD_TARGET] || targetedEntries[process.env.BUILD_TARGET];
  if (!buildTarget) throw new Error(`Unknown build target: "${process.env.BUILD_TARGET}"`);
  input = {
    [process.env.BUILD_TARGET]: buildTarget,
  };
}


const plugins = [
  // analyze(),
  sizes({ ignoreEmpty: true, details: false }),
  alias({
    entries: [
      { find: 'common', replacement: resolve('common') },
      { find: 'vm', replacement: resolve('common/fills/null') },
      { find: 'object-assign', replacement: resolve('common/fills/object-assign.cjs') },
      { find: '@restart/hooks', replacement: resolve('common/hooks') },
      { find: 'handybars', replacement: resolve('handybars/src/index.js') }, // eslint-disable-line node/no-extraneous-require
      { find: '@twipped/utils', replacement: resolve('common/utils') },
    ],
  }),
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      '__ENV_PROD__': JSON.stringify(process.env.NODE_ENV === 'production'),
      '__ENV_DEV__': JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
  }),
  // insert postcss here
  json(),
  svg(),
  nodeResolve({ browser: true, extensions: [ '.mjs', '.js', '.json', '.jsx' ] }),
  commonjs({
    include: 'node_modules/**',
    sourceMap: false,
  }),
  babel({
    exclude: 'node_modules/**',
    presets: [
      [ "@babel/preset-env", {
        modules: false,
        useBuiltIns: "usage",
        corejs: { version: 3, shippedProposals: true },
      } ],
      [ "@babel/preset-react", {
        "runtime": "automatic",
      } ],
    ],
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    terser({ output: { comments: false } }),
  );
}

// const moduleMatch = /node_modules\/([^/]+)\//;

const base = {
  onwarn: (warning) => {
    // Skip certain warnings

    // should intercept ... but doesn't in some rollup versions
    if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

    // console.warn everything else
    console.warn( warning.message ); // eslint-disable-line no-console
  },
  // manualChunks: (id) => {
  //   const [ , nodeModule ] = id.match(moduleMatch) || [];
  //   if (nodeModule) {
  //     if (nodeModule.includes('react-select') || nodeModule.includes('@emotion')) return 'react-select';
  //     if (nodeModule.includes('mobx')) return 'react';
  //     if (
  //       nodeModule.includes('react-beautiful-dnd')
  //       || nodeModule.includes('css-box-model')
  //       || nodeModule.includes('use-memo-one')
  //       || nodeModule.includes('raf-schd')
  //     ) return 'dnd';
  //     if (nodeModule.includes('react') || nodeModule.includes('redux') || nodeModule.includes('prop-types')) return 'react';
  //     return 'vendor';
  //   }
  //   // if (id.includes('react/common/')) return 'common';
  // },
};

function pcss () {
  return postcss({
    extract: true,
    // onExtract: (fn) => console.log(fn()),
    inject: false,
    modules: true,
    minimize: PROD,
    autoModules: false,
    use: [ 'sass', [ 'prepend', { files: [ resolve('styles.scss') ] } ] ],
    plugins: [
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
  });
}

const config = [];

for (const [ outputName, inputPath ] of Object.entries(input)) {
  const build = {
    ...base,
    plugins: [ ...plugins.slice(0, 3), pcss(), ...plugins.slice(3) ],
    input: [ inputPath, 'base.scss' ],
    output: [
      {
        dir: '../public/react',
        format: 'esm',
        sourcemap: !PROD,
        entryFileNames: outputName + ".js",
        chunkFileNames: "[name].js",
      },
    ],
    treeshake: PROD,
    watch: {
      exclude: 'node_modules/**',
    },
  };

  config.push(build);
}

export default config;
