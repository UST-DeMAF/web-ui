<template>
  <v-app>
    <v-app-bar color="primary" height="55">
      <v-app-bar-nav-icon class="ml-3" icon="fas fa-diagram-project" size="small" />
      <v-app-bar-title class="mx-0 small-caps text-h5"
        style="min-width: 120px; max-width: 120px;">DeMAF</v-app-bar-title>
      <v-spacer />
      <div class="mr-3 ml-2" style="min-width: 168px; max-width: 168px; text-align: end;">
        <v-btn icon="fas fa-book" size="small" @click="openDocumentation" />
        <v-btn v-if="theme.global.current.dark" icon="fas fa-moon" size="small" @click="toggleTheme" />
        <v-btn v-if="!theme.global.current.dark" icon="fas fa-sun" size="small" @click="toggleTheme" />
      </div>
      <template v-slot:extension>
        <v-tabs align-with-title v-model="selectedTab">
          <v-tab value="Start">
            <v-icon class="mr-2" icon="fas fa-house" size="small" />
            Start
          </v-tab>
          <v-tab :style="{ 'display': docDisplayStyle }" value="Documentation">
            <v-icon class="mr-2" icon="fas fa-book" size="small" />
            Documentation
            <v-btn icon="fas fa-xmark" size="x-small" variant="plain" @click.stop="closeDocumentation" />
          </v-tab>
          <v-tab v-for="(tab, t) in viewTabs" :key="t" :value="tab.id">
            {{ tab.name }}
            <template v-slot:append>
              <v-btn icon="fas fa-xmark" size="x-small" variant="plain" @click.stop="closeTab(tab.id)" />
            </template>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <v-tabs-window class="h-100" v-model="selectedTab">
        <v-tabs-window-item class="h-100" value="Start">
          <StartTab :_lastTransformations="this.lastTransformations" :_selectedTab="this.selectedTab"
            :_session="this.session" :_viewTabs="this.viewTabs" @openTrans="openTrans" @removeTrans="removeTrans" />
        </v-tabs-window-item>
        <v-tabs-window-item v-for="(tab, t) in viewTabs" :key="t" :value="tab.id">
          <ViewTab :_showTADM="false" :_transformationProcessId="tab.id" />
        </v-tabs-window-item>
        <v-tabs-window-item value="Documentation">
          <v-container class="my-2" height="calc(100vh - 103px - 16px)">
            <iframe class="rounded-lg w-100 h-100 border-none" src="https://ust-demaf.github.io/web-ui/" />
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
  generateSessionId,
} from "@/services/transformationService";

export default {
  created() {
    this.initializeSession();
  },
  data() {
    return {
      docDisplayStyle: "none",
      lastTransformations: [
        { name: "test1", id: "1234" },
        { name: "test2", id: "5678" },
        { name: "test3", id: "9012" },
      ],
      selectedTab: "Start",
      session: null,
      viewTabs: [],
      theme: useTheme(),
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
</style>