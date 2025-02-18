基于monorepo的微前端脚手架搭建

待解决的问题

- [-] 包管理器 pnpm workspace 工程搭建
- [-] Typescript 集成
- [-] prettier + esLint 集成 vscode自定保存lint
- [-] husky + commitList
- [ ] 应用库工程搭建 webpack/vite + 集成qiankun/wujie
- [ ] 基础库工程搭建 webpack/rollup + 文档generator
- [ ] 基础组件库搭建 component / hooks
- [ ] 基础工具库搭建 utils/request
- [ ] 基础icon库搭建 icon
- [ ] vscode 插件 代码片段

## 目录搭建

- apps 存放所有子应用库的代码
  - micro-main-app 微前端主应用工程
- packages 基础工具库代码
  - runtime 公共utils/hooks
  - request 请求库
