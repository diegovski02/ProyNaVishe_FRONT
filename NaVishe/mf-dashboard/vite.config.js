import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mf_dashboard", // Nombre del módulo remoto
      filename: "remoteEntry.js", // Nombre del archivo que se genera
      exposes: {
        "./Dashboard": "./src/App.jsx", // Ajusta la ruta según el componente que quieras exponer
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
  server: {
    port: 5005, // Puerto diferente al de mf-listaColmenas
    host: "0.0.0.0", // Expone el servidor más allá de localhost
    cors: true, // Habilita CORS
  },
  build: {
    target: "esnext",
  },
});