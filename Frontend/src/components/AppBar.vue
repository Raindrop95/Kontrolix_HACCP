<template>
  <v-app-bar :elevation="2" style="background-color: #1e1e1e; color: white" v-if="showNav">
    <v-app-bar-title>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <img align="center" class="mr-3" src="../assets/logo/Logo_SVG_BLACK.png" height="30" />
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn
        style="margin-left: 10px"
        flat
        :append-icon="item.icon"
        v-for="item in navItems"
        :key="item.title"
        :to="item.path"
        :disabled="item.disable"
      >
        {{ item.title }}
      </v-btn>
      <v-btn style="margin-left: 10px" flat append-icon="mdi-logout-variant" @click="logoutUser()">
        Logout
      </v-btn>
    </template>
  </v-app-bar>
  <!-- <v-app-bar
    :elevation="2"
    style="background-color: #1e1e1e; color: white; visibility: collapse"
    v-else
  >
    <v-app-bar-title align="center">
      <img align="center" class="mr-3" src="../assets/logo/Logo_SVG_BLACK.png" height="30" />
    </v-app-bar-title>
  </v-app-bar> -->
  <v-navigation-drawer
    permanent
    v-model="drawer"
    style="background-color: #1e1e1e; color: white"
    v-if="showNav"
  >
    <!-- <v-list-item>
      <img
        class="mr-3"
        src="../assets/logo/Logo_SVG_BLACK.png"
        width="100%"
        style="margin-top: 20px"
      />
       </v-list-item
    > -->
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navItemsMain"
        :disabled="item.disable"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
      ></v-list-item
    ></v-list>

    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navActions"
        :disabled="item.disable"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
      ></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navItemsControl"
        :disabled="item.disable"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
      ></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list density="compact" v-if="userRole == '1' || userRole == '0'" nav>
      <v-list-item
        v-for="item in navItemsSettingsAdmin"
        :v-if="showNavItem(item)"
        :disabled="item.disable"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
      ></v-list-item>
    </v-list>
    <v-list density="compact" v-if="userRole == '2'" nav>
      <v-list-item
        v-for="item in navItemsSettingsEmployee"
        :v-if="showNavItem(item)"
        :disabled="item.disable"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="item.title"
      ></v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list nav>
        <v-list-item>
          <v-btn
            size="large"
            width="100%"
            color="primary"
            prepend-icon="mdi-qrcode"
            @click="showScanner = true"
            variant="flat"
            >Scan QR-Code</v-btn
          >

          <v-dialog max-width="500" v-model="showScanner">
            <v-row align="center">
              <Scanner @close="showScanner = false" />
            </v-row>
          </v-dialog> </v-list-item
      ></v-list>
      <v-divider></v-divider>

      <v-list-item
        v-if="userImage != null"
        lines="two"
        :prepend-avatar="userImage"
        :title="userData.name + ' ' + userData.surname"
        :subtitle="loggedInCompany"
        ><VListItemSubtitle v-if="userRole == '0'">Masteruser</VListItemSubtitle>
        <VListItemSubtitle v-if="userRole == '1'">Administrator</VListItemSubtitle
        ><VListItemSubtitle v-if="userRole == '2'">Employee</VListItemSubtitle></v-list-item
      >
      <v-list-item
        v-else
        lines="two"
        prepend-icon="mdi-account-circle"
        :title="userData.name + ' ' + userData.surname"
        :subtitle="loggedInCompany"
        ><VListItemSubtitle v-if="userRole == '0'">Masteruser</VListItemSubtitle>
        <VListItemSubtitle v-if="userRole == '1'">Administrator</VListItemSubtitle
        ><VListItemSubtitle v-if="userRole == '2'">Employee</VListItemSubtitle></v-list-item
      >
      <div class="pa-2">
        <v-btn block color="red" variant="outlined" @click="logoutUser"> Logout </v-btn>
        <div
          class="versionTexty"
          style="
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            text-align: center;
            color: gray;
            font-size: 0.8rem;
          "
        >
          <div>© Exelentic GmbH 2024</div>
          <div>[BETA] v.0.0.1</div>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script>
