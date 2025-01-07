<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>DeMAF</v-app-bar-title>
      <v-row></v-row>
      <v-row>
        <v-file-input
          v-model="uploadedFile"
          label="File"
          min-width="200px"
          variant="outlined"
        ></v-file-input>
        <v-spacer></v-spacer>
        <v-select
          v-model="selectedTechnology"
          label="Technology"
          :items="technologies"
          min-width="150px"
          variant="outlined"
        ></v-select>
        <v-spacer></v-spacer>
        <v-select
          v-model="selectedOptions"
          clearable
          label="Options"
          :items="['flat', 'partial']"
          min-width="150px"
          multiple
          variant="outlined"
        ></v-select>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="commands"
          label="Commands"
          min-width="200px"
          variant="outlined"
        ></v-text-field>
      </v-row>
      <v-spacer></v-spacer>
      <v-btn rounded="LG" @click="startTransformation">Transform</v-btn>
      <v-spacer></v-spacer>
      <template v-slot:extension>
        <v-tabs align-with-title v-model="selectedTab">
          <v-tab value="start">Start</v-tab>
          <v-tab v-for="(tab, t) in viewTabs" :key="t" :value="tab.value">{{
            tab.title
          }}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item value="start">
          <StartTab
            :_lastTransformations="this.lastTransformations"
            :_status="this.status"
          ></StartTab>
        </v-tabs-window-item>
        <v-tabs-window-item
          v-for="(tab, t) in viewTabs"
          :key="t"
          :value="tab.value"
        >
          <ViewTab :_showTADM="false" :_wineryUrl="tab.path"></ViewTab>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-main>
  </v-app>
</template>

<script>
import StartTab from "./StartTab.vue";
import ViewTab from "./ViewTab.vue";

import {
  getRegisteredPlugins,
  saveUploadedFileForTransformation,
  callAnalysisManagerTransformation,
  pollTransformationProcessStatusForResult,
} from "@/services/transformationService";
import { transform } from "typescript";

export default {
  created() {
    this.loadRegisteredPlugins();
  },
  data() {
    return {
      error: false, // Data property to store the error status
      commands: "", // Data property to store the commands
      lastTransformations: [], // Data property to store the last transformations
      status: {
        icon: "fas fa-cloud-arrow-up",
        message: "To start drag and drop or upload a file.",
      }, // Data property to store the status
      selectedTechnology: null, // Data property to store the selected technology
      selectedOptions: [], // Data property to store the selected options
      selectedTab: null, // Data property to store the selected tab
      viewTabs: [], // Data property to store the available tabs
      technologies: ["helm", "kubernetes", "terraform"], // Data property to store the available technologies
      transform: false, // Data property to store the transformation status
      transformationProcesses: [],
      uploadedFile: null, // Data property to store the uploaded file
    };
  },
  components: {
    StartTab,
    ViewTab,
  },
  methods: {
    handleFileUpload() {
      if (this.uploadedFile) {
        console.log("uploaded file: " + this.uploadedFile.name);
      }
    },
    async loadRegisteredPlugins() {
      try {
        this.technologies = await getRegisteredPlugins();
        console.log("Registered extensions successfully received.");
      } catch (error) {
        //this.error = true;
        //this.updateStatus();
        console.log("Error while receiving registered extensions.");
      }
    },
    async startTransformation() {
      if (!this.uploadedFile) {
        alert("Please upload a file first.");
        return;
      }
      if (!this.selectedTechnology) {
        alert("Please select a technology first.");
        return;
      }

      this.transform = true;
      this.updateStatus();

      try {
        await saveUploadedFileForTransformation(this.uploadedFile);
        const tsdm = {
          technology: this.selectedTechnology.toLowerCase(),
          locationURL: "file:/usr/share/" + this.uploadedFile.name,
          commands: this.commands
            ? this.commands.split(",").map((cmd) => cmd.trim())
            : [""],
          options: this.selectedOptions,
        };
        const currentTransformationProcessId =
          await callAnalysisManagerTransformation(tsdm);
        this.transformationProcesses.push(currentTransformationProcessId);
        const statusMessage = await pollTransformationProcessStatusForResult(
          currentTransformationProcessId,
          10
        );

        if (statusMessage) {
          //TODO: change this be more robust?
          this.lastTransformations.push(this.uploadedFile.name); //TODO: add stuff needed for I-frame for Winery
          this.transform = false;
          this.updateStatus();

          // Create a new view tab with the Winery path
          const wineryPath = statusMessage.path;
          console.log("Winery path 1: " + wineryPath);
          this.viewTabs.push({
            title: this.uploadedFile.name,
            value: this.uploadedFile.name,
            path: wineryPath,
          });
        } else {
          this.error = true;
          this.updateStatus();
        }
      } catch (error) {
        console.log(error);
        this.error = true;
        this.updateStatus();
      }
    },
    async updateStatus() {
      if (this.transform && !this.error) {
        this.status.icon = "fas fa-gear fa-spin";
        this.status.message =
          "Transform " +
          this.uploadedFile.name +
          " this may take a few moments.";
      } else if (this.error) {
        this.status.icon = "fas fa-exclamation-triangle";
        this.status.message =
          "An error has occurred during the transformation.";
      } else {
        this.status.icon = "fas fa-cloud-arrow-up";
        this.status.message = "To start drag and drop or upload a file.";
      }
    },
  },
  watch: {
    uploadedFile(newFile) {
      this.handleFileUpload();
    },
  },
};
</script>