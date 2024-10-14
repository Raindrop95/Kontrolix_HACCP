<template>
  <v-card class="d-flex flex-column" style="height: 80vh; width: 100vw; overflow-y: scroll">
    <!-- <v-col align="center"
          ><v-row> <qrcode-vue value="test" size="150" level="H" /></v-row>
        </v-col> -->
    <v-card-item>
      <v-card-title>{{ fetchedQrCodeInfo.workspace_name }}</v-card-title>

      <v-card-subtitle>
        <span class="me-1">#{{ scannedQrCode }} </span>
      </v-card-subtitle>
      <v-card-subtitle>
        Last cleaned:
        {{ lastCleaned }}</v-card-subtitle
      >
    </v-card-item>
    <v-card-text>
      <v-col>
        <v-row>
          <v-col align="center"> <img :width="300" :src="workspaceImage" alt="Image" /> </v-col
          ><v-col
            ><v-row>Preferred Cleaning Agents:</v-row>
            <v-row>
              <v-chip
                v-for="agent in preferred_cleaning_agent"
                @click="openInformationSheet(agent)"
                style="margin: 5px"
                >{{ agent }}</v-chip
              ></v-row
            ></v-col
          ></v-row
        ><v-row
          ><v-col align="center"
            ><v-btn color="red" @click="deleteWorkspace()">Delete QR-Code</v-btn></v-col
          ></v-row
        >
        <v-row>
          <v-select
            v-model="selectedCleaningAgents"
            :rules="[requiredRule]"
            chips
            multiple
            label="Used Agent for cleaning"
            :items="cleaningAgents"
          ></v-select
        ></v-row>
        <v-row>
          <v-file-input
            show-size
            v-model="selectedFile"
            label="Upload image after cleaning"
            outlined
            prepend-icon="mdi-camera"
            dense
            capture="environment"
            accept="image/*"
            @change="loadPreview()"
          ></v-file-input>
        </v-row>
        <v-row>
          <v-col align="center"
            ><v-btn prepend-icon="mdi-check" @click="addNewLog()" variant="outlined" color="success"
              >Save New Cleaning</v-btn
            >
          </v-col></v-row
        >
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
  <v-dialog v-model="showLog" max-width="500px">
    <v-row>
      <WorkspaceLog @closed="showLog = false" :selectedQrCode="fetchedQrCodeInfo" />
    </v-row>
  </v-dialog>
  <v-dialog v-model="showDeleteScreen" max-width="400" persistent>
    <v-card prepend-icon="mdi-delete" title="Delete QR-Code" color="red"
      ><v-card-text
        >Are you sure, that you want to delete the QR-Code with the ID {{ scannedQrCode }} ({{
          fetchedQrCodeInfo.workspace_name
        }})?</v-card-text
      >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn variant="tonal" @click="showDeleteScreen = false"> Cancel </v-btn>

        <v-btn variant="outlined" @click="removeItem()"> Delete </v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showImage" max-width="900px">
    <v-row align="center">
      <v-col align="center"> <img :width="300" :src="imageInformationSheet" alt="Image" /></v-col
    ></v-row>
  </v-dialog>
  <v-snackbar v-model="showMessage" timeout="3000" :color="messageColor">
    {{ messageText }}

    <template v-slot:actions>
      <v-btn variant="text" @click="showSuccesTemp = false"> Close </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar v-model="showSnackbar" timeout="3000" :color="snackColor">
    {{ snackText }}

    <template v-slot:actions>
      <v-btn variant="text" @click="showSnackbar = false"> Close </v-btn>
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
import WorkspaceLog from '../components/WorkspaceLog.vue'
import { date } from 'yup'
import kontrolix_api from '../../../services/kontrolix_api.service'

