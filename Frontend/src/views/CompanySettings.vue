<script setup></script>

<template>
  <v-container class="mb-6">
    <v-row
      ><v-col
        ><v-card
          ><v-card-title>Company Information</v-card-title>

          <v-card-text
            ><v-row
              ><v-col
                ><p class="text-disabled">
                  These are your registered billing informations. In case of errors or change
                  requests, please contact us: request@controlix.com
                </p></v-col
              ></v-row
            ><v-row
              ><v-col
                ><v-list lines="two">
                  <v-list-item
                    :title="companyData.company_name"
                    subtitle="Companyname"
                  ></v-list-item>
                  <v-list-item :title="companyData.company_address" subtitle="Adress"></v-list-item>
                  <v-list-item
                    :title="companyData.company_postcode"
                    subtitle="Postcode"
                  ></v-list-item>
                  <v-list-item :title="companyData.company_city" subtitle="City"></v-list-item>
                  <v-list-item
                    :title="companyData.company_country"
                    subtitle="Country"
                  ></v-list-item></v-list></v-col
              ><v-col
                ><v-list lines="two">
                  <v-list-item>
                    <v-input :messages="['Phonenumber']" prepend-icon="mdi-phone">
                      {{ companyData.company_phonenumber }}
                    </v-input></v-list-item
                  ><v-list-item>
                    <v-input :messages="['E-Mail']" prepend-icon="mdi-email">
                      {{ companyData.company_email }}
                    </v-input></v-list-item
                  ><v-list-item>
                    <v-input :messages="['Contact Person']" prepend-icon="mdi-account">
                      {{ companyData.company_contact_person }}
                    </v-input></v-list-item
                  ><v-list-item>
                    <v-input :messages="['Personal ID']" prepend-icon="mdi-identifier">
                      {{ companyData.company_customer_id_str }}
                    </v-input></v-list-item
                  ></v-list
                ></v-col
              ></v-row
            > </v-card-text
          ><v-card-actions class="d-flex"
            ><v-col align="left"
              ><v-btn
                color="light-blue"
                disabled="true"
                variant="outlined"
                prepend-icon="mdi-face-agent"
                >Contact Support</v-btn
              ></v-col
            ><v-col align="right"
              ><v-btn
                color="primary"
                variant="outlined"
                disabled="true"
                prepend-icon="mdi-cash-multiple"
                >Manage Subscription
              </v-btn>
            </v-col></v-card-actions
          ></v-card
        ></v-col
      ></v-row
    ><v-row
      ><v-col
        ><v-card
          ><v-card-title>User Management</v-card-title
          ><v-card-text
            ><v-row
              ><v-col
                ><p class="text-disabled">
                  Here you can add, remove and edit user accounts. In case of password change,
                  remember to contact the owner of the account about the password change.
                </p></v-col
              ></v-row
            >
            <v-row
              ><v-col>
                <v-text-field
                  v-model="userSearch"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  single-line
                ></v-text-field></v-col
            ></v-row>
            <v-row
              ><v-col align="right">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-account-plus"
                  variant="outlined"
                  @click="openNewUser()"
                  >Add Account</v-btn
                ></v-col
              ></v-row
            >
            <v-row
              ><v-col>
                <v-data-table
                  :loading="loadData"
                  :footer-props="{
                    'items-per-page-options': [10, 20, 30, 40, 50]
                  }"
                  :items-per-page="10"
                  no-data-text="There are no users!"
                  :headers="headerUsers"
                  :items="userData"
                  :search="userSearch"
                >
                  <template v-slot:item.role="{ item }">
                    <v-chip
                      v-if="item.role == 'Administrator'"
                      variant="flat"
                      color="yellow-darken-4"
                    >
                      ADMIN
                    </v-chip>
                    <v-chip v-if="item.role == 'Employee'" variant="flat" color="indigo-lighten-3">
                      EMPLOYEE
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon class="me-2" size="small" @click="editItem(item)"> mdi-pencil </v-icon>
                    <v-icon class="me-2" size="small" @click="deleteUser(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table></v-col
              ></v-row
            ></v-card-text
          ></v-card
        ></v-col
      ></v-row
    >
  </v-container>
  <v-dialog v-model="showEditUser" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit User Account</span>
      </v-card-title>

      <v-card-text>
        <v-row
          ><v-col
            ><p class="text-disabled">
              If you want to set a new password for this user, just type in a new password into the
              field and click save.
            </p></v-col
          ></v-row
        >
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="10">
              <v-text-field :rules="rules" v-model="editUsername" label="Username"></v-text-field>
            </v-col>
            <v-col cols="12" :rules="rules" md="6" sm="6">
              <v-text-field v-model="editName" label="Name"></v-text-field>
            </v-col>
            <v-col cols="12" :rules="rules" md="6" sm="10">
              <v-text-field v-model="editSurname" label="Surname"></v-text-field>
            </v-col>
            <v-col cols="12" :rules="rules" md="6" sm="10">
              <v-text-field v-model="editMail" label="E-Mail"></v-text-field>
            </v-col>
            <v-col
              ><v-select v-model="selectedRole" label="User role" :items="roles"></v-select
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="20" sm="20">
              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="New Password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                v-model="newPassword"
                @click:append-inner="visible = !visible"
              ></v-text-field> </v-col
          ></v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="showEditUser = false"> Cancel </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="editUserConfirm"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showCreate" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add User Account</span>
      </v-card-title>

      <v-card-text>
        <v-row
          ><v-col
            ><p class="text-disabled">
              Please fill in all fields to create a new user account.
            </p></v-col
          ></v-row
        >
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="10">
              <v-text-field :rules="rules" v-model="newUsername" label="Username"></v-text-field>
            </v-col>
            <v-col cols="12" :rules="rules" md="6" sm="6">
              <v-text-field v-model="newName" label="Name"></v-text-field>
            </v-col>
            <v-col cols="12" :rules="rules" md="6" sm="10">
              <v-text-field v-model="newSurname" label="Surname"></v-text-field>
            </v-col>
            <v-col cols="12" :rules="rules" md="6" sm="10">
              <v-text-field v-model="newMail" label="E-Mail"></v-text-field>
            </v-col>
            <v-col
              ><v-select v-model="selectedRole" label="User role" :items="roles"></v-select
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="20" sm="20">
              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="New Password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                v-model="newPasswordUser"
                @click:append-inner="visible = !visible"
              ></v-text-field> </v-col
          ></v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="showCreate = false"> Cancel </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="createUserConfirm"> Create User </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showDeleteUser" max-width="400" persistent>
    <v-card prepend-icon="mdi-delete" title="Delete Account" color="red"
      ><v-card-text
        >Are you sure, that you want to delete the account with username
        {{ selectedUser.username }} ({{ selectedUser.name }}
        {{ selectedUser.surname }})?</v-card-text
      >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn variant="tonal" @click="showDeleteUser = false"> Cancel </v-btn>

        <v-btn variant="outlined" @click="deleteUserConfirm()"> Delete </v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="showInfoBox" timeout="3000" :color="infoBoxColor">
    {{ infoText }}

    <template v-slot:actions>
      <v-btn variant="text" @click="showInfoBox = false"> Close </v-btn>
    </template>
  </v-snackbar>
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
      companyData: {
        company_name: '',
        company_address: '',
        company_postcode: '',
        company_city: '',
        company_country: '',
        company_phonenumber: '',
        company_contact_person: '',
        company_customer_id_str: ''
      },
      showInfoBox: false,
      showCreate: false,
      infoBoxColor: 'green',
      infoText: '',
      visible: false,
      selectedRole: '',
      headerUsers: [
        {
          align: 'start',
          key: 'id',
          sortable: false,
          title: 'User ID'
        },
        { key: 'username', title: 'Username' },
        { key: 'name', title: 'Name' },
        { key: 'surname', title: 'Surname' },
        { key: 'email', title: 'E-Mail' },
        { key: 'role', title: 'Role' },

        { key: 'actions', title: 'Actions' }
      ],
      userData: [],
      userSearch: '',
      loadData: false,
      selectedUser: [],
      showEditUser: false,
      showDeleteUser: false,
      editUsername: '',
      editName: '',
      editSurname: '',
      editMail: '',
      newUsername: '',
      newName: '',
      newSurname: '',
      newMail: '',
      newPasswordUser: '',
      newPassword: '',
      roles: [],
      rules: [
        (value) => {
          if (value) return true

          return 'You must enter a something into this field!'
        }
      ]
    }
  },
  methods: {
    openNewUser() {
      this.showCreate = true
      this.newUsername = ''
      this.newPasswordUser = ''
      this.newName = ''
      this.newSurname = ''
      this.selectedRole = ''
      kontrolix_api.getRoles().then((response) => {
        response.data.shift()
        for (var i = 0; i < response.data.length; i++) {
          this.roles[i] = response.data[i].name
        }
        console.log(response.data)
      })
    },
    deleteUser(item) {
      this.selectedUser = item
      this.showDeleteUser = true
    },
    deleteUserConfirm() {
      kontrolix_api.deleteUser(this.selectedUser.id).then((response) => {
        this.infoText = 'The account was deleted successfully!'
        this.infoBoxColor = 'green'
        this.showInfoBox = true
        this.reloadData()
        this.showDeleteUser = false
      })
    },
    reloadData() {
      kontrolix_api
        .getAllUsers(JSON.parse(localStorage.getItem('user')).company_id)
        .then((response) => {
          this.userData = response.data
          this.selectedUser = response.data[0]
        })
    },
    createUserConfirm() {
      var user = []
      user.username = this.newUsername
      user.password = this.newPasswordUser
      user.name = this.newName
      user.surname = this.newSurname
      user.email = this.newMail
      user.roles = this.selectedRole
      user.company = JSON.parse(localStorage.getItem('user')).company_id
      console.log('1')
      if (
        this.newUsername == '' ||
        this.newPasswordUser == '' ||
        this.newName == '' ||
        this.newSurname == '' ||
        this.selectedRole == ''
      ) {
        console.log('2')

        this.infoBoxColor = 'red'
        this.infoText = 'Please fill out all fields!'
        this.showInfoBox = true
      } else {
        console.log('3')
        this.$store.dispatch('auth/register', user).then(
          (data) => {
            console.log(data)
            this.showCreate = false
            this.infoBoxColor = 'green'
            this.infoText = data.message
            this.showInfoBox = true
            this.reloadData()
          },
          (error) => {
            console.log('4')

            if (error.response && error.response.status === 400) {
              this.infoBoxColor = 'red'
              this.infoText = error.response.data.message || 'Bad Request'
            } else {
              this.infoBoxColor = 'red'
              this.infoText =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            }
            this.showInfoBox = true
          }
        )
      }
    },
    editItem(item) {
      this.newUsername = ''
      this.newPasswordUser = ''
      this.newName = ''
      this.newSurname = ''
      this.selectedRole = item.role
      kontrolix_api.getRoles().then((response) => {
        response.data.shift()
        for (var i = 0; i < response.data.length; i++) {
          this.roles[i] = response.data[i].name
        }
      })
      this.editUsername = item.username
      this.editName = item.name
      this.editSurname = item.surname
      this.editMail = item.email
      this.selectedUser = item
      this.showEditUser = true
    },
    deleteItem(item) {
      this.selectedUser = item
    },
    async editUserConfirm() {
      kontrolix_api
        .updateUser(
          this.selectedUser.id,
          this.editUsername,
          this.editName,
          this.editSurname,
          this.editMail,
          this.newPassword,
          this.selectedRole
        )
        .then(async (response) => {
          this.showEditUser = false
          this.infoBoxColor = 'green'
          this.infoText = 'The user was edited successfully!'
          this.showInfoBox = true
          this.userData = []
          await this.reloadData()
        })
    }
  },
  computed: {},
  async mounted() {
    kontrolix_api
      .getAllUsers(JSON.parse(localStorage.getItem('user')).company_id)
      .then((response) => {
        this.userData = response.data
        this.selectedUser = response.data[0]
      })

    kontrolix_api
      .getCompanyInformation(JSON.parse(localStorage.getItem('user')).company_id)
      .then((company) => {
        this.companyData = company.data
      })
  }
}
</script>
<style scoped></style>
