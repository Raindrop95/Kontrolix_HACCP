<template>
  <v-container class="mb-6 d-flex align-stretch">
    <v-row>
      <v-row
        ><v-col
          ><div class="text-h5">Welcome Back {{ userData.name }} {{ userData.surname }}!</div>
          <div class="text-disabled">Registered Company: Figlmüller Bäckerstraße</div>
        </v-col></v-row
      >
      <v-row>
        <v-col align-self="center" align="center">
          <v-btn
            @click="showScanner = true"
            color="primary"
            text="Scan QR-Code"
            variant="flat"
            size="x-large"
            block
            prepend-icon="mdi-qrcode"
            >Scan QR-Code</v-btn
          >
          <div class="text-disabled">
            <v-icon>mdi-alert-outline</v-icon> You may need to set permissions for the camera in
            your device settings!
          </div>
          <v-dialog v-model="showScanner">
            <v-row justify="center"> <Scanner @close="showScanner = false" /> </v-row>
          </v-dialog>
        </v-col>
      </v-row>

      <!-- <v-row>
        <v-col align="center">
          <v-btn
            color="primary"
            text="Scan QR-Code"
            prepend-icon="mdi-open-in-new"
            variant="flat"
            size="x-large"
            block
            >Open Dektop View</v-btn
          >
        </v-col>
      </v-row> -->

      <v-row
        ><v-col align-self="end">
          <v-btn
            color="red"
            text="Scan QR-Code"
            variant="outlined"
            size="x-large"
            @click="logoutUser()"
            block
            >Logout</v-btn
          ></v-col
        >
      </v-row></v-row
    >
  </v-container>
</template>
<script>
import { ref } from 'vue'
import kontrolix_api from '../../services/kontrolix_api.service'
import Scanner from '../mobile/components/Scanner.vue'

export default {
  name: 'MobileDashboard',
  components: { Scanner },
  setup() {},
  data() {
    return {
      uploadedImage: null,
      selectedFile: null,
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
    uploadImage() {
      console.log(this.selectedFile)
      kontrolix_api.uploadImage(this.selectedFile).then((response) => {
        this.uploadImage = response.data[0].resultImagePath
      })
    }
  },
  computed: {},
  async mounted() {
    try {
      // Request permission to use the camera
      await navigator.mediaDevices.getUserMedia({ video: true })
      console.log('Camera access granted')
    } catch (error) {
      console.error('Error accessing camera:', error)
      // Handle error or show a message to the user
    }
    if (localStorage.getItem('user') != null) {
      const obj = JSON.parse(localStorage.getItem('user'))
      const idValue = obj.id
      const user_id = idValue

      kontrolix_api.getUserData(user_id).then((response) => {
        this.userData = response.data[0]
      })
    }
  }
}
</script>
<style scoped></style>
