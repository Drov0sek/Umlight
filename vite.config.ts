import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".", // корень проекта, где лежит index.html
  build: {
    outDir: "dist/client", // куда класть сборку
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/frontend"), // чтобы можно было писать "@/App.tsx" и т.п.
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4200",
    },
  },
});
