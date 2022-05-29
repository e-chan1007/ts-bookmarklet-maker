import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
  ssr: false,
  srcDir: "./src",
  build: { transpile: process.env.NODE_ENV === "production" ? ["typescript"] : [] },
  typescript: {
    typeCheck: true,
    strict: true
  }
});
