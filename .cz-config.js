module.exports = {
  types: [
    { value: 'feat', name: 'feat: 新功能' },
    { value: 'fix', name: 'fix: 修复' },
    { value: 'docs', name: 'docs: 文档变更' },
    { value: 'style', name: 'style: 代码格式(不影响代码运行的变动)' },
    {
      value: 'refactor',
      name: 'refactor: 重构(既不是新增功能，也不是修复bug的代码变动)'
    },
    { value: 'perf', name: 'perf: 性能优化' },
    { value: 'test', name: 'test: 测试用例' },
    { value: 'build', name: 'build: 构建系统(例如webpack的配置变更)' },
    { value: 'ci', name: 'ci: 持续集成相关' },
    { value: 'chore', name: 'chore: 构建过程或辅助工具的变动' }
    // 你可以在这里添加更多类型
  ],
  messages: {
    type: '请选择提交类型:',
    scope: '请输入影响范围(可选):'
    // 其他消息...
  },
  allowScope: true, // 是否允许输入影响范围
  allowBreakingChanges: ['feat', 'fix'] // 哪些类型允许输入破坏性变更
  // 其他配置...
}
