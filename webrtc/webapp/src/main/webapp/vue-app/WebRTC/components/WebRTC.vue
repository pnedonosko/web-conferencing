<template>
  <v-dialog 
    v-model="showWebRTC"
    content-class="WebRTC">
    <template v-slot:activator="{ on }">
      <a 
        data-placement="bottom" 
        rel="tooltip"  
        v-on="on">
        <span>Hello webrtc</span>
      </a>
    </template>
  </v-dialog>
</template>


<script>
export default {
  data: function() {
    return {
      showWebRTC: false,
    };
  },
  
};
</script>