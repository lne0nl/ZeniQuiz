import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import enUS from "@/locales/en-US.json";
import frFR from "@/locales/fr-FR.json";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

type MessageSchema = typeof enUS;

const app = createApp(App);
const i18n = createI18n<[MessageSchema], "en-US" | "fr-FR">({
  legacy: false,
  locale: navigator.language,
  fallbackLocale: "en-US",
  messages: {
    "en-US": enUS,
    "fr-FR": frFR,
  },
});

app.use(router);
app.use(i18n);

app.mount("#app");
