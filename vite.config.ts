import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

export default defineConfig({
  plugins: [react()],
});
