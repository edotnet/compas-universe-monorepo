const i18n = require("i18next");
const { initReactI18next } = require("react-i18next");

const en = require("./locales/en.json");
const fr = require("./locales/fr.json");
const es = require("./locales/es.json");

module.exports = i18n;

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  languages: ["en"],
  debug: false,
  
  lng: "en",
  returnObjectTrees: true,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en,
    fr,
    es,
  },
});
