<template>
  <v-card class="mx-auto my-12" min-width="500px"
    ><!-- <v-col align="center"
              ><v-row> <qrcode-vue value="test" size="150" level="H" /></v-row>
            </v-col> -->
    <v-card-item>
      <v-card-title>Edit Cleaning Agent</v-card-title>

      <v-card-subtitle>
        <span class="me-1"
          >Change the name of the selected cleaning agent or upload a new informationsheet image.
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
                label="New Information Sheet"
                outlined
                prepend-icon="mdi-camera"
                dense
                capture="environment"
                accept="image/*"
              ></v-file-input></v-col
          ></v-row>

          <v-btn class="mt-2" color="primary" type="submit" @click="saveChanges()" block
            >Save Changes</v-btn
          >
        </v-form></v-sheet
      >
    </v-card-text>
    <v-card-actions>
      <v-btn @click="closeLogs()"> Close </v-btn>
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
  props: ['currentAgentId'],
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
            kontrolix_api
              .newCleaningAgent(
                this.agentName,
                imageData,
                JSON.parse(localStorage.getItem('user')).company_id
              )
              .then((response) => {
                this.$emit('successAgent')
              })
          }
          reader.readAsDataURL(this.selectedFile[0])
        }
      }
    },

    saveChanges() {
      if (this.agentName == '' && this.selectedFile == null) {
        this.snackColor = 'red'
        this.snackText =
          'You must at least enter a new name or upload a new information sheet to edit this item!'
        this.showSnackbar = true
      } else {
        if (this.selectedFile != null) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const base64String = e.target.result
            const imageData = [base64String] // Put the base64 string into an array
            kontrolix_api
              .editCleaningAgent(this.currentAgentId, this.agentName, imageData)
              .then((response) => {
                this.$emit('successEdit')
              })
          }
          reader.readAsDataURL(this.selectedFile[0])
        } else {
          kontrolix_api
            .editCleaningAgent(this.currentAgentId, this.agentName, null)
            .then((response) => {
              this.$emit('successEdit')
            })
        }
      }
    }
  },
  async mounted() {
    kontrolix_api.getCleaningAgentById(this.currentAgentId).then((response) => {
      this.agentName = response.data[0].agent_name
    })
  }
}
</script>
<style></style>
