// vite.config.mjs
import { defineConfig } from "vite";
import obfuscator from "rollup-plugin-obfuscator";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      name: "HeatpeekTracker",
      fileName: "index",
      formats: ["iife"],
    },
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "index.iife.js",
      },
      plugins: [
        obfuscator({
          compact: true,
          controlFlowFlattening: true,
          deadCodeInjection: true,
          selfDefending: true,
          disableConsoleOutput: true,
        }),
      ],
    },
    minify: "terser",
  },
});
