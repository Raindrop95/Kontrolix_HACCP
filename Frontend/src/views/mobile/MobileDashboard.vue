<template>
  <v-container class="mb-6 d-flex align-stretch justify-center">
    <v-row
      ><v-row style="background-color: black; height: 40vh">
        <v-sheet color="#1E1E1E" style="width: 102vw">
          <v-col align="center">
            <img
              class="mr-3"
              style="margin-top: 50px"
              src="../../assets/logo/Logo_SVG_BLACK.png"
              height="30"
            />
          </v-col>
          <div style="margin-left: 20px">
            <p
              style="
                font-family: 'Roboto', sans-serif;
                font-size: 2rem;
                font-weight: 300;
                margin-bottom: -10px;
              "
            >
              Welcome Back!
            </p>
            <p style="font-size: 2.5rem; font-weight: 500; margin-bottom: -10px">
              {{ userData.name }} {{ userData.surname }}
            </p>
            <p style="font-family: 'Roboto', sans-serif; font-weight: 100; font-size: 1.2rem">
              {{ loggedInCompany }}
            </p>
          </div></v-sheet
        >
      </v-row>
      <v-row justify="center" style="margin-top: 30px"
        ><v-btn
          prepend-icon="mdi-qrcode"
          text="Scan QR-Code"
          size="x-large"
          color="primary"
          @click="showScanner = true"
        ></v-btn
      ></v-row>
      <v-row justify="center" style="margin-top: 30px"
        ><v-btn
          prepend-icon="mdi-barrel-outline"
          text="New Oil Change"
          size="x-large"
          color="primary"
          @click="openNewOilChange = true"
        ></v-btn
      ></v-row>
      <v-row align="center" justify="center">
        <v-card
          class="mx-auto fill-height"
          style="border-bottom: 5px; margin-top: 20px; border-style: solid; border-color: #464bcf"
        >
          <v-card-title>QR-Codes In Use </v-card-title>

          <apexchart
            class="d-flex justify-center align-center"
            height="200"
            :options="demoProgress"
            :series="qrCodeDataStat1"
          ></apexchart></v-card
      ></v-row>
      <v-row
        ><v-col align-self="end" align="center">
          <v-btn
            color="red"
            text="Scan QR-Code"
            variant="plain"
            size="large"
            style="margin-bottom: 40px; width: 300px"
            @click="logoutUser()"
            >Logout</v-btn
          ></v-col
        >
      </v-row>
    </v-row>
    <v-dialog v-model="showScanner">
      <v-row justify="center"> <Scanner @close="showScanner = false" /> </v-row>
    </v-dialog>
    <v-dialog v-model="openNewOilChange">
      <v-row justify="center">
        <AddOilChange
          @successCreated="newOildChangeCreated()"
          @close="openNewOilChange = false"
        /> </v-row
    ></v-dialog>
    <v-snackbar v-model="showSnack" timeout="3000" :color="snackColor">
      {{ snackText }}

      <template v-slot:actions>
        <v-btn variant="text" @click="showSnack = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import { ref } from 'vue'
import kontrolix_api from '../../services/kontrolix_api.service'
import Scanner from '../mobile/components/Scanner.vue'
import AddOilChange from '../mobile/components/AddNewOilChange.vue'
export default {
  name: 'MobileDashboard',
  components: { Scanner, AddOilChange },
  setup() {},
  data() {
    return {
      showSnack: '',
      snackColor: '',
      showSnack: false,
      uploadedImage: null,
      loggedInCompany: '',
      selectedFile: null,
      openNewOilChange: false,
      selectedCategroy: 'foodTable',
      DashboardInfo: [
        { title: 'Active QR-Codes', value: '-' },
        { title: 'Unused QR-Codes', value: '-' },
        { title: 'Expire within 7 days', value: '-' },
        { title: 'Expired', value: '-' }
      ],
      searchFood: '',
      loadData: true,
      showScanner: false,
      currentCategory: 1,
      qrCodeDataStat1: [0],
      demoProgress: {
        chart: { type: 'radialBar' },
        labels: ['QR-Codes used']
      },
      searchLocation: '',
      searchWorkspace: '',
      showLogs: false,
      headersFood: [
        {
          align: 'start',
          key: 'qr_code_str',
          sortable: false,
          title: 'QR-Code ID'
        },
        { key: 'product_name', title: 'Productname' },
        { key: 'packed_on_date', title: 'Packed On' },
        { key: 'freeze_date', title: 'Date (Freezed)' },
        { key: 'thaw_date', title: 'Date (Thawed)' },
        { key: 'best_before_date', title: 'Best Before' },
        { key: 'isExpired', title: 'Shelf Life' },
        { key: 'actions', title: 'History' }
      ],
      userData: [],
      headersLocations: [
        {
          align: 'start',
          key: 'qr_code_str',
          sortable: false,
          title: 'QR-Code ID'
        },
        { key: 'location_name', title: 'Loaction' },
        { key: 'last_cleaned_date', title: 'Last cleaned' }
      ],
      headersWorkspace: [
        {
          align: 'start',
          key: 'qr_code_str',
          sortable: false,
          title: 'QR-Code ID'
        },
        { key: 'workspace_name', title: 'Workspace' },
        { key: 'cleaning_agent_name', title: 'Cleaning Agent' },
        { key: 'last_cleaned_date', title: 'Last cleaned' }
      ],
      food_data: [],
      location_data: [],
      workspace_data: [],
      currentQrCode: []
    }
  },
  methods: {
    logoutUser() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
    newOildChangeCreated() {
      this.openNewOilChange = false

      this.snackColor = 'green'
      this.snackText = 'New oil change was added!'
      this.showSnack = true
    },
    uploadImage() {
      console.log(this.selectedFile)
      kontrolix_api.uploadImage(this.selectedFile).then((response) => {
        this.uploadImage = response.data[0].resultImagePath
      })
    }
  },
  computed: {},
  async mounted() {
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
    }

    await kontrolix_api
      .getQrCodeStatistic(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        this.DashboardInfo[0].value = response.data.active
        this.DashboardInfo[1].value = response.data.unused
        var statPercent =
          (100 / (response.data.active + response.data.unused)) * response.data.active

        statPercent = statPercent.toFixed(2)
        this.qrCodeDataStat1[0] = statPercent
        console.log(response.data.activeFoodCodes)
        var qrCodeStat1 = [
          response.data.activeFoodCodes,
          response.data.activeWorkspaceCodes,
          response.data.activeLocationCodes
        ]
        var qrCodeStat2 = [response.data.thrownawayProducts, response.data.usedUpProducts]
        this.series2 = qrCodeStat2
        this.series = qrCodeStat1
        console.log(this.series)
      })

    try {
      // Request permission to use the camera
      await navigator.mediaDevices.getUserMedia({ video: true })
      console.log('Camera access granted')
    } catch (error) {
      console.error('Error accessing camera:', error)
      // Handle error or show a message to the user
    }
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
</style>
