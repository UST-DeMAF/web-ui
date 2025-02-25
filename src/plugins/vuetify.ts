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
    background: latte.base.hex,
    surface: latte.crust.hex,
    'surface-bright': latte.surface0.hex,
    'surface-light': latte.surface1.hex,
    'surface-variant': latte.surface2.hex,
    'on-surface-variant': latte.overlay0.hex,
    primary: latte.teal.hex,
    secondary: latte.rosewater.hex,
    error: latte.maroon.hex,
    info: latte.sky.hex,
    success: latte.green.hex,
    warning: latte.yellow.hex,

    // Custom colors
    extension: "#40ADB4",
    // 'info-tooltip': '#86C8E7',
    'on-info-tooltip': latte.text.hex,
    'on-error-tooltip': latte.base.hex,

    // Text colors
    'on-primary': latte.base.hex,
    'on-background': latte.text.hex,
    'on-surface': latte.text.hex,
    'on-surface-bright': latte.text.hex,
    'on-surface-light': latte.text.hex,
    'on-secondary': latte.base.hex,
    'on-error': latte.base.hex,
    'on-info': latte.base.hex,
    'on-success': latte.base.hex,
    'on-warning': latte.base.hex,
  },
  variables: {
    'border-color': latte.overlay1.hex,
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': latte.text.hex,
    'theme-on-kbd': latte.base.hex,
    'theme-code': latte.overlay0.hex,
    'theme-on-code': latte.text.hex,
  }
};

const catppuccinFrappeTheme = {
  dark: true,
  colors: {
    background: frappe.base.hex,
    surface: frappe.crust.hex,
    'surface-bright': frappe.surface0.hex,
    'surface-light': frappe.surface1.hex,
    'surface-variant': frappe.surface2.hex,
    'on-surface-variant': frappe.overlay0.hex,
    primary: frappe.teal.hex,
    secondary: frappe.rosewater.hex,
    error: frappe.maroon.hex,
    info: frappe.blue.hex,
    success: frappe.green.hex,
    warning: frappe.yellow.hex,

    // Custom colors
    extension: '#66ADA3',
    // 'info-tooltip': '#6275A4',
    'on-info-tooltip': frappe.text.hex,
    'on-error-tooltip': frappe.base.hex,

    // Text colors
    'on-primary': frappe.base.hex,
    'on-background': frappe.text.hex,
    'on-surface': frappe.text.hex,
    'on-surface-bright': frappe.text.hex,
    'on-surface-light': frappe.text.hex,
    'on-secondary': frappe.base.hex,
    'on-error': frappe.base.hex,
    'on-info': frappe.base.hex,
    'on-success': frappe.base.hex,
    'on-warning': frappe.base.hex,
  },
  variables: {
    'border-color': frappe.overlay1.hex,
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': frappe.text.hex,
    'theme-on-kbd': frappe.base.hex,
    'theme-code': frappe.overlay0.hex,
    'theme-on-code': frappe.text.hex,
  }
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
    variations: {
      colors: ['primary', 'secondary'],
      lighten: 1,
      darken: 1,
    },
    themes: {
      catppuccinLatteTheme,
      catppuccinFrappeTheme
    },
  },
})
