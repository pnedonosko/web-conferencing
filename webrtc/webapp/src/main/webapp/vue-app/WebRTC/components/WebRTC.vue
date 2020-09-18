<template>
  <div id="webrtc-settings-dialog">
    <v-dialog
      v-model="showDialog"
      content-class="WebRTC"
      width="600"
      style="overflow-x: hidden"
      @click:outside="showDialog = false">
      <template v-slot:activator="{ on, attr }">
        <v-btn
          v-bind="attr"
          icon
          class="actionIcon"
          height="fit-content"
          width="fit-content"
          v-on="on">
          <i class="uiIconSetting uiIconLightGray"></i>
        </v-btn>
      </template>
      <v-card class="uiPopup settingsForm">
        <div v-show="error" class="alert alert-error">{{ $t(error) }}</div>
        <v-card-title class="popupHeader ClearFix">
          <span
            class="PopupTitle popupTitle">
            {{ this.$t(`webconferencing.admin.${action.component.name}.modal.title`) }}
          </span>
          <i class="uiIconClose pull-right" @click="closeDialog"></i>
        </v-card-title>
        <div v-show="warn" class="alert alert-warning no-server-warning">{{ $t(warn) }}</div>
        <v-card-text class="popupContent pa-4">
          <v-container class="permissions px-0">
            <v-row>
              <v-card-subtitle style="font-weight: bold">
                {{ $t(`webconferencing.admin.${action.component.name}.modal.StunTurnServ`) }}
                <v-tooltip top max-width="500">
                  <template v-slot:activator="{ on, attr }">
                    <i 
                      v-bind="attr" 
                      class="uiIconInformation"
                      v-on="on"></i>
                  </template>
                  <span>{{ $t(`webconferencing.admin.${action.component.name}.modal.tooltips.infoStun`) }}</span>
                </v-tooltip>
              </v-card-subtitle>
            </v-row>
            <component
              v-for="(component, index) in components"
              :key="index"
              :tooltip="tooltip"
              :action="action"
              :credentialsform="credentialsform"
              :settings="settings"
              :cslogcheck="csLogCheck"
              :addserver="addServer"
              :removeserver="removeServer"
              :is="component"/>
            <v-row>
              <v-card-subtitle
                style="font-weight: bold">
                {{ $t(`webconferencing.admin.${action.component.name}.modal.ErrDiagnostocs`) }}
              </v-card-subtitle>
            </v-row>
            <v-row>
              <v-subheader inset>
                <v-checkbox
                  v-model="csLogCheck"
                  :label="$t(`webconferencing.admin.${action.component.name}.modal.CsLog`)"
                  :value="csLogCheck"/>
                <v-tooltip top max-width="500">
                  <template v-slot:activator="{ on, attr }">
                    <i
                      v-bind="attr"
                      style="padding: 0px 4px 7px"
                      class="uiIconInformation"
                      v-on="on"></i>
                  </template>
                  <span>{{ $t(`webconferencing.admin.${action.component.name}.modal.tooltips.infoCsLog`) }}</span>
                </v-tooltip>
              </v-subheader>
            </v-row>
            <v-spacer />
            <v-card-actions :class="`d-flex justify-center`">
              <v-btn
                color="primary"
                @click="postSettingsConfig">
                {{ $t(`webconferencing.admin.buttons.Save`) }}
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="closeDialog">
                {{ $t(`webconferencing.admin.buttons.Cancel`) }}
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Server from "./Server.vue";
import NoServer from "./NoServer.vue";
export default {
  components: {
    Server,
    NoServer
  },
  props: {
    action: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showWebRTC: false,
      components: [Server],
      error: null,
      warn: null,
      showDialog: false,
      settings: null,
      csLogCheck: false,
      credentialsform: ["username", "credential"]
    };
  },
  created() {
    this.getSettingsConfig();
  },
  methods: {
    async getSettingsConfig() {
      try {
        this.settings = await webConferencing.webrtc.getRtcConfiguration();
        this.error = null;
      } catch (err) {
        this.error = err.message;
      }
    },

   /**
   * Post the settings configuration and close settings dialog
   *
   * @async
   * @function postSettingsConfig
   * @return {Promise<JSON>} 
   */

    async postSettingsConfig() {
      try {
        await webConferencing.webrtc.postSettings({
          rtcConfiguration: JSON.stringify(this.settings)
        });
      } catch (err) {
        this.error = err.message;
      }
      this.closeDialog();
    },

    /**
     * Close settings dialog
     *
     * @function closeDialog
     */

    closeDialog() {
      this.error = null;
      this.showDialog = false;
    },

    /**
     * Add new iceServer to this.settings.iceServers and 
     * depends on it Server component renders it to the DOM
     *
     * @function addServer
     * @param {Object} e - the event to work with
     */

    addServer(e) {
      if (e.target.matches(".actionIcon, .uiIconPlus")) {
        const newServerSettings = {
          credential: "",
          default: true,
          enabled: true,
          urls: [""],
          username: ""
        };
        if (this.components.indexOf(NoServer) !== -1) {
          this.components.pop(NoServer);
          this.components.push(Server)
          this.warn = null;
        } else {
          this.settings.iceServers = [...this.settings.iceServers, newServerSettings];
        this.credentialsCheck = [...this.credentialsCheck, false];
        }
      }
    },

     /**
     * Remove the iceServer from this.settings.iceServers depending on event.taget 
     * and depends on it Server component renders to the DOM
     * and close confirmation dialog
     *
     * @function removeServer
     * @param {Object} e - the event to work with
     */

    removeServer(e) {
      const classn = e.target.getAttribute("class");
      this.settings.iceServers.map((iceServer, index, arr) => {
        if (classn.includes(index)) {
          if (arr.length !== 1) {
            arr.splice(index, 1);
          } else {
            this.components.splice(0, 1, NoServer);
           this.warn = `webconferencing.admin.${this.action.component.name}.modal.warn`;
          }
          this.showRemoveDialog = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.VuetifyApp .v-dialog > .v-card > .v-card__title {
  padding: 0;
}
.VuetifyApp .v-application .uiPopup .popupHeader {
  margin-bottom: 0;
  padding: 8px 10px 8px 15px;
}
.VuetifyApp .theme--light.v-card .v-card__subtitle {
  color: black;
}
.VuetifyApp .theme--light.v-label {
  color: black !important;
}
.v-row:first-of-type > .v-card__subtitle {
  padding-top: 0px;
}
.spacer {
  height: 40px;
}
.VuetifyApp .container {
  padding: 0;
}
.VuetifyApp .v-subheader--inset {
  margin-left: 30px;
}
.VuetifyApp .v-input--selection-controls {
  margin-top: 0;
}
</style>