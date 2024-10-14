<template>
  <v-card style="height: 80vh; width: 100vw; overflow-y: scroll">
    <!-- <v-col align="center"
        ><v-row> <qrcode-vue value="test" size="150" level="H" /></v-row>
      </v-col> -->
    <v-card-item>
      <v-card-title>{{ fetchedQrCodeInfo.product_name }}</v-card-title>

      <v-card-subtitle>
        <span class="me-1">#{{ scannedQrCode }} </span>
      </v-card-subtitle>
      <v-card-subtitle> Quantity: {{ fetchedQrCodeInfo.quantity }}</v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-col>
        <v-row
          ><v-btn
            size="small"
            style="margin-bottom: 5px; margin-right: 10px"
            variant="outlined"
            prepend-icon="mdi-file-document-outline"
            @click="openImage(0)"
            :loading="isLoadingNote"
            >Delivery Note</v-btn
          ><v-btn
            size="small"
            style="margin-bottom: 5px"
            variant="outlined"
            prepend-icon="mdi-image-outline"
            @click="openImage(1)"
            :loading="isLoadingImage"
            >Delivery Image</v-btn
          ></v-row
        >
        <v-row>
          <v-col
            ><v-row class="text-h6">{{
              new Date(fetchedQrCodeInfo.packed_on_date).toLocaleDateString('en-GB')
            }}</v-row>
            <v-row class="text-caption">Packed On Date</v-row></v-col
          >
          <v-col
            ><v-row class="text-h6 text-red" v-if="showBestBeforeAlert">
              {{ new Date(fetchedQrCodeInfo.best_before_date).toLocaleDateString('en-GB') }}
            </v-row>
            <v-row class="text-h6 text-green" v-else
              >{{ new Date(fetchedQrCodeInfo.best_before_date).toLocaleDateString('en-GB') }}
            </v-row>
            <v-row class="text-caption">Best Before </v-row></v-col
          >
        </v-row>

        <v-row>
          <v-col
            ><v-row class="text-h6">{{ opening_date }}</v-row>
            <v-row class="text-caption">Item opened on</v-row></v-col
          ><v-col
            ><v-row class="text-h6">{{ vaccuming_date }} </v-row>
            <v-row class="text-caption">Vaccumming date</v-row></v-col
          >
        </v-row>
        <v-row>
          <v-col
            ><v-row class="text-h6">{{ thaw_date }}</v-row>
            <v-row class="text-caption">Thaw Date</v-row></v-col
          ><v-col
            ><v-row class="text-h6">{{ freeze_date }} </v-row>
            <v-row class="text-caption">Freeze Date</v-row></v-col
          >
        </v-row>
        <v-row>
          <v-col align="center"
            ><v-btn
              color="yellow-darken-3"
              :disabled="disableOpening"
              variant="outlined"
              icon="mdi-tray"
              @click="openItem()"
            ></v-btn>
            <div class="text-disabled">Open Container</div></v-col
          >
          <v-col align="center"
            ><v-btn
              color="teal-lighten-4"
              :disabled="disableVaccuming"
              variant="outlined"
              icon="mdi-album"
              @click="vaccumItem()"
            ></v-btn>
            <div class="text-disabled">Vaccum Seal</div></v-col
          >
          <v-col align="center"
            ><v-btn
              color="blue"
              :disabled="disableFreeze"
              variant="outlined"
              icon="mdi-snowflake"
              @click="freezeItem()"
            ></v-btn>
            <div class="text-disabled">Freeze</div></v-col
          ><v-col align="center"
            ><v-btn
              variant="outlined"
              :disabled="disableThaw"
              color="orange"
              @click="thawItem()"
              icon="mdi-snowflake-off"
            ></v-btn>
            <div class="text-disabled">Thaw</div></v-col
          ><v-col align="center">
            <v-btn
              variant="tonal"
              @click="showThrowAway = true"
              color="red"
              icon="mdi-delete"
            ></v-btn>
            <div class="text-disabled">Throw Away</div>
            <!-- <v-dialog v-model="showThrowAwayScreen" max-width="400" persistent>
              <template v-slot:activator="{ props: activatorProps }">
               
              </template>

              <v-card prepend-icon="mdi-delete" title="Delete QR-Code" color="red"
                ><v-card-text
                  >Are you sure, that you want to throw away the product
                  {{ fetchedQrCodeInfo.product_name }} with {{ fetchedQrCodeInfo.quantity }} left of
                  it?</v-card-text
                >
                <template v-slot:actions>
                  <v-spacer></v-spacer>

                  <v-btn variant="tonal" @click="showThrowAwayScreen = false"> Cancel </v-btn>

                  <v-btn variant="outlined" @click="throwItemAway()"> Delete </v-btn>
                </template>
              </v-card>
            </v-dialog> -->
          </v-col></v-row
        >
        <v-row
          ><v-col>
            <v-text-field
              v-model="measuredTemp"
              suffix="C°"
              type="number"
              :disabled="disableTemperature"
              label="Measured Temperature (in C°)"
            ></v-text-field> </v-col
          ><v-col cols="3"
            ><v-btn color="primary" :disabled="disableTemperature" @click="saveTemperature()"
              >Save</v-btn
            ></v-col
          ></v-row
        >
        <v-row
          ><v-col>
            <v-text-field
              v-model="newQuantity"
              type="text"
              :disabled="disableQuantity"
              label="Measured Quantity"
            ></v-text-field> </v-col
          ><v-col cols="3"
            ><v-btn color="primary" :disabled="disableQuantity" @click="saveNewQuantity()"
              >Save</v-btn
            ></v-col
          ></v-row
        >
        <v-row
          ><v-col align="center">
            <v-dialog v-model="showDeleteScreen" max-width="400" persistent>
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn @click="showDeleteScreen = true" color="red">Delete QR-Code</v-btn>
              </template>

              <v-card prepend-icon="mdi-delete" title="Delete QR-Code" color="red"
                ><v-card-text
                  >Are you sure, that you want to delete the QR-Code with the ID
                  {{ scannedQrCode }} ({{ fetchedQrCodeInfo.product_name }})?</v-card-text
                >
                <template v-slot:actions>
                  <v-spacer></v-spacer>

                  <v-btn variant="tonal" @click="showDeleteScreen = false"> Cancel </v-btn>

                  <v-btn variant="outlined" @click="removeItem()"> Delete </v-btn>
                </template>
              </v-card>
            </v-dialog>
          </v-col></v-row
        >
        <v-row
          ><v-col align="left">
            <p class="text-disabled">
              Keep in mind, that you can only freeze once a food product to not break the cold
              chain.
            </p></v-col
          ></v-row
        >

        <v-row v-if="showBestBeforeAlert">
          <v-alert border="top" type="warning" variant="outlined" prominent>
            This product might be spoiled, since the best before date is in the past!
          </v-alert>
        </v-row>

        <v-row>
          <v-col align="left"> <v-btn variant="text" @click="closeLogs()">Close</v-btn></v-col>
          <v-col align="right"
            ><v-btn prepend-icon="mdi-history" @click="showLog = !showLog" variant="plain"
              >Logs</v-btn
            >
          </v-col></v-row
        ></v-col
      >
    </v-card-text>
  </v-card>
  <v-dialog v-model="showImage" max-width="900px">
    <v-row align="center">
      <v-col align="center"> <img :width="300" :src="image" alt="Image" /></v-col
    ></v-row>
  </v-dialog>
  <v-dialog v-model="showLog" max-width="500px">
    <v-row>
      <FoodLog
        v-if="currentCategory == 1"
        @closed="showLog = false"
        :selectedQrCode="fetchedQrCodeInfo"
      />
    </v-row>
  </v-dialog>
  <v-dialog v-model="showThrowAway" max-width="500px">
    <v-row>
      <ThrowFoodAway
        @closed="showThrowAway = false"
        @successDelete="throwAwayConfirm()"
        :selectedQrCode="fetchedQrCodeInfo"
      />
    </v-row>
  </v-dialog>
  <v-snackbar v-model="showMessage" timeout="3000" :color="messageColor">
    {{ messageText }}

    <template v-slot:actions>
      <v-btn variant="text" @click="showSuccesTemp = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>
