<template>
  <v-row
    class="h-100"
    no-gutters
  >
    <v-col
      class="fit-content-container ma-2 mb-auto"
      align-self="center"
    >
      <v-container>
        <v-card
          class="border-md border-primary rounded-lg"
          title="Last transformations"
          density="compact"
          flat
        >
          <v-list
            class="pa-0 py-2 border-t-md"
            color="primary"
          >
            <v-list-item
              v-for="(transformation, t) in lastTransformations"
              :key="t"
              class="ma-2 border-md rounded-pill"
              :value="transformation.id"
              @click="openTrans(transformation.id)"
            >
              <template #prepend>
                <v-icon>far fa-file</v-icon>
              </template>
              <v-list-item-title>{{ transformation.name }}</v-list-item-title>
              <template #append>
                <v-btn
                  icon="fas fa-xmark"
                  size="x-small"
                  variant="plain"
                  @click.stop="removeTrans(transformation.id)"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </v-col>
    <v-col
      class="my-4 px-6 flex-grow-1"
      style="margin-top: 10vh !important;"
    >
      <v-container class="mx-auto pa-0 pt-3 pb-4 border-md border-primary rounded-lg w-100 w-md-75 w-lg-50">
        <h4 class="mb-4 pb-2 text-h6 text-center border-b-md">
          Deployment Model Transformation
        </h4>

        <v-text-field
          v-if="showFileInput"
          v-model="fileName"
          class="mx-2 my-4 px-4"
          color="primary"
          label="File"
          placeholder="No file selected"
          readonly
          variant="outlined"
          hide-details
          prepend-icon="fas fa-file"
        />

        <v-tooltip
          content-class="tooltip-info text-center"
          offset="-4"
          location="start"
        >
          <template #activator="{ props }">
            <div
              class="mx-2 my-4 px-4 flex-grow-0"
              v-bind="props"
            >
              <v-text-field
                v-if="showFolderInput"
                v-model="startFilePath"
                color="primary"
                label="Start file"
                placeholder="Relative path to main file"
                :prefix="folderPrefix"
                variant="outlined"
                hide-details
                prepend-icon="fas fa-folder"
              />
            </div>
          </template>

          <span>
            Leave this blank or use <code>*</code> to use all uploaded files,<br>
            or specify the <i>main entrypoint</i>, relative to the uploaded folder.<br>
            This is the file which is used to start the deployment model.<br>
            For example, <i>Terraform</i> usually has a main file called <code>main.tf</code>.
          </span>
        </v-tooltip>

        <input
          ref="fileInput"
          class="d-none mx-2 my-4 px-4"
          type="file"
          name="file"
          @change="handleFileUpload"
        >
        <input
          ref="folderInput"
          class="d-none mx-2 my-4 px-4"
          type="file"
          name="files"
          webkitdirectory
          multiple
          @change="handleFolderUpload"
        >

        <v-row
          class="ma-n2 px-4"
          align="center"
          justify="center"
        >
          <v-btn
            class="mx-4 my-2 ml-lg-auto"
            rounded="LG"
            color="primary"
            variant="tonal"
            prepend-icon="fas fa-file"
            @click="selectFile"
          >
            Select File
          </v-btn>
          <v-btn
            class="mx-4 my-2 mr-lg-auto"
            rounded="LG"
            color="primary"
            variant="tonal"
            prepend-icon="fas fa-folder"
            @click="selectFolder"
          >
            Select Folder
          </v-btn>
        </v-row>

        <v-tooltip
          content-class="tooltip-info text-center"
          offset="-4"
          location="start"
        >
          <template #activator="{ props }">
            <div
              class="mx-2 my-4 px-4 flex-grow-0"
              v-bind="props"
            >
              <v-select
                v-model="selectedTechnology"
                color="primary"
                label="Technology"
                min-width="148px"
                :items="technologies"
                variant="outlined"
                hide-details
              />
            </div>
          </template>

          <span>
            Select which Deployment Model <i>Technology</i> you're using.<br>
            This lists all available plugins.
          </span>
        </v-tooltip>

        <v-tooltip
          content-class="tooltip-info text-center"
          offset="-4"
          location="start"
        >
          <template #activator="{ props }">
            <div
              class="mx-2 my-4 px-4 flex-grow-0"
              v-bind="props"
            >
              <v-text-field
                v-model="commands"
                color="primary"
                label="Deployment Command(s)"
                min-width="120px"
                variant="outlined"
                hide-details
              />
            </div>
          </template>

          <span>
            <i>Optional:</i>
            Specify the command which is used to deploy the model.<br>
            (e.g., for Terraform, you can pass parameters for the execution plan)
          </span>
        </v-tooltip>

        <v-row
          class="ma-n2 px-4"
          align="center"
          justify="center"
        >
          <v-tooltip
            content-class="tooltip-info text-center"
            location="start"
            max-width="450px"
          >
            <template #activator="{ props }">
              <div
                class="mx-4 my-2 flex-grow-0 mr-lg-auto w-100 w-lg-60"
                v-bind="props"
              >
                <v-text-field
                  v-model="optionsInput"
                  color="primary"
                  label="Options"
                  variant="outlined"
                  hide-details
                />
              </div>
            </template>

            <span>
              <i>Optional:</i>
              Specify additional options for the transformation as a comma-separated list.<br>
              The following are the current available options:<br>
              <table class="mx-auto my-2 tooltip-table">
                <tbody>
                  <tr>
                    <td style="width: 35%;"><code>width=&lt;pixels&gt;</code></td>
                    <td>The width of the visualization<br>(default: <code>1080</code>)</td>
                  </tr>
                  <tr>
                    <td><code>height=&lt;pixels&gt;</code></td>
                    <td>The height of the visualization<br>(default: <code>1920</code>)</td>
                  </tr>
                  <tr>
                    <td><code>dpi=&lt;dots&gt;</code></td>
                    <td>The DPI of the visualization; choose <code>144</code> for high DPI monitors<br>(default:
                      <code>96</code>)
                    </td>
                  </tr>
                </tbody>
              </table>
              An example would be: <code>width=3840,height=2160,dpi=144</code>
            </span>
          </v-tooltip>

          <v-tooltip
            content-class="tooltip-info text-center"
            max-width="400px"
            location="end"
          >
            <template #activator="{ props }">
              <div
                class="mx-4 my-2 flex-grow-0 ml-lg-auto w-100 w-lg-25"
                v-bind="props"
              >
                <v-select
                  v-model="flatten"
                  color="primary"
                  label="Flatten"
                  :items="['false', 'true', 'partial']"
                  chips
                  variant="outlined"
                  hide-details
                />
              </div>
            </template>

            <span>
              There are three options for flattening the resulting visualization available:<br>
              <table class="mx-auto mt-2 tooltip-table">
                <tbody>
                  <tr>
                    <td><code>false</code></td>
                    <td>Not flattening at all</td>
                  </tr>
                  <tr>
                    <td><code>true</code></td>
                    <td>Maximal amount of flattening</td>
                  </tr>
                  <tr>
                    <td><code>partial</code></td>
                    <td>Some levels will be flattened</td>
                  </tr>
                </tbody>
              </table>
            </span>
          </v-tooltip>
        </v-row>

        <v-row
          class="ma-n2 px-4"
          align="center"
          justify="center"
        >
          <v-tooltip
            content-class="tooltip-error text-center"
            location="bottom"
            :disabled="uploadedFiles.length && selectedTechnology && (showFileInput || showFolderInput)"
          >
            <template #activator="{ props }">
              <div
                class="d-inline-block mx-4 my-2 ml-lg-auto"
                v-bind="props"
              >
                <v-btn
                  color="primary"
                  :disabled="(!uploadedFiles.length || !selectedTechnology) || transform"
                  rounded="LG"
                  v-bind="props"
                  flat
                  @click="startTransformation"
                >
                  Transform
                </v-btn>
              </div>
            </template>

            <span>
              <p v-if="!uploadedFiles.length">
                Please <i>upload a file or folder</i>.
              </p>
              <p v-if="!selectedTechnology">
                Please <i>select a technology</i>.
              </p>
            </span>
          </v-tooltip>

          <v-tooltip
            content-class="tooltip-info text-center"
            offset="0"
            max-width="300px"
            location="bottom"
          >
            <template #activator="{ props }">
              <div
                class="mr-lg-auto"
                v-bind="props"
              >
                <v-checkbox
                  v-model="storeSettings"
                  label="Store Settings"
                  color="primary"
                  hide-details
                />
              </div>
            </template>

            <span>
              Whether to store the current settings after the transformation.<br>
              This includes the <i>selected file/folder</i>, <i>start file</i>, <i>technology</i>, <i>options</i>, and
              <i>commands</i>.<br><br>
              <strong class="text-error text-decoration-underline">Careful:</strong> This will overwrite the currently
              saved
              settings!
            </span>
          </v-tooltip>
        </v-row>
      </v-container>

      <v-container
        v-if="transform || error"
        class="mt-8"
      >
        <v-row>
          <v-spacer />
          <v-icon
            :style="{ color: status.color }"
            size="64px"
          >
            {{ status.icon }}
          </v-icon>
          <v-spacer />
        </v-row>

        <v-row
          class="text-sm-h7 text-md-h6"
          :style="{ color: status.color }"
        >
          <v-spacer />
          <p>
            {{ status.message }}
          </p>
          <v-spacer />
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import {
  checkTotalSize,
  getRegisteredPlugins,
  handleSingleFileTransformation,
  handleMultipleFilesTransformation,
  moveToTADMS,
  startTransformationProcess
} from "@/services/transformationService";

