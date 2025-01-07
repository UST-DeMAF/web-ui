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
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-tabs-window v-model="selectedTab">
        <v-tabs-window-item value="start">
          <v-row>
            <v-col align-self="center" cols="2">
              <v-container>
                <v-card title="Last transformations">
                  <v-list v-model="selectedTransformation" color="primary">
                      <v-list-item v-for="(transformation, t) in lastTransformations" :key="t" :value="transformation">
                         <template v-slot:prepend>
                          <v-icon>far fa-file</v-icon>
                        </template>
                          <v-list-item-title>{{transformation}}</v-list-item-title>
                      </v-list-item>
                  </v-list>
                </v-card>
              </v-container>
            </v-col>
            <v-col align-self="center" cols="8">
              <v-container>
                <v-row>
                  <v-icon size="64px">{{ statusIcon }}</v-icon>
                </v-row>
                <v-row>{{ statusMessage }}</v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-main>
  </v-app>
</template>

<script>
export default {
  created() {
    this.getRegisteredPlugins();
  },
  data() {
    return {
      error: false, // Data property to store the error status
      commands: "", // Data property to store the commands
      lastTransformations: [], // Data property to store the last transformations
      uploadedFile: null, // Data property to store the uploaded file
      statusIcon: "fas fa-cloud-arrow-up", // Data property to store the status icon
      statusMessage: "To start drag and drop or upload a file.", // Data property to store the status message
      selectedTechnology: null, // Data property to store the selected technology
      selectedTransformation: null, // Data property to store the selected transformation
      selectedOptions: [], // Data property to store the selected options
      selectedTab: null, // Data property to store the selected tab
      technologies: ["helm", "kubernetes", "terraform"], // Data property to store the available technologies
      transform: false, // Data property to store the transformation status
    };
  },
  methods: {
    handleFileUpload() {
      if (this.uploadedFile) {
        // Access the uploaded file here
        console.log("uploaded file: " + this.uploadedFile.name);
      }
    },
    async getRegisteredPlugins() {
      console.log("Getting registered plugins");
      try {
        const response = await fetch("http://localhost:8080/demaf/plugins", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to get registered plugins");
        }

        const data = await response.json();
        this.technologies = data.pluginNames;

        console.log("Registered extensions successfully received.");
      } catch (error) {
        console.error("Error getting registered plugins:", error);
      }
    },
    async startTransformation() {
      console.log("Transformation started");
      console.log("Selected Technology: " + this.selectedTechnology);
      console.log("Selected Options: " + this.selectedOptions);
      console.log("Commands: " + this.commands);

      // Check if all fields have been filled out
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
      // Save the uploaded file for transformation
      await this.saveUploadedFileForTransformation();
    },
    async saveUploadedFileForTransformation() {
      if (!this.uploadedFile) {
        return;
      }

      // Save the uploaded file for transformation
      console.log("Saving uploaded file for transformation");

      const formData = new FormData();
      formData.append("file", this.uploadedFile);

      //BUG: fails if transformation is called a second time
      try {
        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        console.log("File uploaded successfully");

        // Call the transform endpoint after the file is uploaded
        await this.callAnalysisManagerTransformation();
      } catch (error) {
        this.error = true;
        this.updateStatus();
        console.error("Error uploading file:", error);
      }
    },
    async updateStatus() {
      if (this.transform && !this.error) {
        this.statusIcon = "fas fa-gear fa-spin";
        this.statusMessage =
          "Transform " +
          this.uploadedFile.name +
          " this may take a few moments.";
      } else if (this.error) {
        this.statusIcon = "fas fa-exclamation-triangle";
        this.statusMessage = "An error has occurred during the transformation.";
      } else {
        this.statusIcon = "fas fa-cloud-arrow-up";
        this.statusMessage = "To start drag and drop or upload a file.";
      }
    },
    async callAnalysisManagerTransformation() {
      const tsdm = {
        technology: this.selectedTechnology.toLowerCase(), // Convert to lowercase
        locationURL: "file://./usr/share/" + this.uploadedFile.name, // Use file:// protocol
        commands: this.commands
          ? this.commands.split(",").map((cmd) => cmd.trim())
          : [""], // Ensure commands is an array of strings
        options: this.selectedOptions,
      };

      try {
        const response = await fetch("http://localhost:8080/demaf/transform", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tsdm),
        });

        if (!response.ok) {
          throw new Error("Failed to start transformation process");
        }

        const data = await response.json();
        console.log("Transformation process started with ID:", data);
      } catch (error) {
        this.error = true;
        this.updateStatus();
        console.error("Error starting transformation process:", error);
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