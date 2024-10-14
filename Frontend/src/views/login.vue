<template>
  <v-container class="fill-height" v-if="!showMobile">
    <v-row align="center" justify="center">
      <v-col align="center">
        <v-card max-width="800px" min-width="360px">
          <v-row style="margin: 10px"
            ><v-col align="center"
              ><img class="mr-3" src="../assets/logo/Logo_SVG_WHITE.png" height="40" /></v-col
          ></v-row>

          <v-card-text>
            <!-- <img id="profile-img" src="../assets/logo/Logo_SVG_BLACK.png" /> -->
            <v-row
              ><v-col>
                <v-form @submit.prevent>
                  <v-text-field
                    v-model="userData.username"
                    :rules="ruleUsername"
                    label="Username"
                  />
                  <v-text-field
                    v-model="userData.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required]"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    name="input-10-1"
                    counter
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                  <v-btn block class="mt-2" type="submit" color="primary" @click="handleLogin"
                    >Login</v-btn
                  >
                </v-form>

                <p class="text-disabled" style="text-align: left; margin-top: 20px">
                  In case of forgotten user credentials, please contact your system administrator.
                </p></v-col
              ><v-divider vertical></v-divider
              ><v-col cols="5"
                ><div class="caption" style="text-align: justify; color: gray">
                  This website may use your webcam to read QR codes. No images or videos are stored
                  on our servers. The user will receive a notification when the webcam is being
                  used, and the video The video output will be displayed in a window. The webcam can
                  only be used if the user has permissions for it. The browser should ask for
                  permission the first time it is used. <br />
                  <br />
                  If you have any questions or concerns, please contact us at info@info.com
                </div>
              </v-col></v-row
            ><v-row
              ><v-col>
                <div
                  class="versionTexty"
                  style="
                    margin-top: 10px;
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    color: gray;
                    font-size: 0.8rem;
                  "
                >
                  <div>© Exelentic GmbH 2024</div>
                  <div>[BETA] v.0.0.1</div>
                </div></v-col
              ></v-row
            >
          </v-card-text>
        </v-card></v-col
      >
    </v-row>
    <v-snackbar v-model="showLoginError" timeout="3000" color="red">
      {{ errorText }}

      <template v-slot:actions>
        <v-btn variant="text" @click="showLoginError = false"> Close </v-btn>
      </template>
    </v-snackbar></v-container
  >
  <v-container class="fill-height" v-else>
    <v-row align="center" justify="center">
      <v-col align="center">
        <v-card max-width="800px" min-width="250px">
          <v-row
            ><v-col align="center"
              ><img
                class="mr-3"
                style="margin-top: 20px"
                src="../assets/logo/Logo_SVG_WHITE.png"
                height="40" /></v-col
          ></v-row>

          <v-card-text>
            <!-- <img id="profile-img" src="../assets/logo/Logo_SVG_BLACK.png" /> -->
            <v-row
              ><v-col>
                <v-form @submit.prevent>
                  <v-text-field
                    v-model="userData.username"
                    :rules="ruleUsername"
                    label="Username"
                  />
                  <v-text-field
                    v-model="userData.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required]"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    name="input-10-1"
                    counter
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                  <v-btn
                    block
                    class="mt-2"
                    type="submit"
                    size="x-large"
                    color="primary"
                    @click="handleLogin"
                    >Login</v-btn
                  >
                </v-form>

                <p class="text-disabled" style="text-align: left; margin-top: 20px">
                  In case of forgotten user credentials, please contact your system administrator.
                </p></v-col
              ></v-row
            ><v-row
              ><v-col>
                <div
                  class="versionTexty"
                  style="
                    margin-top: 10px;
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    color: gray;
                    font-size: 0.8rem;
                  "
                >
                  <div>© Exelentic GmbH 2024</div>
                  <div>[BETA] v.0.0.1</div>
                </div></v-col
              ></v-row
            >
          </v-card-text>
        </v-card></v-col
      >
    </v-row>
    <v-snackbar v-model="showLoginError" timeout="3000" color="red">
      {{ errorText }}

      <template v-slot:actions>
        <v-btn variant="text" @click="showLoginError = false"> Close </v-btn>
      </template>
    </v-snackbar></v-container
  >
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useDisplay } from 'vuetify'
import { fa } from 'vuetify/lib/iconsets/fa.mjs'
import kontrolix_apiService from '@/services/kontrolix_api.service'

export default {
  name: 'Login',
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required('Username is required!'),
      password: yup.string().required('Password is required!')
    })

    return {
      rules: {
        required: (value) => !!value || 'You must enter a password'
      },
      ruleUsername: [
        (value) => {
          if (value) return true

          return 'You must enter a username.'
        }
      ],

      userData: { username: '', password: '' },
      showPassword: false,
      loading: false,
      showMobile: false,
      message: '',
      showLoginError: false,
      errorText: ''
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    }
  },
  created() {
    if (this.loggedIn) {
      if (!window.matchMedia('(max-width: 768px)').matches) {
        this.$router.push('/dashboard')
      } else {
        this.$router.push('/mobile/Dashboard')
      }
    }
  },
  methods: {
    handleLogin() {
      this.loading = true

      if (this.userData.username != '' && this.userData.password != '')
        this.$store.dispatch('auth/login', this.userData).then(
          () => {
            if (!window.matchMedia('(max-width: 768px)').matches) {
              this.$router.push('/dashboard')
            } else {
              this.$router.push('/mobile/Dashboard')
            }
          },
          (error) => {
            this.loading = false
            this.message =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString()
            this.errorText = this.message
            this.showLoginError = true
          }
        )
    }
  },
  mounted() {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      this.showMobile = false
    } else {
      this.showMobile = true
    }
  }
}
</script>
