<template>
  <div>
    <app-header />
    <v-content>
      <v-container fluid>
        <v-row>
          <v-col v-for="(item, index) of menuItems" :key="index">
            <v-hover v-slot:default="{ hover }" open-delay="200" aria-disabled>
              <v-tooltip
                v-if="navigator === 'offline' && item.online === true"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-card class="mx-auto" max-width="344" outlined v-on="on" :disabled="item.disabled">
                    <v-card-title>
                      {{ item.name }}
                    </v-card-title>
                    <v-img class="white--text align-end" :src="item.img" />
                  </v-card>
                </template>
                <span
                  >Cette application a besoin d'une connexion internet pour
                  fonctionner.</span
                >
              </v-tooltip>
              <v-card
                v-else
                class="mx-auto"
                :elevation="hover ? 16 : 2"
                max-width="344"
                outlined
                nuxt
                :to="item.to.name"
                :disabled="item.disabled"
              >
                <v-card-title>
                  {{ item.name }}
                </v-card-title>
                <v-img class="white--text align-end" :src="item.img" />
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="600" persistent>
          <v-card>
            <v-card-title class="headline">
              Important !
            </v-card-title>

            <v-card-text>
              NSMultiTools a besoin d'installer des fichiers indispensables pour
              certaines applications, cliquez sur <kbd>J'accepte</kbd> pour
              installer ces fichiers(TegraRcmSmash.exe, apx_driver,
              serials.json).<br />Si vous n'acceptez pas, vous ne pourrez pas
              continuer !
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn text @click="installFiles()">
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
import { remote, ipcRenderer } from 'electron'
import appHeader from '@/components/navigationHome'
import download from 'url-download'
import fs from 'fs'
import unzipper from 'unzipper'
import path from 'path'
import https from 'https'

let userData = path.join(process.env.APPDATA, 'nsmultitools')

export default {
  components: {
    appHeader,
  },
  data: () => ({
    dialog: false,
    navigator: navigator.onLine ? 'online' : 'offline',
    menuItems: [
      {
        name: 'Switch Appstore',
        img: require('../assets/appstorenx.png'),
        to: { name: '/appstore/home' },
        online: true,
        disabled: false
      },
      {
        name: 'Inject Payload',
        img: require('../assets/smashFistIcon.png'),
        to: { name: '/inject' },
        online: false,
        download: true,
        disabled: false
      },
      {
        name: 'IMSP',
        img: require('../assets/imsp.png'),
        to: { name: '/imsp' },
        online: false,
        download: true,
        disabled: false
      },
      {
        name: 'SysDVR',
        img: require('../assets/sysdvr.png'),
        to: { name: '/sysdvr' },
        online: false,
        download: true,
        disabled: false
      },
      {
        name: 'SX OS LICENSE',
        img: require('../assets/sxos.png'),
        to: { name: '/sxos' },
        online: true,
        download: true,
        disabled: false
      },
      /*{
        name: 'switch-lan-play',
        img: require('../assets/slp.png'),
        to: { name: '/slp' },
        online: true
      }
      {
        name: "Tinfoil",
        img: require('../assets/tinfoil.png'),
        to: { name: '/tinfoil' },
        online: true
      }*/
    ],
  }),
  created() {
    if (!fs.existsSync(path.join(userData, 'TegraRcmSmash'))) {
      this.dialog = true
      this.menuItems[1].disabled = true
    } else if (!fs.existsSync(path.join(userData, 'apx_driver'))) {
      this.dialog = true
      this.menuItems[1].disabled = true
    } else if (!fs.existsSync(path.join(userData, 'ssnc'))) {
      this.dialog = true
      this.menuItems[2].disabled = true
    } else if (!fs.existsSync(path.join(userData, 'UsbStream'))) {
      this.dialog = true
      this.menuItems[3].disabled = true
    }
  },
  methods: {
    async installFiles() {
      const menu = this.menuItems
      this.dialog = false
      if (!fs.existsSync(userData)) {
        fs.mkdirSync(userData)
      }
      if (!fs.existsSync(path.join(userData, 'TegraRcmSmash'))) {
        fs.mkdirSync(path.join(userData, 'TegraRcmSmash'))
        download(
          'https://github.com/MeatReed/NSMultiTools/raw/additionalFiles/TegraRcmSmash/TegraRcmSmash.exe',
          path.join(userData, 'TegraRcmSmash')
        ).on('close', function () {
          console.log('Download TegraRCMSmash')
          menu[1].disabled = false
        })
      }
      if (!fs.existsSync(path.join(userData, 'apx_driver'))) {
        fs.mkdirSync(path.join(userData, 'apx_driver'))
        download(
          'https://github.com/MeatReed/NSMultiTools/raw/additionalFiles/apx_driver/apx_driver.zip',
          path.join(userData, 'apx_driver')
        ).on('close', async function () {
          console.log('Download apx_driver.zip')
          await fs
            .createReadStream(
              path.join(userData, 'apx_driver', 'apx_driver.zip')
            )
            .pipe(unzipper.Extract({ path: path.join(userData) }))
          menu[1].disabled = false
        })
      }
      if (!fs.existsSync(path.join(userData, 'UsbStream'))) {
        fs.mkdirSync(path.join(userData, 'UsbStream'))
        download(
          'https://github.com/MeatReed/NSMultiTools/raw/additionalFiles/UsbStream/UsbStream.zip',
          path.join(userData, 'UsbStream')
        ).on('close', async function () {
          console.log('Download UsbStream.zip')
          await fs
            .createReadStream(path.join(userData, 'UsbStream', 'UsbStream.zip'))
            .pipe(unzipper.Extract({ path: path.join(userData, 'UsbStream') }))
          menu[3].disabled = false
        })
      }
      if (!fs.existsSync(path.join(userData, 'ssnc'))) {
        fs.mkdirSync(path.join(userData, 'ssnc'))
        var file = fs.createWriteStream(
          path.join(userData, 'ssnc', 'serials.json')
        )
        var request = https.get(
          'https://raw.githubusercontent.com/MeatReed/NSMultiTools/additionalFiles/ssnc/serials.json',
          function (response) {
            response.on('finish', function () {}).pipe(file)
            menu[2].disabled = false
          }
        )
      }
    },
  },
}
</script>
