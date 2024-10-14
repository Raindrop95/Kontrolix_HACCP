<template>
  <v-card class="mx-auto my-12" min-width="500px"
    ><!-- <v-col align="center"
                ><v-row> <qrcode-vue value="test" size="150" level="H" /></v-row>
              </v-col> -->
    <v-card-item>
      <v-card-title>Throw Out Food</v-card-title>

      <v-card-subtitle>
        <span class="me-1"
          >Please provide a reason why this food item has to be thrown away and upload a picture of
          the food.
        </span>
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-sheet>
        <v-form @submit.prevent>
          <v-row
            ><v-col>
              <v-text-field v-model="reasonText" :rules="rules" label="Reason"></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-file-input
                show-size
                v-model="selectedFile"
                label="Food image"
                outlined
                prepend-icon="mdi-camera"
                dense
                capture="environment"
                accept="image/*"
              ></v-file-input></v-col
          ></v-row>

          <v-btn class="mt-2" color="red" type="submit" @click="throwAway()" block
            >Throw Food Away</v-btn
          >
        </v-form></v-sheet
      >
    </v-card-text>
    <v-card-actions>
      <v-btn @click="closeWindow()"> Cancel </v-btn>
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
  props: ['selectedQrCode'],
  setup() {},
  name: 'Details',
  data() {
    return {
      showSnackbar: false,
      snackColor: 'success',
      snackText: '',
      uploadedImage: null,
      selectedFile: null,
      reasonText: '',

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
            kontrolix_api.newCleaningAgent(this.agentName, imageData).then((response) => {
              this.$emit('successAgent')
            })
          }
          reader.readAsDataURL(this.selectedFile[0])
        }
      }
    },
    closeWindow() {
      this.$emit('closed')
    },
    throwAway() {
      if (this.reasonText == '' || this.selectedFile == null) {
        this.snackColor = 'red'
        this.snackText =
          'You must enter a reason why you throw this item out and upload a picture of the food!'
        this.showSnackbar = true
      } else {
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64String = e.target.result
          const imageData = [base64String] // Put the base64 string into an array
          kontrolix_api.throwFoodItemAway(
            JSON.parse(localStorage.getItem('user')).company_id,
            '8',
            this.selectedQrCode.qr_code_id,
            this.reasonText,
            this.user_id,
            imageData
          )
          this.$emit('successDelete')
        }
        reader.readAsDataURL(this.selectedFile[0])
      }
    }
  },
  async mounted() {
    const obj = JSON.parse(localStorage.getItem('user'))
    const idValue = obj.id
    this.user_id = idValue
  }
}
</script>
<style></style>
