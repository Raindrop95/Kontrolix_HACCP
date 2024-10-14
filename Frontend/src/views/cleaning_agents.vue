<template>
  <v-container class="md-6" style="background-color: transparent">
    <v-row>
      <v-col
        ><div class="text-h4"><v-icon size="x-small">mdi-spray-bottle</v-icon> Cleaning Agents</div>
        <p>
          Here you will find all registered cleaning agents and their corresponding information and
          safety letter. You can either create a new detergent or delete an existing one. You cannot
          cannot edit an existing detergent.
        </p></v-col
      ></v-row
    >
    <v-row>
      <v-col>
        <v-card title="Registered Cleaning Agents" flat>
          <v-col>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="searchAgent"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  single-line
                ></v-text-field
              ></v-col>
              <v-col cols="2"
                ><v-btn color="primary" prepend-icon="mdi-plus" @click="showNewCleaningAgent = true"
                  >Cleaning Agent</v-btn
                ></v-col
              >
            </v-row>
          </v-col>
          <v-data-table
            :loading="loadData"
            :footer-props="{
              'items-per-page-options': [10, 20, 30, 40, 50]
            }"
            :items-per-page="10"
            no-data-text="Currently there are no cleaning agents to display!"
            :headers="headerCleaningAgent"
            :items="cleaningAgent_data"
            :search="searchAgent"
          >
            <template v-slot:item.showImage="{ item }">
              <v-icon class="me-2" size="small" @click="showInformationSheet(item.id)">
                mdi-image
              </v-icon>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon class="me-2" size="small" @click="openEditAgent(item.id)"> mdi-pen </v-icon>
              <v-icon class="me-2" size="small" @click="openConfirmDeleteAgent(item.id)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog max-width="500" v-model="showNewCleaningAgent">
      <v-row align="center">
        <NewCleaningAgent @successAgent="agentCreated()" @close="showNewCleaningAgent = false" />
      </v-row>
    </v-dialog>
    <v-dialog v-model="showDeleteAgent" max-width="400" persistent>
      <v-card prepend-icon="mdi-delete" title="Delete Cleaning Agent" color="red"
        ><v-card-text>Are you sure, that you want to delete this cleaning agent? </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn variant="tonal" @click="showDeleteAgent = false"> Cancel </v-btn>

          <v-btn variant="outlined" @click="confirmDeleteAgent()"> Delete </v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showImage" max-width="900px">
      <v-row align="center">
        <v-col align="center"> <img :width="800" :src="imageInformationSheet" alt="Image" /></v-col
      ></v-row>
    </v-dialog>
    <v-dialog v-model="showEditView">
      <EditCleaningAgent
        :currentAgentId="currentAgentId"
        @successEdit="agentEdited()"
        @close="showEditView = false"
    /></v-dialog>
    <v-snackbar v-model="showAlert" timeout="3000" :color="errorColor">
      {{ errorText }}

      <template v-slot:actions>
        <v-btn variant="text" @click="showAlert = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import { ref } from 'vue'

import kontrolix_api from '../services/kontrolix_api.service'

import NewCleaningAgent from '../components/NewCleaningAgent.vue'
import EditCleaningAgent from '../components/EditCleaningAgent.vue'
import { fa } from 'vuetify/lib/iconsets/fa.mjs'

export default {
  name: 'Register',
  components: { NewCleaningAgent, EditCleaningAgent },
  data() {
    return {
      searchAgent: '',
      showAlert: false,
      errorColor: 'green',
      errorText: '',
      showImage: false,
      showEditView: false,
      imageInformationSheet: null,
      showNewCleaningAgent: false,
      showDeleteAgent: false,
      headerCleaningAgent: [
        {
          align: 'start',
          key: 'id',
          sortable: false,
          title: 'ID'
        },
        { key: 'agent_name', title: 'Name' },
        { key: 'showImage', title: 'Information Sheet' },
        { key: 'actions', title: 'Actions' }
      ],
      cleaningAgent_data: [],
      userData: [],
      currentAgentId: ''
    }
  },
  methods: {
    agentCreated() {
      this.showNewCleaningAgent = false

      this.errorColor = 'success'
      this.errorText = 'New cleaning agent was created!'
      this.showAlert = true
      this.reloadData()
    },
    openEditAgent(id) {
      this.currentAgentId = id
      this.showEditView = true
    },
    reloadData() {
      kontrolix_api
        .getAllCleaningAgents(JSON.parse(localStorage.getItem('user')).company_id)
        .then((response) => {
          this.cleaningAgent_data = response.data
        })
    },
    showInformationSheet(id) {
      kontrolix_api.getInformationSheet(id).then((response) => {
        this.imageInformationSheet = response.data[0]
        this.showImage = true
      })
    },
    openConfirmDeleteAgent(id) {
      this.currentAgentId = id
      this.showDeleteAgent = true
    },
    confirmDeleteAgent() {
      kontrolix_api.deleteCleaningAgent(this.currentAgentId).then((response) => {
        this.showDeleteAgent = false
        this.errorColor = 'success'
        this.errorText = 'Cleaning agent was successfully deleted!'
        this.showAlert = true
        this.reloadData()
      })
    },
    agentEdited() {
      this.showEditView = false
      this.errorColor = 'success'
      this.errorText = 'Cleaning agent was successfully edited!'
      this.showAlert = true
      this.reloadData()
    }
  },
  computed: {},
  async mounted() {
    const obj = JSON.parse(localStorage.getItem('user'))
    const idValue = obj.id
    const user_id = idValue

    kontrolix_api.getUserData(user_id).then((response) => {
      this.userData = response.data[0]
    })

    kontrolix_api
      .getAllCleaningAgents(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        this.cleaningAgent_data = response.data
      })
  }
}
</script>
<style scoped></style>
