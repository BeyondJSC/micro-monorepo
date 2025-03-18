import { defineConfig } from 'vitest/config';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [
    vueJsx()
  ],
  test: {
    environment: 'jsdom',
    // 支持 TypeScript
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // 假设错误提示是说 transformMode 应改为 testTransformMode
    testTransformMode: {
      // 将正则表达式转换为字符串
      web: ['/\\.[jt]sx?$/']
    }
  }
});