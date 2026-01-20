import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

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
      shared: {
        react: {
          requiredVersion: "^18.2.0",
        },
        "react-dom": {
          requiredVersion: "^18.2.0",
        },
        "react-redux": {
          requiredVersion: "^8.1.3",
        },
        antd: {
          requiredVersion: "^5.4.0",
        },
      },
    }),
    {
      name: "module-federation-debug",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.includes("remoteEntry.js")) {
            res.setHeader("Content-Type", "application/javascript");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "*");
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.setHeader("Access-Control-Expose-Headers", "*");
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
      external: ["react-redux"],
    },
  },
});
