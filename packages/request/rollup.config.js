import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/request.cjs.js',
      format: 'cjs',
      sourcemap: false
    },
    {
      file: 'dist/request.esm.js',
      format: 'esm',
      sourcemap: false
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      outputToFilesystem: true
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts'],
      include: ['src/**/*.ts']
    })
  ]
}
