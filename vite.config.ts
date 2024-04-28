/* eslint-disable import/no-extraneous-dependencies */
import preact from "@preact/preset-vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.tsx"),
      name: "mangadex-post-to-myanimelist",
      fileName(format) {
        return `mangadex-post-to-myanimelist.${format}.js`;
      },
    },
  },
});
