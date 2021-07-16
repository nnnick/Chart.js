const analyze = require('rollup-plugin-analyzer');
const cleanup = require('rollup-plugin-cleanup');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve').default;
const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');

const input = 'src/index.js';
const inputESM = {
  'dist/chart.esm': 'src/index.esm.js',
  'dist/helpers.esm': 'src/helpers/index.js'
};

const banner = `/*!
 * Chart.js v${pkg.version}
 * ${pkg.homepage}
 * (c) ${(new Date(process.env.SOURCE_DATE_EPOCH ? (process.env.SOURCE_DATE_EPOCH * 1000) : new Date().getTime())).getFullYear()} Chart.js Contributors
 * Released under the MIT License
 */`;

module.exports = [
  // UMD builds
  // dist/chart.min.js
  // dist/chart.js
  {
    input,
    plugins: [
      json(),
      resolve(),
      cleanup({
        sourcemap: true
      }),
      analyze({summaryOnly: true})
    ],
    output: {
      name: 'Chart',
      file: 'dist/chart.js',
      banner,
      format: 'umd',
      indent: false,
    },
  },
  {
    input,
    plugins: [
      json(),
      resolve(),
      terser({
        output: {
          preamble: banner
        }
      }),
    ],
    output: {
      name: 'Chart',
      file: 'dist/chart.min.js',
      format: 'umd',
      indent: false,
    },
  },

  // CJS builds
  // dist/chart.cjs
  {
    input, // for backwards-compatibility. should change to inputESM at 4.0 (and possibly rename that variable/file)
    plugins: [
      json(),
      resolve(),
      cleanup({
        sourcemap: true
      }),
      analyze({summaryOnly: true})
    ],
    output: {
      name: 'Chart',
      file: 'dist/chart.cjs',
      exports: 'default', // for backwards-compatibility. should change to 'named' with 4.0
      banner,
      format: 'cjs',
      indent: false,
    },
  },

  // ES6 builds
  // dist/chart.esm.js
  // helpers/*.js
  {
    input: inputESM,
    plugins: [
      json(),
      resolve(),
      cleanup({
        sourcemap: true
      }),
    ],
    output: {
      dir: './',
      chunkFileNames: 'dist/chunks/[name].js',
      banner,
      format: 'esm',
      indent: false,
    },
  },
];
