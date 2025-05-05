import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server :{
		port: 5000,
		watch: {
		usePolling: true,
		interval: 30,
		},
    proxy: {
      '/api/vapi': {
        target: 'https://api.vapi.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vapi/, '')
      }
    }
	}
})
