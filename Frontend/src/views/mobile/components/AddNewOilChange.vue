<template>
  <v-card style="max-height: 80vh; width: 100vw; overflow-y: scroll"
    ><!-- <v-col align="center"
                ><v-row> <qrcode-vue value="test" size="150" level="H" /></v-row>
              </v-col> -->
    <v-card-item>
      <v-card-title>Add New Oil Change</v-card-title>

      <v-card-subtitle>
        <span class="me-1">Please provide all Informations of the oil change. </span>
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-sheet>
        <v-form @submit.prevent>
          <v-row
            ><v-col>
              <v-text-field
                :rules="rules"
                v-model="containerName"
                label="Container Name"
              ></v-text-field
              ><v-text-field :rules="rules" v-model="oilType" label="Oil Type"></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-text-field
                v-model="quantity"
                :rules="rules"
                suffix="L"
                type="number"
                label="Quantity (L)"
              ></v-text-field
            ></v-col>
            <v-col
              ><v-text-field
                :rules="rules"
                v-model="phVal"
                label="pH-Value"
                type="number"
              ></v-text-field
            ></v-col>
          </v-row>

          <v-btn class="mt-2" color="primary" type="submit" @click="addOilChange()" block
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
import kontrolix_api from '../../../services/kontrolix_api.service'

import { fa } from 'vuetify/lib/iconsets/fa.mjs'
import { walkIdentifiers } from 'vue/compiler-sfc'

export default {
  components: {},
  props: ['currentAgentId'],
  setup() {},
  name: 'Details',
  data() {
    return {
      containerName: '',
      oilType: '',
      quantity: '',
      phVal: '',

      showSnackbar: false,
      snackColor: 'success',
      snackText: '',

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
    addOilChange() {
      if (
        this.containerName != '' &&
        this.oilType != '' &&
        this.quantity != '' &&
        this.phVal != ''
      ) {
        kontrolix_api
          .addNewOilChange(
            JSON.parse(localStorage.getItem('user')).company_id,
            this.containerName,
            this.oilType,
            this.phVal,
            this.quantity,
            JSON.parse(localStorage.getItem('user')).id
          )
          .then((response) => {
            this.$emit('successCreated')
          })
      } else {
        this.snackColor = 'red'
        this.snackText = 'Please fill out all fields!'
        this.showSnackbar = true
      }
    },

    close() {
      this.$emit('close')
    }
  },
  async mounted() {}
}
</script>
<style></style>
