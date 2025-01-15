/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Import Catppuccin Latte and Frappé palettes
import { flavors } from '@catppuccin/palette'

// Composables
import { aliases, fa } from 'vuetify/iconsets/fa'
import { createVuetify } from 'vuetify'

const latte = flavors.latte.colors
const frappe = flavors.frappe.colors

const catppuccinLatteTheme = {
  dark: false,
  colors: {
    primary: latte.teal.hex,
    secondary: latte.rosewater.hex,
    accent: latte.flamingo.hex,
    error: latte.red.hex,
    info: latte.sky.hex,
    success: latte.mauve.hex,
    warning: latte.yellow.hex,
    background: latte.base.hex,
    surface: latte.crust.hex,
  },
};

const catppuccinFrappeTheme = {
  dark: true,
  colors: {
    primary: frappe.teal.hex,
    secondary: frappe.rosewater.hex,
    accent: frappe.flamingo.hex,
    error: frappe.red.hex,
    info: frappe.sky.hex,
    success: frappe.mauve.hex,
    warning: frappe.yellow.hex,
    background: frappe.base.hex,
    surface: frappe.crust.hex,
  },
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
  theme: {
    defaultTheme: 'catppuccinLatteTheme',
    themes: {
      catppuccinLatteTheme,
      catppuccinFrappeTheme
    },
  },
})
