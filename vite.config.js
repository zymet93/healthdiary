import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "start-api-harjoituspohja.html"),
        about: resolve(__dirname, "about.html"),
      },
    },
  },
  base: "/dist/",
});