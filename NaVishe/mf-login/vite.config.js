import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  base: "./", // Para asegurar rutas relativas en S3
  plugins: [
    react(),
    federation({
      name: "mf_login",
      filename: "remoteEntry.js",
      exposes: {
        "./Login": "./src/views/Login.jsx",
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
  server: {
    port: 5001,
    host: "0.0.0.0",
    cors: true,
  },
  build: {
    target: "esnext",
    outDir: "dist", // Carpeta de salida
    rollupOptions: {
      input: "index.html",
      external: ["react", "react-dom", "react-router-dom"],
    },
  },
});
