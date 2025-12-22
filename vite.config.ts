import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    cors: true,
  },
  preview: {
    port: 5173,
    cors: true,
  },
  plugins: [
    react(),
    federation({
      name: "smeNovaSondagem",
      filename: "remoteEntry.js",
      exposes: {
        "./Home": "./src/paginas/home/home.tsx",
      },
      shared: ["react", "react-dom", "react-redux"],
    }),
    {
      name: "module-federation-debug",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.includes("remoteEntry.js")) {
            console.log(
              "═══════════════════════════════════════════════════════"
            );
            console.log("📥 [REMOTE SERVER] remoteEntry.js requisitado!");
            console.log("    Referer:", req.headers.referer || "unknown");
            console.log("    Host:", req.headers.host);
            console.log("    Content-Type será: application/javascript");
            console.log(
              "═══════════════════════════════════════════════════════"
            );

            // Define o Content-Type correto para módulos ES
            res.setHeader("Content-Type", "application/javascript");
            res.setHeader("Access-Control-Allow-Origin", "*");
          }
          next();
        });
      },
    },
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react-dom", "react-redux"],
    },
  },
});
