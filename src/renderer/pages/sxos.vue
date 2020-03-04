<template>
  <div>
    <app-header />
    <v-content>
      <div class="font-weight-bold headline text-center">
        SX OS LICENSE
      </div>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="start">
          <v-col>
            <v-row>
              <v-col>
                <v-alert :value="valueAlert" :type="typeAlert">
                  {{ messageAlert }}
                </v-alert>
                <v-file-input
                  v-model="fileSelected"
                  placeholder="Uploader le fichier license-request.dat créé par SX OS pour obtenir une licence unique pour votre console !"
                  label="Votre license-request.dat"
                  accept=".dat"
                  prepend-icon="mdi-paperclip"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small label>
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
                <div :class="showRedeemCode ? '' : 'd-none'">
                  <v-text-field
                    v-model="license_code"
                    class="sxCode"
                    label="Veuillez entrer votre code de licence."
                  />
                  <v-btn
                    :disabled="btnRetrieveDisabled"
                    :loading="btnRetrieveLoading"
                    @click="manualRetrieve()"
                  >
                    Activer sa licence
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn nuxt to="/imsp">
              Vérifier si sa Nintendo Switch est compatible
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { remote, shell } from 'electron'
import appHeader from '@/components/navigationHome'
import fs from 'fs'
import axios from 'axios'
export default {
  components: {
    appHeader
  },
  data: () => ({
    messageAlert: null,
    valueAlert: false,
    licenseCodeForm: false,
    typeAlert: null,
    fileSelected: null,
    license_code: null,
    showRedeemCode: false,
    btnRetrieveDisabled: true,
    csr_data: null,
    dataPost: null,
    btnRetrieveLoading: false
  }),
  watch: {
    fileSelected(file) {
      if (file === undefined) {
        this.messageAlert = null
        this.typeAlert = null
        this.valueAlert = false
        this.showRedeemCode = false
        return
      }

      if (file.name !== 'license-request.dat') {
        this.messageAlert =
          'Le fichier que vous avez mis ne correspond pas au license-request.dat !'
        this.typeAlert = 'error'
        this.valueAlert = true
        this.showRedeemCode = false
        return
      }

      var buffer = fs.readFileSync(file.path)
      let bytes = new Uint8Array(new ArrayBuffer(buffer.length))
      for (var i = 0; i < buffer.length; ++i) {
        bytes[i] = buffer[i]
      }
      this.csr_data = ''
      for (i = 0; i < bytes.length; i++) {
        this.csr_data += ('0' + bytes[i].toString(16)).substr(-2)
      }
      if (this.csr_data.substr(0x40, 0x40) == '0'.repeat(0x40)) {
        this.showRedeemCode = true
      } else {
        this.showRedeemCode = false
      }
    },
    license_code(val) {
      if (val.length === 0) {
        this.messageAlert = null
        this.typeAlert = null
        this.valueAlert = false
        this.btnRetrieveDisabled = true
      } else if (val.length === 12) {
        this.messageAlert = null
        this.typeAlert = null
        this.valueAlert = false
        this.btnRetrieveDisabled = false
      } else {
        this.messageAlert = 'Le code de licence doit contenir 12 caractères !'
        this.typeAlert = 'error'
        this.valueAlert = true
        this.btnRetrieveDisabled = true
      }
    }
  },
  methods: {
    manualRetrieve() {
      this.btnRetrieveLoading = true
      this.license_code = this.license_code.toUpperCase()

      if (/^[0-9A-Z]{12}$/.test(this.license_code) != true) {
        this.messageAlert = "Le code de licence n'est pas valide !"
        this.typeAlert = 'error'
        this.valueAlert = true
        return
      }

      this.sign_csr(this.csr_data, this.license_code)
    },
    sign_csr(csr_data, code) {
      if (code != null) {
        this.dataPost = { csr_data: csr_data, redeem_code: code }
      } else {
        this.dataPost = { csr_data: csr_data }
      }

      var self = this

      axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(this.dataPost),
        url: 'https://sx.xecuter.com/sx-api-server.php?u=sign'
      })
        .then(function() {
          self.get_license(csr_data, code)
        })
        .catch(function() {
          self.messageAlert =
            "Une erreur est survenue, votre licence n'est sûrement pas valide ou les serveurs SX XECUTER ne sont pas fonctionnels."
          self.typeAlert = 'error'
          self.valueAlert = true
          self.btnRetrieveLoading = false
        })
    },
    get_license(csr_data, code) {
      if (code != null) {
        this.dataPost = { csr_data: csr_data, redeem_code: code }
      } else {
        this.dataPost = { csr_data: csr_data }
      }

      var self = this

      axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(this.dataPost),
        url: 'https://sx.xecuter.com/sx-api-server.php?u=retrieve'
      })
        .then(function(response) {
          let license_file = new Uint8Array(response.data.license.length / 2)
          for (var i = 0; i < response.data.license.length / 2; i++) {
            license_file[i] = parseInt(
              response.data.license.substr(i * 2, 2),
              16
            )
          }

          var path = remote.dialog.showSaveDialogSync({
            title: 'Sauvegarde license.dat',
            defaultPath: 'license.dat'
          })
          fs.writeFileSync(path, new Buffer.from(license_file))
          shell.showItemInFolder(path)

          self.messageAlert = 'license.dat a été enregistré avec succès !'
          self.typeAlert = 'success'
          self.valueAlert = true
          self.btnRetrieveLoading = false
        })
        .catch(function() {
          self.messageAlert = 'Une erreur est survenue.'
          self.typeAlert = 'error'
          self.valueAlert = true
          self.btnRetrieveLoading = false
        })
    }
  }
}
</script>

<style scoped>
.sxCode {
  width: 300px;
  margin: 0px auto;
  display: block;
}

.col {
  text-align: center;
}
</style>
