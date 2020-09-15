import WebRTC from "./components/WebRTC.vue";

Vue.use(Vuetify);
const vuetify = new Vuetify({
  dark: true,
  iconfont: ""
});

// getting language of user
const lang = (eXo && eXo.env && eXo.env.portal && eXo.env.portal.language) || "en";
const localePortlet = "locale.webconferencing";
const resourceBundleName = "WebRTC";
const url = `${eXo.env.portal.context}/${eXo.env.portal.rest}/i18n/bundle/${localePortlet}.${resourceBundleName}-${lang}.json`;

export function init(settings) {
  // getting locale ressources
  exoi18n.loadLanguageAsync(lang, url).then(i18n => {
    // init Vue app when locale ressources are ready
    new Vue({
      render: h =>
        h(WebRTC, { props: {...settings, i18n: i18n, language: lang, resourceBundleName: resourceBundleName } }),
      i18n,
      vuetify
    }).$mount("#WebRTC");
  });
}

  