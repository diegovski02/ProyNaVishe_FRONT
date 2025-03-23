import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mf_listaColmenas", // Nombre del módulo remoto
      filename: "remoteEntry.js", // Nombre del archivo que se genera
      exposes: {
        "./Colmenas": "./src/views/Colmenas.jsx", // Ajusta la ruta según tu estructura
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
  server: {
    port: 5003,
    host: "0.0.0.0", // Expone el servidor más allá de localhost
    cors: true, // Habilita CORS
  },
  build: {
    target: "esnext",
  },
});