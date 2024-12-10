module.export = {
  root: true,
  parser: '@typescript-eslint/parser', // 指定解析器为@typescript-eslint/parser
  plugins: [
    '@typescript-eslint' // 添加@typescript-eslint插件
  ],
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended', // 使用ESLint的推荐规则
    'plugin:@typescript-eslint/recommended' // 使用@typescript-eslint的推荐规则
  ],
  rules: {
    'no-console': 'error'
  },
  ignores: ['node_modules/', 'dist/', 'logs/', 'src/assets/js/']
}
