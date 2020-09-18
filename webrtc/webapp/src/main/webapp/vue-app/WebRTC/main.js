import WebRTC from "./components/WebRTC.vue";
import Server from "./components/Server.vue";
import NoServer from "./components/Noserver.vue";
import RemoveServer from "./components/RemoveIceServer.vue";
// import Vuex from "vuex";

// Vue.use(Vuex);
Vue.use(Vuetify);
Vue.component("Server", Server);
Vue.component("RemoveServer", RemoveServer);
Vue.component("NoServer", NoServer);
Vue.component("WebRTC", WebRTC);

const vuetify = new Vuetify({
  dark: true,
  iconfont: ""
});

// const store = new Vuex.Store({
//   state: {
//   },
//   mutations: {
//   }
// })

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

  