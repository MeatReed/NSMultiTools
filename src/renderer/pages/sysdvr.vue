<template>
  <div>
    <app-header />
    <v-content>
      <div class="font-weight-bold headline text-center">
        SysDVR
      </div>
      <v-container class="fill-height" fluid>
        <v-row>
          <v-col>
            <v-alert v-model="alertModel" :type="alertType">
              {{ alertMessage }}
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center mb-6">
            <v-radio-group
              v-model="radioChannel"
              row
              label="Canaux de diffusion:"
            >
              <v-radio label="Vidéo" value="--no-audio" />
              <v-radio label="Audio" value="--no-video" />
              <v-radio label="Tout" value=" " />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center mb-6">
            <v-radio-group v-model="radioStream" row label="Méthode du flux:">
              <v-radio label="RTSP(Recommandé)" value="rtsp" />
              <!-- <v-radio label="mpv" value="mpv" /> -->
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center mb-6">
            <v-btn :disabled="btnLaunchDisabled" @click="launch()">
              Lancer SysDVR
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

const userData = path.join(process.env.APPDATA, 'nsmultitools')

export default {
  components: {
    appHeader,
  },
  data: () => ({
    alertMessage: null,
    alertModel: false,
    alertType: null,
    radioChannel: null,
    radioStream: null,
    dialogDriver: false,
    args: [],
    btnLaunchDisabled: false
  }),
  methods: {
    async installDriver() {
      this.dialogDriver = false
      exec(`${userData}/apx_driver/InstallDriver.exe`)
    },
    launch() {
      this.args = []
      this.btnLaunchDisabled = true
      if (this.radioChannel === null) {
        this.alertMessage =
          "Vous n'avez sélectionné aucun canaux de diffusion !"
        this.alertModel = true
        this.alertType = 'error'
      } else if (this.radioStream === null) {
        this.alertMessage = "Vous n'avez sélectionné aucune méthode du flux !"
        this.alertModel = true
        this.alertType = 'error'
      }
      this.args.push(this.radioStream)
      this.args.push(this.radioChannel)
      console.log(this.radioChannel, this.radioStream, this.args)

      let smash = spawn(`${userData}/UsbStream/SysDVR-Client.exe`, this.args, {
        shell: true,
        detached: true,
        windowsHide: true,
        stdio: 'inherit',
      })

      smash.on('close', (code) => {
        this.btnLaunchDisabled = false
      });
    },
  },
}
</script>

<style scoped>
.col {
  text-align: center;
}
</style>
