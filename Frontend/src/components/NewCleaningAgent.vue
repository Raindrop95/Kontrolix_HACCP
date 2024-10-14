<template>
  <v-card class="mx-auto my-12" min-width="500px"
    ><!-- <v-col align="center"
            ><v-row> <qrcode-vue value="test" size="150" level="H" /></v-row>
          </v-col> -->
    <v-card-item>
      <v-card-title>Add New Cleaning Agent</v-card-title>

      <v-card-subtitle>
        <span class="me-1"
          >The information sheet refers to the package leaflet, which contains the composition and
          chemical warnings.
        </span>
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-sheet>
        <v-form @submit.prevent>
          <v-row
            ><v-col>
              <v-text-field
                v-model="agentName"
                :rules="rules"
                label="Cleaning Agent Name"
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-file-input
                show-size
                v-model="selectedFile"
                label="Information Sheet"
                outlined
                prepend-icon="mdi-camera"
                dense
                capture="environment"
                accept="image/*"
              ></v-file-input></v-col
          ></v-row>

          <v-btn
            class="mt-2"
            color="primary"
            type="submit"
            @click="addNewCleaningAgent"
            block
            :loading="isLoadingCreate"
            >Save new Cleaning Agent</v-btn
          >
        </v-form></v-sheet
      >
    </v-card-text>
    <v-card-actions>
      <v-btn @click="closeLogs()"> Close </v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="showPackedOnPicker" width="auto">
    <v-date-picker label="Select a date" :max="new Date()" v-model="packedOnDate"></v-date-picker>
    <v-btn @click="showPackedOnPicker = false">close</v-btn> </v-dialog
  ><v-dialog v-model="showBestBeforePicker" width="auto">
    <v-date-picker label="Select a date" :min="new Date()" v-model="bestBeforeDate"></v-date-picker>
    <v-btn @click="showBestBeforePicker = false">close</v-btn>
  </v-dialog>
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
function closeLogs() {
  emits('close', false)
}
</script>
<script>
import QrcodeVue from 'qrcode.vue'
import kontrolix_api from '../services/kontrolix_api.service'

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
      uploadedImage: null,
      selectedFile: null,
      agentName: '',
      isLoadingCreate: false,
      user_id: '',

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
    addNewCleaningAgent() {
      this.isLoadingCreate = true
      if (this.agentName != '') {
        if (!this.selectedFile || this.selectedFile.length === 0) {
          this.snackColor = 'red'
          this.snackText = 'Please select an Image!'
          this.showSnackbar = true
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            const base64String = e.target.result
            const imageData = [base64String] // Put the base64 string into an array
            kontrolix_api
              .newCleaningAgent(
                this.agentName,
                imageData,
                JSON.parse(localStorage.getItem('user')).company_id
              )
              .then((response) => {
                this.isLoadingCreate = false
                this.$emit('successAgent')
              })
          }
          reader.readAsDataURL(this.selectedFile[0])
        }
      }
    },

    uploadImage() {},
    loadItem() {}
  },
  async mounted() {}
}
</script>
<style></style>
