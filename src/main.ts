/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

fetch('/config.json')
    .then(response => response.json())
    .then(config => { app.config.globalProperties.$runtimeConfig = config })
    .catch(errror => console.error('Failed to load configuration file: ', errror))

registerPlugins(app)

app.mount('#app')
