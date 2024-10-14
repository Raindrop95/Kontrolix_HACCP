<template>
  <v-container class="md-6" style="background-color: transparent">
    <v-row align="stretch" class="md-6">
      <v-col>
        <v-card
          class="mx-auto fill-height"
          style="border-bottom: 5px; border-style: solid; border-color: orange"
          :loading="loadData"
        >
          <v-card-item align="center"> </v-card-item>
          <v-card-text class="py-0">
            <v-row align="center">
              <v-col
                align="center"
                class="text-h5"
                style="
                  font-weight: 200 !important;
                  border-style: solid;
                  border-width: 1px;
                  border-color: gray;
                  border-radius: 50px;
                  margin: 5px;
                "
                >User Manuals</v-col
              ></v-row
            >
            <v-row
              ><v-col
                >In these user manuals, you can find guides, on every function within the Kontrolix
                web application. By clicking on your preferred language, the PDF-File will be
                downloaded to your device.</v-col
              ></v-row
            >
            <v-row align="center">
              <v-btn
                style="margin: 40px"
                v-for="item in userManuals"
                size="x-large"
                :href="`${baseUrl}assets/guides/pdf/${item.downloadLink}`"
                target="_blank"
                :disabled="item.isAviable"
                prepend-icon="mdi-file-document-outline"
                >{{ item.language }}</v-btn
              >
              <!-- <v-col align="center" class="text-h2" style="margin-bottom: 20px">asd </v-col> -->
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="stretch" class="md-6">
      <v-col>
        <v-card
          class="mx-auto fill-height"
          style="border-bottom: 5px; border-style: solid; border-color: orange"
          :loading="loadData"
        >
          <v-card-item align="center"> </v-card-item>
          <v-card-text class="py-0">
            <v-row align="center">
              <v-col
                align="center"
                class="text-h5"
                style="
                  font-weight: 200 !important;
                  border-style: solid;
                  border-width: 1px;
                  border-color: gray;
                  border-radius: 50px;
                  margin: 5px;
                "
                >Video Guides</v-col
              ></v-row
            ><v-row
              ><v-col
                >These videos show how to use the Kontrolix web application and explains each
                function in depth. By clicking on your preferred language, the video file will be
                downloaded to your device.</v-col
              ></v-row
            >
            <v-row align="center">
              <v-btn
                style="margin: 40px"
                v-for="item in videoGuides"
                size="x-large"
                :href="`${baseUrl}assets/guides/video/${item.downloadLink}`"
                target="_blank"
                :disabled="item.isAviable"
                prepend-icon="mdi-video"
                >{{ item.language }}</v-btn
              >
              <!-- <v-col align="center" class="text-h2" style="margin-bottom: 20px">asd </v-col> -->
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ref } from 'vue'
import QrCodeScanner from '../components/QrCodeScanner.vue'
import Scanner from '@/components/Scanner.vue'
import HandScanner from '@/components/HandScanner.vue'
import QrcodeVue from 'qrcode.vue'
import FoodLog from '../components/LogViews/FoodLog.vue'
import kontrolix_api from '../services/kontrolix_api.service'

export default {
  name: 'Register',
  components: { QrCodeScanner, Scanner, HandScanner, FoodLog, QrcodeVue },
  setup() {
    const ReadQrCode = ref('')
    return { ReadQrCode }
  },
  data() {
    return {
      userManuals: [
        { language: 'English', downloadLink: '/', isAviable: true },
        { language: 'German', downloadLink: '/Kontrolix_Handbuch_DE.pdf', isAviable: false },
        { language: 'Italian', downloadLink: '/', isAviable: true },
        { language: 'Spanish', downloadLink: '/', isAviable: true }
      ],
      videoGuides: [
        {
          language: 'English',
          downloadLink: '/Kontrolix_Introduction_English.mov',
          isAviable: false
        },
        { language: 'German', downloadLink: '/Kontrolix_Einleitung_Deutsch.mov', isAviable: false },
        { language: 'Italian', downloadLink: '/', isAviable: true },
        { language: 'Spanish', downloadLink: '/', isAviable: true }
      ]
    }
  },
  methods: {},
  computed: {
    baseUrl() {
      return import.meta.env.BASE_URL
    }
  },
  async mounted() {}
}
</script>
<style scoped></style>
