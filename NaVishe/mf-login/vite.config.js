import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mf_login",
      filename: "remoteEntry.js", 
      exposes: {
        "./Login": "./src/Login.jsx",
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
  },
});
