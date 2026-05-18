import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    port: 5173,
    proxy: {
      "/auth": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
      "/user-api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
      "/author-api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
      "/admin-api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});