<template>
  <v-container v-if="showTADM">
    <v-textarea disabled variant="outlined"></v-textarea>
  </v-container>
  <v-container v-else>
    <iframe :src="wineryUrl" width="100%" height="600px"></iframe>
  </v-container>
  <v-container>
    <v-row>
      <v-switch v-model="showTADM" color="primary" label="Show TADM" @click="loadTADM"></v-switch>
      <v-spacer></v-spacer>
      <v-btn class="mx-2" color="primary" @click="downloadCSAR"
        >Download CSAR</v-btn
      >
      <v-btn class="mx-2" color="primary" @click="downloadTADM"
        >Download TADM</v-btn
      >
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showTADM: this._showTADM,
      tadmPath: null,
      wineryUrl: this._wineryUrl,
    };
  },
  props: {
    _showTADM: {
      type: Boolean,
      default: false,
    },
    _wineryUrl: {
      type: String,
      required: true,
    },
  },
  watch: {
    _showTADM: function (value) {
      this.showTADM = value;
    },
    _wineryUrl: function (value) {
      this.wineryUrl = value;
      console.log("WineryURL: " + value);
    },
  },
};
</script>