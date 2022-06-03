import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
  ssr: false,
  srcDir: "./src",
  build: { transpile: process.env.NODE_ENV === "production" ? ["typescript"] : [] },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  typescript: {
    typeCheck: true,
    strict: true
  }
});
