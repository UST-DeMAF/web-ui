<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>DeMAF</v-app-bar-title>
      <v-row></v-row>
      <v-row>
        <!-- Use native input element for file and folder upload -->
        <input type="file" webkitdirectory multiple @change="handleFileOrFolderUpload" style="display: none;" ref="fileInput">
        <v-btn @click="selectFileOrFolder" min-width="200px" variant="outlined">Select File or Folder</v-btn>
        <v-spacer></v-spacer>
        <v-select v-model="selectedTechnology" label="Technology" :items="technologies" min-width="150px"
          variant="outlined"></v-select>
        <v-spacer></v-spacer>
        <v-select v-model="selectedOptions" clearable label="Options" :items="['flat', 'partial']" min-width="150px"
          multiple variant="outlined"></v-select>
        <v-spacer></v-spacer>
        <v-text-field v-model="commands" label="Commands" min-width="200px" variant="outlined"></v-text-field>
      </v-row>
      <v-spacer></v-spacer>
      <v-btn rounded="LG" @click="startTransformation">Transform</v-btn>
      <v-spacer></v-spacer>
      <v-btn class="ma-2" v-if="theme.global.current.dark" icon="fas fa-moon" @click="toggleTheme"></v-btn>
      <v-btn class="ma-2" v-if="!theme.global.current.dark" icon="fas fa-sun" @click="toggleTheme"></v-btn>
      <template v-slot:extension>
        <v-tabs align-with-title v-model="selectedTab">
          <v-tab value="Start">Start</v-tab>
          <v-tab v-for="(tab, t) in viewTabs" :key="t" :value="tab.id">{{
            tab.name
          }}</v-tab>
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
      error: false, // Data property to store the error status
      commands: "", // Data property to store the commands
      lastTransformations: [], // Data property to store the last transformations
      status: {
        icon: "fas fa-cloud-arrow-up",
        message: "To start drag and drop or upload a file.",
      }, // Data property to store the status
      selectedTechnology: null, // Data property to store the selected technology
      selectedOptions: [], // Data property to store the selected options
      selectedTab: "Start", // Data property to store the selected tab
      viewTabs: [], // Data property to store the available tabs
      technologies: ["helm", "kubernetes", "terraform"], // Data property to store the available technologies
      theme: useTheme(), // Add theme to data properties
      transform: false, // Data property to store the transformation status
      transformationProcesses: [],
      uploadedFiles: [], // Data property to store the uploaded files
    };
  },
  components: {
    StartTab,
    ViewTab,
  },
  methods: {
    selectFileOrFolder() {
      // Trigger the file input element
      this.$refs.fileInput.click();
    },
    handleFileOrFolderUpload(event) {
      this.uploadedFiles = Array.from(event.target.files);
      console.log("Uploaded files:", this.uploadedFiles);
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
          tsdm = {
          technology: this.selectedTechnology.toLowerCase(),
          locationURL: "file:/usr/share/" + this.uploadedFiles[0].webkitRelativePath.split('/')[0],
          commands: this.commands ? this.commands.split(",").map((cmd) => cmd.trim()) : [""],
          options: this.selectedOptions,
        };
        }else{
          alert("Please upload a file or folder first.");
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