<template>
  <div>
    <app-header />
    <v-content>
      <div class="font-weight-bold headline text-center">
        Inject Payload
      </div>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="start">
          <v-col>
            <v-row>
              <v-col>
                <v-alert :type="typeAlert">
                  {{ messageAlert }}
                </v-alert>
                <v-file-input
                  v-model="files"
                  placeholder="Choisir un payload"
                  label="Payload"
                  accept=".bin"
                  prepend-icon="mdi-paperclip"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small label>
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
                <v-btn text :disabled="disabledInject" @click="launchPayload()">
                  Injecter
                </v-btn>
              </v-col>
              <v-col>
                <v-select v-model="selectPayload" :items="favList" />
                <v-btn
                  :disabled="disabledAddFav"
                  color="success"
                  @click="addFav()"
                >
                  Ajouter en favorie
                </v-btn>
                <v-btn
                  :disabled="disabledDeleteFav"
                  color="error"
                  @click="deleteFav()"
                >
                  Retirer en favorie
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              @click="
                openURL(
                  'http://www.logic-sunrise.com/forums/topic/81670-demarrer-la-switch-en-mode-rcm/'
                )
              "
            >
              Mettre sa Nintendo Switch en mode RCM ?
            </v-btn>
          </v-col>
          <v-col>
            <v-btn nuxt to="/imsp">
              Vérifier si sa Nintendo Switch est compatible
            </v-btn>
          </v-col>
        </v-row>
        <v-dialog v-model="dialogDriver" max-width="290">
          <v-card>
            <v-card-title class="headline">
              Installer les drivers ?
            </v-card-title>

            <v-card-text>
              Les drivers ne sont pas installés, cliquez sur
              <kbd>J'accepte</kbd> pour les installer et recommencez.
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn text @click="dialogDriver = false">
                Je n'accepte pas
              </v-btn>

              <v-btn text @click="installDriver()">
                J'accepte
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { remote } from 'electron'
import usb from 'usb'
import { exec, spawn } from 'child_process'
import appHeader from '@/components/navigationHome'
import path from 'path'
import config from 'electron-json-config'
import fs from 'fs'

let usbVerifyLaunch = usb.getDeviceList().find(function(d) {
  return d.deviceDescriptor.idVendor === 0x0955
})

let usbConnect = !usbVerifyLaunch ? false : true

let typeAlert = null
let messageAlert = null

if (!usbConnect) {
  typeAlert = 'error'
  messageAlert =
    "La Nintendo Switch n'est pas connectée à l'ordinateur ou en mode RCM !"
} else {
  typeAlert = 'success'
  messageAlert =
    'La Nintendo Switch est bien détectée, veuillez choisir un payload.'
}

let userData = path.join(process.env.APPDATA, 'nsmultitools')

export default {
  components: {
    appHeader
  },
  data: () => ({
    files: null,
    file: null,
    favList: config.has('payloadFav') ? config.get('payloadFav') : [],
    messageAlert: messageAlert,
    typeAlert: typeAlert,
    dialogDriver: false,
    disabledAddFav: true,
    disabledDeleteFav: true,
    disabledInject: true,
    selectPayload: null
  }),
  mounted() {
    usb.on('attach', (device) => {
      if (device.deviceDescriptor.idVendor === 0x0955) {
        usbConnect = true
        this.onUsb('attach')
      }
    })
    usb.on('detach', (device) => {
      if (device.deviceDescriptor.idVendor === 0x0955) {
        usbConnect = false
        this.onUsb('detach')
      }
    })
  },
  watch: {
    files(file) {
      if (file) {
        this.file = file.path
        this.disabledAddFav = false
        this.disabledInject = false
      } else {
        this.file = null
        this.disabledAddFav = true
        this.disabledInject = true
      }
    },
    selectPayload(file) {
      if (file) {
        this.file = file
        this.disabledInject = false
        this.disabledDeleteFav = false
        this.typeAlert = 'success'
        this.messageAlert = file + ' a bien été sélectionner.'
      } else {
        this.file = null
        this.disabledInject = true
        this.disabledDeleteFav = false
      }
    }
  },
  methods: {
    openURL(url) {
      remote.shell.openExternal(url)
    },
    onUsb: function(type) {
      if (type === 'attach') {
        this.typeAlert = 'success'
        this.messageAlert =
          'La Nintendo Switch est bien détectée, veuillez choisir un payload.'
      } else {
        this.typeAlert = 'error'
        this.messageAlert =
          "La Nintendo Switch n'est pas connectée à l'ordinateur ou en mode RCM !"
      }
    },
    installDriver() {
      this.dialogDriver = false
      exec(`${userData}/apx_driver/InstallDriver.exe`)
    },
    async launchPayload() {
      if (usbConnect === false) {
        this.typeAlert = 'error'
        this.messageAlert =
          "La Nintendo Switch n'est pas connectée à l'ordinateur ou en mode RCM !"
        return
      }
      if (!this.file) {
        this.typeAlert = 'error'
        this.messageAlert = "Vous n'avez pas sélectionné de payload !"
        return
      }
      let smash = spawn(
        `${userData}/TegraRcmSmash/TegraRcmSmash.exe`,
        [`${this.file}`],
        { shell: true, detached: true, windowsHide: true, stdio: 'inherit' }
      )
      smash.on('exit', (code) => {
        if (code === 4294967290) {
          this.typeAlert = 'error'
          this.messageAlert = 'Les drivers ne sont pas installés !'
          this.dialogDriver = true
        } else {
          this.typeAlert = 'success'
          this.messageAlert = 'Payload injecté !'
        }
      })
    },
    addFav() {
      if (this.favList.includes(this.file)) {
        this.typeAlert = 'error'
        this.messageAlert = 'Ce payload existe déjà dans les favoris !'
      } else {
        this.typeAlert = 'success'
        this.messageAlert =
          'Ce payload a bien été ajouté dans la liste des favoris !'
        this.favList.push(this.file)
        config.set('payloadFav', this.favList)
      }
    },
    deleteFav() {
      var index = this.favList.indexOf(this.file)
      while (index > -1) {
        this.favList.splice(index, 1)
        index = this.favList.indexOf(this.file)
      }
      config.set('payloadFav', this.favList)
    }
  }
}
</script>

<style scoped>
.col {
  text-align: center;
}
</style>
