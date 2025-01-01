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
                <v-tabs align-with-title>
                    <v-tab>Start</v-tab>
                </v-tabs>
            </template>
        </v-app-bar>
        <v-main>
            <v-tabs-window>
                <v-tabs-window-item>
                    <v-card>
                    </v-card>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-main>
    </v-app>
</template>