import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';
import { defineConfig } from "vite";

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
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: true,
      },
      "/ws-chat": {
        target: "http://localhost:8080",
        ws: true,
        changeOrigin: true,
      },
    },
    host: "0.0.0.0",
    port: 5173,
    open: true
  },
});
