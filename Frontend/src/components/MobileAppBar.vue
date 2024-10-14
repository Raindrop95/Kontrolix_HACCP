<template>
  <v-navigation-drawer v-model="showNav" style="width: 100vw">
    <v-list-item>
      <v-row>
        <v-col align="center">
          <img class="mr-3" src="../assets/logo/Logo_SVG_BLACK.png" height="40" />
        </v-col>
        <v-col align="right">
          <v-btn
            @click="showNav = !showNav"
            size="small"
            color="primary"
            variant="tonal"
            icon="mdi-close"
          ></v-btn
        ></v-col>
      </v-row>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
      <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-row
    ><v-col align="right" style="position: fixed; top: 0px; margin: 10px">
      <v-btn color="primary" @click.stop="showNav = !showNav" icon="mdi-menu"> </v-btn
    ></v-col>
  </v-row>
</template>
<script>
//import HelloWorld from "./components/HelloWorld";

export default {
  name: 'App',
  data() {
    return {
      showNav: true,
      navItems: [
        { title: 'Dashboard', path: '/dashboard', icon: '' },
        { title: 'QR-Codes', path: '/qrcode', icon: '' },
        { title: 'History', path: '/history', icon: '' },
        { title: 'Company', path: '/company', icon: '' }
      ]
    }
  },
  methods: {
    logoutUser() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped></style>
