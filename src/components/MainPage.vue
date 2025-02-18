<template>
  <v-app>
    <v-app-bar color="primary" height="100" v-if="selectedTab === 'Start'">
      <v-app-bar-nav-icon class="ml-3" icon="fas fa-diagram-project"></v-app-bar-nav-icon>
      <v-app-bar-title class="mx-0 small-caps text-h4" style="min-width: 120px; max-width: 120px;">DeMAF</v-app-bar-title>
      <v-spacer></v-spacer>
      <!-- Use native input elements for file and folder upload -->
      <input class="ma-2" type="file" name="file" @change="handleFileUpload" style="display: none;" ref="fileInput">
      <input class="ma-2" type="file" name="files" webkitdirectory multiple @change="handleFolderUpload"
        style="display: none;" ref="folderInput">
      <v-container class="pa-0 ma-2 w-auto">
        <v-row class="pa-0 ma-0 d-flex flex-column align-center">
          <v-btn class="mb-1" @click="selectFile" variant="outlined" dense block>Select File</v-btn>
          <v-btn class="mt-1" @click="selectFolder" variant="outlined" dense block>Select Folder</v-btn>
        </v-row>
      </v-container>
      <v-row class="ma-2 flex-shrink-1 flex-grow-0" style="max-width: 652px; min-width: 388px;">
        <v-text-field class="ma-2 flex-grow-0" v-if="showStartFileInput" v-model="startFilePath" :prefix="folderPrefix" label="Start file" placeholder="Relative path" min-width="200px" variant="outlined" hide-details></v-text-field>
        <v-select class="ma-2 flex-grow-0" v-model="selectedTechnology" label="Technology" min-width="148px" :items="technologies"
          variant="outlined" hide-details></v-select>
        <v-select class="ma-2 flex-grow-0" v-model="selectedOptions" label="Options" min-width="120px" :items="['flatten=true', 'flatten=partial', 'flatten=false']"
          chips variant="outlined" hide-details></v-select>
        <!-- Add "multiple" again when there are more options -->
        <v-text-field class="ma-2 flex-grow-0" v-model="commands" label="Commands" min-width="120px" variant="outlined" hide-details></v-text-field>
      </v-row>
      <v-btn class="ma-2" rounded="LG" @click="startTransformation" variant="outlined">Transform</v-btn>
      <v-spacer></v-spacer>
      <div class="mr-3 ml-2" style="min-width: 168px; max-width: 168px; text-align: end;">
        <v-btn icon="fas fa-book" @click="openDocumentation"></v-btn>
        <v-btn v-if="theme.global.current.dark" icon="fas fa-moon" @click="toggleTheme"></v-btn>
        <v-btn v-if="!theme.global.current.dark" icon="fas fa-sun" @click="toggleTheme"></v-btn>
      </div>
      <template v-slot:extension>
        <v-tabs align-with-title v-model="selectedTab">
          <v-tab value="Start">
            <v-icon class="mr-2" icon="fas fa-house"></v-icon>
            Start
          </v-tab>
          <v-tab :style="{'display': docDisplayStyle}" value="Documentation">
            <v-icon class="mr-2" icon="fas fa-book"></v-icon>
            Documentation
            <v-btn icon="fas fa-xmark" size="x-small" variant="plain" @click.stop="closeDocumentation"></v-btn>
          </v-tab>
          <v-tab v-for="(tab, t) in viewTabs" :key="t" :value="tab.id">
            {{ tab.name }}
            <template v-slot:append>
              <v-btn icon="fas fa-xmark" size="x-small" variant="plain" @click.stop="closeTab(tab.id)"></v-btn>
            </template>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-app-bar color="primary" height="55" v-else>
      <v-app-bar-nav-icon class="ml-3" icon="fas fa-diagram-project" size="small"></v-app-bar-nav-icon>
      <v-app-bar-title class="mx-0 small-caps text-h5" style="min-width: 120px; max-width: 120px;">DeMAF</v-app-bar-title>
      <v-spacer></v-spacer>
      <div class="mr-3 ml-2" style="min-width: 168px; max-width: 168px; text-align: end;">
        <v-btn icon="fas fa-book" size="small" @click="openDocumentation"></v-btn>
        <v-btn v-if="theme.global.current.dark" icon="fas fa-moon" size="small" @click="toggleTheme"></v-btn>
        <v-btn v-if="!theme.global.current.dark" icon="fas fa-sun" size="small" @click="toggleTheme"></v-btn>
      </div>
      <template v-slot:extension>
        <v-tabs align-with-title v-model="selectedTab">
          <v-tab value="Start">
            <v-icon class="mr-2" icon="fas fa-house" size="small"></v-icon>
            Start
          </v-tab>
          <v-tab :style="{'display': docDisplayStyle}" value="Documentation">
            <v-icon class="mr-2" icon="fas fa-book" size="small"></v-icon>
            Documentation
            <v-btn icon="fas fa-xmark" size="x-small" variant="plain" @click.stop="closeDocumentation"></v-btn>
          </v-tab>
          <v-tab v-for="(tab, t) in viewTabs" :key="t" :value="tab.id">
            {{ tab.name }}
            <template v-slot:append>
              <v-btn icon="fas fa-xmark" size="x-small" variant="plain" @click.stop="closeTab(tab.id)"></v-btn>
            </template>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-tabs-window class="h-100" v-model="selectedTab">
        <v-tabs-window-item class="h-100" value="Start">
          <StartTab :_lastTransformations="this.lastTransformations" :_status="this.status" @openTrans="openTrans" @removeTrans="removeTrans"></StartTab>
        </v-tabs-window-item>
        <v-tabs-window-item v-for="(tab, t) in viewTabs" :key="t" :value="tab.id">
          <ViewTab :_showTADM="false" :_transformationProcessId="tab.id"></ViewTab>
        </v-tabs-window-item>
        <v-tabs-window-item value="Documentation">
          <v-container>
            <iframe src="https://ust-demaf.github.io/web-ui/" class="documentation-iframe"></iframe>
          </v-container>
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
  generateSessionId,
  checkTotalSize
} from "@/services/transformationService";

