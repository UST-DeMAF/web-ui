<template>
  <v-row class="h-100" no-gutters>
    <v-col class="fit-content-container ma-2 mb-auto" align-self="center">
      <v-container>
        <v-card class="border-md border-primary rounded-lg" title="Last transformations" density="compact" flat>
          <v-list class="pa-0 py-2 border-t-md" color="primary">
            <v-list-item class="ma-2 border-md rounded-pill" v-for="(transformation, t) in lastTransformations" :key="t" :value="transformation.id" @click="openTrans(transformation.id)">
              <template v-slot:prepend>
                <v-icon>far fa-file</v-icon>
              </template>
              <v-list-item-title>{{ transformation.name }}</v-list-item-title>
              <template v-slot:append>
                <v-btn icon="fas fa-xmark" size="x-small" variant="plain" @click.stop="removeTrans(transformation.id)"/>
                </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </v-col>
    <v-col class="my-4 px-6 flex-grow-1" style="margin-top: 10vh !important;">
      <v-container class="mb-8">
        <v-row>
          <v-spacer/>
          <v-icon :style="{ color: status.color }" size="64px">
            {{ status.icon }}
          </v-icon>
          <v-spacer/>
        </v-row>

        <v-row class="text-sm-h7 text-md-h6" :style="{ color: status.color }">
          <v-spacer/>
          <p>
            {{ status.message }}
          </p>
          <v-spacer/>
        </v-row>
      </v-container>

      <v-container class="mx-auto pa-0 pt-3 pb-4 border-md border-primary rounded-lg w-100 w-md-75 w-lg-50">
        <h4 class="mb-4 pb-2 text-h6 text-center border-b-md">
          TSDM Transformation
        </h4>

        <v-text-field class="mx-2 my-4 px-4" color="primary" label="File" placeholder="No file selected" readonly variant="outlined" hide-details prepend-icon="fas fa-file" v-model="fileName" v-if="showFileInput"/>

        <v-text-field class="mx-2 my-4 px-4 flex-grow-0" color="primary" label="Start file" placeholder="Relative path to main file" :prefix="folderPrefix" variant="outlined" hide-details prepend-icon="fas fa-folder" v-model="startFilePath" v-if="showStartFileInput"/>

        <input class="d-none mx-2 my-4 px-4" type="file" name="file" @change="handleFileUpload" ref="fileInput">
        <input class="d-none mx-2 my-4 px-4" type="file" name="files" webkitdirectory multiple @change="handleFolderUpload" ref="folderInput">

        <v-row class="ma-n2 px-4" align="center" justify="center">
          <v-btn class="mx-4 my-2 ml-lg-auto" rounded="LG" @click="selectFile" color="primary" variant="tonal" prepend-icon="fas fa-file">
            Select File
          </v-btn>
          <v-btn class="mx-4 my-2 mr-lg-auto" rounded="LG" @click="selectFolder" color="primary" variant="tonal" prepend-icon="fas fa-folder">
            Select Folder
          </v-btn>
        </v-row>
        
        <v-select class="mx-2 my-4 px-4 flex-grow-0" color="primary" v-model="selectedTechnology" label="Technology" min-width="148px" :items="technologies" variant="outlined" hide-details/>

        <v-row class="ma-n2 px-4" align="center" justify="center">
          <v-text-field class="mx-4 my-2 flex-grow-0 mr-lg-auto w-100 w-lg-60" color="primary" v-model="optionsInput" label="Options" variant="outlined" hide-details/>
          <v-select class="mx-4 my-2 flex-grow-0 ml-lg-auto w-100 w-lg-25" color="primary" v-model="flatten" label="Flatten" :items="['false', 'true', 'partial']" chips variant="outlined" hide-details/>
        </v-row>
        
        <v-text-field class="mx-2 my-4 px-4 flex-grow-0" color="primary" v-model="commands" label="Commands" min-width="120px" variant="outlined" hide-details/>

        <v-row class="ma-n2 px-4" align="center" justify="center">
          <v-btn class="mx-4 my-2 ml-lg-auto" color="primary" rounded="LG" @click="startTransformation" flat>
            Transform
          </v-btn>

          <v-checkbox class="mr-lg-auto" v-model="storeSettings" label="Store settings" color="primary" hide-details/>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import {
  getRegisteredPlugins,
  // saveUploadedFileForTransformation,
  // saveUploadedFilesForTransformation,
  // callAnalysisManagerTransformation,
  // pollTransformationProcessStatusForResult,
  handleSingleFileTransformation,
  handleMultipleFilesTransformation,
  startTransformationProcess,
  checkTotalSize
} from "@/services/transformationService";

