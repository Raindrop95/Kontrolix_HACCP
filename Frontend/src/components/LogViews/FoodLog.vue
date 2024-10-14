<template>
  <v-container fluid>
    <v-card style="overflow-y: auto; height: 75vh" min-width="700">
      <v-card-title>
        <v-row
          ><v-col>
            {{ currentQrCode.product_name }}
            <p class="text-disabled">#{{ currentQrCode.qr_code_str }}</p></v-col
          > </v-row
        ><v-row>
          <v-col align="left">
            <p class="text-disabled">
              Packed on: {{ new Date(currentQrCode.packed_on_date).toLocaleDateString('en-GB') }}
            </p>
          </v-col></v-row
        >
      </v-card-title>
      <v-card-text
        ><v-col>
          <v-row
            ><v-btn
              size="small"
              style="margin-bottom: 5px; margin-right: 10px"
              variant="outlined"
              prepend-icon="mdi-file-document-outline"
              @click="openImage(0)"
              :loading="isLoadingNote"
              >Delivery Note</v-btn
            ><v-btn
              size="small"
              style="margin-bottom: 5px"
              variant="outlined"
              prepend-icon="mdi-image-outline"
              @click="openImage(1)"
              :loading="isLoadingImage"
              >Delivery Image</v-btn
            ></v-row
          ><v-row
            ><v-col>
              Temperature Curve
              <apexchart height="300" :options="demoLine" :series="demoData"></apexchart>
              <v-row>
                <v-data-table
                  :loading="loadData"
                  :footer-props="{
                    'items-per-page-options': [10, 20, 30, 40, 50]
                  }"
                  :items-per-page="10"
                  no-data-text="There are no logs for this QR-Code!"
                  :headers="headerLogs"
                  :items="logData"
                >
                  <template v-slot:item.action_id="{ item }">
                    <v-chip v-if="item.action_id == 0"> Created </v-chip>
                    <v-chip v-if="item.action_id == 1" color="blue"> Freezed </v-chip>
                    <v-chip v-if="item.action_id == 2" color="orange"> Thawed</v-chip>
                    <v-chip v-if="item.action_id == 3" color="red"> Removed</v-chip>
                    <v-chip v-if="item.action_id == 4" color="yellow"> Opened</v-chip>
                    <v-chip v-if="item.action_id == 5" color="teal-lighten-4"> Vaccumed</v-chip>
                    <v-chip v-if="item.action_id == 6" color="black"> Temperature</v-chip>
                    <v-chip v-if="item.action_id == 7" color="brown"> New Quantity</v-chip>
                    <v-chip v-if="item.action_id == 8" color="red" @click="loadLogInfo(item.id)">
                      Thrown Away</v-chip
                    >
                  </template>
                  <template v-slot:item.createdAt="{ item }"
                    >{{
                      new Date(item.createdAt).toLocaleString('en-GB', {
                        timeZone: 'UTC'
                      })
                    }}
                  </template>
                </v-data-table></v-row
              ></v-col
            ></v-row
          ></v-col
        >
      </v-card-text>
      <v-card-actions
        ><v-btn color="blue-darken-1" variant="text" @click="closeLogs()">close</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="showThrowAwayLog" max-width="500px">
      <v-card style="overflow-y: auto; height: 50vh" min-width="200">
        <v-card-text>
          <v-row
            ><v-col>
              <p class="text-disabled">Thorw Away Reason:</p>
              {{ reasonText }}</v-col
            ></v-row
          >
          <p class="text-disabled">Image of thrown away item:</p>
          <v-row align="center">
            <v-col align="center"> <img :width="300" :src="logImage" alt="Image" /></v-col
          ></v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showThrowAwayLog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showImage" max-width="900px">
      <v-row align="center">
        <v-col align="center"> <img :width="800" :src="image" alt="Image" /></v-col
      ></v-row>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'
import kontrolix_api from '../../services/kontrolix_api.service'

const emits = defineEmits()

function closeLogs() {
  emits('closed', false)
}
</script>
<script>
export default {
  components: {},
  props: ['selectedQrCode'],
  setup() {},
  name: 'Food Log',
  data() {
    return {
      showImage: false,
      image: null,
      demoData: [
        {
          data: []
        }
      ],
      logImage: null,
      showThrowAwayLog: false,
      reasonText: '',
      demoLine: {
        chart: {
          id: 'vuechart-example',
          type: 'area',

          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          }
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime'
        }
      },

      loadData: true,
      headerLogs: [
        { key: 'employee_name', title: 'Employee' },
        { key: 'action_id', title: 'Action' },
        { key: 'measured_temperature', title: 'Temperature in C°' },
        { key: 'reported_quantity', title: 'Quantity' },

        { key: 'createdAt', title: 'Date' }
      ],
      logData: [],
      currentQrCode: [],
      isLoadingImage: false,
      isLoadingNote: false
    }
  },
  methods: {
    getFormattedDate(date) {
      var datetime = new Date(Date.parse(date))
      // Extract year, month, and day components
      var year = datetime.getFullYear()
      var month = ('0' + (datetime.getMonth() + 1)).slice(-2) // Adding 1 because getMonth() returns zero-based month
      var day = ('0' + datetime.getDate()).slice(-2)

      // Construct the date string with desired format
      return year + '-' + month + '-' + day
    },
    openImage(type) {
      if (type == 0) {
        this.isLoadingNote = true
        kontrolix_api.getDeliveryNote(this.selectedQrCode.qr_code_id).then((response) => {
          this.image = response.data[0]
          this.showImage = true
          this.isLoadingNote = false
        })
      } else if (type == 1) {
        this.isLoadingImage = true
        kontrolix_api.getDeliveryImage(this.selectedQrCode.qr_code_id).then((response) => {
          this.image = response.data[0]
          this.showImage = true
          this.isLoadingImage = false
        })
      }
    },
    loadLogInfo(logID) {
      this.showThrowAwayLog = true

      kontrolix_api.getThrowAwayLog(logID).then((response) => {
        this.reasonText = response.data[1]
        this.logImage = response.data[0]
      })
    }
  },
  async mounted() {
    await kontrolix_api.getFoodLogs(this.selectedQrCode.qr_code_id).then((response) => {
      this.logData = response.data
      console.log(this.logData)
    })

    this.currentQrCode = this.selectedQrCode
    this.loadData = false
    var tempData = []
    for (var i = 0; i < this.logData.length; i++) {
      if (this.logData[i].action_id == '6') {
        tempData[tempData.length] = {
          x: new Date(this.logData[i].createdAt),
          y: this.logData[i].measured_temperature
        }
      }
    }

    this.demoData[0].data = tempData
  }
}
</script>
<style></style>
