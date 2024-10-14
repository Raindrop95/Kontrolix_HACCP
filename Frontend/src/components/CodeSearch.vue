<template>
  <v-container class="mb-6">
    <v-row align="center">
      <v-col
        ><v-sheet
          color="surface-light"
          style="padding: 20px; border-radius: 30px; margin-bottom: 20px"
          ><v-col align="center"
            ><v-row
              ><v-col align="center">
                <p class="text-h5 text-md-h5 text-lg-h4">Search QR-Code</p></v-col
              ></v-row
            ><v-row>
              <p class="font-weight-thin">
                Please type in the QR-Code ID. You can find the ID below the code.
              </p></v-row
            >
          </v-col></v-sheet
        ><v-col align="center">
          <v-row
            ><v-col
              ><v-text-field
                clearable
                label="Search Code-ID"
                v-model="textFieldQrCode"
                variant="solo-filled"
              ></v-text-field></v-col
          ></v-row>
          <v-row>
            <v-col><v-btn color="primary" @click="searchQrCode()">Search</v-btn></v-col></v-row
          ></v-col
        ></v-col
      >
    </v-row>
  </v-container>
</template>
<style scoped></style>

<script>
export default {
  data: () => ({
    textFieldQrCode: ''
  }),
  name: 'Dashboard',
  metaInfo: {
    title: 'Exelentic RCI - Dashboard'
  },
  components: {},

  methods: {
    searchQrCode() {
      // Access the value of the id field

      this.$emit('result-changed', this.textFieldQrCode)
    }
  },
  mounted() {},
  beforeDestroy() {}
}
</script>
<style scoped></style>
