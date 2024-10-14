<template>
  <v-container class="mb-6">
    <v-col>
      <v-row
        ><v-sheet
          color="surface-light"
          style="padding: 20px; border-radius: 30px; margin-bottom: 20px"
          ><v-col align="center"
            ><v-row
              ><v-col align="center">
                <p class="text-h5 text-md-h5 text-lg-h4">Scan QR-Code</p></v-col
              ></v-row
            ><v-row>
              <p class="font-weight-thin">
                Scan a QR-Code by using a handheld Scanner. Make sure that the correct keyboard
                language is selected!
              </p></v-row
            >
          </v-col></v-sheet
        ><v-col align="center">
          <v-row style="margin-bottom: 20px"
            ><v-col><v-icon size="100">mdi-qrcode-scan</v-icon></v-col></v-row
          >
        </v-col>
      </v-row></v-col
    >
  </v-container>
</template>
<style scoped></style>

<script setup lang="js">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { defineEmits } from 'vue'

const emits = defineEmits()

const isListening = ref(false)
const result = ref('')
const tmp = ref('')
let timerId = null

const handleKeyDown = (event) => {
  if (event.key === '#') {
    tmp.value = ''
    tmp.value += event.key
    startListening()
  } else if (isListening.value) {
    tmp.value += event.key
    if (tmp.value.endsWith('Enter')) {
      stopListening()
      tmp.value = tmp.value.replace('Enter', '')
      tmp.value = tmp.value.replace('#', '')
      result.value = tmp.value
    }
  }
}
// watch(result, (newValue) => {
//   // Emit an event when result changes
//   emits(
//     'result-changed',
//     newValue.replace('[', '').replace(']', '').replace('"', '').replace('"', '')
//   )
// })

const startListening = () => {
  isListening.value = true
  clearTimer()
  if (tmp.value.endsWith('Enter')) {
    stopListening()
  }
}

const stopListening = () => {
  tmp.value = tmp.value.replace('Enter', '')
  isListening.value = false
  emits(
    'result-changed',
    tmp.value.replace('[', '').replace(']', '').replace('"', '').replace('"', '')
  )
  tmp.value = ''
}

const clearTimer = () => {
  clearTimeout(timerId)
  timerId = null
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  clearTimer()
})
</script>
<style scoped></style>
