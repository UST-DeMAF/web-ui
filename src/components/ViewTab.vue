<template>
  <v-container v-if="showTADM">
    <v-textarea :value="tadm" variant="outlined"/>
  </v-container>
  <v-container v-else>
    <div class="iframe-container">
      <iframe :src="wineryUrl" class="dynamic-iframe"/>
    </div>
  </v-container>
  <v-container class="controls-container">
    <v-row>
      <v-switch v-model="showTADM" color="primary" @change="loadTADM" label="Show TADM"/>
      <v-spacer/>
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
    },
  },
  created() {
    this.loadTADM();
  },
  methods: {
    async loadTADM() {
      if (this.tadm === null) {
        const url = "http://localhost:3000/tadms/" + this.transformationProcessId + ".yaml";
        try {
          const response = await fetch(url);
          this.tadm = await response.text();
        } catch (err) {
          console.error("Error loading TADM: " + err);
        }
      }
    },
    downloadCSAR() {
      // Implement the logic to download CSAR
    },
    downloadTADM() {
      if (this.tadm === null) {
        alert("No TADM available to download.");
      } else {
        try {
          const blob = new Blob([this.tadm], { type: 'text/yaml' });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${this.transformationProcessId}.yaml`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log("TADM file downloaded successfully");
        } catch (error) {
          console.error("Error downloading TADM file:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.iframe-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 20px 5px 20px;
  /* Top, Right, Bottom, Left */
  height: calc(100vh - 225px);
  /* Adjust height based on margins */
}

.dynamic-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.controls-container {
  height: auto;
}
</style>