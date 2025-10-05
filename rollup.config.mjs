import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const production = process.env.NODE_ENV === 'production';
const fileName = 'booking_widget.js';

export default {
  input: './src/widget/index.tsx',
  output: {
    file: `dist/${fileName}`,
    format: 'iife',
    name: 'BookingWidget', // accessible via window.BookingWidget si besoin
    sourcemap: false,
    inlineDynamicImports: true,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-dom/client': 'ReactDOM',
    },
  },
  external: ['react', 'react-dom'], // React/CDN externe
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve({ browser: true, extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      presets: ['@babel/preset-typescript', ['@babel/preset-react', { runtime: 'automatic' }]],
    }),
    postcss({ extensions: ['.css'], extract: true, minimize: production }),
    terser(),
  ],
};

