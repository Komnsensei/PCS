import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
base: '/', // ensures correct base path on Vercel
server: {
port: 5173,
historyApiFallback: true, // for SPA routing
},
})
