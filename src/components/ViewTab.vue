<template>
  <div v-if="showWinery">
    <iframe :src="wineryUrl" width="100%" height="600px"></iframe>
  </div>
</template>

<script>
export default {
    data() {
    return {
      showWinery: this._showWinery, 
      wineryUrl: this._wineryUrl,
    };
  },
  props: {
    _showWinery: {
      type: Boolean,
      default: true,
    },
    _wineryUrl: {
      type: String,
      required: true,
    },
  },
  watch: {
    _showWinery: function (value) {
      this.showWinery = value;      
    },
    _wineryUrl: function (value) {
      this.wineryUrl = value;
      console.log("WineryURL: " + value);
    },
  },
};
</script>