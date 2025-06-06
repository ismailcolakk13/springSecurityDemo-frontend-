import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  base: "/ChitChat/",
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    global: "window",
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.API,
        changeOrigin: true,
        secure: false,
      },
      "/ws-chat": {
        target: process.env.API,
        ws: true,
        changeOrigin: true,
      },
    },
    host: "0.0.0.0",
    port: 5173,
    open: true
  },
});
