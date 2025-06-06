import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
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
        target: "https://chitchat-qe8b.onrender.com",
        changeOrigin: true,
        secure: true,
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
