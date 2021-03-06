<template>
  <v-app id="web-conferencing-admin" class="VuetifyApp">
    <v-container style="width: 95%" class="v-application--is-ltr">
      <div v-show="error" class="alert alert-error">
        {{ i18n.te(`${errorResourceBase}.${error}`) ? $t(`${errorResourceBase}.${error}`) : error }}
      </div>
      <v-row class="white">
        <v-col xs12 px-3>
          <h4 class="webconferencingTitle">
            {{ $t("webconferencing.admin.title") }}
          </h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs12>
          <v-simple-table :dense="true" class="uiGrid table table-hover table-striped providersTable">
            <template v-slot:default>
              <thead>
                <tr class="providersTableRow">
                  <th class="text-left">{{ $t("webconferencing.admin.table.Provider") }}</th>
                  <th class="text-left">{{ $t("webconferencing.admin.table.Description") }}</th>
                  <th class="text-left" style="width: 5%">{{ $t("webconferencing.admin.table.Active") }}</th>
                  <th class="text-left" style="width: 5%">{{ $t("webconferencing.admin.table.Permissions") }}</th>
                </tr>
              </thead>
              <tbody v-if="providers.length > 0">
                <tr 
                  v-for="item in providers" 
                  :key="item.provider" 
                  class="providersTableRow">
                  <td>
                    <div>
                      {{ i18n.te(`webconferencing.admin.${item.provider}.name`)
                        ? $t(`webconferencing.admin.${item.provider}.name`)
                        : item.provider 
                      }}
                    </div>
                  </td>
                  <td>
                    <div>
                      {{ i18n.te(`webconferencing.admin.${item.provider}.description`)
                        ? $t(`webconferencing.admin.${item.provider}.description`)
                        : "" 
                      }}
                    </div>
                  </td>
                  <td class="center actionContainer">
                    <div>
                      <v-switch
                        :input-value="item.active"
                        :ripple="false"
                        color="#568dc9"
                        class="providersSwitcher"
                        @change="changeActive(item)" />
                    </div>
                  </td>
                  <td class="center actionContainer">
                    <edit-dialog
                      :provider-name="item.provider"
                      :provider-link="item.links.self.href"
                      :search-url="services.identities"
                      :i18n="i18n" />
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
import EditDialog from "./EditDialog.vue";

export default {
  components: {
    EditDialog
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
  },
  methods: {
    async getProviders() {
      // services object contains urls for requests
      try {
        const data = await getData(this.services.providers);
        this.error = null;
        this.providers = data.editors;
        const resourcesPromises = this.providers.map(({ provider }) => this.getProviderResources(provider));
        Promise.all(resourcesPromises).then(res => {
          res.map(localized => {
            this.i18n.mergeLocaleMessage(this.language, localized.getLocaleMessage(this.language));
          });
        });
      } catch (err) {
        this.error = err.message;
      }
    },
    getProviderResources(providerId) {
      const resourceUrl = 
        `${eXo.env.portal.context}/${eXo.env.portal.rest}/i18n/bundle/locale.${providerId}.${this.resourceBundleName}-${this.language}.json`;
      return exoi18n.loadLanguageAsync(this.language, resourceUrl);
    },
    async changeActive(provider) {
      // getting rest for updating provider status
      try {
        const data = await postData(provider.links.self.href, { active: !provider.active });
        this.error = null;
        this.providers.map(p => {
          if (p.provider === provider.provider) {
            p.active = !provider.active;
          }
        });
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>
