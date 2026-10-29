import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const api = new URL(env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1');
  const port = Number(env.VITE_HOST_PORT || 5174);
  if (!['http:', 'https:'].includes(api.protocol) || api.username || api.password || api.search || api.hash || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Cấu hình API URL hoặc port không hợp lệ');
  const apiPath = api.pathname.replace(/\/$/, '') || '/api/v1';
  const proxy = { '/api/v1': { target: api.origin, changeOrigin: true, rewrite: (path: string) => path.replace(/^\/api\/v1(?=\/|\?|$)/, apiPath) } };
  return { plugins: [react()], server: { host: '0.0.0.0', port, strictPort: true, proxy }, preview: { host: '0.0.0.0', port, strictPort: true, proxy } };
});
