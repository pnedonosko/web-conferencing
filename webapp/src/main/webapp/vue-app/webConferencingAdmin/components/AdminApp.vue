/* eslint-disable no-undef */
<template>
  <v-app id="web-conferencing-admin" class="VuetifyApp">
    <v-container style="width: 95%" class="v-application--is-ltr">
      <div
        v-show="error"
        class="alert alert-error">{{ i18n.te(`${errorResourceBase}.${error}`) ? $t(`${errorResourceBase}.${error}`) : error }}</div>
      <v-row class="white">
        <v-col xs12 px-3>
          <v-title class="webconferencingTitle">{{ $t("webconferencing.admin.title") }}</v-title>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs12>
          <v-simple-table :dense="true" class="uiGrid table table-hover providersTable">
            <template v-slot:default>
              <thead>
                <tr class="providersTableRow">
                  <th class="text-left">{{ $t("webconferencing.admin.table.Provider") }}</th>
                  <th class="text-left">{{ $t("webconferencing.admin.table.Description") }}</th>
                  <th
                    class="text-left"
                    style="width: 5%">{{ $t("webconferencing.admin.table.Active") }}</th>
                  <th
                    class="text-left"
                    style="width: 5%">{{ $t("webconferencing.admin.table.Permissions") }}</th>
                </tr>
              </thead>
              <tbody v-if="attachmentsProviderPreferences.length > 0">
                <tr
                  v-for="action in attachmentsProviderPreferences"
                  :key="action.component.name"
                  class="providersTableRow">
                  <td>
                    <div>
                      {{ i18n.te(`webconferencing.admin.${action.component.name}.name`)
                        ? $t(`webconferencing.admin.${action.component.name}.name`)
                        : action.component.name
                      }}
                    </div>
                  </td>
                  <td>
                    <div
                      v-html="i18n.te(`webconferencing.admin.${action.component.name}.description`)
                        ? $t(`webconferencing.admin.${action.component.name}.description`)
                      : '' "></div>
                  </td>
                  <td class="center actionContainer">
                    <div>
                      <v-switch
                        v-for="provider in getFilteredProviders(providers, action.component)"
                        :key="provider.title"
                        :dense="true"
                        :input-value="provider.active"
                        :ripple="false"
                        v-model="provider.active"
                        hide-details
                        color="#568dc9"
                        class="providersSwitcher"
                        @change="changeActive(action.component, provider)" />
                    </div>
                  </td>
                  <td class="center actionContainer">
                    <div :key="action.key" :class="`${action.appClass}Action`">
                      <component
                        v-dynamic-events="action.component.events"
                        v-if="action.component"
                        :action="action"
                        v-bind="action.component.props ? action.component.props : {}"
                        :is="action.component.name"
                        :ref="action.key"/>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { postData, getData } from "../AdminAPI";
// import Jitsi from "../../../../../../../../jitsi/webapp/src/main/webapp/vue-app/Jitsi/components/Jitsi.vue";
import { getAttachmentsProvidersSettings } from "../../../js/extension";

export default {
  components: {
    // Jitsi,
  },
  props: {
    services: {
      type: Object,
      required: true
    },
    i18n: {
      type: Object,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    resourceBundleName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      providers: [],
      switcher: false,
      error: null
    };
  },
  created() {
    this.getProviders();
    this.attachmentsProviderPreferences = getAttachmentsProvidersSettings();
  },
  methods: {
    async getProviders() {
      console.log(
        extensionRegistry.loadExtensions("webConferencing", "webconferencing"),
        "extensionApp"
      );
      // services object contains urls for requests
      try {
        this.providers = await webConferencing.getProvidersConfig();
        this.error = null;
        console.log(this.providers, "providers");
      } catch (err) {
        this.error = err.message;
      }
    },
    getFilteredProviders(providers, plugin) {
      return providers.filter(provider => provider.title === plugin.name);
    },
    getProviderResources(providerId) {
      const resourceUrl = `${eXo.env.portal.context}/${eXo.env.portal.rest}/i18n/bundle/locale.${providerId}.${this.resourceBundleName}-${this.language}.json`;
      return exoi18n.loadLanguageAsync(this.language, resourceUrl);
    },
    async changeActive(plugin, provider) {
      // getting rest for updating provider status
      try {
        const data = await webConferencing.postProviderConfig(
          plugin.name.toLowerCase(),
          provider.active
        );
        this.error = null;
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style scoped lang="less">
#web-conferencing-admin {
  .webconferencingTitle {
    color: #4d5466;
    font-size: 24px;
    position: relative;
    overflow: hidden;
    line-height: 27px;

    &:after {
      border-bottom: 1px solid #dadada;
      height: 14px;
      content: "";
      position: absolute;
      width: 100%;
      margin-left: 10px;
    }
  }
  .providersTable {
    border-left: 0;
    .providersTableRow {
      th,
      td {
        height: 20px;
        padding: 5px 15px;
      }
    }
  }
  .providersSwitcher {
    padding: 0;
    margin: 0;
    height: 25px;
  }
}
</style>
<style>
.uiIconSetting::before {
  content: "\f13e";
  font-size: 21px;
}
</style>