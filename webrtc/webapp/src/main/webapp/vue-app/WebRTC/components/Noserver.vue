<template>
  <v-row>
    <v-subheader inset>No server available, please add your first one</v-subheader>
    <v-tooltip top>
      <template v-slot:activator="{ on, attr }">
        <v-btn 
          v-bind="attr" 
          icon 
          class="actionIcon" 
          v-on="on" 
          @click="addserver">
          <i class="uiIconPlus uiIconLightGray"></i>
        </v-btn>
      </template>
      <span>{{ $t(`webconferencing.admin.${action.component.name}.modal.tooltips.add`) }}</span>
    </v-tooltip>
  </v-row>
</template>

<script>
export default {
  props: {
    action: {
      type: Object,
      required: true
    },
    addserver: {
      type: Function,
      required: true
    },
  }
}
</script>

<style scoped> 
    .v-btn:before {
    background-color: transparent;
}
.VuetifyApp .v-subheader--inset {
    margin-left: 30px;
}
</style>