export default {
  created() {
    this.initializeSession();
    this.loadRegisteredPlugins();
  },
  data() {
    return {
      error: false,
      commands: "",
      docDisplayStyle: "none",
      lastTransformations: [
        {name: "test1", id: "1234"},
        {name: "test2", id: "5678"},
        {name: "test3", id: "9012"},
      ],
      status: {
        icon: "fas fa-cloud-arrow-up",
        message: "To start upload a file or folder.",
        color: "rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))",
      },
      selectedTechnology: null,
      selectedOptions: "flatten=false",
      selectedTab: "Start",
      session: null,
      viewTabs: [],
      technologies: ["helm", "kubernetes", "terraform"],
      theme: useTheme(),
      transform: false,
      transformationProcesses: [],
      uploadedFiles: [],
      showStartFileInput: false,
      startFilePath: "", // Changed from startFileName to startFilePath
      folderPrefix: "",
    };
  },
  components: {
    StartTab,
    ViewTab,
  },
  methods: {
    closeDocumentation() {
      this.selectedTab = "Start";
      this.docDisplayStyle = "none";
    },
    closeTab(value) {
      console.log("Close tab: " + value);
      for (let i = 0; i < this.viewTabs.length; i++) {
        if (this.viewTabs[i].id === value) {
          this.viewTabs.splice(i, 1);
          break;
        }
      }
      if (this.selectedTab === value) {
        this.selectedTab = "Start";
      }
    },
    openDocumentation() {
      this.docDisplayStyle = "block";
      this.selectedTab = "Documentation";
    },
    openTrans(value) {
      console.log("Open transformation: " + value);
      var hasTab = false;
      for (let i = 0; i < this.viewTabs.length; i++) {
        if (this.viewTabs[i].id === value) {
          hasTab = true;
          break;
        }
      }
      if (!hasTab) {
        for (let i = 0; i < this.lastTransformations.length; i++) {
          if (this.lastTransformations[i].id === value) {
            this.viewTabs.push({
              name: this.lastTransformations[i].name,
              id: value,
            });
            break;
          }
        }
      }
      this.selectedTab = value;
    },
    removeTrans(value) {
      console.log("Delete transformation: " + value);
      for (let i = 0; i < this.lastTransformations.length; i++) {
        if (this.lastTransformations[i].id === value) {
          this.lastTransformations.splice(i, 1);
          break;
        }
      }
      localStorage.setItem("lastTransformations", JSON.stringify(this.lastTransformations));
      for (let i = 0; i < this.viewTabs.length; i++) {
        if (this.viewTabs[i].id === value) {
          this.viewTabs.splice(i, 1);
          break;
        }
      }
    },
    initializeSession() {
      this.session = localStorage.getItem("session");
      if (!this.session) {
        this.session = generateSessionId();
        localStorage.setItem("session", this.session);
        localStorage.setItem("theme", JSON.stringify('catppuccinLatteTheme'));
      } else {
        // Load theme
        this.theme.global.name = JSON.parse(localStorage.getItem("theme"));
        // Load last transformations
        this.lastTransformations = JSON.parse(localStorage.getItem("lastTransformations"));
      }
    },
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
      const files = Array.from(event.target.files);
      if (!checkTotalSize(files)) {
        alert("Total file size exceeds 50 MB. Please upload a smaller file.");
        return;
      }
      this.uploadedFiles = files;
      console.log("Uploaded file:", this.uploadedFiles[0]);
    },
    handleFolderUpload(event) {
      const files = Array.from(event.target.files);
      if (!checkTotalSize(files)) {
        alert("Total file size exceeds 50 MB. Please upload smaller files.");
        return;
      }
      this.uploadedFiles = files;
      console.log("Uploaded folder:", this.uploadedFiles);
      if (this.uploadedFiles.length > 0) {
        const folderName = this.uploadedFiles[0].webkitRelativePath.split('/')[0];
        this.folderPrefix = folderName + '/';
      }
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

      console.log("Session ID:", this.session);

      this.transform = true;
      this.updateStatus();

      console.log("Selected options: " + this.selectedOptions);

      try {
        var transformationProcessName;
        var tsdm;
        if (this.uploadedFiles.length === 1) {
          await saveUploadedFileForTransformation(this.uploadedFiles[0], this.session);
          transformationProcessName = this.uploadedFiles[0].name;
          tsdm = {
            technology: this.selectedTechnology.toLowerCase(),
            locationURL: "file:/usr/share/uploads/" + this.session + "/" + transformationProcessName,
            commands: this.commands ? this.commands.split(",").map((cmd) => cmd.trim()) : [""],
            options: [this.selectedOptions],
          };
        } else if (this.uploadedFiles.length > 1) {
          const folderName = this.uploadedFiles[0].webkitRelativePath.split('/')[0];
          const startFile = this.uploadedFiles.find(file => file.webkitRelativePath === `${folderName}/${this.startFilePath}`);
          if (!startFile) {
            alert("Start file not found in the uploaded folder.");
            this.transform = false;
            this.updateStatus();
            return;
          }
          await saveUploadedFilesForTransformation(this.uploadedFiles, this.session);
          console.log("Start file path:", startFile.webkitRelativePath);
          transformationProcessName = startFile.webkitRelativePath.split('/').at(-1);
          tsdm = {
            technology: this.selectedTechnology.toLowerCase(),
            locationURL: "file:/usr/share/uploads/" + this.session + "/" + startFile.webkitRelativePath,
            commands: this.commands ? this.commands.split(",").map((cmd) => cmd.trim()) : [""],
            options: [this.selectedOptions],
          };
        } else {
          alert("Uploaded folder is empty.");
          this.transform = false;
          return;
        }

        // Start transformation and then reset the selected options
        const transformationProcessId = await callAnalysisManagerTransformation(tsdm);
        this.transformationProcesses.push(transformationProcessId);
        const statusMessage = await pollTransformationProcessStatusForResult(transformationProcessId, 10);

        if (statusMessage) {
          this.lastTransformations.push({ name: transformationProcessName, id: transformationProcessId });
          localStorage.setItem("lastTransformations", JSON.stringify(this.lastTransformations));
          this.transform = false;
          this.updateStatus();

          const wineryPath = statusMessage.path;
          console.log("Winery path 1: " + wineryPath);
          this.viewTabs.push({
            name: transformationProcessName,
            id: transformationProcessId,
          });
          this.selectedTab = transformationProcessId; // Automatically select the new tab

          // Reset the flatten option
          this.selectedOptions = "flatten=false";
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
        this.status.color = "rgba(var(--v-theme-primary), var(--v-high-emphasis-opacity))";
      } else if (this.error) {
        this.status.icon = "fas fa-exclamation-triangle";
        this.status.message = "An error occurred during transformation.";
        this.status.color = "rgba(var(--v-theme-error), var(--v-high-emphasis-opacity))";
      } else {
        this.status.icon = "fas fa-cloud-arrow-up";
        this.status.message = "To start upload a file or folder.";
        this.status.color = "rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))";
      }
    },
    toggleTheme() {
      var themeName = this.theme.global.current.dark ? 'catppuccinLatteTheme' : 'catppuccinFrappeTheme';
      this.theme.global.name = themeName;
      localStorage.setItem("theme", JSON.stringify(themeName));
    },
  },
};
</script>

<style scoped>
:deep(.v-toolbar__extension) {
  background-color: rgb(var(--v-theme-extension));
}
.documentation-iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>