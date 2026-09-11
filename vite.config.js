import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sarkarSathiApiPlugin } from "./vite-plugin-api";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sarkarSathiApiPlugin(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
