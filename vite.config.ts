import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves a project site from /<repo>/, local dev stays at /.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/work101/' : '/',
  plugins: [react(), tailwindcss()],
}))
