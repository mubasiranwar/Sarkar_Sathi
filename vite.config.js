import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sarkarSathiApiPlugin } from "./vite-plugin-api.ts";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Make env vars available to the Vite plugin
  Object.assign(process.env, env);
  
  return {
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
  };
});
