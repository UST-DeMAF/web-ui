<template>
  <v-container
    v-if="showTADM"
    class="my-2"
    height="calc(100vh - 225px)"
  >
    <v-textarea
      class="rounded-lg w-100 h-100 border-none"
      color="primary"
      :value="tadm"
      variant="outlined"
      readonly
      no-resize
    />
  </v-container>
  <v-container
    v-else
    class="my-2"
    height="calc(100vh - 225px)"
  >
    <iframe
      class="rounded-lg w-100 h-100 border-none"
      :src="url"
    />
  </v-container>
  <v-container>
    <v-row class="w-100">
      <v-switch
        v-model="showTADM"
        class="mx-7"
        color="primary"
        label="Show TADM"
        hide-details
        flat
        @change="loadTADM"
      />
      <v-spacer />
      <v-btn
        class="mx-2 my-auto"
        disabled
        color="primary"
        flat
        @click="downloadCSAR"
      >
        Download CSAR
      </v-btn>
      <v-btn
        class="mx-2 my-auto"
        color="primary"
        flat
        @click="downloadTADM"
      >
        Download TADM
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
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
  data() {
    const protocol = this.$runtimeConfig?.DEMAF_HTTPS === "true" ? "https" : "http";
    const domain = this.$runtimeConfig?.DEMAF_DOMAIN;
    return {
      showTADM: this._showTADM,
      tadm: null,
      transformationProcessId: this._transformationProcessId,
      url: `${protocol}://${domain}/winery/winery-topologymodeler/?repositoryURL=${protocol}:%2F%2F${domain}:%2Fwinery%2Fwinery&uiURL=${protocol}:%2F%2F${domain}%2Fwinery%2F%23%2F&ns=ust.tad.servicetemplates&id=${this._transformationProcessId}&topologyProDecURL=${protocol}:%2F%2F${domain}:9090`
    };
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
        const url = "/tadms/" + this.transformationProcessId + ".yaml";
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