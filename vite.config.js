import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Make env vars available
  Object.assign(process.env, env);
  
  return {
    plugins: [
      react(),
      tailwindcss(),
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
