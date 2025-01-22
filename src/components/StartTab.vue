<template>
  <v-row no-gutters>
    <v-col class="fit-content-container" align-self="center">
      <v-container>
        <v-card class="border-md border-primary rounded-lg" title="Last transformations" density="compact" flat>
          <v-list class="pa-0 py-2 border-t-md" v-model="selectedTransformation" color="primary">
            <v-list-item class="ma-2 border-md rounded-pill" v-for="(transformation, t) in lastTransformations" :key="t" :value="transformation.id"
              @click="openTransformation">
              <template v-slot:prepend>
                <v-icon>far fa-file</v-icon>
              </template>
              <v-list-item-title>{{ transformation.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </v-col>
    <v-col class="flex-grow-1" align-self="center">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-icon :style="{ color: status.color }" size="64px">{{ status.icon }}</v-icon>
          <v-spacer></v-spacer>
        </v-row>
        <v-row class="text-h6" :style="{ color: status.color }">
          <v-spacer></v-spacer>
          {{ status.message }}
          <v-spacer></v-spacer>
        </v-row>
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
  methods: {
    openTransformation() {
      console.log("Open transformation: " + this.selectedTransformation);
    }
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

<style scoped>
:deep(.fit-content-container) {
  max-width: fit-content;
}
:deep(.v-card-title) {
  margin: 8px 8px 0 8px;
}
</style>
