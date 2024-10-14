<template>
  <v-container class="md-6" style="background-color: transparent">
    <v-row>
      <v-col
        ><div class="text-h4"><v-icon size="x-small">mdi-barrel-outline</v-icon> Oil Change</div>
        <p>
          Here is a list of all registered oil changes. These changes are not linked to a specific
          QR code. When creating a new oil change, you can enter any name for the vessel or machine
          that has had an oil change.
        </p></v-col
      ></v-row
    >
    <v-row>
      <v-col>
        <v-card title="Oil Changes" flat>
          <v-card-text>
            <v-btn prepend-icon="mdi-plus" @click="openNewOilChange = true" color="primary"
              >Add New Oil Change</v-btn
            >
          </v-card-text>
          <template v-slot:text>
            <v-text-field
              v-model="searchOilChanges"
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
            :headers="headersOil"
            :items="oil_change_data"
            :search="searchOilChanges"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon class="me-2" size="small" @click="openConfirmDeleteOilLog(item.id)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="openNewOilChange"
      ><AddOilChange @successCreated="newOildChangeCreated()" @close="openNewOilChange = false"
    /></v-dialog>
    <v-dialog v-model="showDeleteOilLog" max-width="400" persistent>
      <v-card prepend-icon="mdi-delete" title="Delete Oil Change" color="red"
        ><v-card-text>Are you sure, that you want to delete this oil change? </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn variant="tonal" @click="showDeleteOilLog = false"> Cancel </v-btn>

          <v-btn variant="outlined" @click="confirmDeleteOilLog()"> Delete </v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="showSnack" timeout="3000" :color="snackColor">
      {{ snackText }}

      <template v-slot:actions>
        <v-btn variant="text" @click="showSnack = false"> Close </v-btn>
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
import AddOilChange from '../components/AddNewOilChange.vue'
import kontrolix_api from '../services/kontrolix_api.service'
import { fa } from 'vuetify/lib/iconsets/fa.mjs'

export default {
  name: 'Register',
  components: { AddOilChange },
  data() {
    return {
      openNewOilChange: false,
      searchOilChanges: '',
      loadData: false,
      oil_change_data: [],
      headersOil: [
        {
          align: 'start',
          key: 'container_name',
          sortable: false,
          title: 'Container Name'
        },
        { key: 'oil_type', title: 'Oil type' },
        { key: 'quantity', title: 'Quantity (L)' },
        { key: 'ph_value', title: 'PH Value' },
        { key: 'createdAt', title: 'Date of Change' },
        { key: 'actions', title: 'Actions' }
      ],
      showSnack: '',
      snackColor: '',
      showSnack: false,
      userData: null,
      currentLog: null,
      showDeleteOilLog: false
    }
  },
  methods: {
    newOildChangeCreated() {
      this.loadData = true
      this.openNewOilChange = false

      this.snackColor = 'green'
      this.snackText = 'New oil change was added!'
      this.showSnack = true
      kontrolix_api
        .getAllOilChanges(JSON.parse(localStorage.getItem('user')).company_id)
        .then((response) => {
          this.oil_change_data = response.data
          this.loadData = false
        })
    },
    openConfirmDeleteOilLog(item) {
      this.currentLog = item
      this.showDeleteOilLog = true
    },
    confirmDeleteOilLog() {
      this.loadData = true
      kontrolix_api
        .deleteOilChange(JSON.parse(localStorage.getItem('user')).company_id, this.currentLog)
        .then((response) => {
          this.showDeleteOilLog = false

          this.snackColor = 'green'
          this.snackText = 'Oil change was deleted successfully!'
          this.showSnackbar = true
          kontrolix_api
            .getAllOilChanges(JSON.parse(localStorage.getItem('user')).company_id)
            .then((response) => {
              this.oil_change_data = response.data
              this.loadData = false
            })
        })
    },
    loadData() {}
  },
  computed: {},
  async mounted() {
    this.loadData = true
    const obj = JSON.parse(localStorage.getItem('user'))
    const idValue = obj.id
    const user_id = idValue

    kontrolix_api.getUserData(user_id).then((response) => {
      this.userData = response.data[0]
    })

    kontrolix_api
      .getAllOilChanges(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].createdAt != null) {
            response.data[i].createdAt = new Date(response.data[i].createdAt).toLocaleString(
              'en-GB',
              {
                timeZone: 'UTC'
              }
            )
          }
        }
        this.oil_change_data = response.data
        this.loadData = false
      })
  }
}
</script>
<style scoped></style>
