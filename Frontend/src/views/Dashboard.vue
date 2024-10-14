<template>
  <v-container class="md-6" style="background-color: transparent">
    <v-row
      ><v-col
        ><div class="text-h4">{{ $t('message.MsgWelcome') }} {{ userData.name }}!</div>
        <p>
          {{ $t('message.MsgWelcome') }}
        </p></v-col
      >
    </v-row>
    <v-row align="stretch" class="md-6">
      <v-col v-for="item in DashboardInfo" :key="item.title">
        <v-card
          class="mx-auto fill-height"
          style="border-bottom: 5px; border-style: solid; border-color: orange"
          :loading="loadData"
        >
          <v-card-item align="center"> </v-card-item>
          <v-card-text class="py-0">
            <v-row align="center">
              <v-col
                align="center"
                class="text-h5"
                style="
                  font-weight: 200 !important;
                  border-style: solid;
                  border-width: 1px;
                  border-color: gray;
                  border-radius: 50px;
                  margin: 5px;
                "
                >{{ item.title }}</v-col
              ></v-row
            >
            <v-row align="center">
              <v-col align="center" class="text-h2" style="margin-bottom: 20px"
                >{{ item.value }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card
          class="mx-auto fill-height"
          style="border-bottom: 5px; border-style: solid; border-color: orange"
          :loading="loadData"
        >
          <v-card-title>QR-Codes In Use </v-card-title>

          <apexchart
            class="d-flex justify-center align-center"
            height="300"
            :options="demoProgress"
            :series="qrCodeDataStat1"
          ></apexchart></v-card></v-col
      ><v-col>
        <v-card
          class="mx-auto fill-height"
          style="border-bottom: 5px; border-style: solid; border-color: orange"
          :loading="loadData"
        >
          <v-card-title>QR-Code Distribution</v-card-title>
          <apexchart
            class="d-flex justify-center align-center"
            height="300"
            :options="demoPie"
            :series="series"
          ></apexchart></v-card></v-col
      ><v-col>
        <v-card
          class="mx-auto fill-height"
          style="border-bottom: 5px; border-style: solid; border-color: orange"
          :loading="loadData"
        >
          <v-card-title>Food Statistic</v-card-title>
          <apexchart
            class="d-flex justify-center align-center"
            height="300"
            :options="demoFood"
            :series="series2"
          ></apexchart></v-card></v-col
    ></v-row>
    <v-row>
      <v-col>
        <v-card
          class="mx-auto fill-height"
          style="border-bottom: 5px; border-style: solid; border-color: orange"
          :loading="loadData"
        >
          <v-card-title>Temperature and Humidity Sensors</v-card-title>
          <v-card-text v-if="temperatureData.length === 0" class="text-center">
            <v-icon size="64" color="grey lighten-2">mdi-thermometer-off</v-icon>
            <div class="text-h6 mt-4 text-grey-lighten-1">No sensor data available</div>
            <div class="text-subtitle-1 mt-2 text-grey-lighten-1">
              Add sensors in the Sensor Settings to get started
            </div>
          </v-card-text>
          <v-card-text v-else>
            <apexchart
              type="bar"
              class="d-flex justify-center align-center"
              height="300"
              :options="{
                chart: {
                  type: 'bar',
                },
                xaxis: {
                  categories: temperatureData.map(sensor => sensor.name),
                },
                yaxis: [
                  {
                    title: {
                      text: 'Temperature (°C)'
                    }
                  },
                  {
                    opposite: true,
                    title: {
                      text: 'Humidity (%)'
                    }
                  }
                ],
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                  },
                },
                dataLabels: {
                  enabled: false
                },
                tooltip: {
                  y: {
                    formatter: function(value, { seriesIndex }) {
                      return seriesIndex === 0 ? value.toFixed(1) + '°C' : value.toFixed(1) + '%';
                    }
                  }
                },
                annotations: {
                  yaxis: [{
                    y: 0,
                    borderColor: 'red',
                    label: {
                      borderColor: 'red',
                      style: {
                        color: '#fff',
                        background: 'red'
                      },
                      text: '0°C'
                    }
                  }]
                }
              }"
              :series="[
                {
                  name: 'Temperature',
                  data: temperatureData.map(sensor => sensor.temperature)
                },
                {
                  name: 'Humidity',
                  data: temperatureData.map(sensor => sensor.humidity)
                }
              ]"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showUpdateInfo">
      <v-row justify="center"
        ><v-card width="600"
          ><v-card-title>Welcome to the Kontrolix Beta!</v-card-title
          ><v-card-subtitle>Version [BETA] 0.1.23</v-card-subtitle>
          <v-card-text>
            <p class="font-weight-medium">
              This is the beta version of the Kontrolix web application for digital HACCP. In this
              version, you have access to all the functions such as: adding QR codes for food and
              food and work areas, edit these QR codes and add log entries, log cleaning of work
              areas adding cleaning agents as single items, adding oil changes.
            </p>
            <p class="font-weight-bold" style="color: red; margin-bottom: 10px">
              The integration of temperature sensors is currently possible but not fully integrated!
            </p>

            <v-divider></v-divider>
            <p class="font-weight-bold" style="margin-top: 10px">Disclaimer:</p>
            <p class="text-disabled">
              The beta software program product licensed here under is still in Its testing phase
              and is provided on an "as is" and "as available" basis and is Believed to contain
              defects. A primary purpose of this beta testing licence is to Obtain feedback on
              software performance and the identification of defects. Licensee Is advised to
              safeguard important data, to use caution and not to rely in any way on The correct
              functioning or performance of the beta software program product and/or Accompanying
              materials or documentation.
            </p> </v-card-text
          ><v-card-actions
            ><v-btn color="primary" @click="showUpdateInfo = false">Close</v-btn
            ><v-btn variant="plain" @click="saveDoNotShowAgain()"
              >Don't show again</v-btn
            ></v-card-actions
          ></v-card
        ></v-row
      ></v-dialog
    >
  </v-container>
