<template>
  <v-container class="md-6" style="background-color: transparent">
    <v-row>
      <v-col
        ><div class="text-h4"><v-icon size="x-small">mdi-qrcode</v-icon> Active QR-Codes</div>
        <p>
          Here you will find a list of all active QR codes. You can can use the search to find a
          specific qr code, and you can also find detailed logs on the to the right by clicking on
          the <v-icon>mdi-history</v-icon>-icon. If you want to add a new action to the qr code, you
          can use the <v-icon>mdi-open-in-app</v-icon>-button to add new actions.
        </p></v-col
      ></v-row
    >
    <v-row>
      <v-col>
        <v-tabs v-model="selectedCategroy" slider-color="teal-lighten-3" show-arrows>
          <v-tab value="foodTable">
            <v-icon>mdi-food</v-icon>
            <p style="margin-left: 5px">Food</p></v-tab
          >
          <v-tab value="workspaceTable">
            <v-icon>mdi-table-furniture</v-icon>
            <p style="margin-left: 5px">Workspace</p>
          </v-tab>
          <v-tab value="locationTable">
            <v-icon>mdi-map-marker-radius</v-icon>
            <p style="margin-left: 5px">Locations</p>
          </v-tab>
        </v-tabs>
        <v-window v-model="selectedCategroy">
          <v-window-item value="foodTable">
            <v-card title="Active QR-Codes" flat>
              <template v-slot:text>
                <v-text-field
                  v-model="searchFood"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  single-line
                ></v-text-field>
              </template>

              <v-data-table
                :loading="loadData"
                :footer-props="{
                  'items-per-page-options': [10, 20, 30, 40, 50]
                }"
                :items-per-page="10"
                no-data-text="There are no QR-Codes registered at the moment!"
                :headers="headersFood"
                :items="food_data"
                :search="searchFood"
              >
                <template v-slot:item.isExpired="{ item }">
                  <span v-if="isFutureDate(item.best_before_date) <= 0"
                    ><v-icon color="error" icon="mdi-alert"></v-icon>
                  </span>
                  <span v-else-if="isFutureDate(item.best_before_date) <= 7"
                    ><v-icon color="warning" icon="mdi-timer-outline"></v-icon
                  ></span>
                  <span v-else><v-icon color="success" icon="mdi-check-bold"></v-icon></span>
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-icon class="me-2" size="small" @click="openHistoryLogs(item, 1)">
                    mdi-history
                  </v-icon>
                  <v-icon class="me-2" size="small" @click="openQrCode(item, 1)">
                    mdi-open-in-app
                  </v-icon>
                </template>
              </v-data-table>
            </v-card></v-window-item
          >
          <v-window-item value="workspaceTable">
            <v-card title="Active QR-Codes" flat>
              <template v-slot:text>
                <v-text-field
                  v-model="searchWorkspace"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  single-line
                ></v-text-field>
              </template>

              <v-data-table
                :loading="loadData"
                :footer-props="{
                  'items-per-page-options': [10, 20, 30, 40, 50]
                }"
                :items-per-page="10"
                no-data-text="There are no QR-Codes registered at the moment!"
                :headers="headersWorkspace"
                :items="workspace_data"
                :search="searchWorkspace"
              >
                <template v-slot:item.preferred_cleaning_agent="{ item }">
                  <v-chip
                    style="margin: 2px"
                    v-for="agent in item.preferred_cleaning_agent.split(',')"
                    >{{ agent }}</v-chip
                  ></template
                >
                <template v-slot:item.actions="{ item }">
                  <v-icon class="me-2" size="small" @click="openHistoryLogs(item, 2)">
                    mdi-history
                  </v-icon>
                  <v-icon class="me-2" size="small" @click="openQrCode(item, 2)">
                    mdi-open-in-app
                  </v-icon>
                </template>
              </v-data-table>
            </v-card></v-window-item
          >
          <v-window-item value="locationTable">
            <v-card title="Active QR-Codes" flat>
              <template v-slot:text>
                <v-text-field
                  v-model="searchLocation"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  single-line
                ></v-text-field>
              </template>

              <v-data-table
                :loading="loadData"
                :footer-props="{
                  'items-per-page-options': [10, 20, 30, 40, 50]
                }"
                no-data-text="There are no QR-Codes registered at the moment!"
                :items-per-page="10"
                :headers="headersLocations"
                :items="location_data"
                :search="searchLocation"
              >
                <template v-slot:item.preferred_cleaning_agent="{ item }">
                  <v-chip
                    style="margin: 2px"
                    v-for="agent in item.preferred_cleaning_agent.split(',')"
                    >{{ agent }}</v-chip
                  ></template
                >
                <template v-slot:item.actions="{ item }">
                  <v-icon class="me-2" size="small" @click="openHistoryLogs(item, 3)">
                    mdi-history
                  </v-icon>
                  <v-icon class="me-2" size="small" @click="openQrCode(item, 3)">
                    mdi-open-in-app
                  </v-icon>
                  <v-icon class="me-2" size="small" @click="openEdit(item, 3)"> mdi-pen </v-icon>
                </template>
              </v-data-table>
            </v-card></v-window-item
          >
        </v-window>
      </v-col>
    </v-row>
    <v-dialog v-model="showEditLocation" max-width="500px">
      <EditLocation
        @close="showEditLocation = false"
        @successEdit="editSuccess()"
        :scannedQrCode="this.currentQrCode.qr_code_str"
      />
    </v-dialog>
    <v-dialog v-model="showLogs" max-width="500px">
      <FoodLog
        v-if="currentCategory == 1"
        @closed="showLogs = false"
        :selectedQrCode="currentQrCode"
      />
      <WorkspaceLog
        v-if="currentCategory == 2"
        @closed="showLogs = false"
        :selectedQrCode="currentQrCode"
      />
      <LocationLog
        v-if="currentCategory == 3"
        @closed="showLogs = false"
        :selectedQrCode="currentQrCode"
      />
    </v-dialog>
    <v-dialog v-model="showDetails" max-width="500px">
      <DetailsCard
        v-if="currentCategory == 1"
        @deletion="validateDeletion()"
        @logUpdate="updatedFoodLog()"
        @close="showDetails = false"
        :scannedQrCode="this.currentQrCode.qr_code_str"
      /><WorkspaceDetails
        @deletion="validateDeletion()"
        @logUpdate="updatedWorkspaceLog()"
        v-if="currentCategory == 2"
        @close="showDetails = false"
        :scannedQrCode="this.currentQrCode.qr_code_str"
      />
      <LocationDetails
        @deletion="validateDeletion()"
        @logUpdate="updatedWorkspaceLog()"
        v-if="currentCategory == 3"
        @close="showDetails = false"
        :scannedQrCode="this.currentQrCode.qr_code_str"
      />
    </v-dialog>
    <v-snackbar v-model="showSuccessRemove" timeout="3000" color="green">
      The QR-Code was successfully removed!

      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccessRemove = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="showErrorReading" timeout="3000" :color="errorColor">
      {{ errorText }}

      <template v-slot:actions>
        <v-btn variant="text" @click="showErrorReading = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import { ref } from 'vue'
