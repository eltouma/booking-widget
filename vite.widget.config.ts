import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/widget/index.tsx'),
      name: 'BookingWidget',
      fileName: () => 'booking_widget.js',
      formats: ['iife'],
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name && assetInfo.name.endsWith('.css')
            ? 'booking_widget.css'
            : '[name].[ext]',
      },
    },
    minify: 'terser'
  },
});
