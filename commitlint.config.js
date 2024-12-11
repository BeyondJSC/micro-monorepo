module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],
    // 其他规则配置...
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新增功能
        'fix', // 修复bug
        'perf', // 性能优化
        'style', // 代码格式（不影响功能）
        'docs', // 修改文档
        'test', // 测试用例
        'refactor', // 代码重构
        'build', // 构建流程、外部依赖变更
        'ci', // 修改CI配置、脚本
        'chore', // 对构建过程或辅助工具和库的更改
        'revert' // 回滚commit
        // 其他类型...
      ]
    ]
    // 其他规则...
  }
}
