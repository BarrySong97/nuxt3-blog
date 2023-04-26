// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: "@nuxt-themes/typography",
  css: ["~/assets/css/main.css", "vue-final-modal/style.css"],
  modules: ["@nuxt/content"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  content: {
    documentDriven: true,
    highlight: {
      // OR
      theme: {
        // Default theme (same as single string)
        default: "github-light",
        // Theme used if `html.dark`
        dark: "github-dark",
        // Theme used if `html.sepia`
        sepia: "monokai",
      },
    },
    experimental: {
      clientDB: true,
    },
  },
});
