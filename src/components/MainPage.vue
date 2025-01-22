<template>
  <v-app>
    <v-app-bar color="primary" height="80">
      <v-app-bar-title class="text-secondary" style="min-width: 80px; max-width: 80px; font-size: 1.5rem; font-weight: bolder;">DeMAF</v-app-bar-title>
      <v-spacer></v-spacer>
      <!-- Use native input elements for file and folder upload -->
      <input class="ma-2" type="file" name="file" @change="handleFileUpload" style="display: none;" ref="fileInput">
      <input class="ma-2" type="file" name="files" webkitdirectory multiple @change="handleFolderUpload" style="display: none;" ref="folderInput">
      <v-btn class="ma-2" @click="selectFile" variant="outlined">Select File</v-btn>
      <v-btn class="ma-2" @click="selectFolder" variant="outlined">Select Folder</v-btn>
      <v-row class="ma-2">
        <v-text-field class="ma-2" v-if="showStartFileInput" v-model="startFileName" label="Path to start file" variant="outlined" hide-details></v-text-field>
        <v-select class="ma-2" v-model="selectedTechnology" label="Technology" min-width="6pc" :items="technologies"
          variant="outlined" hide-details></v-select>
        <v-select class="ma-2" v-model="selectedOptions" clearable label="Options" :items="['flat', 'partial']"
          multiple chips variant="outlined" hide-details></v-select>
        <v-text-field class="ma-2" v-model="commands" label="Commands" variant="outlined" hide-details></v-text-field>
      </v-row>
      <v-btn class="ma-2" rounded="LG" @click="startTransformation" variant="outlined">Transform</v-btn>
      <v-spacer></v-spacer>
      <div class="mr-3 ml-2" min-width="80px" max-width="80px">
        <v-btn v-if="theme.global.current.dark" icon="fas fa-moon" @click="toggleTheme"></v-btn>
        <v-btn v-if="!theme.global.current.dark" icon="fas fa-sun" @click="toggleTheme"></v-btn>
      </div>
      <template v-slot:extension>
        <v-tabs align-with-title v-model="selectedTab">
          <v-tab value="Start">
            <v-icon class="mr-2" icon="fas fa-house"></v-icon>
            Start
          </v-tab>
          <v-tab v-for="(tab, t) in viewTabs" :key="t" :value="tab.id">{{tab.name}}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item value="Start">
          <StartTab :_lastTransformations="this.lastTransformations" :_status="this.status"></StartTab>
        </v-tabs-window-item>
        <v-tabs-window-item v-for="(tab, t) in viewTabs" :key="t" :value="tab.id">
          <ViewTab :_showTADM="false" :_transformationProcessId="tab.id"></ViewTab>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-main>
  </v-app>
</template>

<style>
  .v-toolbar__extension {
    background-color: color-mix(in srgb, rgb(var(--v-theme-primary)) 75%, rgb(var(--v-theme-on-primary)));
  }
</style>

<script>
import { useTheme } from 'vuetify';
import StartTab from "./StartTab.vue";
import ViewTab from "./ViewTab.vue";

import {
  getRegisteredPlugins,
  saveUploadedFileForTransformation,
  saveUploadedFilesForTransformation,
  callAnalysisManagerTransformation,
  pollTransformationProcessStatusForResult,
} from "@/services/transformationService";

export default {
  created() {
    this.loadRegisteredPlugins();
  },
  data() {
    return {
      error: false,
      commands: "",
      lastTransformations: [],
      status: {
        icon: "fas fa-cloud-arrow-up",
        message: "To start drag and drop or upload a file.",
      },
      selectedTechnology: null,
      selectedOptions: [],
      selectedTab: "Start",
      viewTabs: [],
      technologies: ["helm", "kubernetes", "terraform"],
      theme: useTheme(),
      transform: false,
      transformationProcesses: [],
      uploadedFiles: [],
      showStartFileInput: false,
      startFileName: "",
    };
  },
  components: {
    StartTab,
    ViewTab,
  },
  methods: {
    selectFile() {
      // Trigger the file input element
      this.$refs.fileInput.click();
      this.showStartFileInput = false;
    },
    selectFolder() {
      // Trigger the folder input element
      this.$refs.folderInput.click();
      this.showStartFileInput = true;
    },
    handleFileUpload(event) {
      this.uploadedFiles = Array.from(event.target.files);
      console.log("Uploaded file:", this.uploadedFiles[0]);
    },
    handleFolderUpload(event) {
      this.uploadedFiles = Array.from(event.target.files);
      console.log("Uploaded folder:", this.uploadedFiles);
    },
    async startTransformation() {
      if (!this.uploadedFiles.length) {
        alert("Please upload a file or folder first.");
        return;
      }
      if (!this.selectedTechnology) {
        alert("Please select a technology first.");
        return;
      }

      this.transform = true;
      this.updateStatus();

      try {
        var tsdm;
        if(this.uploadedFiles.length === 1){
          await saveUploadedFileForTransformation(this.uploadedFiles[0]);
          tsdm = {
          technology: this.selectedTechnology.toLowerCase(),
          locationURL: "file:/usr/share/" + this.uploadedFiles[0].name,
          commands: this.commands ? this.commands.split(",").map((cmd) => cmd.trim()) : [""],
          options: this.selectedOptions,
        };
        }else if(this.uploadedFiles.length > 1){
          await saveUploadedFilesForTransformation(this.uploadedFiles);
          const startFile = this.uploadedFiles.find(file => file.name === this.startFileName);

          if (!startFile) {
            alert("Start file not found in the uploaded folder.");
            this.transform = false;
            this.updateStatus();
            return;
          }
          console.log("Start file path:", startFile.webkitRelativePath);
          
          tsdm = {
          technology: this.selectedTechnology.toLowerCase(),
          locationURL: "file:/usr/share/" + startFile.webkitRelativePath,
          commands: this.commands ? this.commands.split(",").map((cmd) => cmd.trim()) : [""],
          options: this.selectedOptions,
        };
        }else{
          alert("Please upload a file or folder first.");
          this.transform = false;
          return;
        }

        const transformationProcessId = await callAnalysisManagerTransformation(tsdm);
        this.transformationProcesses.push(transformationProcessId);
        const statusMessage = await pollTransformationProcessStatusForResult(transformationProcessId, 10);

        if (statusMessage) {
          this.lastTransformations.push({ name: this.uploadedFiles[0].webkitRelativePath.split('/')[0], id: transformationProcessId });
          this.transform = false;
          this.updateStatus();

          const wineryPath = statusMessage.path;
          console.log("Winery path 1: " + wineryPath);
          this.viewTabs.push({
            name: this.uploadedFiles[0].webkitRelativePath.split('/')[0],
            id: transformationProcessId,
          });
          this.selectedTab = transformationProcessId; // Automatically select the new tab
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
    async loadRegisteredPlugins() {
      try {
        this.technologies = await getRegisteredPlugins();
        console.log("Registered extensions successfully received.");
      } catch (error) {
        console.log("Error while receiving registered extensions.");
      }
    },
    updateStatus() {
      if (this.transform && !this.error) {
        this.status.icon = "fas fa-gear fa-spin";
        this.status.message = "Transformation in progress...";
      } else if (this.error) {
        this.status.icon = "fas fa-exclamation-triangle";
        this.status.message = "An error occurred during transformation.";
      } else {
        this.status.icon = "fas fa-cloud-arrow-up";
        this.status.message = "To start drag and drop or upload a file.";
      }
    },
    toggleTheme() {
      this.theme.global.name = this.theme.global.current.dark ? 'catppuccinLatteTheme' : 'catppuccinFrappeTheme';
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>