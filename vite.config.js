import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
      "/api": "http://localhost:8080",
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
