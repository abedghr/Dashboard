import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        commonjsOptions: {
            include: ['tailwind.config.js', 'node_modules/**'],
        },
    },
    optimizeDeps: {
        include: ['tailwind-config'],
    },
    plugins: [react(), eslint()],
    resolve: {
        alias: {
            'tailwind-config': path.resolve(__dirname, './tailwind.config.js'),
        },
    },
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
        strictPort: true,
        port: 5173,
    },
})
