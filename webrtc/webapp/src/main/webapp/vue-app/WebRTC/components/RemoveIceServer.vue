<template>
  <v-dialog 
    v-model="showRemoveDialog" 
    width="500" 
    @click:outside="showRemoveDialog = false">
    <template v-slot:activator="{ on, attr }">
      <v-btn
        v-bind="attr"
        icon
        class="actionIcon"
        height="fit-content"
        width="fit-content"
        v-on="on">
        <i class="uiIconTrash uiIconLightGray"></i>
      </v-btn>
    </template>
    <v-card class="uiPopup settingsForm">
      <v-card-title class="popupHeader ClearFix">
        <span
          class="PopupTitle popupTitle">
          {{ this.$t(`webconferencing.admin.${action.component.name}.modal.removeModal.title`) }}
        </span>
        <i class="uiIconClose pull-right" @click="closeDialog"></i>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-subheader>
            <i style="padding: 0px 4px 7px" class="uiIconQuestion"></i>

            <span>{{ this.$t(`webconferencing.admin.${action.component.name}.modal.removeModal.confirmAction`) }}</span>
          </v-subheader>
          <v-spacer />
          <v-card-actions :class="`d-flex justify-center`">
            <v-btn 
              :class="`remove-server-${index}`" 
              color="primary" 
              @click="removeserver">
              <span
                :class="`remove-server-${index}`">
                {{ $t(`webconferencing.admin.buttons.Remove`) }}
              </span>
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
</template>

<script>
export default {
  props: {
    action: {
      type: Object,
      required: true
    },
    index: {
      type: String,
      required: true
    },
    removeserver: {
      type: Function,
      required: true
    }
  },
  data: function() {
    return {
      showRemoveDialog: false
    };
  },
  methods: {
    closeDialog() {
      this.error = null;
      this.showRemoveDialog = false;
    }
  }
};
</script>

<style scoped>
.VuetifyApp .v-application .uiPopup .popupHeader {
  margin-bottom: 0;
  padding: 8px 10px 8px 15px;
}
.v-btn:first-of-type {
  padding: 2px 5px 5px 5px;
}
.v-btn:before {
  background-color: transparent;
}
.uiIconTrash {
  font-size: 23px;
}
.VuetifyApp .container {
  padding: 0;
}
.VuetifyApp .v-dialog > .v-card > .v-card__text {
  padding-bottom: 0;
}
.spacer {
  height: 30px;
}
</style>