export default {
  props: {
    _lastTransformations: Array, // Prop to store the last transformations
    _session: String, // Prop to store the session ID
    _viewTabs: Array,
  },
  data() {
    return {
      commands: "",
      error: false,
      flatten: "false",
      fileName: "",
      folderPrefix: "",
      lastTransformations: this._lastTransformations, // Data to store the last transformations
      longInterval: false,
      selectedOptions: [],
      optionsInput: "",
      pluginsInterval: null,
      pluginsTimer: null,
      selectedTechnology: null,
      session: this._session,
      showFileInput: false,
      showFolderInput: false,
      startFilePath: "", // Changed from startFileName to startFilePath
      status: {
        icon: "fas fa-cloud-arrow-up",
        message: "To start upload a file or folder.",
        color: "rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))",
      },
      storeSettings: false,
      technologies: [],
      transform: false,
      transformationProcesses: [],
      uploadedFiles: [],
      viewTabs: this._viewTabs
    };
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
  beforeUnmount() {
    // Clear the plugins interval
    if (this.pluginsInterval) {
      clearInterval(this.pluginsInterval);
    }
  },
  created() {
    this.loadRegisteredPlugins();
    this.pluginsInterval = setInterval(this.loadRegisteredPlugins, 10000);
    this.pluginsTimer = setTimeout(this.increasePluginsInterval, 180000);
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
    increasePluginsInterval() {
      console.log("Increasing plugins interval.");
      this.longInterval = true;
      clearInterval(this.pluginsInterval);
      this.pluginsInterval = setInterval(this.loadRegisteredPlugins, 60000);
    },
    async loadRegisteredPlugins() {
      try {
        const plugins = await getRegisteredPlugins();

        // Reset timer as long as the list of plugins changes and the short interval is still active
        if (!this.longInterval && plugins.length !== this.technologies.length) {
          console.log("Reset timer for plugins interval.");
          clearTimeout(this.pluginsTimer);
          this.pluginsTimer = setTimeout(this.increasePluginsInterval, 180000);
        }

        this.technologies = plugins;
        console.log("Registered extensions successfully received.");
      } catch (error) {
        console.error("Error while receiving registered extensions:", error);
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
      this.showFolderInput = false;
    },
    selectFolder() {
      // Trigger the folder input element
      this.$refs.folderInput.click();
      this.showFileInput = false;
      this.showFolderInput = true;
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
        let transformationProcessName;
        let tsdm;

        const options = this.selectedOptions; // Create a copy of selectedOptions
        options.push("flatten=" + this.flatten);

        console.log("Selected options: " + options);

        const technology = this.selectedTechnology === "TADM" ? "visualization-service" : this.selectedTechnology;

        if (this.uploadedFiles.length === 1) {
          ({ transformationProcessName, tsdm } = await handleSingleFileTransformation(
            this.uploadedFiles[0],
            this.session,
            technology,
            this.commands,
            options
          ));
        } else if (this.uploadedFiles.length > 1) {
          ({ transformationProcessName, tsdm } = await handleMultipleFilesTransformation(
            this.uploadedFiles,
            this.session,
            technology,
            this.commands,
            options,
            this.startFilePath
          ));
        } else {
          alert("Uploaded folder is empty.");
          this.transform = false;
          return;
        }

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

          if (technology === "visualization-service") {
            await moveToTADMS(this.uploadedFiles[0].name, this.session, transformationProcessId);
          }

          this.openTrans(transformationProcessId); // Automatically select the new tab
        } else {
          this.error = true;
          this.updateStatus();
        }
      } catch (error) {
        console.log(error);
        this.error = true;
        this.updateStatus();
      } finally {
        this.transform = false;

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
          this.showFolderInput = false;
          this.startFilePath = "";
        }
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
