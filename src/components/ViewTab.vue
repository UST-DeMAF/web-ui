<template>
  <v-container v-if="showTADM">
    <v-textarea :value="this.tadm" variant="outlined"></v-textarea>
  </v-container>
  <v-container v-else>
    <iframe :src="wineryUrl" width="100%" height="600px"></iframe>
  </v-container>
  <v-container>
    <v-row>
      <v-switch v-model="showTADM" color="primary" @change="loadTADM" label="Show TADM"></v-switch>
      <v-spacer></v-spacer>
      <v-btn class="mx-2" disabled color="primary" @click="downloadCSAR">Download CSAR</v-btn>
      <v-btn class="mx-2" color="primary" @click="downloadTADM">Download TADM</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showTADM: this._showTADM,
      tadm: null,
      transformationProcessId: this._transformationProcessId,
      wineryUrl: "http://localhost/winery-topologymodeler/?repositoryURL=http:%2F%2Flocalhost:%2Fwinery&uiURL=http:%2F%2Flocalhost%2F%23%2F&ns=ust.tad.servicetemplates&id=" + this._transformationProcessId + "&topologyProDecURL=http:%2F%2Flocalhost:9090",
    };
  },
  props: {
    _showTADM: {
      type: Boolean,
      default: false,
    },
    _transformationProcessId: {
      type: String,
      required: true,
    },
  },
  watch: {
    _showTADM: function (value) {
      this.showTADM = value;
    },
    _transformationProcessId: function (value) {
      this.transformationProcessId = value;
      this.wineryUrl = "http://localhost/winery-topologymodeler/?repositoryURL=http:%2F%2Flocalhost:%2Fwinery&uiURL=http:%2F%2Flocalhost%2F%23%2F&ns=ust.tad.servicetemplates&id=" + this._transformationProcessId + "&topologyProDecURL=http:%2F%2Flocalhost:9090";
    },
  },
  methods:
  {
    async loadTADM() {
      const url = "http://localhost:3000/tadms/" + this.transformationProcessId + ".yaml";
      try {
        const response = await fetch(url);
        this.tadm = await response.text();
      } catch (err) {
        console.error("Error loading TADM: " + err);
      }
    }
  }
};
</script>