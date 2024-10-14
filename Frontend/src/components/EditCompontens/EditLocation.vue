<template>
  <v-card class="mx-auto my-12" min-width="500px"
    ><!-- <v-col align="center"
                ><v-row> <qrcode-vue value="test" size="150" level="H" /></v-row>
              </v-col> -->
    <v-card-item>
      <v-card-title>Edit Location</v-card-title>

      <v-card-subtitle>
        <p style="text-wrap: wrap">
          For fixed QR-Codes, you can change the location name, image and cleaning agents.
        </p>
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-sheet>
        <v-form @submit.prevent>
          <v-row>
            <v-col align="center"> <img :width="300" :src="locationImage" alt="Image" /> </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="locationName"
                :rules="rules"
                label="Location name"
              ></v-text-field></v-col
          ></v-row>
          <v-row
            ><v-col>
              <v-combobox
                v-model="selectedPrefferedCleaningAgent"
                :rules="rules"
                chips
                multiple
                label="Preferred Cleaning Agent"
                :items="cleaningAgents"
              ></v-combobox
            ></v-col>
          </v-row>
          <v-row
            ><v-col>
              <v-file-input
                show-size
                v-model="selectedFile"
                label="Preferred Cleaning Condition"
                outlined
                prepend-icon="mdi-camera"
                dense
                capture="environment"
                accept="image/*"
                @change="loadPreview()"
              ></v-file-input>
              <!-- <v-img :width="300" aspect-ratio="16/9" cover :src="uploadedImage"></v-img> -->
            </v-col>
          </v-row>
          <v-btn
            class="mt-2"
            color="primary"
            :loading="creatingNewCode"
            type="submit"
            @click="editLocation()"
            block
            >Save Changes</v-btn
          >
        </v-form></v-sheet
      >
    </v-card-text>
    <v-card-actions>
      <v-btn @click="closeEdit()"> Close </v-btn>
    </v-card-actions>
  </v-card>

  <v-snackbar v-model="showSnackbar" timeout="3000" :color="snackColor">
    {{ snackText }}

    <template v-slot:actions>
      <v-btn variant="text" @click="showSnackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup>
import { ref } from 'vue'
const result = ref('')
const emits = defineEmits()

function closeEdit() {
  emits('close', false)
}
</script>
<script>
import QrcodeVue from 'qrcode.vue'
import kontrolix_api from '../../services/kontrolix_api.service'

import { fa } from 'vuetify/lib/iconsets/fa.mjs'
import { walkIdentifiers } from 'vue/compiler-sfc'

export default {
  components: {
    QrcodeVue
  },
  props: ['scannedQrCode'],
  setup() {},
  name: 'Details',
  data() {
    return {
      showSnackbar: false,
      snackColor: 'success',
      snackText: '',
      locationImage: null,
      uploadedImage: null,
      selectedFile: null,
      agentName: '',
      locationName: '',
      user_id: '',
      cleaningAgents: [],
      selectedPrefferedCleaningAgent: [],
      qr_code_id: '',
      rules: [
        (value) => {
          if (value) return true

          return 'This field cannot be empty!'
        }
      ]
    }
  },
  watch: {},
  methods: {
    editLocation() {
      if (this.selectedPrefferedCleaningAgent.length == 0) {
        this.snackColor = 'red'
        this.snackText = 'Please select at least one preferred cleaning agent!'
        this.showSnackbar = true
      } else {
        if (this.locationName == '') {
          this.snackColor = 'red'
          this.snackText = 'You have to give a location name!'
          this.showSnackbar = true
        } else {
          if (this.selectedFile != null) {
            const reader = new FileReader()
            reader.onload = (e) => {
              const base64String = e.target.result
              const imageData = [base64String] // Put the base64 string into an array
              kontrolix_api
                .editLocationData(
                  this.qr_code_id,
                  this.locationName,
                  this.selectedPrefferedCleaningAgent,
                  imageData,
                  JSON.parse(localStorage.getItem('user')).company_id
                )
                .then((response) => {
                  this.$emit('successEdit')
                })
            }
            reader.readAsDataURL(this.selectedFile[0])
          } else {
            kontrolix_api
              .editLocationData(
                this.qr_code_id,
                this.locationName,
                this.selectedPrefferedCleaningAgent,
                null,
                JSON.parse(localStorage.getItem('user')).company_id
              )
              .then((response) => {
                this.$emit('successEdit')
              })
          }
        }
      }
    },
    loadPreview() {
      if (this.selectedFile && this.selectedFile.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImage = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile[0]);
      } else {
        this.uploadedImage = null;
      }
    }
  },
  async mounted() {
    await kontrolix_api.getQrCodeInfo(this.scannedQrCode).then(async (response) => {
      var activeAgents = response.data[0][0].preferred_cleaning_agent.split(',')
      var activeAgentsName = []
      this.qr_code_id = response.data[0][0].qr_code_id

      this.locationName = response.data[0][0].location_name
      this.locationImage = response.data[2]
      await kontrolix_api
        .getAllCleaningAgents(JSON.parse(localStorage.getItem('user')).company_id)
        .then((agents) => {
          for (let i = 0; i < agents.data.length; i++) {
            this.cleaningAgents[this.cleaningAgents.length] = agents.data[i].agent_name
            for (let j = 0; j < activeAgents.length; j++) {
              if (activeAgents[j] == agents.data[i].id) {
                activeAgentsName[activeAgentsName.length] = agents.data[i].agent_name
              }
            }
          }
          this.selectedPrefferedCleaningAgent = activeAgentsName
        })
    })
  }
}
</script>
<style></style>
