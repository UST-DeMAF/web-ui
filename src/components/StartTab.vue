<template>
  <v-row>
    <v-col align-self="center" cols="2">
      <v-container>
        <v-card title="Last transformations">
          <v-list v-model="selectedTransformation" color="primary">
            <v-list-item
              v-for="(transformation, t) in lastTransformations"
              :key="t"
              :value="transformation.id"
            >
              <template v-slot:prepend>
                <v-icon>far fa-file</v-icon>
              </template>
              <v-list-item-title>{{ transformation.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </v-col>
    <v-col align-self="center" cols="8">
      <v-container>
        <v-row>
          <v-icon size="64px">{{ status.icon }}</v-icon>
        </v-row>
        <v-row>{{ status.message }}</v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      lastTransformations: this._lastTransformations, // Data to store the last transformations
      selectedTransformation: null, // Data to store the selected transformation
      status: this._status, // Data to store the status
    };
  },
  props: {
    _lastTransformations: Array, // Prop to store the last transformations
    _status: {
      icon: String, // Prop to store the status icon
      message: String, // Prop to store the status message
    },
  },
  watch: {
    _lastTransformations: function (value) {
      this.lastTransformations = value;
    },
    _status: function (value) {
      this.status = value;
    },
  },
};
</script>
