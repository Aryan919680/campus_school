// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   base: '/admin-frontend/',
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   build: {
//     outDir: '../dist/admin-frontend',
//     assetsDir: 'assets',
//     emptyOutDir: true,
//     rollupOptions: {
//       output: {
//         assetFileNames: 'assets/[name]-[hash][extname]',
//         chunkFileNames: 'assets/[name]-[hash].js',
//         entryFileNames: 'assets/[name]-[hash].js',
//       },
//     },
//   },
//   server: {
//     port: 3000,
//     historyApiFallback: {
//       rewrites: [
//         { from: /^\/admin-frontend\/.*$/, to: '/admin-frontend/index.html' },
//       ],
//     },
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // base: '/admin-frontend/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000
  }
})



