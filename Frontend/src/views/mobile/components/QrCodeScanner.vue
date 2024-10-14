<template>
  <v-container class="mb-6">
    <v-row align="center">
      <v-col>
        <v-sheet
          color="surface-light"
          style="padding: 20px; border-radius: 30px; margin-bottom: 20px"
          ><v-col align="center"
            ><v-row
              ><v-col align="center">
                <p class="text-h5 text-md-h5 text-lg-h4">Scan QR-Code</p></v-col
              ></v-row
            ><v-row>
              <p class="font-weight-thin">
                Scan a QR-Code by using the integrated camera or a webcam.
              </p></v-row
            ></v-col
          ></v-sheet
        >
        <select v-model="selectedDevice">
          <option v-for="device in devices" :key="device.label" :value="device">
            {{ device.label }}
          </option>
        </select>
        <v-card
          v-if="cameraInUse"
          class="d-flex justify-center align-center mb-6"
          variant="elevated"
          :width="400"
          :height="200"
        >
          <v-col>
            <v-row>
              <v-col align="center">
                <v-icon size="50">mdi-camera-off</v-icon>
              </v-col>
            </v-row>
            <v-row>
              <v-col align="center">{{ errorText }} </v-col>
            </v-row>
          </v-col>
        </v-card>
        <v-card
          v-if="!cameraInUse"
          color="primary"
          class="d-flex justify-center align-center"
          style="padding: 5px"
        >
          <qrcode-stream
            :paused="paused"
            :constraints="{ deviceId: selectedDevice.deviceId }"
            :track="trackFunctionSelected.value"
            :formats="selectedBarcodeFormats"
            @error="onError"
            @detect="onDetect"
            v-if="selectedDevice !== null"
          >
            <div v-show="showScanConfirmation" class="scan-confirmation">
              <img src="../../../assets/check.svg" alt="Checkmark" width="128" />
            </div>
          </qrcode-stream>
        </v-card>

        <v-row style="visibility: hidden">
          <select v-model="selectedDevice">
            <option v-for="device in devices" :key="device.label" :value="device">
              {{ device.label }}
            </option>
          </select></v-row
        >
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col align="center">
        <v-btn :disabled="scanAgainBtnDisabled" v-if="!cameraInUse" @click="scanAgain()"
          >Scan Again</v-btn
        ></v-col
      ></v-row
    >
    <v-snackbar v-model="showError" color="red" :timeout="timeout">
      <v-icon icon="mdi-alert-circle-outline" style="margin-right: 10px"></v-icon>{{ errorText }}
    </v-snackbar></v-container
  >
</template>
<style scoped></style>

<script setup lang="js">
import { ref, computed, onMounted, watch, defineEmits } from 'vue'

import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
const emits = defineEmits()
/*** detection handling ***/
/*** detection handling ***/
const showError = ref(false)
const timeout = 3000
const errorText = ref('')
const cameraInUse = ref(false)
const result = ref('')
const resetDelay = 2000 // Time in milliseconds before resetting the result
var scanAgainBtnDisabled = ref(true)
var paused = ref(false)
var showScanConfirmation = ref(false)
let resetTimeout

function onDetect(detectedCodes) {
  result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue))
  clearTimeout(resetTimeout)
  resetTimeout = setTimeout(() => {
    result.value = ''
  }, resetDelay)
}

watch(result, (newValue) => {
  // Emit an event when result changes
  paused.value = true
  showScanConfirmation.value = true
  scanAgainBtnDisabled.value = false
  emits(
    'result-changed',
    newValue.replace('[', '').replace(']', '').replace('"', '').replace('"', '')
  )
})

/*** select camera ***/
const selectedDevice = ref(null)
const devices = ref([])
const deviceNames = ref([])

onMounted(async () => {
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    ({ kind }) => kind === 'videoinput'
  )
  console.log(devices.value)
  if (devices.value.length > 0) {
    if (devices.value.length > 1) {
      selectedDevice.value = devices.value[1]
    }
  }
})

/*** track functons ***/

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}
function paintBoundingBox(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height }
    } = detectedCode

    ctx.lineWidth = 2
    ctx.strokeStyle = '#007bff'
    ctx.strokeRect(x, y, width, height)
  }
}
function paintCenterText(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const { boundingBox, rawValue } = detectedCode

    const centerX = boundingBox.x + boundingBox.width / 2
    const centerY = boundingBox.y + boundingBox.height / 2

    const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'

    ctx.lineWidth = 3
    ctx.strokeStyle = '#35495e'
    ctx.strokeText(detectedCode.rawValue, centerX, centerY)

    ctx.fillStyle = '#5cb984'
    ctx.fillText(rawValue, centerX, centerY)
  }
}
const trackFunctionOptions = [
  { text: 'nothing (default)', value: undefined },
  { text: 'outline', value: paintOutline },
  { text: 'centered text', value: paintCenterText },
  { text: 'bounding box', value: paintBoundingBox }
]
const trackFunctionSelected = ref(trackFunctionOptions[1])

/*** barcode formats ***/

const barcodeFormats = ref({
  aztec: false,
  code_128: false,
  code_39: false,
  code_93: false,
  codabar: false,
  databar: false,
  databar_expanded: false,
  data_matrix: false,
  dx_film_edge: false,
  ean_13: false,
  ean_8: false,
  itf: false,
  maxi_code: false,
  micro_qr_code: false,
  pdf417: false,
  qr_code: true,
  rm_qr_code: false,
  upc_a: false,
  upc_e: false,
  linear_codes: false,
  matrix_codes: false
})
const selectedBarcodeFormats = computed(() => {
  return Object.keys(barcodeFormats.value).filter((format) => barcodeFormats.value[format])
})

/*** error handling ***/

const error = ref('')

function onError(err) {
  error.value = `[${err.name}]: `

  cameraInUse.value = true
  if (err.name === 'NotAllowedError') {
    errorText.value = 'You need to grant camera access permission!'
    error.value += 'you need to grant camera access permission'
  } else if (err.name === 'NotFoundError') {
    errorText.value = 'No camera on this device!'
    error.value += 'no camera on this device'
  } else if (err.name === 'NotSupportedError') {
    errorText.value = 'Secure context required (HTTPS, localhost)'
    error.value += 'secure context required (HTTPS, localhost)'
  } else if (err.name === 'NotReadableError') {
    errorText.value = 'Camera might be already in use!'
    error.value += 'is the camera already in use?'
  } else if (err.name === 'OverconstrainedError') {
    errorText.value = 'Installed cameras are not suitable!'
    error.value += 'installed cameras are not suitable'
  } else if (err.name === 'StreamApiNotSupportedError') {
    errorText.value = 'Stream API is not supported in this browser!'
    error.value += 'Stream API is not supported in this browser'
  } else if (err.name === 'InsecureContextError') {
    errorText.value =
      'Camera access is only permitted in secure context. Use HTTPS or localhost rather than http!'
    error.value +=
      'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  } else {
    errorText.value = err.message
    error.value += err.message
  }
  showError.value = true
}
</script>
<style scoped>
.scan-confirmation {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);

  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
</style>
