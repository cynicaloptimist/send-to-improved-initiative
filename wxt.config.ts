import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["storage"],
    name: "Improved Initiative Importer for D&D Beyond",
    browser_specific_settings: {
      gecko: {
        id: "send-to-improved-initiative@improvedinitiative.app",
      },
    },
  },
  runner: {
    startUrls: ["https://www.dndbeyond.com/monsters"],
  },
  vite: (env) => {
    return {
      build: {
        minify: env.mode === "production",
      },
    };
  },
});
