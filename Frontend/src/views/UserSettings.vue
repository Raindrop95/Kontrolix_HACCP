<script setup></script>

<template>
  <v-container class="mb-6">
    <v-row
      ><v-col
        ><v-card
          ><v-card-title>User Settings</v-card-title>

          <v-card-text
            ><v-row
              ><v-col
                ><p class="text-disabled">
                  These are your user account details. In case of any wrong informations, please
                  contact you system administrator.
                </p></v-col
              ></v-row
            >
            <v-row
              ><v-col align="center">
                <v-avatar v-if="profile_image != null" :image="profile_image" size="130"></v-avatar>
                <v-icon v-else size="130">mdi-account-circle</v-icon>
              </v-col></v-row
            >
            <v-row
              ><v-col
                ><v-list lines="two">
                  <v-list-item :title="currentUser.username" subtitle="Username"></v-list-item>

                  <v-list-item :title="currentUser.name" subtitle="Name"></v-list-item>
                  <v-list-item :title="currentUser.surname" subtitle="Surname"></v-list-item>
                  <v-list-item :title="role" subtitle="Role"></v-list-item></v-list></v-col
              ><v-col
                ><v-list lines="two">
                  <v-list-item>
                    <v-input :messages="['E-Mail']" prepend-icon="mdi-mail">
                      {{ currentUser.email }}
                    </v-input></v-list-item
                  ><v-list-item>
                    <v-select
                      v-model="language"
                      hint="Select your preferred language"
                      label="Preferred Language"
                      persistent-hint
                      :disabled="true"
                      prepend-icon="mdi-translate"
                    ></v-select> </v-list-item
                  ><v-list-item>
                    <v-alert
                      text="In this version only English en-US is available! In the next version you will be able to choose between Italian and German."
                      title="Upcoming Changes"
                      type="info"
                      variant="tonal"
                    ></v-alert
                  ></v-list-item> </v-list></v-col
            ></v-row> </v-card-text
          ><v-card-actions class="d-flex"
            ><v-col align="left"
              ><v-btn
                color="light-blue"
                @click="showChangeImage = true"
                variant="outlined"
                prepend-icon="mdi-image-edit-outline"
                >Change Image</v-btn
              ></v-col
            ><v-col align="right"
              ><v-btn
                color="primary"
                @click="showChangePassword = true"
                variant="outlined"
                prepend-icon="mdi-key"
                >Change Password</v-btn
              ></v-col
            ></v-card-actions
          ></v-card
        ></v-col
      ></v-row
    >
    <v-dialog v-model="showChangePassword" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Change Password</span>
        </v-card-title>

        <v-card-text>
          <v-row
            ><v-col
              ><p class="text-disabled">
                Please type in your current password and then your new password, and again to
                confirm it.
              </p></v-col
            ></v-row
          >
          <v-container>
            <v-row>
              <v-col cols="12" md="20" sm="20">
                <v-row>
                  <v-text-field
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'"
                    density="compact"
                    placeholder="New Password"
                    prepend-inner-icon="mdi-lock-outline"
                    variant="outlined"
                    v-model="newPassword1"
                    @click:append-inner="visible = !visible"
                  ></v-text-field></v-row
                ><v-row>
                  <v-text-field
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'"
                    density="compact"
                    placeholder="New Password again"
                    prepend-inner-icon="mdi-lock-outline"
                    variant="outlined"
                    v-model="newPassword2"
                    @click:append-inner="visible = !visible"
                  ></v-text-field
                ></v-row> </v-col
            ></v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="showChangePassword = false">
            Cancel
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="setNewPassword()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showChangeImage" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Change Image</span>
        </v-card-title>

        <v-card-text>
          <v-row
            ><v-col
              ><p class="text-disabled">
                Please select a new image. Changes will be effective after your next login!
              </p></v-col
            ></v-row
          >
          <v-container>
            <v-row>
              <v-col cols="12" md="20" sm="20">
                <v-row>
                  <v-file-input
                    show-size
                    v-model="selectedFile"
                    label="User Image"
                    outlined
                    prepend-icon="mdi-camera"
                    dense
                    capture="environment"
                    accept="image/*"
                  ></v-file-input>
                </v-row> </v-col
            ></v-row>
          </v-container>
        </v-card-text>

        <v-card-actions
          ><v-btn color="red" variant="text" @click="deleteImage()"> Delete Image </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="showChangeImage = false">
            Cancel
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="setNewImage()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

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
      profile_image: null,
      showChangePassword: false,
      oldPassword: '',
      showChangeImage: false,
      selectedFile: null,
      newPassword1: '',
      newPassword2: '',
      showInfoBox: false,
      showCreate: false,
      language: 'en-US',
      infoBoxColor: 'green',
      infoText: '',
      visible: false,

      currentUser: {
        username: '',
        name: '',
        surname: '',
        email: '',
        preferred_language: '',
        user_image: null
      },
      role: null,
      newPasswordUser: '',
      newPassword: '',
      rules: [
        (value) => {
          if (value) return true

          return 'You must enter a something into this field!'
        }
      ]
    }
  },
  methods: {
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

    async setNewPassword() {
      if (this.newPassword1 == this.newPassword2) {
        kontrolix_api
          .updateUser(
            this.currentUser.id,
            this.currentUser.username,
            this.currentUser.name,
            this.currentUser.surname,
            this.currentUser.email,
            this.newPassword1,
            this.role
          )
          .then(async (response) => {
            this.showEditUser = false
            this.infoBoxColor = 'green'
            this.infoText = 'The new password was set successfully!'
            this.showInfoBox = true
            this.userData = []
            this.showChangePassword = false
          })
      } else {
        this.infoBoxColor = 'red'
        this.infoText = 'The passwords do not match!'
        this.showInfoBox = true
      }
    },
    setNewImage() {
      if (!this.selectedFile || this.selectedFile.length === 0) {
        this.infoBoxColor = 'red'
        this.infoText = 'Please select an Image!'
        this.showInfoBox = true
      } else {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const base64String = e.target.result
          const imageData = [base64String] // Put the base64 string into an array
          await kontrolix_api.changeUserImage(this.currentUser.id, imageData).then(
            await kontrolix_api.getUserImage(this.currentUser.id).then((image) => {
              this.profile_image = image.data[0]
              this.showChangeImage = false
              this.infoBoxColor = 'green'
              this.infoText = 'New profile image was set successfully!'
              this.showInfoBox = true
            })
          )
        }
        reader.readAsDataURL(this.selectedFile[0])
      }
    },
    deleteImage() {
      kontrolix_api.deleteUserImage(this.currentUser.id)
      this.showChangeImage = false
      this.infoBoxColor = 'green'
      this.infoText = 'You profile image was deleted succefully!'
      this.profile_image = null
      this.showInfoBox = true
    }
  },
  computed: {},
  async mounted() {
    const obj = JSON.parse(localStorage.getItem('user'))
    const idValue = obj.id
    const user_id = idValue

    await kontrolix_api.getUserData(user_id).then((response) => {
      this.currentUser = response.data[0]
    })

    kontrolix_api.getUserImage(user_id).then((image) => {
      if (image.data != false) {
        this.profile_image = image.data[0]
      }
    })

    if (obj.roles[0] == 'ROLE_ADMINISTRATOR') {
      this.role = 'Administrator'
    } else {
      this.role = 'Employee'
    }
  }
}
</script>
<style scoped></style>