//import HelloWorld from "./components/HelloWorld";
import { fa } from 'vuetify/lib/iconsets/fa.mjs'
import kontrolix_api from '../services/kontrolix_api.service'

export default {
  name: 'App',
  data() {
    return {
      loggedInCompany: '',
      drawer: true,
      showScanner: false,
      showNav: false,
      navItemsMain: [
        {
          title: 'Dashboard',
          path: '/dashboard',
          icon: 'mdi-view-dashboard',
          disable: false,
          condition: '3'
        }
      ],
      navActions: [
        {
          title: 'Active QR-Codes',
          path: '/qrcode',
          icon: 'mdi-qrcode',
          disable: false,
          condition: '1'
        },
        {
          title: 'History Logs',
          path: '/history',
          icon: 'mdi-history',
          disable: false,
          condition: '1'
        },
        {
          title: 'Cleaning Agents',
          path: '/cleaning_agents',
          icon: 'mdi-spray-bottle',
          disable: false,
          condition: '1'
        }
      ],
      navItemsSettingsAdmin: [
        // {
        //   title: 'Documentation',
        //   path: '/documentation',
        //   icon: 'mdi-book-open-variant-outline',
        //   disable: false,
        //   condition: '1'
        // },
        { title: 'Shop', path: '/', icon: 'mdi-store', disable: true, condition: '1' },
        {
          title: 'Company',
          path: '/CompanySettings',
          icon: 'mdi-domain',
          disable: false,
          condition: '1'
        },
        {
          title: 'Settings',
          path: '/UserSettings',
          icon: 'mdi-cog-outline',
          disable: false,
          condition: '1'
        }
      ],

      navItemsControl: [
        {
          title: 'Oil Change',
          path: '/oilChange',
          icon: 'mdi-barrel-outline',
          disable: false,
          condition: '1'
        },
        {
          title: 'Sensors',
          path: '/sensorsOverview',
          icon: 'mdi-thermometer-water',
          disable: false,
          condition: '1'
        }
      ],
      navItemsSettingsEmployee: [
        // {
        //   title: 'Documentation',
        //   path: '/documentation',
        //   icon: 'mdi-book-open-variant-outline',
        //   disable: false,
        //   condition: '1'
        // },
        {
          title: 'Settings',
          path: '/UserSettings',
          icon: 'mdi-cog-outline',
          disable: false,
          condition: '1'
        }
      ],
      userData: [],
      userRole: null,
      userImage: null
    }
  },
  methods: {
    logoutUser() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
    showNavItem(item) {
      const result = item.condition === this.userRole
      return result
    }
  },
  mounted() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      this.showNav = false
      this.drawer = false
    } else {
      this.showNav = true
      this.drawer = true
    }
    if (localStorage.getItem('user') != null) {
      const obj = JSON.parse(localStorage.getItem('user'))
      const idValue = obj.id
      const user_id = idValue

      kontrolix_api.getUserData(user_id).then((response) => {
        this.userData = response.data[0]

        kontrolix_api.getCompanyInformation(response.data[0].company_id).then((company) => {
          this.loggedInCompany = company.data.company_name
          sessionStorage.setItem('company_id', company.data.id)
        })
      })
      kontrolix_api.getUserImage(user_id).then((image) => {
        if (image.data != false) {
          this.userImage = image.data[0]
        } else {
          this.userImage = null
        }
      })

      if (obj.roles[0] == 'ROLE_ADMINISTRATOR') {
        this.userRole = '1'
      } else if (obj.roles[0] == 'ROLE_MASTERUSER') {
        this.userRole = '0'
      } else {
        this.userRole = '2'
      }
    }
  }
}
</script>
<style scoped></style>