import QrCodeScanner from '../components/QrCodeScanner.vue'
import Scanner from '@/components/Scanner.vue'
import HandScanner from '@/components/HandScanner.vue'
import QrcodeVue from 'qrcode.vue'
import FoodLog from '../components/LogViews/FoodLog.vue'
import kontrolix_api from '../services/kontrolix_api.service'
import DetailsCard from '../components/QrCodeDetailsFood.vue'
import WorkspaceLog from '../components/LogViews/WorkspaceLog.vue'
import WorkspaceDetails from '../components/QrCodeDetailWorkspace.vue'
import LocationDetails from '../components/QrCodeDetailsLocation.vue'
import LocationLog from '../components/LogViews/LocationLog.vue'
import EditLocation from '../components/EditCompontens/EditLocation.vue'

import { fa } from 'vuetify/lib/iconsets/fa.mjs'

export default {
  name: 'Register',
  components: {
    FoodLog,
    DetailsCard,
    WorkspaceLog,
    WorkspaceDetails,
    LocationDetails,
    LocationLog,
    EditLocation
  },
  data() {
    return {
      showEditLocation: false,
      showErrorReading: false,
      errorColor: 'green',
      errorText: '',
      selectedCategroy: 'foodTable',
      DashboardInfo: [
        { title: 'Active QR-Codes', value: '-' },
        { title: 'Unused QR-Codes', value: '-' },
        { title: 'Expire within 7 days', value: '-' },
        { title: 'Expired', value: '-' }
      ],
      searchFood: '',
      loadData: true,
      showDetails: false,
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
        { key: 'opening_date', title: 'Opened On' },
        { key: 'vaccuming_date', title: 'Vaccum Sealed On' },
        { key: 'freeze_date', title: 'Freezed On' },
        { key: 'thaw_date', title: 'Thawed On' },
        { key: 'best_before_date', title: 'Best Before Date' },
        { key: 'isExpired', title: 'Shelf Life' },
        { key: 'actions', title: 'Actions' }
      ],
      headersLocations: [
        {
          align: 'start',
          key: 'qr_code_str',
          sortable: false,
          title: 'QR-Code ID'
        },
        { key: 'location_name', title: 'Loaction' },
        { key: 'preferred_cleaning_agent', title: 'Preferred Cleaning Agent' },
        { key: 'updatedAt', title: 'Last cleaned' },
        { key: 'actions', title: 'Actions' }
      ],
      headersWorkspace: [
        {
          align: 'start',
          key: 'qr_code_str',
          sortable: false,
          title: 'QR-Code ID'
        },
        { key: 'workspace_name', title: 'Workspace' },
        { key: 'preferred_cleaning_agent', title: 'Preferred Cleaning Agent' },
        { key: 'updatedAt', title: 'Last cleaned' },
        { key: 'actions', title: 'Actions' }
      ],
      food_data: [],
      location_data: [],
      workspace_data: [],
      currentQrCode: [],
      userData: [],
      showSuccessRemove: false,
      currentCategory: 0
    }
  },
  methods: {
    validateDeletion() {
      this.showDetails = false
      this.showSuccessRemove = true
    },
    openQrCode(item, val) {
      this.currentQrCode = item
      this.currentCategory = val
      this.showDetails = true
    },
    openHistoryLogs(item, val) {
      this.currentQrCode = item
      this.currentCategory = val
      this.showLogs = true
    },
    openEdit(item, val) {
      this.currentQrCode = item
      this.currentCategory = val
      this.showEditLocation = true
    },
    updatedWorkspaceLog() {
      this.showDetails = false
      this.errorText = 'Log for workspace has been successfully added!'
      this.errorColor = 'green'
      this.showErrorReading = true
    },
    updatedFoodLog() {
      this.showDetails = false
      this.errorText = 'Log for food has been successfully added!'
      this.errorColor = 'green'
      this.showErrorReading = true
    },

    isFutureDate(dateString) {
      const currentDate = new Date()
      const bestbeforeDate = new Date(dateString)
      const differenceInTime = bestbeforeDate.getTime() - currentDate.getTime()
      const differenceInDays = differenceInTime / (1000 * 3600 * 24)

      return differenceInDays
    },
    loadWorkspaces() {
      kontrolix_api
        .getAllWorkspaces(JSON.parse(localStorage.getItem('user')).company_id)
        .then((response) => {
          var data = response.data
          for (let i = 0; i < data.length; i++) {
            kontrolix_api.getWorkspaceLogs(data[i].qr_code_id).then((log) => {
              if (log.length > 0) {
                data[i].updatedAt = new Date(log[log.length - 1].createdAt).toLocaleString(
                  'en-GB',
                  {
                    timeZone: 'UTC'
                  }
                )
              } else {
                data[i].updatedAt = ''
              }
            })
          }
          this.workspace_data = data
        })
    },
    editSuccess() {
      this.errorColor = 'green'
      this.errorText = 'Location was successfully edited!'
      this.showErrorReading = true
      this.showEditLocation = false
      this.loadLocations()
    },
    loadLocations() {
      kontrolix_api
        .getAllLocations(JSON.parse(localStorage.getItem('user')).company_id)
        .then((response) => {
          var data = response.data
          for (let i = 0; i < data.length; i++) {
            kontrolix_api.getLocationLogs(data[i].qr_code_id).then((log) => {
              if (log.length > 0) {
                data[i].updatedAt = new Date(log[log.length - 1].createdAt).toLocaleString(
                  'en-GB',
                  {
                    timeZone: 'UTC'
                  }
                )
              } else {
                data[i].updatedAt = ''
              }
            })
          }
          this.location_data = data
        })
    }
  },
  computed: {},
  async mounted() {
    const obj = JSON.parse(localStorage.getItem('user'))
    const idValue = obj.id
    const user_id = idValue

    var data

    kontrolix_api.getUserData(user_id).then((response) => {
      this.userData = response.data[0]
    })
    await kontrolix_api
      .getAllActiveQrCodes(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        data = response.data
      })
    // DashboardInfo: [
    //     { title: 'Active QR-Codes', value: '5' },
    //     { title: 'Unused QR-Codes', value: '5' },
    //     { title: 'Expire within 7 days', value: '5' },
    //     { title: 'Expired', value: '2' }
    //   ],
    this.DashboardInfo[0].value = data.length
    var expiredCodes = 0
    var almostExpiredCodes = 0
    for (var i = 0; i < data.length; i++) {
      if (data[i].best_before_date != null) {
        data[i].best_before_date = new Date(data[i].best_before_date).toLocaleString('en-GB', {
          timeZone: 'UTC'
        })
      }

      if (data[i].packed_on_date != null) {
        data[i].packed_on_date = new Date(data[i].packed_on_date).toLocaleString('en-GB', {
          timeZone: 'UTC'
        })
      }

      if (data[i].freeze_date != null) {
        data[i].freeze_date = new Date(data[i].freeze_date).toLocaleString('en-GB', {
          timeZone: 'UTC'
        })
      }
      if (data[i].thaw_date != null) {
        data[i].thaw_date = new Date(data[i].thaw_date).toLocaleString('en-GB', {
          timeZone: 'UTC'
        })
      }
      if (data[i].opening_date != null) {
        data[i].opening_date = new Date(data[i].opening_date).toLocaleString('en-GB', {
          timeZone: 'UTC'
        })
      }
      if (data[i].vaccuming_date != null) {
        data[i].vaccuming_date = new Date(data[i].vaccuming_date).toLocaleString('en-GB', {
          timeZone: 'UTC'
        })
      }
      var isExpired = this.isFutureDate(data[i].best_before_date)
      if (isExpired < 0) {
        expiredCodes++
      } else if (isExpired <= 7) {
        almostExpiredCodes++
      }
      this.DashboardInfo[2].value = almostExpiredCodes
      this.DashboardInfo[3].value = expiredCodes
    }

    this.food_data = data

    this.loadData = false

    kontrolix_api
      .getQrCodeStatistic(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        this.DashboardInfo[0].value = response.data.active
        this.DashboardInfo[1].value = response.data.unused
      })

    this.loadWorkspaces()
    this.loadLocations()
  }
}
</script>
<style scoped></style>
