Vue.config.devtools = true;

import CallButtons from "./components/CallButtons.vue";

// import Vuex from "vuex";
// Vue.use(Vuex);
Vue.use(Vuetify);

const vuetify = new Vuetify({
  dark: true,
  iconfont: "",
});

//const comp = Vue.component("call-button", CallButtons);

Vue.directive("click-outside", {
  priority: 700,
  bind: function(el, binding, vnode) {
    el.clickOutside = function(e) {
      if(!(el === e.target || el.contains(e.target))) {
        vnode.context[binding.expression](e);
      }
    }
    document.body.addEventListener("click", el.clickOutside);
  },
  unbind: function(el) {
    document.body.removeEventListener("click", el.clickOutside);
  },
});

// getting language of user
const lang = (eXo && eXo.env && eXo.env.portal && eXo.env.portal.language) || "en";
const localePortlet = "locale.webconferencing";
const resourceBundleName = "WebConferencingClient";
const url = `${eXo.env.portal.context}/${eXo.env.portal.rest}/i18n/bundle/${localePortlet}.${resourceBundleName}-${lang}.json`;
const log = webConferencing.getLog("webconferencing-call-buttons");

export function create(context, target) {
  const result = new Promise((resolve, reject) => {
    if (target) {
      // const localStore = new Vuex.Store({
      //   state: {
      //     callContext: {},
      //   },
      //   mutations: {
      //     initButton(state, payload) {
      //       Vue.set(state, "callContext", payload.context);
      //     },
      //   }
      // });

      exoi18n.loadLanguageAsync(lang, url).then((i18n) => {
        const vmComp = new Vue({
          el: target,
          components: {
            "CallButtons" : CallButtons
          },
          data() {
            return {
              // store: localStore,
              language: lang,
              resourceBundleName,
              callCntext: {}
            }
          },
          created() {
            this.getCallContext(context, this)
            // console.log("CREATED MAIN")
          },
          // eslint-disable-next-line quotes
          mounted() {
            // console.log(this.store, "STORE")
            this.getCallContext(context, this)
            // console.log("MOUNTED MAIN")
            // localStore.commit("initButton", {context});
          },
          methods: {
            getCallContext(context, vmcomp) {
              this.$set(vmcomp, "callCntext", context)
            }
          },
          // eslint-disable-next-line quotes
          // template: `<CallButtons :language="lang" :resourceBundleName="resourceBundleName" :callCntext="callCntext"></CallButtons>`,
          i18n,
          vuetify,  
          render: function(h) {
            return h(
             CallButtons,
              {
                props: {
                 language: lang,
                  resourceBundleName,
                  callCntext: this.callCntext
                  // store: localStore
               },
             }
           )
          },
        });
        resolve({
          // store: localStore,
          callCntext: {},
          update: function(context) {
            vmComp.getCallContext(context,vmComp)
            // this.store.commit("initButton", {context});
          },
        });
      });
    } else {
      log.error("Error getting the extension container");
      reject(new Error("Error getting the extension container"));
    }
  });

  return result;
}