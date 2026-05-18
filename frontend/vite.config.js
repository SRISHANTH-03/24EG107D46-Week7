import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_API_URL;

  return {
    plugins: [react(), tailwind()],
    server: {
      port: 5173,
      proxy: proxyTarget
        ? {
            "/auth": {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
            "/user-api": {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
            "/author-api": {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
            "/admin-api": {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
  };
});
