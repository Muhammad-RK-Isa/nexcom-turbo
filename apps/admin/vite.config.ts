import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import Unfonts from "unplugin-fonts/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({}),
    react(),
    Unfonts({
      google: {
        families: ["Poppins"],
      },
    }),
  ],
  server: {
    proxy: {
      "/api/trpc/admin": {
        target: process.env.SERVER_URL ?? "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@nexcom/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
});
