// vite.config.mjs
import { defineConfig } from "vite";
import obfuscator from "rollup-plugin-obfuscator";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    // Development server configuration
    server: {
      port: 3002,
      host: true,
      cors: true,
    },

    // Build configuration
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
          entryFileNames: "hp.js",
        },
        plugins: [
          // Only use obfuscator in production builds
          ...(isDev
            ? []
            : [
                obfuscator({
                  compact: true,
                  controlFlowFlattening: true,
                  deadCodeInjection: true,
                  selfDefending: true,
                  disableConsoleOutput: true,
                }),
              ]),
        ],
      },
      minify: isDev ? false : "terser",
    },

    // Development mode: serve the entry file directly
    ...(isDev && {
      define: {
        global: "globalThis",
      },
    }),
  };
});
