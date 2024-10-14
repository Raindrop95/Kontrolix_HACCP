<template>
  <v-container class="md-6" style="background-color: transparent">
    <v-row>
      <v-col>
        <div class="text-h3">
          <v-icon size="small">mdi-thermometer-water</v-icon>
          Temperature-/Humidity Sensors
        </div>
      </v-col>
      <v-col class="d-flex justify-end align-center" style="padding-top: 30px; padding-bottom: 0px; padding-right: 30px;">
        <v-btn @click="openSensorSettings" class="mr-2" style="width: 180px; height: 56px; border-radius: 4px; background-color: #e0e0e0; color: #555;">
          <v-icon left>mdi-thermometer</v-icon>
          Sensor Settings
        </v-btn>
        <v-select
          v-model="sortKey"
          :items="sortOptions"
          item-title="text"
          item-value="value"
          label="Sort by"
          @update:model-value="handleSortChange"
          dense
          hide-details
          class="small-select"
          style="max-width: 170px;"
        ></v-select>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col v-if="sortedSensorsData.length === 0" cols="12" class="text-center">
        <div class="no-sensors-watermark">
          <v-icon size="100" color="grey lighten-2">mdi-thermometer-off</v-icon>
          <div class="text-h4 mt-4 text-grey-lighten-1">No Sensors Yet</div>
          <div class="text-subtitle-1 mt-2 text-grey-lighten-1">Add sensors in the Sensor Settings to get started</div>
        </div>
      </v-col>
      <v-col v-else v-for="sensorData in sortedSensorsData" :key="sensorData.sensor_id" cols="12" sm="6" md="4">
        <v-card
          class="fill-height"
          style="border-bottom: 10px; border-style: solid; border-color: orange"
          :loading="loadData"
        >
          <v-card-title class="text-center" style="position: relative;">
            Sensor {{ sensorData.sensor_id }} Data
            <v-btn 
              icon 
              @click="toggleGraphView(sensorData.sensor_id)" 
              class="ml-auto" 
              style="position: absolute; top: 5px; right: 5px; width: 30px; height: 30px; border-radius: 0;"
              :disabled="!sensorData.hasData"
            >
              <v-icon>mdi-chart-line</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle class="text-center">
            Temperature and Humidity
            <br>
            MAC: {{ getSensorMacAddress(sensorData.sensor_id) }}
          </v-card-subtitle>
          <v-card-text class="text-center">
            <div v-if="!sensorData.hasData" class="waiting-data">
              <v-icon size="64" color="grey lighten-2">mdi-clock-outline</v-icon>
              <div class="text-h6 mt-4 text-grey-lighten-1">Waiting for data...</div>
              <div class="text-subtitle-1 mt-2 text-grey-lighten-1">
                Sensor is active but hasn't sent any readings yet.
              </div>
              <div class="text-caption mt-2 text-grey-lighten-2">
                This may take a few minutes. If it persists, check the sensor's connection.
              </div>
            </div>
            <div v-else-if="!sensorData.showGraph">
              <div class="last-updated">
                Last Updated: {{ formatDate(sensorData.createdAt) }}
              </div>
              <svg :width="svgSize" :height="svgSize" viewBox="0 0 300 127.5" class="mx-auto d-block">
                <path v-if="sensorData.showHalfCircles" :d="generalShape" stroke="#ccc" stroke-width="15" fill="none"  />
                <path
                  v-if="sensorData.showHalfCircles"
                  :d="generalShape"
                  :stroke="getTemperatureColor(sensorData.temperature)"
                  stroke-width="15"
                  fill="none"
                  :stroke-dasharray="circumference / 2"
                  :stroke-dashoffset="(circumference / 2) - ((sensorData.temperature + 40) / 100) * (circumference / 2)"
                  :stroke-linecap="butt"
                  :stroke-linejoin="round"
                />
                <text v-if="sensorData.showHalfCircles" x="21.5" y="100" text-anchor="middle" dy=".3em" :font-size="18" fill="white" font-weight="bolder">
                  T
                </text>
                <path v-if="sensorData.showHalfCircles" :d="innerShape" stroke="#ccc" stroke-width="15" fill="none" />
                <path
                  v-if="sensorData.showHalfCircles"
                  :d="innerShape"
                  stroke="green"
                  stroke-width="15"
                  fill="none"
                  :stroke-dasharray="circumference / 2 * (70/90)"
                  :stroke-dashoffset="(circumference / 2 * (70/90)) - (sensorData.humidity / 130) * (circumference / 2 * (70/90))"
                  stroke-linecap="butt round"
                />
                <text v-if="sensorData.showHalfCircles" x="51.5" y="100" text-anchor="middle" dy=".3em" :font-size="18" fill="white" font-weight="bolder">
                  H
                </text>

                <text v-if="sensorData.showHalfCircles" x="50%" y="160.5" text-anchor="middle" dy=".3em" :font-size="textSize">
                  {{ sensorData.temperature }}°C / {{ sensorData.humidity }}%
                </text>
              </svg>
              <div class="color-scale" style="margin-top: -40px;" v-if="sensorData.showScale">
                <div class="scale-labels">
                  <div class="min-temp">-40°C</div>
                  <div class="max-temp">30°C</div>
                </div>
                <div class="color-boxes-horizontal">
                  <div class="color-box" v-for="n in 100" :key="n" :style="{ backgroundColor: getTemperatureColor((n - 1) * 0.7 - 40) }"></div>
                  <div class="current-temp-line" :style="{ left: `${(sensorData.temperature + 40) / 70 * 100}%`, backgroundColor: 'white' }"></div>
                </div>
              </div>
            </div>
            <div v-else>
              <div v-if="sensorData.showGraph" class="graph-container">
                <apexchart
                  class="d-flex justify-center align-center"
                  height="350"
                  :options="{
                    ...chartOptions,
                    tooltip: {
                      ...chartOptions.tooltip,
                      x: {
                        format: 'dd MMM yyyy HH:mm:ss'
                      }
                    },
                    animations: {
                      enabled: sensorData.firstTimeGraph
                    }
                  }"
                  :series="sensorData.chartData"
                ></apexchart>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
    <!-- Sensor Settings Dialog -->
    <v-dialog v-model="sensorSettingsDialog" max-width="500px">
      <v-card class="sensor-settings-card" elevation="4" rounded="lg">
        <v-card-title class="sensor-settings-title text-h5 font-weight-bold pa-4 bg-grey-lighten-2">
          Sensor Settings
        </v-card-title>
        <v-card-text class="pa-6">
          <p class="sensor-settings-description text-body-2 text-grey-darken-2 mb-4">
            Manage your sensors here. Toggle checkboxes to activate or deactivate sensors. 
          </p>
          <div class="d-flex align-center mb-4">
            <v-text-field
              v-model="newSensorMacAddress"
              label="Add new sensor (MAC address)"
              class="mr-2"
            ></v-text-field>
            <v-btn
              color="green-darken-1"
              @click="addNewSensor"
              width="10"
              height="55"
              
              class="ml-2"
              style="margin-top: -20px; width: 50px;"
            >
              Add
            </v-btn>
          </div>
          <v-list class="sensor-list bg-transparent">
            <v-list-item v-for="sensor in allSensors" :key="sensor.sensor_id" class="sensor-list-item mb-2 bg-grey-lighten-3 rounded">
              <v-list-item-content class="d-flex align-center justify-space-between pa-3">
                <div>
                  <v-list-item-title class="sensor-title font-weight-medium">Sensor {{ sensor.sensor_id }}</v-list-item-title>
                  <v-list-item-subtitle class="sensor-mac-address">MAC: {{ sensor.mac_address }}</v-list-item-subtitle>
                </div>
                <div class="d-flex align-center">
                  <v-checkbox
                    v-model="sensor.active"
                    @change="toggleSensor(sensor)"
                    color="grey-darken-3"
                    hide-details
                    class="sensor-checkbox mr-2"
                  ></v-checkbox>
                  <v-icon color="grey-darken-2" @click="deleteSensor(sensor)">mdi-delete</v-icon>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeSensorSettings" class="close-button text-uppercase font-weight-medium">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import kontrolix_api from '@/services/kontrolix_api.service'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'SensorsOverview',
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      loadData: false,
      showSuccessRemove: false,
      showErrorReading: false,
      errorText: '',
      errorColor: 'red',
      sensorsData: [],
      activeSensors: [],
      circumference: 2 * Math.PI * 180, // Circumference of the outer circle
      generalShape: "M20,112.5 A110,110 0 0,1 280,112.5",
      innerShape: "M50,112.5 A80,80 0 0,1 250,112.5",
      svgSize: 280,
      textSize: 42,
      showScale: false, // Added variable to control the visibility of the scale
      showHalfCircles: true, // Added variable to control the visibility of the half circles and text
      showGraph: false, // Added variable to control the visibility of the graph
      chartOptions: {
        chart: {
          type: 'line',
          height: 350
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value.toFixed(2);
            }
          }
        }
      },
      sortKey: 'name', // Default sort key
      sortOptions: [
        { text: 'Name', value: 'name' },
        { text: 'Temperature', value: 'temperature' },
        { text: 'Humidity', value: 'humidity' }
      ],
      sensorSettingsDialog: false,
      allSensors: [], // This will hold all sensors, both active and inactive
      newSensorMacAddress: '', // Add this line to store the new sensor MAC address
      refreshInterval: null, // Add this line to store the interval ID
    }
  },
  computed: {
    sortedSensorsData() {
      return this.sensorsData.slice().sort((a, b) => {
        switch(this.sortKey) {
          case 'name':
            return a.sensor_id.toString().localeCompare(b.sensor_id.toString());
          case 'temperature':
            return (b.temperature || 0) - (a.temperature || 0);
          case 'humidity':
            return (b.humidity || 0) - (a.humidity || 0);
          default:
            return 0;
        }
      });
    }
  },
  methods: {
    async fetchActiveSensors() {
      try {
        const company_id = JSON.parse(localStorage.getItem('user')).company_id
        const response = await kontrolix_api.getActiveSensors(company_id)
        this.activeSensors = response.data
      } catch (error) {
        this.$forceUpdate()
        
        this.errorText = 'Error loading active sensors'
        this.showErrorReading = true
        
        console.error(error)
        // Force update the page if an error occurs
      
      }
    },
    async fetchSensorData() {
      try {
        const company_id = JSON.parse(localStorage.getItem('user')).company_id
        const response = await kontrolix_api.getLastReadings(company_id)
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          this.sensorsData = this.activeSensors.map(sensorId => {
            const sensorData = response.data.find(data => 
              Array.isArray(data) && 
              data.length > 0 && 
              data[0] && 
              data[0].sensor_id === sensorId
            )

            const existingSensorData = this.sensorsData.find(data => data.sensor_id === sensorId);

            return {
              sensor_id: sensorId,
              hasData: !!sensorData,
              showGraph: existingSensorData ? existingSensorData.showGraph : false,
              showHalfCircles: existingSensorData ? existingSensorData.showHalfCircles : true,
              showScale: existingSensorData ? existingSensorData.showScale : false,
              chartData: existingSensorData ? existingSensorData.chartData : [],
              firstTimeGraph: existingSensorData ? existingSensorData.firstTimeGraph : true,
              ...(sensorData ? sensorData[0] : {})
            }
          })
        } else {
          console.error('Invalid response data format:', response.data)
          this.sensorsData = []
        }
      } catch (error) {
        this.$forceUpdate()
        
        this.showErrorReading = true
        this.errorText = 'Error loading sensor data'
        console.error(error)
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString()
    },
    getTemperatureColor(temperature) {
      if (temperature < 0) {
        const minTemp = -40; // Adjust based on your temperature range
        const maxTemp = 0;  // Adjust based on your temperature range

        // Normalize the temperature to a value between 0 and 1
        const normalizedTemp = (temperature - minTemp) / (maxTemp - minTemp);

        // Calculate the color components for blue shades
        const hue = 240; // 240 is the hue for blue
        const lightness = 50 + (normalizedTemp * 30); // Lightness varies from 50% to 80% for better visibility
        return `hsl(${hue}, 100%, ${lightness}%)`;
      } else if (temperature >= 0 && temperature <= 5) {
        const minTemp = 0; // Adjust based on your temperature range
        const maxTemp = 5;  // Adjust based on your temperature range

        // Normalize the temperature to a value between 0 and 1
        const normalizedTemp = (temperature - minTemp) / (maxTemp - minTemp);

        // Calculate the color components for green shades
        const hue = 120; // 120 is the hue for green
        const lightness = 50 + (normalizedTemp * 10); // Lightness varies from 50% to 60% for better visibility
        return `hsl(${hue}, 100%, ${lightness}%)`;
      } else {
        const minTemp = 5; // Adjust based on your temperature range
        const maxTemp = 30;  // Adjust based on your temperature range

        // Normalize the temperature to a value between 0 and 1
        const normalizedTemp = (temperature - minTemp) / (maxTemp - minTemp);

        // Calculate the color components for red shades
        const hue = 0 + (1 - normalizedTemp) * 30; // Transition from red (0) to orange (30)
        const lightness = 50 + (1 - normalizedTemp) * 10; // Lightness varies from 60% to 50% for better visibility
        return `hsl(${hue}, 100%, ${lightness}%)`;
      }
    },
    toggleGraphView(sensorId) {
      const index = this.sortedSensorsData.findIndex(data => data.sensor_id === sensorId);
      if (index === -1 || !this.sortedSensorsData[index].hasData) return;

      this.sortedSensorsData[index].showHalfCircles = !this.sortedSensorsData[index].showHalfCircles;
      this.sortedSensorsData[index].showGraph = !this.sortedSensorsData[index].showHalfCircles;
      if (this.sortedSensorsData[index].showGraph && this.sortedSensorsData[index].chartData.length === 0) {
        this.getChartData(sensorId).then(chartData => {
          if (this.sortedSensorsData[index]) {
            this.sortedSensorsData[index].chartData = chartData;
            this.sortedSensorsData[index].firstTimeGraph = true;
            this.$nextTick(() => {
              this.$forceUpdate(); // Force Vue to re-render the component
            });
          }
        });
      } else {
        this.$nextTick(() => {
          this.$forceUpdate(); // Force Vue to re-render the component
        });
      }
    },
    async getChartData(sensorId) {
      const company_id = JSON.parse(localStorage.getItem('user')).company_id
      try {
        const response = await kontrolix_api.getLastReadings(company_id)
        const sensorDataArray = response.data

        if (!sensorDataArray || !Array.isArray(sensorDataArray) || sensorDataArray.length === 0) {
          console.error('sensorDataArray is not a valid array or is empty:', sensorDataArray);
          // Create dummy data with 0 values for temperature and humidity
          const now = new Date();
          const dummyData = [{
            x: now,
            y: 0
          }];
          console.log('Temperature Data:', dummyData);
          console.log('Humidity Data:', dummyData);
          return [{
            name: 'Temperature',
            data: dummyData
          }, {
            name: 'Humidity',
            data: dummyData
          }];
        }

        const sensorData = sensorDataArray.find(data => Array.isArray(data) && data.some(entry => entry.sensor_id === sensorId));

        if (!sensorData || !Array.isArray(sensorData)) {
          console.error('No data found for sensorId:', sensorId);
          // Create dummy data with 0 values for temperature and humidity
          const now = new Date();
          const dummyData = [{
            x: now,
            y: 0
          }];
          console.log('Temperature Data:', dummyData);
          console.log('Humidity Data:', dummyData);
          return [{
            name: 'Temperature',
            data: dummyData
          }, {
            name: 'Humidity',
            data: dummyData
          }];
        }

        const temperatureData = sensorData.map(entry => ({
          x: new Date(entry.createdAt),
          y: entry.temperature
        }));

        const humidityData = sensorData.map(entry => ({
          x: new Date(entry.createdAt),
          y: entry.humidity
        }));

        console.log('Temperature Data:', JSON.stringify(temperatureData, null, 2));
        console.log('Humidity Data:', JSON.stringify(humidityData, null, 2));

        return [{
          name: 'Temperature',
          data: temperatureData
        }, {
          name: 'Humidity',
          data: humidityData
        }];
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        // Create dummy data with 0 values for temperature and humidity
        const now = new Date();
        const dummyData = [{
          x: now,
          y: 0
        }];
        console.log('Temperature Data:', dummyData);
        console.log('Humidity Data:', dummyData);
        return [{
          name: 'Temperature',
          data: dummyData
        }, {
          name: 'Humidity',
          data: dummyData
        }];
      }
    },
    sortBy(key) {
      this.sortKey = key
    },
    handleSortChange() {
      // Close all open graphs when sorting changes
      this.sortedSensorsData.forEach(sensorData => {
        sensorData.showGraph = false;
        sensorData.showHalfCircles = true;
      });
    },
    openSensorSettings() {
      this.sensorSettingsDialog = true;
    },
    closeSensorSettings() {
      this.sensorSettingsDialog = false;
    },
    async toggleSensor(sensor) {
      try {
        // First, fetch all sensors to get the most up-to-date information
        const company_id = JSON.parse(localStorage.getItem('user')).company_id;
        const response = await kontrolix_api.getAllSensors(company_id);
        const updatedSensor = response.data.find(s => s.sensor_id === sensor.sensor_id);

        if (!updatedSensor) {
          throw new Error('Sensor not found');
        }

        if (typeof updatedSensor.is_active !== 'boolean') {
          throw new Error('Sensor active status is invalid');
        }

        // Toggle the sensor
        await kontrolix_api.toggleSensor(updatedSensor.sensor_id, !updatedSensor.is_active);

        // Refresh the sensor data after toggling
        await this.fetchActiveSensors();
        await this.fetchSensorData();
        await this.fetchAllSensors();

        // Check if all sensors are inactive
        const allInactive = this.allSensors.every(s => !s.active);
        if (allInactive) {
          // Force update the page
          
        }
       
        
      } catch (error) {
        console.error('Error toggling sensor:', error);
        this.showErrorReading = true;
        this.errorText = error.message || 'Error toggling sensor';
      }
    },
    async fetchAllSensors() {
      try {
        const company_id = JSON.parse(localStorage.getItem('user')).company_id;
        const response = await kontrolix_api.getAllSensors(company_id);
        this.allSensors = response.data.map(sensor => ({
          sensor_id: sensor.sensor_id,
          mac_address: sensor.mac_address,
          active: sensor.is_active
        }));
        console.log('All sensors:', this.allSensors); // Add this line for debugging
      } catch (error) {
        console.error('Error fetching all sensors:', error);
        this.showErrorReading = true;
        this.errorText = 'Error loading all sensors';
      }
    },
    getSensorMacAddress(sensorId) {
      const sensor = this.allSensors.find(s => s.sensor_id === sensorId);
      if (sensor) {
        return sensor.mac_address;
      } else {
        console.warn(`Sensor with ID ${sensorId} not found in allSensors`);
        return 'Unknown';
      }
    },
    async addNewSensor() {
      if (!this.newSensorMacAddress) {
        this.showErrorReading = true;
        this.errorText = 'Please enter a MAC address';
        return;
      }

      try {
        const company_id = JSON.parse(localStorage.getItem('user')).company_id;
        await kontrolix_api.addSensor(company_id, this.newSensorMacAddress);
        
        // Refresh the sensor list
        await this.fetchAllSensors();
        await this.fetchActiveSensors();
        await this.fetchSensorData();

        this.newSensorMacAddress = ''; // Clear the input field
        this.showSuccessRemove = true; // Reuse this for success message
        this.$forceUpdate();
      } catch (error) {
        console.error('Error adding new sensor:', error);
        this.showErrorReading = true;
        this.errorText = error.response?.data?.message || 'Error adding new sensor';
      }
    },

    async deleteSensor(sensor) {
      try {
        await kontrolix_api.deleteSensor(sensor.sensor_id);
        
        // Refresh the sensor list
        await this.fetchAllSensors();
        await this.fetchActiveSensors();
        await this.fetchSensorData();

        this.showSuccessRemove = true;
        
      } catch (error) {
        console.error('Error deleting sensor:', error);
        this.showErrorReading = true;
        this.errorText = error.response?.data?.message || 'Error deleting sensor';
      }
    },
    startRefreshInterval() {
      this.refreshInterval = setInterval(async () => {
        await this.fetchActiveSensors();
        await this.fetchSensorData();
        this.sensorsData.forEach(sensorData => {
          if (sensorData.showGraph) {
            this.getChartData(sensorData.sensor_id).then(chartData => {
              sensorData.chartData = chartData;
              sensorData.firstTimeGraph = false;
            });
          }
        });
      }, 60000); // 60000 milliseconds = 1 minute
    },
    stopRefreshInterval() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
    },
  },
  async mounted() {
    this.loadData = true;
    try {
      await this.fetchAllSensors();
      await this.fetchActiveSensors();
      await this.fetchSensorData();
      this.startRefreshInterval(); // Start the refresh interval
    } catch (error) {
      this.showErrorReading = true;
      this.errorText = 'Error loading sensor data';
      console.error(error);
    } finally {
      this.loadData = false;
    }
  },
  beforeUnmount() {
    this.stopRefreshInterval(); // Stop the refresh interval when the component is unmounted
  }
}
</script>

<style scoped>
.color-scale {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  position: relative; /* Added to position the current-temp-line correctly */
  width: 100%; /* Ensure the scale takes the full width */
}

.color-boxes-horizontal {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 20px; /* Adjusted height for better visibility */
  position: relative; /* Added to position the current-temp-line correctly */
}

.color-box {
  width: 1%; /* Adjusted width to fit 100 boxes within the container */
  height: 100%; /* Ensure the boxes take the full height of the container */
  background-color: transparent; /* Ensure the boxes are visible */
}

.current-temp-line {
  position: absolute;
  height: 20px;
  width: 2px;
  background-color: white;
  top: 0;
}

.scale-labels {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
}

.min-temp, .max-temp {
  font-size: 12px;
  color: #000;
}

.waiting-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}
</style>