<!-- <script setup>
import { ref } from 'vue'
const result = ref('')
</script> -->

<script setup>
import { ref } from 'vue'
var showLog = ref(false)
const emits = defineEmits()

function closeLogs() {
  emits('close', false)
}
</script>
<script>
import QrcodeVue from 'qrcode.vue'
import { fa } from 'vuetify/lib/iconsets/fa.mjs'
import { defineEmits } from 'vue'
import { walkIdentifiers } from 'vue/compiler-sfc'
import FoodLog from '../components/FoodLog.vue'
import { date } from 'yup'
import kontrolix_api from '../../../services/kontrolix_api.service'
import ThrowFoodAway from '../components/TrashFoodUploader.vue'

export default {
  components: {
    QrcodeVue,
    FoodLog,
    ThrowFoodAway
  },
  props: ['scannedQrCode'],
  setup() {},
  name: 'Details',
  data() {
    return {
      qr_code_str: '',
      fetchedQrCodeInfo: {},
      freeze_date: '-',
      thaw_date: '-',
      showImage: false,
      image: null,
      opening_date: '-',
      newQuantity: '',
      vaccuming_date: '-',
      messageText: '',
      messageColor: '',
      disableFreeze: false,
      disableQuantity: false,
      showThrowAwayScreen: false,
      showThrowAway: false,
      disableTemperature: false,
      disableOpening: false,
      disableVaccuming: false,
      measuredTemp: '',
      user_id: '',
      showMessage: false,
      currentCategory: 1,
      disableThaw: false,
      showBestBeforeAlert: false,
      showDeleteScreen: false,
      showSuccessRemove: false,
      isLoadingImage: false,
      isLoadingNote: false
    }
  },
  methods: {
    freezeItem() {
      kontrolix_api
        .changeFoodStatus(
          JSON.parse(localStorage.getItem('user')).company_id,
          '1',
          this.fetchedQrCodeInfo.qr_code_id,
          this.user_id
        )
        .then((response) => {
          this.freeze_date = new Date().toLocaleString('en-GB', {
            timeZone: 'UTC'
          })
          this.disableFreeze = true
          this.disableThaw = false
        })
    },

    completeDeletion() {
      this.$emit('deletion')
    },

    saveTemperature() {
      if (this.measuredTemp != '') {
        kontrolix_api
          .changeFoodStatus(
            JSON.parse(localStorage.getItem('user')).company_id,
            '6',
            this.fetchedQrCodeInfo.qr_code_id,
            this.user_id,
            this.measuredTemp
          )
          .then((response) => {
            console.log(response.data)
          })

        this.messageColor = 'green'
        this.messageText = 'The temperature was successfully stored!'
        this.disableTemperature = true
        this.showMessage = true
      }
    },
    saveNewQuantity() {
      kontrolix_api
        .changeFoodStatus(
          JSON.parse(localStorage.getItem('user')).company_id,
          '7',
          this.fetchedQrCodeInfo.qr_code_id,
          this.user_id,
          '',
          this.newQuantity
        )
        .then((response) => {
          this.disableQuantity = true
          this.messageColor = 'green'
          this.messageText = 'The quantity was successfully stored!'
          this.showMessage = true
        })

      this.messageColor = 'green'
      this.messageText = 'The new quantity was successfully stored!'
      this.disableQuantity = true
      this.showMessage = true
    },
    openItem() {
      kontrolix_api
        .changeFoodStatus(
          JSON.parse(localStorage.getItem('user')).company_id,
          '4',
          this.fetchedQrCodeInfo.qr_code_id,
          this.user_id
        )
        .then((response) => {
          this.opening_date = new Date().toLocaleString('en-GB', {
            timeZone: 'UTC'
          })
          this.disableOpening = true
          this.disableVaccuming = false
        })
    },
    vaccumItem() {
      kontrolix_api
        .changeFoodStatus(
          JSON.parse(localStorage.getItem('user')).company_id,
          '5',
          this.fetchedQrCodeInfo.qr_code_id,
          this.user_id
        )
        .then((response) => {
          this.vaccuming_date = new Date().toLocaleString('en-GB', {
            timeZone: 'UTC'
          })
          this.disableVaccuming = true
          this.disableOpening = true
        })
    },

    openImage(type) {
      if (type == 0) {
        this.isLoadingNote = true
        kontrolix_api.getDeliveryNote(this.fetchedQrCodeInfo.qr_code_id).then((response) => {
          this.image = response.data[0]
          this.showImage = true
          this.isLoadingNote = false
        })
      } else if (type == 1) {
        this.isLoadingImage = true
        kontrolix_api.getDeliveryImage(this.fetchedQrCodeInfo.qr_code_id).then((response) => {
          this.image = response.data[0]
          this.showImage = true
          this.isLoadingImage = false
        })
      }
    },

    thawItem() {
      kontrolix_api
        .changeFoodStatus(
          JSON.parse(localStorage.getItem('user')).company_id,
          '2',
          this.fetchedQrCodeInfo.qr_code_id,
          this.user_id
        )
        .then((response) => {
          this.thaw_date = new Date().toLocaleString('en-GB', {
            timeZone: 'UTC'
          })
          this.disableFreeze = true
          this.disableThaw = true
        })
    },
    throwItemAway() {
      kontrolix_api
        .changeFoodStatus(
          JSON.parse(localStorage.getItem('user')).company_id,
          '8',
          this.fetchedQrCodeInfo.qr_code_id,
          this.user_id,
          this.quantity
        )
        .then((response) => {})
      this.showThrowAwayScreen = false

      this.completeDeletion()
    },
    throwAwayConfirm() {
      this.showThrowAway = false
      this.completeDeletion()
    },
    removeItem() {
      kontrolix_api
        .changeFoodStatus(
          JSON.parse(localStorage.getItem('user')).company_id,
          '3',
          this.fetchedQrCodeInfo.qr_code_id,
          this.user_id
        )
        .then((response) => {
          this.showDeleteScreen = false

          this.completeDeletion()
        })
    },
    loadItem() {
      this.fetchedQrCodeInfo = {}
      this.freeze_date = ''
      this.thaw_date = ''
      kontrolix_api.getQrCodeInfo(this.scannedQrCode).then((response) => {
        this.fetchedQrCodeInfo = response.data[0][0]
        this.fetchedQrCodeInfo.qr_code_str = this.scannedQrCode

        if (this.fetchedQrCodeInfo.opening_date == null) {
          this.opening_date = '-'
          this.disableVaccuming = true
        } else {
          this.disableVaccuming = false
          this.disableOpening = true
          this.opening_date = new Date(this.fetchedQrCodeInfo.opening_date).toLocaleString(
            'en-GB',
            {
              timeZone: 'UTC'
            }
          )
        }
        if (this.fetchedQrCodeInfo.vaccuming_date == null) {
          this.disableThaw = true
        } else {
          this.disableOpening = true
          this.disableVaccuming = true
          this.vaccuming_date = new Date(this.fetchedQrCodeInfo.vaccuming_date).toLocaleString(
            'en-GB',
            {
              timeZone: 'UTC'
            }
          )
        }
        if (this.fetchedQrCodeInfo.freeze_date == null) {
          this.fetchedQrCodeInfo.freeze_date = '-'
          this.freeze_date = '-'
          this.disableFreeze = false
          this.disableThaw = true
        } else {
          this.disableFreeze = true
          this.disableThaw = false
          this.freeze_date = new Date(this.fetchedQrCodeInfo.freeze_date).toLocaleString('en-GB', {
            timeZone: 'UTC'
          })
        }
        if (
          this.fetchedQrCodeInfo.freeze_date != null &&
          this.fetchedQrCodeInfo.thaw_date != null
        ) {
          this.thaw_date = new Date(this.fetchedQrCodeInfo.freeze_date).toLocaleString('en-GB', {
            timeZone: 'UTC'
          })
          this.disableFreeze = true
          this.disableThaw = true
        } else {
          this.fetchedQrCodeInfo.thaw_date = '-'
          this.thaw_date = '-'
        }
        var best_before_date = new Date(this.fetchedQrCodeInfo.best_before_date)
        var current_date = new Date()

        if (best_before_date < current_date) {
          this.disableFreeze = true
          this.disableThaw = true
          this.showBestBeforeAlert = true
        }
        console.log(this.fetchedQrCodeInfo)
      })
    }
  },
  mounted() {
    this.loadItem()
    const obj = JSON.parse(localStorage.getItem('user'))
    const idValue = obj.id
    this.user_id = idValue
  }
}
</script>
<style></style>
