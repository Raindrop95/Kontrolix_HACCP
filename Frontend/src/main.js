import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import QrCodeScanner from './components/QrCodeScanner.vue'
import Scanner from './components/Scanner.vue'
import HandScanner from './components/HandScanner.vue'
import DetailsCard from './components/QrCodeDetailsFood.vue'
import store from './store'
import kontrolix_api from './services/kontrolix_api.service'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fa } from 'vuetify/iconsets/fa'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'

import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import VueApexCharts from 'vue3-apexcharts'
import { createI18n } from 'vue-i18n'
const vuetify = createVuetify({
  theme: {
    dark: false
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      fa
    }
  },
  components,
  directives
})
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'de',
  messages: {
    en: {
      message: {
        // General
        FoodCategory: 'Food',
        WorkspaceCategory: 'Workspace',
        LocationsCategory: 'Location',
        // Tables
        TitleTable1: 'Active QR-Codes',
        Foodheader: '',

        //Navigation
        NavigationPoint1: 'Dashboard',
        NavigationPoint2: 'Active QR-Codes',
        NavigationPoint3: 'Deleted QR-Codes',
        NavigationPoint4: 'Documentation',
        NavigationPoint5: 'Shop',
        NavigationPoint6: 'Company Settings',
        NavigationPoint7: 'User Settings',
        ScanFuncitonBtn: 'Scan QR-Code',
        LogoutBtn: 'Logout',
        //Dashboard
        MsgWelcome: 'Welcome Back',
        MsgWelcomeSub:
          'Here you can find all important statistics about your QR Codes and its registered articles.',
        DashField1: 'Active QR-Codes',
        DashField2: 'Unused QR-Codes',
        DashField3: 'Expire Withing 7 Days',
        DashField4: 'Expired',
        DashField5: 'QR-Codes In Use',
        DashField6: 'QR-Code Distribution',
        DashField7: 'Food Statistic',
        DashField8: 'Scanned QR-Codes',
        DashField9: 'Added QR-Codes',
        DashFieldSub1: 'current week'
      }
    },
    de: {
      message: {
        hello: 'Wilkommen zurück '
      }
    }
  }
})
const app = createApp(App).use(vuetify)
app.component('QrCodeScanner', QrCodeScanner)
app.component('Scanner', Scanner)
app.component('HandScanner', HandScanner)
app.component('DatilsCard', DetailsCard)
app.use(VueApexCharts)
app.use(i18n)
app.use(router)
app.use(kontrolix_api)
app.use(store)
app.mount('#app')
