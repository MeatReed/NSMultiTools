<template>
  <v-container
      class="fill-height"
      fluid
    >
    <v-row
      id="menuIcons"
      align="center"
      justify="start"
    >
      <v-col>
        <v-row>
          <v-col>
            <v-alert :color="colorAlert">
              {{ messageAlert }}
            </v-alert>
            <v-file-input
              v-model="files"
              placeholder="Choisir un payload"
              label="Payload"
              multiple
              prepend-icon="mdi-paperclip"
              dark
            >
              <template v-slot:selection="{ text }">
                <v-chip
                  small
                  label
                  color="primary"
                >
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>
            <v-btn text v-on:click="launchPayload()" dark>Injecter</v-btn>
          </v-col>
          <v-col>
            <v-textarea
              dark
              disabled
              clearable
              outlined
              name="input-7-4"
              label="Log"
              :value="textareaValue"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn v-on:click="closeWindow" id="close-btn" class="mx-3" fab dark small color="red">
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
            <nuxt-link to="/" class="mx-3 v-btn v-btn--contained v-btn--fab v-btn--round theme--dark v-size--small grey">
              <v-icon dark>mdi-home</v-icon>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-col>
      <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card dark>
        <v-card-title class="headline">Installer les drivers ?</v-card-title>

        <v-card-text>
          Les drivers ne sont pas installés, cliquez sur <kbd>J'accepte</kbd> pour les installer et recommencez.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            @click="dialog = false"
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
    </v-row>
  </v-container>
</template>

<script>
import { remote } from 'electron'
import usb from 'usb'
import fs from 'fs'
import { exec, spawn } from 'child_process'

let usbVerifyLaunch = usb.getDeviceList().find(function(d) {
  return d.deviceDescriptor.idVendor === 0x0955
});

let usbConnect = !usbVerifyLaunch ? false : true

let colorAlert = null
let messageAlert = null

if(!usbConnect) {
  colorAlert = "red"
  messageAlert = "La Nintendo Switch n'est pas connectée à l'ordinateur, en mode RCM ou les drivers ne sont pas installer !"
} else {
  colorAlert = "green"
  messageAlert = "La Nintendo Switch est bien détectée, veuillez choisir un payload."
}

export default {
  data: () => ({
      files: [],
      messageAlert: messageAlert,
      colorAlert: colorAlert,
      textareaValue: null,
      dialog: false
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
    onUsb: function(type) {
      if(type === 'attach') {
        this.colorAlert = "green"
        this.messageAlert = "La Nintendo Switch est bien détectée, veuillez choisir un payload."
      } else {
        this.colorAlert = "red"
        this.messageAlert = "La Nintendo Switch n'est pas connectée à l'ordinateur ou en mode RCM !"
      }
    },
    async installDriver(payload) {
      this.dialog = false
      exec(`${process.cwd()}/apx_driver/InstallDriver.exe`)
    },
    async launchPayload(payload) {

      if(usbConnect === false) {
        this.colorAlert = "green"
        this.messageAlert = "La Nintendo Switch n'est pas connectée à l'ordinateur ou en mode RCM !"
        return;
      };

      if(!this.files[0]) {
        this.colorAlert = "red"
        this.messageAlert = "Vous n'avez pas sélectionné de payload !"
        return;
      };

      let smash = spawn(`${process.cwd()}/TegraRcmSmash/TegraRcmSmash.exe`, [`${this.files[0].path}`]);

      smash.stdout.on('data', (data) => {
        this.textareaValue = data.toString()
      });

      smash.on('exit', (code) => {
        if(code === 4294967290) {
          this.colorAlert = "red"
          this.messageAlert = "Les drivers ne sont pas installés !"
          this.dialog = true
        } else {
          this.colorAlert = "green"
          this.messageAlert = "Payload injecté !"
        }
      });
    
    },
    closeWindow: function (event) {
      var window = remote.getCurrentWindow()
      window.close();
    }
  }
}
</script>

<style scoped>
.v-slide-group {
  background: #2D2D2D;
}

#menuIcons {
  padding-left: 20px;
}

#menuIcon {
  height: 250px;
  width: 250px;
}

.align-center {
    align-items: center !important;
}

.justify-start {
    justify-content: flex-start !important;
}

.col {
  text-align: center;
}
</style>
