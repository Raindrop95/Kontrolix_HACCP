<template>
  <v-card class="mx-auto my-12" min-width="500px" max-height="800px" style="overflow-y: scroll"
    ><!-- <v-col align="center"
          ><v-row> <qrcode-vue value="test" size="150" level="H" /></v-row>
        </v-col> -->
    <v-card-item>
      <v-card-title>{{ cardTitle }}</v-card-title>

      <v-card-subtitle>
        <span class="me-1">#{{ currentQrCode }}</span>
      </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      Please select a category:
      <v-chip-group v-model="selectedCategory" style="margin-bottom: 20px" mandatory column>
        <v-chip filter :disabled="fixedQrCode">Food</v-chip>
        <v-chip filter :disabled="fixedQrCode">Workspace</v-chip>
        <v-chip filter :disabled="!fixedQrCode">Location</v-chip>
      </v-chip-group>
      <v-sheet v-if="selectedCategory == 0">
        <v-form @submit.prevent>
          <v-row
            ><v-col>
              <v-combobox
                v-model="selectedProductName"
                :rules="rules"
                label="Productname"
                :items="productNames"
              ></v-combobox
            ></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="batchNumber"
                :rules="rules"
                label="Batch number"
              ></v-text-field></v-col
          ></v-row>
          <v-row
            ><v-col>
              <v-text-field v-model="quantity" :rules="rules" label="Quantity"></v-text-field
            ></v-col>
            <v-col>
              <v-text-field
                v-model="deliveryTemperature"
                :rules="rules"
                label="Delivery Temperature (in C)"
              ></v-text-field></v-col
          ></v-row>
          <v-row>
            <v-col>
              <v-file-input
                show-size
                v-model="deliveryNote"
                label="Delivery Note"
                outlined
                prepend-icon="mdi-camera"
                dense
                capture="environment"
                accept="image/*"
              ></v-file-input></v-col
          ></v-row>
          <v-row>
            <v-col>
              <v-file-input
                show-size
                v-model="deliveryImage"
                label="Delivery Image"
                outlined
                prepend-icon="mdi-camera"
                dense
                capture="environment"
                accept="image/*"
              ></v-file-input></v-col
          ></v-row>
          <v-col style="margin-bottom: 20px">
            <v-row justify="center" align="center">
              <v-text-field
                v-model="packedOnDate_Str"
                :counter="10"
                :disabled="true"
                label="Packed On Date"
                hide-details
                required
              ></v-text-field>
              <v-btn
                color="surface-variant"
                icon="mdi-calendar"
                size="small"
                style="margin-left: 10px"
                @click="showPackedOnPicker = true"
                variant="flat"
              ></v-btn> </v-row
          ></v-col>
          <v-col style="margin-bottom: 20px">
            <v-row justify="center" align="center">
              <v-text-field
                v-model="bestBeoreDate_Str"
                :counter="10"
                :disabled="true"
                label="Best Before Date"
                hide-details
                required
              ></v-text-field>
              <v-btn
                color="surface-variant"
                icon="mdi-calendar"
                size="small"
                style="margin-left: 10px"
                @click="showBestBeforePicker = true"
                variant="flat"
              ></v-btn> </v-row
          ></v-col>
          <v-btn
            class="mt-2"
            color="primary"
            :loading="creatingNewCode"
            type="submit"
            @click="addNewQrCode"
            block
            >Save new QR-Code</v-btn
          >
        </v-form></v-sheet
      >
      <v-sheet v-else-if="selectedCategory == 1">
        <v-form @submit.prevent>
          <v-row>
            <v-col>
              <v-text-field
                v-model="workspaceName"
                :rules="rules"
                label="Workspacename"
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
              <v-img :width="300" aspect-ratio="16/9" cover :src="uploadedImage"></v-img
            ></v-col>
          </v-row>
          <v-btn
            class="mt-2"
            color="primary"
            :loading="creatingNewCode"
            type="submit"
            @click="addNewQrCode"
            block
            >Save New Qr-Code</v-btn
          >
        </v-form></v-sheet
      >
      <v-sheet v-else-if="selectedCategory == 2">
        <v-form @submit.prevent>
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
              <v-img :width="300" aspect-ratio="16/9" cover :src="uploadedImage"></v-img
            ></v-col>
          </v-row>
          <v-btn
            class="mt-2"
            color="primary"
            :loading="creatingNewCode"
            type="submit"
            @click="addNewQrCode"
            block
            >Save New Qr-Code</v-btn
          >
        </v-form></v-sheet
      >
      <!-- <v-sheet v-else>gfd</v-sheet> -->
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
  emits('closeNewQr', false)
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
      cardTitle: '',
      showSnackbar: false,
      snackColor: 'success',
      snackText: '',
      uploadedImage: null,
      creatingNewCode: false,
      selectedFile: null,
      fixedQrCode: false,
      deliveryImage: null,
      deliveryNote: null,
      currentQrCode: '',
      selectedCategory: 0,
      productNames: [],
      locationName: '',
      showPackedOnPicker: false,
      showBestBeforePicker: false,
      user_id: '',
      batchNumber: '',
      deliveryTemperature: '',
      quantity: '',
      packedOnDate: new Date(),
      bestBeforeDate: new Date(),
      packedOnDate_Str: '',
      bestBeoreDate_Str: '',
      selectedProductName: '',
      selectedPrefferedCleaningAgent: [],
      cleaningAgents: [],
      workspaceName: '',
      selectedPrefferedImage: null,
      rules: [
        (value) => {
          if (value) return true

          return 'This field cannot be empty!'
        }
      ]
    }
  },
  watch: {
    packedOnDate(newValue, oldValue) {
      // This function will be called every time packedOnDate changes
      this.packedOnDate_Str = newValue.toLocaleDateString('en-GB')
    },
    bestBeforeDate(newValue, oldValue) {
      // This function will be called every time packedOnDate changes
      this.bestBeoreDate_Str = newValue.toLocaleDateString('en-GB')
    }
  },
  methods: {
    readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })
    },
    addNewQrCode() {
      console.log(this.selectedCategory)
      this.creatingNewCode = true // Use 'this' to access the property
      if (this.selectedCategory == 0) {
        if (
          this.selectedProductName != '' ||
          this.deliveryImage != null ||
          this.deliveryNote != null
        ) {
          Promise.all([
            this.readFileAsBase64(this.deliveryNote[0]),
            this.readFileAsBase64(this.deliveryImage[0])
          ]).then(([base64String1, base64String2]) => {
            const imageData = [base64String1, base64String2]

            kontrolix_api
              .addNewFoodQrCode(
                this.currentQrCode,
                1,
                this.selectedProductName,
                this.packedOnDate,
                this.bestBeforeDate,
                this.user_id,
                this.batchNumber,
                this.quantity,
                this.deliveryTemperature,
                imageData[0],
                imageData[1],
                JSON.parse(localStorage.getItem('user')).company_id
              )
              .then((response) => {
                this.$emit('successQr')
              })
          })
        }
      } else if (this.selectedCategory == 1) {
        if (!this.selectedFile || this.selectedFile.length === 0) {
          this.snackColor = 'red'
          this.snackText = 'Please select an Image!'
          this.showSnackbar = true
        } else {
          if (this.selectedPrefferedCleaningAgent.length == 0) {
            this.snackColor = 'red'
            this.snackText = 'Please select at least one preferred cleaning agent!'
            this.showSnackbar = true
          } else {
            if (this.workspaceName == '') {
              this.snackColor = 'red'
              this.snackText = 'You have to give a workspacename!'
              this.showSnackbar = true
            }
            const reader = new FileReader()
            reader.onload = (e) => {
              const base64String = e.target.result
              const imageData = [base64String] // Put the base64 string into an array
              kontrolix_api
                .addNewWorkspaceCode(
                  this.currentQrCode,
                  this.workspaceName,
                  this.selectedPrefferedCleaningAgent,
                  imageData,
                  JSON.parse(localStorage.getItem('user')).company_id
                )
                .then((response) => {
                  this.$emit('successQr')
                })
            }
            reader.readAsDataURL(this.selectedFile[0]) // Assuming `selectedFile` is an array of files
          }
        }
      } else if (this.selectedCategory == 2) {
        if (!this.selectedFile || this.selectedFile.length === 0) {
          this.snackColor = 'red'
          this.snackText = 'Please select an Image!'
          this.showSnackbar = true
        } else if (this.selectedPrefferedCleaningAgent.length == 0) {
          this.snackColor = 'red'
          this.snackText = 'Please select at least one preferred cleaning agent!'
          this.showSnackbar = true
        } else if (this.locationName == '') {
          this.snackColor = 'red'
          this.snackText = 'You have to give a location name!'
          this.showSnackbar = true
        } else {
          this.readFileAsBase64(this.selectedFile[0]).then(base64String => {
            const data = {
            currentQrCode: this.scannedQrCode,
            location_name: this.locationName,
            preferred_cleaning_agents: this.selectedPrefferedCleaningAgent,
            imageData: base64String,
            company_id: JSON.parse(localStorage.getItem('user')).company_id
          };
          kontrolix_api.addNewLocationCode(data)
            .then((response) => {
              this.$emit('successQr');
            })
            .catch((error) => {
              console.error('Error adding new location code:', error);
              this.snackColor = 'red';
              this.snackText = 'Error adding new location code. Please try again.';
              this.showSnackbar = true;
            });
          })
        }
      }
      this.creatingNewCode = false // Use 'this' to access the property
    },
    uploadImage() {
      if (this.selectedFile && this.selectedFile.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile[0]);
      } else {
        // Clear the image preview if no file is selected
        this.imagePreview = null;
      }
    },
    loadItem() {}
  },
  async mounted() {
    await kontrolix_api
      .getProductNames(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.productNames[this.productNames.length] = response.data[i].product_name
        }
      })

    await kontrolix_api
      .getAllCleaningAgents(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.cleaningAgents[this.cleaningAgents.length] = response.data[i].agent_name
        }
      })
    this.currentQrCode = this.scannedQrCode
    console.log(this.scannedQrCode)
    kontrolix_api.getQrCodeInfo(this.scannedQrCode).then((response) => {
      if (response.data[0].is_fixed == true) {
        this.cardTitle = 'Add new fixed QR-Code'
        this.fixedQrCode = true
        this.selectedCategory = 2
      } else {
        this.cardTitle = 'Add new QR-Code'
        this.fixedQrCode = false
        this.selectedCategory = 0
      }
    })
    const obj = JSON.parse(localStorage.getItem('user'))
    const idValue = obj.id
    this.user_id = idValue

    this.packedOnDate_Str = this.packedOnDate.toLocaleDateString('en-GB')
    this.bestBeoreDate_Str = this.bestBeforeDate.toLocaleDateString('en-GB')
  }
}
</script>
<style></style>
