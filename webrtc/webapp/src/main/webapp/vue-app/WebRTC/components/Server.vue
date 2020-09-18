<template>
  <div>
    <div v-for="(iceServer, index) in settings.iceServers" :key="index">
      <v-row :class="`d-flex align-center justify-center`">
        <v-card-subtitle>{{ $t(`webconferencing.admin.${action.component.name}.modal.URL`) }}</v-card-subtitle>
        <v-text-field
          v-model="iceServer.urls[0]"
          :value="iceServer.urls[0]"
          outlined
          dense
          hide-details
          autofocus/>
        <v-tooltip top>
          <template v-slot:activator="{ on, attr }">
            <RemoveServer
              :index="index"
              v-bind="attr"
              :action="action"
              :removeserver="removeserver"
              v-on="on"/>
          </template>
          <span>{{ $t(`webconferencing.admin.${action.component.name}.modal.tooltips.remove`) }}</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attr }">
            <v-btn
              v-bind="attr"
              icon
              class="actionIcon"
              height="fit-content"
              width="fit-content"
              v-on="on"
              @click="addserver">
              <i class="uiIconPlus uiIconLightGray"></i>
            </v-btn>
          </template>
          <span>{{ $t(`webconferencing.admin.${action.component.name}.modal.tooltips.add`) }}</span>
        </v-tooltip>
      </v-row>
      <v-subheader inset>
        <v-checkbox
          v-model="credentialsCheck[index]"
          :label="$t(`webconferencing.admin.${action.component.name}.modal.Credentials`)"
          :value="credentialsCheck[index]"/>
      </v-subheader>
      <v-form v-show="credentialsCheck[index]">
        <v-row
          v-for="(credential, index) in credentialsform"
          :class="`d-flex align-center`"
          :key="index">
          <v-subheader>{{ $t(`webconferencing.admin.${action.component.name}.modal.input.${credential}.label`) }}</v-subheader>
          <v-text-field
            v-model="iceServer[credential]"
            :placeholder=" $t(`webconferencing.admin.${action.component.name}.modal.input.${credential}.placeholder`)"
            outlined
            required
            dense/>
        </v-row>
      </v-form>
    </div>
  </div>
</template>

<script>
import RemoveServer from "./RemoveIceServer.vue";
export default {
  components: {
    RemoveServer
  },
  props: {
    action: {
      type: Object,
      required: true
    },
    credentialsform: {
      type: Array,
      required: false,
      default: function() {
        return [String];
      }
    },
    settings: {
      type: Object,
      required: true,
      default: function() {
        return {
          bundlePolicy: String,
          iceCandidatePoolSize: Number,
          iceServers: {
            type: Array,
            required: false,
            default: function() {
              return [
                {
                  credential: String,
                  default: Boolean,
                  enabled: Boolean,
                  urls: {
                    type: Array,
                    required: false,
                    default: function() {
                      return [String];
                    }
                  },
                  username: String
                }
              ];
            }
          },
          iceTransportPolicy: String,
          logEnabled: Boolean
        };
      }
    },
    addserver: {
      type: Function,
      required: true
    },
    removeserver: {
      type: Function,
      required: true
    }
  },
  data: function() {
    return {
      credentialsCheck: [false],
      components: [RemoveServer]
    };
  }
};
</script>

<style scoped>
.v-text-field--outlined >>> fieldset {
  border: 2px solid rgb(208 219 234);
}
.v-card__subtitle {
  padding: 0px 16px;
  color: black;
}
.v-subheader--inset {
  margin-left: 63px;
}
.v-form >>> .v-subheader {
  padding-left: 9px;
}
.v-input.v-text-field {
  padding-top: 0px;
}
.d-flex {
  width: 93%;
  margin: auto;
}
.v-form > .d-flex {
  width: 73%;
}
input[type="text"] {
  min-height: fit-content !important;
}
.v-btn {
  padding: 5px;
}
.v-btn:before {
  background-color: transparent;
}
</style>