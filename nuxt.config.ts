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
    // https://content.nuxtjs.org/api/configuration
  },
});
