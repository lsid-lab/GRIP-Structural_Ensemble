import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 公開先のパス。GitHub Pages では "/リポジトリ名/"、理研サーバーでは "/" など。
// 環境変数 BASE_PATH で切り替えます（未指定なら "/"）。
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
});
