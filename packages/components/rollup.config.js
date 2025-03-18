import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { globby } from 'globby'

const extensions = ['.ts', '.tsx', '.vue']

const external = [
  'vue',
  /^ant-design-vue/,
  '@styils/vue',
  'dayjs',
  '@babel/runtime'
]

function genPlugins() {
  const plugins = [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      check: false,
      useTsconfigDeclarationDir: true,
      exclude: ['**/*.test.ts']
    }),
    vue({
      css: true,
      compileTemplate: true
    }),
    babel({
      extensions,
      presets: ['@vue/babel-preset-jsx'],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: true
          }
        ]
      ],
      babelHelpers: 'runtime'
    })
  ]

  return plugins
}

export default async function () {
  const mainEntry = {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'es',
        entryFileNames: () => `[name].mjs`
      },
      {
        dir: 'dist',
        format: 'cjs',
        exports: 'named',
        entryFileNames: () => `[name].cjs`
      }
    ],
    plugins: genPlugins(),
    external
  }

  const moduleEntryPaths = await globby('src/**/index.tsx')

  const moduleEntry = {
    input: moduleEntryPaths,
    output: [
      {
        dir: 'dist',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].mjs'
      },
      {
        dir: 'dist',
        format: 'cjs',
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].cjs'
      }
    ],
    plugins: genPlugins(),
    external
  }

  return [mainEntry, moduleEntry]
}
