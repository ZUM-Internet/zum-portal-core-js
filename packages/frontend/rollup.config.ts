import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';

export default [
  {
    input: './src/lib/index.ts',
    output: {
      file: './lib/index.js',
      format: 'es',
    },
    external: ['axios/dist/axios', 'js-cookie'],
    plugins: [
      typescript({
        tsconfig: './tsconfig.lib.json',
        declarationDir: './',
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', { targets: { ie: 10 } }]],
      }),
    ],
  },
];
