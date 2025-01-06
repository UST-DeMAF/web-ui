<template>
    <v-app>
        <v-app-bar color="primary" prominent>
            <v-app-bar-title>DeMAF</v-app-bar-title>
            <v-row></v-row>
            <v-row>
                <v-file-input v-model="uploadedFile" label="File" min-width="200px" variant="outlined"></v-file-input>
                <v-spacer></v-spacer>
                <v-select v-model="selectedTechnology" label="Technology" :items="['Helm', 'Kubernetes', 'Terraform']" min-width="150px"
                    variant="outlined"></v-select>
                <v-spacer></v-spacer>
                <v-select v-model="selectedOptions" clearable label="Options" :items="['flat', 'partial']" min-width="150px" multiple
                    variant="outlined"></v-select>
                <v-spacer></v-spacer>
                <v-text-field v-model="commands" label="Commands" min-width="200px" variant="outlined"></v-text-field>
            </v-row>
            <v-spacer></v-spacer>
            <v-btn rounded="LG" @click="startTransformation">Transform</v-btn>
            <v-spacer></v-spacer>
            <template v-slot:extension>
                <v-tabs align-with-title v-model="tab">
                    <v-tab value="start">Start</v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-main>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="start">
                    <v-row>
                        <v-col align-self="center" cols="2">
                            <v-container>
                                <v-card>
                                    <v-card-title>Last transformations:</v-card-title>
                                    <v-card-text>
                                        Test
                                    </v-card-text>
                                </v-card>
                            </v-container>
                        </v-col>
                        <v-col align-self="center" cols="8">
                            <v-container>
                                <v-row>
                                    <v-icon icon="fas fa-cloud-arrow-up" size="64px" />
                                </v-row>
                                <v-row>
                                    To start drag and drop or upload a file.
                                </v-row>
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
    data() {
      return {
        tab: null,
        uploadedFile: null, // Data property to store the uploaded file
        selectedTechnology: null, // Data property to store the selected technology
        selectedOptions: [], // Data property to store the selected options
        commands: '', // Data property to store the commands
      };
    },
    methods: {
      handleFileUpload() {
        if (this.uploadedFile) {
          // Access the uploaded file here
          console.log("uploaded file: " + this.uploadedFile.name);
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
        formData.append('file', this.uploadedFile);


        //BUG: fails if transformation is called a second time
        try {
          const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload file');
          }

          console.log('File uploaded successfully');

          // Call the transform endpoint after the file is uploaded
          await this.callAnalysisManagerTransformation();
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      },
      async callAnalysisManagerTransformation() {
        const tsdm = {
          technology: this.selectedTechnology.toLowerCase(), // Convert to lowercase
          locationURL: 'file://./usr/share/' + this.uploadedFile.name, // Use file:// protocol
          commands: this.commands ? this.commands.split(',').map(cmd => cmd.trim()) : [''], // Ensure commands is an array of strings
          options: this.selectedOptions,
        };

        try {
          const response = await fetch('http://localhost:8080/demaf/transform', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tsdm),
          });

          if (!response.ok) {
            throw new Error('Failed to start transformation process');
          }

          const data = await response.json();
          console.log('Transformation process started with ID:', data);
        } catch (error) {
          console.error('Error starting transformation process:', error);
        }
      }
    },
    watch: {
      uploadedFile(newFile) {
        this.handleFileUpload();
      }
    }
  }
</script>