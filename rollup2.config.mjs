import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { parseArgs } from 'node:util';
import postcss from 'rollup-plugin-postcss';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';

const args = parseArgs({
  options: {
    environnement: {
      type: 'string',        
      short: 'e',
      default: 'development',
    },
    configuration: {
      type: "string",
      short: 'c',
    },
  },
});

const env = args.values.environment || 'development';
const production = env == 'production';
let environmentVariatblePath = './env.development';

console.log(`Building widget for ${env} environment...`);

if (production) {
  environmentVariatblePath = './.env.production';
}

const fileName = 'booking_widget.js';

export default {
  input: './src/widget/index.tsx',
  output: {
    file: `dist/${fileName}`,
    format: 'iife',
    name: 'BookingWidget',
    sourcemap: false,
    inlineDynamicImports: true,
    globals: {
      react: 'React',
      'react/jsx-runtime': 'jsxRuntime',
      'react-dom': 'ReactDOM',
      'react-dom/client': 'ReactDOM',
    },
  },
  external: [],
  plugins: [
    tsConfigPaths({
      tsConfigPath: './tsconfig.json',
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    nodeResolve({
      extensions: ['.tsx', '.ts', '.json', '.js', '.jsx', '.mjs'],
      browser: true,
      dedupe: ['react', 'react-dom'],
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
            targets: '>0.1%, not dead, not op_mini all',
          },
        ],
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
    }),
    postcss({
      extensions: ['.css'],
      inject: false,
      extract: false,
      minimize: true,
      toString: true,
    }),
    commonjs(),
    terser({
      ecma: 2020,
      mangle: { toplevel: true },
      compress: {
        module: true,
        toplevel: true,
        unsafe_arrows: true,
        drop_console: true,
        drop_debugger: true,
      },
      output: { quote_style: 1 },
    }),
  ],
};
