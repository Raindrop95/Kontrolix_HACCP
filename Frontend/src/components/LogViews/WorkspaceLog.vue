<template>
  <v-container fluid>
    <v-card class="d-flex flex-column" style="overflow-y: auto; height: 75vh" min-width="700">
      <v-card-title
        ><v-row
          ><v-col>
            {{ currentQrCode.workspace_name }}
            <p class="text-disabled">#{{ currentQrCode.qr_code_str }}</p></v-col
          > </v-row
        ><v-row>
          <v-col align="left">
            <p class="text-disabled">
              Last Cleaning:
              {{ lastCleaned }}
            </p>
          </v-col></v-row
        >
      </v-card-title>
      <v-card-text>
        <v-data-table
          :loading="loadData"
          :footer-props="{
            'items-per-page-options': [10]
          }"
          :items-per-page="10"
          no-data-text="There are no logs for this QR-Code!"
          :headers="headerLogs"
          :items="logData"
        >
          <template v-slot:item.cleaning_agents="{ item }">
            <v-chip
              style="margin-left: 1px; margin-right: 1px"
              v-for="agent in item.cleaning_agents.split(',')"
              >{{ agent }}</v-chip
            ></template
          >

          <template v-slot:item.condition_image="{ item }">
            <v-icon v-if="item.condition_image != null" @click="showLogImage(item.id)"
              >mdi-image</v-icon
            >

            <v-icon v-else>mdi-image-off</v-icon></template
          >
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
        ><v-btn color="blue-darken-1" variant="text" @click="closeLogs()">close</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="showImage" max-width="900px">
      <v-row align="center">
        <v-col align="center"> <img :width="800" :src="logImage" alt="Image" /></v-col
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
        { key: 'user_id', title: 'Employee' },
        { key: 'cleaning_agents', title: 'Used Cleaning Agents' },
        { key: 'condition_image', title: 'Image' },

        { key: 'createdAt', title: 'Date' }
      ],
      logData: [],
      currentQrCode: [],
      logImage: null,
      showImage: false,
      lastCleaned: null
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
    showLogImage(logId) {
      kontrolix_api.getWorkspaceLogImage(logId).then((response) => {
        this.logImage = response.data[0]
        this.showImage = true
      })
    }
  },
  async mounted() {
    await kontrolix_api.getWorkspaceLogs(this.selectedQrCode.qr_code_id).then((response) => {
      this.logData = response.data

      if (response.data.length > 0) {
        this.lastCleaned = new Date(response.data[response.data.length - 1].createdAt)
          .toLocaleString('en-GB', {
            timeZone: 'UTC',
            hour12: false // Use 24-hour time format
          })
          .toString()
      } else {
        this.lastCleaned = 'none'
      }
    })

    this.currentQrCode = this.selectedQrCode
    this.loadData = false
  }
}
</script>
<style></style>
