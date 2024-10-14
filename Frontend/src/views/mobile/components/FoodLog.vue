<template>
  <v-card style="max-height: 80vh; width: 100vw; overflow-y: scroll">
    <v-card-title
      ><v-row
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
      >Temperature Curve
      <apexchart height="300" :options="demoLine" :series="demoData"></apexchart>

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
          <v-chip v-if="item.action_id == 8" color="red"> Thrown Away</v-chip>
        </template>
        <template v-slot:item.createdAt="{ item }"
          >{{
            new Date(item.createdAt).toLocaleString('en-GB', {
              timeZone: 'UTC'
            })
          }}
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions
      ><v-btn align="right" color="blue-darken-1" variant="text" @click="closeLogs()"
        >close</v-btn
      ></v-card-actions
    >
  </v-card>
</template>
<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'
import kontrolix_api from '../../../services/kontrolix_api.service'

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
      demoData: [
        {
          data: []
        }
      ],
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
      currentQrCode: []
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
        kontrolix_api.getDeliveryNote(this.selectedQrCode.qr_code_id).then((response) => {
          this.image = response.data[0]
          this.showImage = true
        })
      } else if (type == 1) {
        kontrolix_api.getDeliveryImage(this.selectedQrCode.qr_code_id).then((response) => {
          this.image = response.data[0]
          this.showImage = true
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
