<template>
  <v-container class="md-6" style="background-color: transparent">
    <v-row>
      <v-col
        ><div class="text-h4"><v-icon size="x-small">mdi-history</v-icon> History Logs</div>
        <p>
          These are all QR Codes from the past. These codes are persistent and cannot be changed or
          deleted. modified or deleted. They can only be permanently deleted if you request it. You
          can can use the search to find a specific QR code, and you can also view detailed logs on
          the on the right side by clicking on the <v-icon>mdi-history</v-icon>-icon.
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
                :footer-props="{
                  'items-per-page-options': [10, 20, 30, 40, 50]
                }"
                :items-per-page="10"
                no-data-text="There are no QR-Codes registered at the moment!"
                :headers="headersFood"
                :items="food_data"
                :search="searchFood"
              >
                <template v-slot:item.bestbeforeDate="{ item }">
                  <span>{{ item.bestbeforeDate }}</span>
                </template>
                <template v-slot:item.isExpired="{ item }">
                  <span v-if="isFutureDate(item.bestbeforeDate) <= 0"
                    ><v-icon color="error" icon="mdi-alert"></v-icon>
                  </span>
                  <span v-else-if="isFutureDate(item.bestbeforeDate) <= 7"
                    ><v-icon color="warning" icon="mdi-timer-outline"></v-icon
                  ></span>
                  <span v-else><v-icon color="success" icon="mdi-check-bold"></v-icon></span>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon class="me-2" size="small" @click="openHistoryLogs(item, 1)">
                    mdi-history
                  </v-icon>
                </template></v-data-table
              >
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
                    :key="agent"
                    >{{ agent }}</v-chip
                  >
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon class="me-2" size="small" @click="openHistoryLogs(item, 2)">
                    mdi-history
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
                    :key="agent"
                    >{{ agent }}</v-chip
                  >
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon class="me-2" size="small" @click="openHistoryLogs(item, 3)">
                    mdi-history
                  </v-icon>
                </template>
              </v-data-table>
            </v-card></v-window-item
          >
        </v-window>
      </v-col>
    </v-row>

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
  </v-container>
</template>
<script>
import { ref } from 'vue'
import FoodLog from '../components/LogViews/FoodLog.vue'
import kontrolix_api from '../services/kontrolix_api.service'
import WorkspaceLog from '@/components/LogViews/WorkspaceLog.vue'
import LocationLog from '../components/LogViews/LocationLog.vue'

export default {
  name: 'Register',
  components: { FoodLog, WorkspaceLog, LocationLog },

  data() {
    return {
      selectedCategroy: 'foodTable',
      DashboardInfo: [
        { title: 'Active QR-Codes', value: '5' },
        { title: 'Unused QR-Codes', value: '5' },
        { title: 'Expire within 7 days', value: '5' },
        { title: 'Expired', value: '2' }
      ],
      searchFood: '',
      searchLocation: '',
      showLogs: false,
      currentCategory: 1,
      searchWorkspace: '',
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
        { key: 'createdAt', title: 'Removed On' },
        { key: 'actions', title: 'History' }
      ],
      headersLocations: [
        {
          align: 'start',
          key: 'qr_code_str',
          sortable: false,
          title: 'QR-Code ID'
        },
        { key: 'location_name', title: 'Location' },
        { key: 'preferred_cleaning_agent', title: 'Preferred Cleaning Agent' },
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

        { key: 'preferred_cleaning_agent', title: 'Cleaning Agent' },
        { key: 'actions', title: 'History' }
      ],
      food_data: [],
      location_data: [],
      workspace_data: [],
      currentQrCode: null
    }
  },
  methods: {
    openHistoryLogs(item, val) {
      console.log(item)
      this.currentQrCode = item
      this.currentCategory = val
      this.showLogs = true
    },
    isFutureDate(dateString) {
      const currentDate = new Date()
      const bestbeforeDate = new Date(dateString)
      const differenceInTime = bestbeforeDate.getTime() - currentDate.getTime()
      const differenceInDays = differenceInTime / (1000 * 3600 * 24)
      return differenceInDays
    },
    loadLocations() {
      kontrolix_api
        .getLocationHistory(JSON.parse(localStorage.getItem('user')).company_id)
        .then((response) => {
          var data = response.data

          this.location_data = data
        })
    }
  },
  computed: {},
  async mounted() {
    await kontrolix_api
      .getAllHistoryFoodQrCodes(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        this.food_data = response.data
      })

    await kontrolix_api
      .getWorkspaceHistory(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        this.workspace_data = response.data
      })

    await kontrolix_api
      .getLocationHistory(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        this.location_data = response.data
      })

    this.loadLocations()

    // DashboardInfo: [
    //     { title: 'Active QR-Codes', value: '5' },
    //     { title: 'Unused QR-Codes', value: '5' },
    //     { title: 'Expire within 7 days', value: '5' },
    //     { title: 'Expired', value: '2' }
    //   ],
    this.DashboardInfo[0].value = this.food_data.length
    var expiredCodes = 0
    var almostExpiredCodes = 0
    for (var i = 0; i < this.food_data.length; i++) {
      this.food_data[i].packed_on_date = new Date(this.food_data[i].packed_on_date).toLocaleString(
        'en-GB',
        {
          timeZone: 'UTC'
        }
      )
      if (this.food_data[i].freeze_date != null) {
        this.food_data[i].freeze_date = new Date(this.food_data[i].freeze_date).toLocaleString(
          'en-GB',
          {
            timeZone: 'UTC'
          }
        )
      }
      if (this.food_data[i].thaw_date != null) {
        this.food_data[i].thaw_date = new Date(this.food_data[i].thaw_date).toLocaleString(
          'en-GB',
          {
            timeZone: 'UTC'
          }
        )
      }
      this.food_data[i].best_before_date = new Date(
        this.food_data[i].best_before_date
      ).toLocaleString('en-GB', {
        timeZone: 'UTC'
      })

      var isExpired = this.isFutureDate(this.food_data[i].bestbeforeDate)
      if (isExpired < 0) {
        expiredCodes++
      } else if (isExpired <= 7) {
        almostExpiredCodes++
      }
      this.food_data[i].createdAt = new Date(this.food_data[i].createdAt).toLocaleString('en-GB', {
        timeZone: 'UTC'
      })
    }
    this.DashboardInfo[2].value = almostExpiredCodes
    this.DashboardInfo[3].value = expiredCodes
  }
}
</script>
<style scoped></style>
