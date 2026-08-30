import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://mern-estate-production-e7a3.up.railway.app",
        secure: false,
      },
    },
  },
  plugins: [react(), tailwindcss()],
});