export default {
  components: {
    QrcodeVue,
    WorkspaceLog
  },
  props: ['scannedQrCode'],
  setup() {},
  name: 'Details',
  data() {
    return {
      showSnackbar: false,
      snackColor: 'success',
      showImage: false,
      imageInformationSheet: null,
      snackText: '',
      uploadedImage: null,
      selectedFile: null,
      uploadedImage: null,
      selectedFile: null,
      qr_code_str: '',
      fetchedQrCodeInfo: {},
      workspaceName: '',
      showDeleteScreen: false,
      workspaceImage: null,
      cleaningAgents: [],
      selectedCleaningAgents: [],
      preferred_cleaning_agent: [],
      selectedImageAfterCleaning: null,
      lastCleaned: null,
      messageText: '',
      messageColor: '',
      dataCleaningAgents: [],
      dataCA: [],
      user_id: ''
    }
  },
  computed: {
    requiredRule() {
      return (value) => value.length > 0 || 'Please select at least one cleaning agent!'
    }
  },
  methods: {
    completeDeletion() {
      this.$emit('deletion')
    },

    addNewLog() {
      if (!this.selectedFile || this.selectedFile.length === 0) {
        this.snackColor = 'red'
        this.snackText = 'Please select an Image!'
        this.showSnackbar = true
      } else {
        if (this.selectedCleaningAgents.length == 0) {
          this.snackColor = 'red'
          this.snackText = 'Please select at least one preferred cleaning agent!'
          this.showSnackbar = true
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            const base64String = e.target.result
            const imageData = [base64String] // Put the base64 string into an array
            console.log(JSON.parse(localStorage.getItem('user')).company_id)
            kontrolix_api.addWorkspaceLog(
              this.fetchedQrCodeInfo.qr_code_id,
              this.user_id,
              this.selectedCleaningAgents,
              imageData,
              JSON.parse(localStorage.getItem('user')).company_id
            )
            this.$emit('logUpdate')
          }
          reader.readAsDataURL(this.selectedFile[0])
        }
      }
    },
    openInformationSheet(agent) {
      var agentId = ''
      for (let i = 0; i < this.dataCleaningAgents.length; i++) {
        if (this.dataCleaningAgents[i]['agent_name'] == agent) {
          agentId = this.dataCleaningAgents[i]['id']
        }
      }

      kontrolix_api.getInformationSheet(agentId).then((response) => {
        this.imageInformationSheet = response.data[0]
        this.showImage = true
      })
    },
    deleteWorkspace() {
      this.showDeleteScreen = true
    },
    removeItem() {
      kontrolix_api.deleteWorkspace(this.fetchedQrCodeInfo.id).then((response) => {
        this.$emit('deletion')
      })
    },
    async loadItem() {
      this.fetchedQrCodeInfo = {}
      this.freeze_date = ''
      this.thaw_date = ''
      await kontrolix_api.getQrCodeInfo(this.scannedQrCode).then(async (response) => {
        this.fetchedQrCodeInfo = response.data[0][0]
        this.workspaceImage = response.data[2]
        kontrolix_api.getWorkspaceLogs(this.fetchedQrCodeInfo.qr_code_id).then((response) => {
          if (response.data.length > 0) {
            this.lastCleaned = this.lastCleaned = new Date(
              response.data[response.data.length - 1].createdAt
            )
              .toLocaleString('en-GB', {
                timeZone: 'UTC',
                hour12: false // Use 24-hour time format
              })
              .toString()
          } else {
            this.lastCleaned = 'none'
          }
        })
        this.fetchedQrCodeInfo.qr_code_str = this.scannedQrCode
        var arr_int_cleaning_agents = this.fetchedQrCodeInfo.preferred_cleaning_agent.split(',')
        var arr_str_cleaning_agents = []

        for (let i = 0; i < arr_int_cleaning_agents.length; i++) {
          await kontrolix_api.getCleaningAgentById(arr_int_cleaning_agents[i]).then((response) => {
            arr_str_cleaning_agents[i] = response.data[0].agent_name
          })
        }

        await kontrolix_api
          .getAllCleaningAgents(JSON.parse(localStorage.getItem('user')).company_id)
          .then((response) => {
            var allCleaningAgents = []

            for (let i = 0; i < response.data.length; i++) {
              allCleaningAgents[i] = response.data[i].agent_name
            }

            this.dataCA = allCleaningAgents
            this.dataCleaningAgents = response.data
          })

        await kontrolix_api
          .getAllActiveCleaningAgents(JSON.parse(localStorage.getItem('user')).company_id)
          .then((response) => {
            this.cleaningAgents = response.data
          })

        this.preferred_cleaning_agent = arr_str_cleaning_agents

        this.workspaceName = this.fetchedQrCodeInfo.workspace_name
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