</template>
<script>
import { ref } from 'vue'
import QrCodeScanner from '../components/QrCodeScanner.vue'
import Scanner from '@/components/Scanner.vue'
import HandScanner from '@/components/HandScanner.vue'
import QrcodeVue from 'qrcode.vue'
import FoodLog from '../components/LogViews/FoodLog.vue'
import kontrolix_api from '../services/kontrolix_api.service'

export default {
  name: 'Register',
  components: { QrCodeScanner, Scanner, HandScanner, FoodLog, QrcodeVue },
  setup() {
    const ReadQrCode = ref('')
    return { ReadQrCode }
  },
  data() {
    return {
      demoLine: {
        chart: {
          id: 'vuechart-example',
          type: 'area',
          stroke: 'smooth',
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
          categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }
      },
      demoProgress: {
        chart: { type: 'radialBar' },
        labels: ['QR-Codes used']
      },
      qrCodeDataStat1: [0],
      demoPie: {
        chart: {
          width: 380,
          type: 'pie'
        },
        labels: ['Food', 'Workspaces', 'Locations'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      },
      demoFood: {
        chart: {
          width: 380,
          type: 'pie'
        },
        labels: ['Used Up', 'Thrown Away'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      },
      series: [0, 0, 0],
      series2: [0, 0],

      demoData2: [
        {
          name: 'series-1',
          data: [40, 20, 37, 42, 27, 30, 13, 22]
        }
      ],
      selectedCategroy: 'foodTable',
      DashboardInfo: [
        { title: 'Active QR-Codes', value: '-' },
        { title: 'Unused QR-Codes', value: '-' },
        { title: 'Expire within 7 days', value: '-' },
        { title: 'Expired', value: '-' }
      ],
      searchFood: '',
      loadData: true,
      currentCategory: 1,
      searchLocation: '',
      searchWorkspace: '',
      showLogs: false,
      temperatureData: [],
      chartLayout: {
        chart: {
          type: 'pie',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            }
          }
        },
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "°C"
            }
          }
        }
      },
      demoData: [], // Array to store multiple series data
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
        { key: 'actions', title: 'History' }
      ],
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
      currentQrCode: [],
      userData: [],
      showUpdateInfo: false
    }
  },
  methods: {
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${day}-${month}-${year} ${hours}:${minutes}`
    },
    openHistoryLogs(item) {
      this.currentQrCode = item
      this.showLogs = true
    },
    isFutureDate(dateString) {
      const currentDate = new Date()
      const bestbeforeDate = new Date(dateString)
      const differenceInTime = bestbeforeDate.getTime() - currentDate.getTime()
      const differenceInDays = differenceInTime / (1000 * 3600 * 24)

      return differenceInDays
    },
    saveDoNotShowAgain() {
      localStorage.setItem('closeDisclaimer', true)
      this.showUpdateInfo = false
    },
    async loadTemperatureSensor() {
      try {
        const company_id = JSON.parse(localStorage.getItem('user')).company_id
        const response = await kontrolix_api.getLastReadings(company_id)
        
        console.log('API response:', response.data);

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          this.temperatureData = response.data.map((sensorData, index) => {
            // Get the first reading, which should be the latest
            const latestReading = sensorData[0];
            return {
              name: `Sensor ${index + 1}`,
              temperature: latestReading ? latestReading.temperature : undefined,
              humidity: latestReading ? latestReading.humidity : undefined
            }
          });

          console.log('Processed temperature data:', this.temperatureData);
        } else {
          console.log('No temperature data available')
          this.temperatureData = []
        }
      } catch (error) {
        this.showErrorReading = true
        this.errorText = 'Error loading sensor data'
        console.error(error)
      } finally {
        this.loadData = false
      }
    }
  },
  computed: {
    chartWidth() {
      // Get the width of the v-card element
      const cardWidth = document.querySelector('.mx-auto').offsetWidth
      // Set the width of the chart to match the width of the v-card
      return cardWidth
    }
  },
  async mounted() {
    this.loadTemperatureSensor()
    if (
      (localStorage.getItem('closeDisclaimer') == 'true') |
      (sessionStorage.getItem('closeDisclaimerOnce') == 'true')
    ) {
      this.showUpdateInfo = false
    } else {
      this.showUpdateInfo = true
      sessionStorage.setItem('closeDisclaimerOnce', true)
    }
    const obj = JSON.parse(localStorage.getItem('user'))
    const idValue = obj.id
    const user_id = idValue

    kontrolix_api.getUserData(user_id).then((response) => {
      this.userData = response.data[0]
    })
    await kontrolix_api
      .getAllActiveQrCodes(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        this.food_data = response.data
      })

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
      if (this.food_data[i].thaw_date != null) {
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
      if (this.food_data[i].opening_date != null) {
        this.food_data[i].opening_date = new Date(this.food_data[i].opening_date).toLocaleString(
          'en-GB',
          {
            timeZone: 'UTC'
          }
        )
      }
      if (this.food_data[i].vaccuming_date != null) {
        this.food_data[i].vaccuming_date = new Date(
          this.food_data[i].vaccuming_date
        ).toLocaleString('en-GB', {
          timeZone: 'UTC'
        })
      }
      var isExpired = this.isFutureDate(this.food_data[i].best_before_date)
      if (isExpired < 0) {
        expiredCodes++
      } else if (isExpired <= 7) {
        almostExpiredCodes++
      }
      this.DashboardInfo[2].value = almostExpiredCodes
      this.DashboardInfo[3].value = expiredCodes
    }
    this.loadData = false
    var statPercent = 0
    await kontrolix_api
      .getQrCodeStatistic(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        this.DashboardInfo[0].value = response.data.active
        this.DashboardInfo[1].value = response.data.unused
        var statPercent =
          (100 / (response.data.active + response.data.unused)) * response.data.active

        statPercent = statPercent.toFixed(2)
        this.qrCodeDataStat1[0] = statPercent
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
  }
}
</script>
<style scoped></style>
