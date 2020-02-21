<template>
  <div>
    <app-header />
    <v-content>
      <div class="font-weight-bold headline text-center">
        Inject Payload
      </div>
      <v-container
          class="fill-height"
          fluid
        >
        <v-row
          align="center"
          justify="start"
        >
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
                    <v-chip
                      small
                      label
                    >
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
                <v-btn text v-on:click="launchPayload()">Injecter</v-btn>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="areaConsole"
                  readonly
                  outlined
                  no-resize
                  label="Log"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn v-on:click="openURL('http://www.logic-sunrise.com/forums/topic/81670-demarrer-la-switch-en-mode-rcm/')">Mettre sa Nintendo Switch en mode RCM ?</v-btn>
          </v-col>
          <v-col>
            <v-btn nuxt to="/imsp">Vérifier si sa Nintendo Switch est compatible</v-btn>
          </v-col>
        </v-row>
        <v-dialog
          v-model="dialogDriver"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">Installer les drivers ?</v-card-title>

            <v-card-text>
              Les drivers ne sont pas installés, cliquez sur <kbd>J'accepte</kbd> pour les installer et recommencez.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text
                @click="dialogDriver = false"
              >
                Je n'accepte pas
              </v-btn>

              <v-btn
                text
                v-on:click="installDriver()"
              >
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
import fs from 'fs'

let usbVerifyLaunch = usb.getDeviceList().find(function(d) {
  return d.deviceDescriptor.idVendor === 0x0955
});

let usbConnect = !usbVerifyLaunch ? false : true

let typeAlert = null
let messageAlert = null

if(!usbConnect) {
  typeAlert = "error"
  messageAlert = "La Nintendo Switch n'est pas connectée à l'ordinateur ou en mode RCM !"
} else {
  typeAlert = "success"
  messageAlert = "La Nintendo Switch est bien détectée, veuillez choisir un payload."
}

let userData = path.join(process.env.APPDATA, 'nsmultitools');

export default {
  components: {
    appHeader
  },
  data: () => ({
    files: [],
    messageAlert: messageAlert,
    typeAlert: typeAlert,
    dialogDriver: false,
    areaConsole: null
  }),
  mounted () {
    usb.on('attach', (device) => {
      if(device.deviceDescriptor.idVendor === 0x0955) {
        usbConnect = true
        this.onUsb('attach')
      }
    })
    usb.on('detach', (device) => {
      if(device.deviceDescriptor.idVendor === 0x0955) {
        usbConnect = false
        this.onUsb('detach')
      }
    })
  },
  methods: {
    openURL(url) {
      remote.shell.openExternal(url)
    },
    onUsb: function(type) {
      if(type === 'attach') {
        this.typeAlert = "success"
        this.messageAlert = "La Nintendo Switch est bien détectée, veuillez choisir un payload."
      } else {
        this.typeAlert = "error"
        this.messageAlert = "La Nintendo Switch n'est pas connectée à l'ordinateur ou en mode RCM !"
      }
    },
    async installDriver() {
      this.dialogDriver = false
      exec(`${userData}/apx_driver/InstallDriver.exe`)
    },
    async launchPayload() {
      if(usbConnect === false) {
        this.typeAlert = "error"
        this.messageAlert = "La Nintendo Switch n'est pas connectée à l'ordinateur ou en mode RCM !"
        return;
      };
      if(!this.files) {
        this.typeAlert = "error"
        this.messageAlert = "Vous n'avez pas sélectionné de payload !"
        return;
      };
      let smash = spawn(`${userData}/TegraRcmSmash/TegraRcmSmash.exe`, [`${this.files.path}`]);
      smash.stdout.on('data', (data) => {
        this.areaConsole = data.toString()
      });
      smash.on('exit', (code) => {
        if(code === 4294967290) {
          this.typeAlert = "error"
          this.messageAlert = "Les drivers ne sont pas installés !"
          this.dialogDriver = true
        } else {
          this.typeAlert = "success"
          this.messageAlert = "Payload injecté !"
        }
      })
    }
  }
}
</script>

<style scoped>
.col {
  text-align: center;
}
</style>
