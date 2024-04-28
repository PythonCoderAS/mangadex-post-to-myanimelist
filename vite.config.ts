/* eslint-disable import/no-extraneous-dependencies */
import preact from "@preact/preset-vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), cssInjectedByJsPlugin({
    cssAssetsFilterFunction(chunk) {
      return ![
        "editor-wysiwyg.css",
      ].includes(chunk.fileName);
    }
  })],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.tsx"),
      name: "mangadex-post-to-myanimelist",
      fileName(format) {
        return `mangadex-post-to-myanimelist.${format}.js`;
      },
    },
  },
  base: "https://pythoncoderas.github.io/mangadex-post-to-myanimelist/"
});
