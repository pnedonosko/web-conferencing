import callButtons from "./components/CallButtons.vue";

Vue.use(Vuetify);
//Vue.component("call-component", callButtons);

const vuetify = new Vuetify({
  dark : true,
  iconfont : ""
});

// getting language of user
const lang = (eXo && eXo.env && eXo.env.portal && eXo.env.portal.language) || "en";
const localePortlet = "locale.webconferencing";
const resourceBundleName = "WebConferencingClient";
const url = `${eXo.env.portal.context}/${eXo.env.portal.rest}/i18n/bundle/${localePortlet}.${resourceBundleName}-${lang}.json`;

let vmCallButtons = null;

export function init(settings) {

  if (vmCallButtons) {
    // Destroy, clean the parent etc.
    vmCallButtons.$destroy();
  }

  // getting locale ressources
  exoi18n.loadLanguageAsync(lang, url).then(i18n => {
    // init Vue app when locale resources are ready
    /*Vue.component("call-component", {
      render : function(createElement) {
        console.log("rendered CallButtons.vue");
        console.log(settings.targetExtensionPoint);
        return createElement(callButtons, {
          props : {
            ...settings,
            i18n : i18n,
            language : lang,
            resourceBundleName : resourceBundleName
          }
        });
      },
      i18n,
      vuetify
    });*/
    vmCallButtons = new Vue({
      el : `#${settings.key}`,
      render : function(createElement) {
        console.log("rendered CallButtons.vue");
        console.log(settings.targetExtensionPoint);
        return createElement(callButtons, {
          props : {
            ...settings,
            i18n : i18n,
            language : lang,
            resourceBundleName : resourceBundleName
          }
        });
      },
      i18n,
      vuetify
    });
    console.log("create CallButtons.vue");
    //new Vue({ el:`#${settings.key}` });
  });
}