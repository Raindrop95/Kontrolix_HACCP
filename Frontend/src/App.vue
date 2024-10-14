<template>
  <v-app app>
    <!-- <v-navigation-drawer>
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer> -->

    <NavBar v-if="!$route.meta.hideNavbar" />

    <v-main
      class="d-flex align-top justify-top"
      style="min-height: 300px; width: 100vw; background-color: #eaebef"
    >
      <router-view></router-view>
    </v-main>
    <!-- <MobileNavBar v-if="!$route.meta.hideNavbar && !mobile" /> -->
  </v-app>
</template>
<script setup>
import { useDisplay } from 'vuetify'

const { width, mobile } = useDisplay()
</script>
<script>
//import HelloWorld from "./components/HelloWorld";
import QrCodeScanner from './components/QrCodeScanner.vue'
import Scanner from './components/Scanner.vue'
import HandScanner from './components/HandScanner.vue'
import NavBar from './components/AppBar.vue'
import MobileNavBar from './components/MobileAppBar.vue'

import { RouterLink, RouterView } from 'vue-router'
export default {
  props: {
    ReadQrCode: {
      type: String
    }
  },
  name: 'App',
  components: {
    QrCodeScanner,
    Scanner,
    NavBar,
    HandScanner,
    MobileNavBar
  },
  data() {
    return {
      menuItems: [
        { title: 'Dashboard', path: '/dashboard', icon: '' },
        { title: 'QR-Codes', path: '/qrcode', icon: '' },
        { title: 'History', path: '/history', icon: '' },
        { title: 'Company', path: '/company', icon: '' },
        { title: 'Logout', path: '/', icon: 'mdi-logout-variant' }
      ]
    }
  },
  methods: {}
}
</script>
<style scoped></style>
