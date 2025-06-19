import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define the '@' alias to point to the src directory
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
