<template>
  <v-card style="overflow-y: auto">
    <v-tabs v-model="selectedTabItem" color="primary" stacked align-tabs="center">
      <v-tab value="cameraScanner"> <v-icon>mdi-camera</v-icon></v-tab>
      <v-tab value="handheldScanner"> <v-icon>mdi-qrcode-scan</v-icon></v-tab>
      <v-tab value="manualInput"> <v-icon>mdi-keyboard-variant</v-icon></v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="selectedTabItem">
        <v-window-item value="cameraScanner">
          <v-row>
            <QrCodeScanner @result-changed="handleResultChange"></QrCodeScanner>
          </v-row>
        </v-window-item>

        <v-window-item value="handheldScanner">
          <v-row>
            <HandScanner @result-changed="handleResultChange"></HandScanner>
          </v-row>
        </v-window-item>
        <v-window-item value="manualInput">
          <v-row> <CodeSearch @result-changed="handleResultChange"></CodeSearch> </v-row>
        </v-window-item>
      </v-window>
      <p class="text-disabled">Last registered QR-Code: {{ prevScannedQrCode }}</p>
    </v-card-text>
    <v-dialog v-model="showDetailsComponent" width="auto">
      <v-row>
        <DetailsCard
          @deletion="validateDeletion()"
          @logUpdate="updatedFoodLog()"
          @close="showDetailsComponent = false"
          v-if="currentCategory == 1"
          :scannedQrCode="prevScannedQrCode" /><DetailsWorkspace
          @deletion="validateDeletion()"
          @logUpdate="updatedWorkspaceLog()"
          @close="showDetailsComponent = false"
          v-if="currentCategory == 2"
          :scannedQrCode="prevScannedQrCode"
        ></DetailsWorkspace>
        <DetailsLocation
          @deletion="validateDeletion()"
          @logUpdate="updatedWorkspaceLog()"
          @close="showDetailsComponent = false"
          v-if="currentCategory == 3"
          :scannedQrCode="prevScannedQrCode"
        >
        </DetailsLocation
      ></v-row>
    </v-dialog>

    <v-dialog v-model="showNewQrCode" width="auto">
      <v-row>
        <NewQrCode
          :scannedQrCode="prevScannedQrCode"
          @successQr="newQrCodeSuccess()"
          @closeNewQr="showNewQrCode = false"
      /></v-row>
    </v-dialog>
    <v-card-actions
      ><v-btn color="blue-darken-1" variant="text" @click="closeLogs()"
        >close</v-btn
      ></v-card-actions
    >
  </v-card>
  <v-snackbar v-model="showSuccessRemove" timeout="3000" color="green">
    Food object was removed successfully!

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
</template>
<script setup>
import HandScanner from './HandScanner.vue'
import QrCodeScanner from './QrCodeScanner.vue'
import CodeSearch from './CodeSearch.vue'
import DetailsCard from './QrCodeDetailsFood.vue'
import NewQrCode from './NewQrCode.vue'
import kontrolix_api from '../services/kontrolix_api.service'
import DetailsWorkspace from './QrCodeDetailWorkspace.vue'
import DetailsLocation from './QrCodeDetailsLocation.vue'

import { ref } from 'vue'
import { fa } from 'vuetify/lib/iconsets/fa.mjs'
var result = ref('')
var prevScannedQrCode = ref('')
var showDetailsComponent = ref(false)
var showSuccessRemove = ref(false)
var showErrorReading = ref(false)
var errorText = ref('')
var showNewQrCode = ref(false)
var errorColor = ref('red')
var currentCategory = ref(0)

const emits = defineEmits()

function closeLogs() {
  emits('close', false)
}

function newQrCodeSuccess() {
  showNewQrCode.value = false
  errorText.value = 'New QR code has been successfully created!'
  errorColor.value = 'green'
  showErrorReading.value = true
}

function updatedFoodLog() {
  showDetailsComponent.value = false
  errorText.value = 'Log for food item has been successfully added!'
  errorColor.value = 'green'
  showErrorReading.value = true
}

function updatedWorkspaceLog() {
  showDetailsComponent.value = false
  errorText.value = 'Log for workspace has been successfully added!'
  errorColor.value = 'green'
  showErrorReading.value = true
}

function handleResultChange(newValue) {
  result.value = newValue.replace('#', '')

  if (result.value != '') {
    kontrolix_api.getQrCodeInfo(result.value).then((response) => {
      if (response.data == 'ERROR01') {
        errorColor.value = 'red'
        showErrorReading.value = true
        errorText.value = 'This QR-Code could not been found in you Account!'
      } else if (response.data == 'ERROR02') {
        showNewQrCode.value = true
      } else {
        if (response.data[0].registered_company_id == null) {
          if (
            response.data[0][0].company_id != JSON.parse(localStorage.getItem('user')).company_id
          ) {
            errorColor.value = 'red'
            showErrorReading.value = true
            errorText.value = 'This QR-Code could not been found in you Account!'
          } else {
            if (response.data[1] == 0) {
              showNewQrCode.value = true
            } else if (response.data[1] == 1) {
              currentCategory = 1
              showDetailsComponent.value = true
            } else if (response.data[1] == 2) {
              currentCategory = 2
              showDetailsComponent.value = true
            } else if (response.data[1] == 3) {
              currentCategory = 3
              showDetailsComponent.value = true
            }
          }
        } else {
          if (
            response.data[0].registered_company_id ==
            JSON.parse(localStorage.getItem('user')).company_id
          ) {
            console.log(response.data)
            if (response.data[1] == 0) {
              showNewQrCode.value = true
            } else if (response.data[1] == 1) {
              currentCategory = 1
              showDetailsComponent.value = true
            } else if (response.data[1] == 2) {
              currentCategory = 2
              showDetailsComponent.value = true
            } else if (response.data[1] == 3) {
              currentCategory = 3
              showDetailsComponent.value = true
            }
          } else {
            errorColor.value = 'red'
            showErrorReading.value = true
            errorText.value = 'This QR-Code could not been found in you Account!'
          }
        }
      }
      prevScannedQrCode.value = result.value
      result.value = ''
    })
  }
}

function validateDeletion() {
  showDetailsComponent.value = false
  showSuccessRemove.value = true
}
</script>
<script>
export default {
  components: { QrCodeScanner, HandScanner, DetailsCard, NewQrCode },
  setup() {
    const ReadQrCode = ref('')
    return { ReadQrCode }
  },
  name: 'Register',
  data() {
    return {
      selectedTabItem: 0,
      showDetails: true,
      showDetailsComponent: false
    }
  },
  methods: {}
}
</script>
<style></style>
