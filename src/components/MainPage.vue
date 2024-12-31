<template>
    <v-card>
        <v-toolbar color="primary" extended>
            <v-toolbar-title>DeMAF</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-file-input label="File" variant="outlined"></v-file-input>
            <v-spacer></v-spacer>
            <v-select label="Technology" :items="['Helm', 'Kubernetes']" variant="outlined"></v-select>
            <v-spacer></v-spacer>
            <v-select clearable label="Options" :items="['flat', 'partial']" multiple variant="outlined"></v-select>
            <v-spacer></v-spacer>
            <v-text-field label="Commands" variant="outlined"></v-text-field>
            <v-spacer></v-spacer>
            <v-btn rounded="LG">Transform</v-btn>
            <v-spacer></v-spacer>
            <template v-slot:extension>
                <v-tabs>
                    <v-tab>Start</v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-tabs-window></v-tabs-window>
    </v-card>
</template>