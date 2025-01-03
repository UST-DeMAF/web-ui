<template>
    <v-app>
        <v-app-bar color="primary" prominent>
            <v-app-bar-title>DeMAF</v-app-bar-title>
            <v-row></v-row>
            <v-row>
                <v-file-input label="File" min-width="200px" variant="outlined"></v-file-input>
                <v-spacer></v-spacer>
                <v-select label="Technology" :items="['Helm', 'Kubernetes']" min-width="150px"
                    variant="outlined"></v-select>
                <v-spacer></v-spacer>
                <v-select clearable label="Options" :items="['flat', 'partial']" min-width="150px" multiple
                    variant="outlined"></v-select>
                <v-spacer></v-spacer>
                <v-text-field label="Commands" min-width="200px" variant="outlined"></v-text-field>
            </v-row>
            <v-spacer></v-spacer>
            <v-btn rounded="LG">Transform</v-btn>
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
    data: () => ({
      tab: null,
    }),
  }
</script>