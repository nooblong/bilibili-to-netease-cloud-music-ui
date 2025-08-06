import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["frp-oil.com", "frp-dad.com"],
    port: 5174,
    proxy: {
      "/api": {
        // target: "http://106.75.218.120:25565",
        // target: "https://frp-dad.com:24700",
        target: "http://127.0.0.1:25565",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