export default {
  created() {
    this.loadRegisteredPlugins();
  },
  data() {
    return {
      commands: "",
      error: false,
      flatten: "false",
      fileName: "",
      folderPrefix: "",
      lastTransformations: this._lastTransformations, // Data to store the last transformations
      selectedOptions: [],
      optionsInput: "",
      selectedTechnology: null,
      session: this._session,
      showFileInput: false,
      showStartFileInput: false,
      startFilePath: "", // Changed from startFileName to startFilePath
      status: {
        icon: "fas fa-cloud-arrow-up",
        message: "To start upload a file or folder.",
        color: "rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))",
      },
      storeSettings: false,
      technologies: ["helm", "kubernetes", "terraform"],
      transform: false,
      transformationProcesses: [],
      uploadedFiles: [],
      viewTabs: this._viewTabs
    };
  },
  methods: {
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      if (!checkTotalSize(files)) {
        alert("Total file size exceeds 50 MB. Please upload a smaller file.");
        return;
      }
      this.uploadedFiles = files;
      this.fileName = this.uploadedFiles[0].name;
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
    async loadRegisteredPlugins() {
      try {
        this.technologies = await getRegisteredPlugins();
        console.log("Registered extensions successfully received.");
      } catch (error) {
        console.log("Error while receiving registered extensions.");
      }
    },
    openTrans(value) {
      this.$emit("openTrans", value);
    },
    removeTrans(value) {
      this.$emit("removeTrans", value);
    },
    selectFile() {
      // Trigger the file input element
      this.$refs.fileInput.click();
      this.showFileInput = true;
      this.showStartFileInput = false;
    },
    selectFolder() {
      // Trigger the folder input element
      this.$refs.folderInput.click();
      this.showFileInput = false;
      this.showStartFileInput = true;
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

      try {
        var transformationProcessName;
        var tsdm;

        var options = this.selectedOptions; // Create a copy of selectedOptions
        options.push("flatten=" + this.flatten);

        console.log("Selected options: " + options);


        if (this.uploadedFiles.length === 1) {
          // await saveUploadedFileForTransformation(this.uploadedFiles[0], this.session);
          // transformationProcessName = this.uploadedFiles[0].name;
          // tsdm = {
          //   technology: this.selectedTechnology.toLowerCase(),
          //   locationURL: "file:/usr/share/uploads/" + this.session + "/" + transformationProcessName,
          //   commands: this.commands ? this.commands.split(",").map((cmd) => cmd.trim()) : [""],
          //   options: [this.selectedOptions],
          // };
          ({ transformationProcessName, tsdm } = await handleSingleFileTransformation(
            this.uploadedFiles[0],
            this.session,
            this.selectedTechnology,
            this.commands,
            options
          ));
        } else if (this.uploadedFiles.length > 1) {
          // const folderName = this.uploadedFiles[0].webkitRelativePath.split('/')[0];
          // const startFile = this.uploadedFiles.find(file => file.webkitRelativePath === `${folderName}/${this.startFilePath}`);
          // if (!startFile) {
          //   alert("Start file not found in the uploaded folder.");
          //   this.transform = false;
          //   this.updateStatus();
          //   return;
          // }
          // await saveUploadedFilesForTransformation(this.uploadedFiles, this.session);
          // console.log("Start file path:", startFile.webkitRelativePath);
          // transformationProcessName = startFile.webkitRelativePath.split('/').at(-1);
          // tsdm = {
          //   technology: this.selectedTechnology.toLowerCase(),
          //   locationURL: "file:/usr/share/uploads/" + this.session + "/" + startFile.webkitRelativePath,
          //   commands: this.commands ? this.commands.split(",").map((cmd) => cmd.trim()) : [""],
          //   options: [this.selectedOptions],
          // };
          ({ transformationProcessName, tsdm } = await handleMultipleFilesTransformation(
            this.uploadedFiles,
            this.session,
            this.selectedTechnology,
            this.commands,
            options,
            this.startFilePath
          ));
        } else {
          alert("Uploaded folder is empty.");
          this.transform = false;
          return;
        }

        // Start transformation and then reset the selected options
        // const transformationProcessId = await callAnalysisManagerTransformation(tsdm);
        // const statusMessage = await pollTransformationProcessStatusForResult(transformationProcessId, 10);
        const { transformationProcessId, statusMessage } = await startTransformationProcess(tsdm);
        this.transformationProcesses.push(transformationProcessId);

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
          this.openTrans(transformationProcessId); // Automatically select the new tab

          if (!this.storeSettings) {
            // Reset variables
            this.fileName = "";
            this.folderPrefix = "";
            this.flatten = "false";
            this.selectedTechnology = null;
            this.selectedOptions = [];
            this.optionsInput = "";
            this.commands = "";
            this.uploadedFiles = [];
            this.showFileInput = false;
            this.showStartFileInput = false;
          }
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
    }
  },
  props: {
    _lastTransformations: Array, // Prop to store the last transformations
    _session: String, // Prop to store the session ID
    _viewTabs: Array,
  },
  watch: {
    _lastTransformations: function (value) {
      this.lastTransformations = value;
    },
    _session: function (value) {
      this.session = value;
    },
    _viewTabs: function (value) {
      this.viewTabs = value;
    },
    optionsInput: function (value) {
      this.selectedOptions = value.split(",").map((opt) => opt.trim());
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
@media (min-width: 1280px) {
  :deep(.w-lg-60) {
    width: 60% !important;
  }
}
:deep(.v-chip) {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
