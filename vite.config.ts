import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Casting process to any to avoid potential TS issues with node types in config
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // specific logic to prioritize API_KEY but fall back to VITE_API_KEY
  const apiKey = env.API_KEY || env.VITE_API_KEY;

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the browser
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});