Vue.config.devtools = true

import callButtons from "./components/CallButtons.vue";


import Vuex from "vuex";
Vue.use(Vuex);
Vue.use(Vuetify);

 export const store = new Vuex.Store({
   state: {
     callContext: {},
     mini: false,
     location: ""
   },
   mutations: {
     initButton(state, payload) {
       if (payload.location) {
         Vue.set(state, "location", payload.location);
         Vue.set(state.callContext, payload.location, payload.context);
       }
     },
     toggleMini(state, condition) {
       state.mini = condition ?  true : false;
     }
   },
   actions: {
   },
 });

const vuetify = new Vuetify({
  dark: true,
  iconfont: "",
});

// getting language of user
const lang =
  (eXo && eXo.env && eXo.env.portal && eXo.env.portal.language) || "en";
const localePortlet = "locale.webconferencing";
const resourceBundleName = "WebConferencingClient";
const url = `${eXo.env.portal.context}/${eXo.env.portal.rest}/i18n/bundle/${localePortlet}.${resourceBundleName}-${lang}.json`;
const log = webConferencing.getLog("webconferencing-call-buttons");

export function create(context, target) {
  const result = new Promise((resolve, reject) => {
    if (target) {
      const location = getLocation(target);
      exoi18n.loadLanguageAsync(lang, url).then((i18n) => {
        const vmComp = new Vue({
          el: target,
          render: function(h) {
            return h(
              callButtons,
              {
                props: {
                  i18n,
                  language: lang,
                  resourceBundleName,
                  location
                },
              },
              i18n,
              vuetify
            );
          },
        });
        store.commit("initButton", {context, location});
        resolve({
          thevue: vmComp,
          loc: location,
          update: function(context) {
            store.commit("initButton", {context, location: this.loc});
          },
          destroy: function() {
            this.thevue.$destroy();
          }
        });
        
      });
    } else {
      log.error("Error getting the extension container");
      reject(new Error("Error getting the extension container"));
    }
  });

  return result;
}

export function getLocation(target) {
  const callContainerClasses = target.parentNode.classList;
  return callContainerClasses.item(callContainerClasses.length - 1);
}