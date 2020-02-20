<template>
  <div>
    <app-header />
    <v-content>
      <v-container fluid>
        <v-row>
          <v-col v-for="(item, index) of menu" :key="index">
            <v-hover
              v-slot:default="{ hover }"
              open-delay="200"
            >
              <v-card
                class="mx-auto"
                :elevation="hover ? 16 : 2"
                max-width="344"
                outlined
                nuxt
                :to="item.to.name"
              >
                <v-card-title>
                  {{ item.name }}
                </v-card-title>
                <v-img class="white--text align-end"
                  :src="item.img"
                />
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
        <v-dialog
          v-model="dialog"
          max-width="600"
          persistent
        >
          <v-card>
            <v-card-title class="headline">Important !</v-card-title>

            <v-card-text>
              NSMultiTools a besoin d'installer des fichiers indispensables pour certaines applications, cliquez sur <kbd>J'accepte</kbd> pour installer ces fichiers(TegraRcmSmash.exe, apx_driver, serials.json).<br />Si vous n'acceptez pas, vous ne pourrez pas continuer !
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                v-on:click="installFiles()"
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
import appHeader from '@/components/navigationHome'
import download from 'url-download'
import fs from 'fs'
import unzipper from 'unzipper'
import path from 'path'
import https from 'https'

let userData = path.join(process.env.APPDATA, 'nsmultitools');

export default {
  components: {
    appHeader
  },
  data: () => ({
    dialog: false,
    menu: [
      {
        name: "Switch Appstore",
        img: require('../assets/appstorenx.png'),
        to: { name: '/appstore' }
      },
      {
        name: "Inject Payload",
        img: require('../assets/smashFistIcon.png'),
        to: { name: '/inject' }
      },
      {
        name: "SysDVR",
        img: require('../assets/sysdvr.png'),
        to: { name: '/sysdvr' }
      },
      {
        name: "IMSP",
        img: require('../assets/imsp.png'),
        to: { name: '/imsp' }
      }
    ]
  }),
  created() {
    if (!fs.existsSync(path.join(userData, 'TegraRcmSmash'))) {
      this.dialog = true
    } else if (!fs.existsSync(path.join(userData, 'apx_driver'))) {
      this.dialog = true
    } else if (!fs.existsSync(path.join(userData, 'ssnc'))) {
      this.dialog = true
    }
  },
  methods: {
    async installFiles() {
      this.dialog = false
      if (!fs.existsSync(path.join(userData, 'TegraRcmSmash'))) {
        fs.mkdirSync(path.join(userData, 'TegraRcmSmash'));
        
        download('https://github.com/MeatReed/NSMultiTools/raw/additionalFiles/TegraRcmSmash/TegraRcmSmash.exe', path.join(userData, 'TegraRcmSmash'))
        .on('close', function () {
          console.log('Download TegraRCMSmash');
        });
      }

      if (!fs.existsSync(path.join(userData, 'apx_driver'))) {
        fs.mkdirSync(path.join(userData, 'apx_driver'));
        
        download('https://github.com/MeatReed/NSMultiTools/raw/additionalFiles/apx_driver/apx_driver.zip', path.join(userData, 'apx_driver'))
        .on('close',async function () {
          console.log('Download apx_driver.zip');
          await fs.createReadStream(path.join(userData, 'apx_driver' , 'apx_driver.zip'))
            .pipe(unzipper.Extract({ path: path.join(userData) }));
          });
      }

      if (!fs.existsSync(path.join(userData, 'ssnc'))) {
        fs.mkdirSync(path.join(userData, 'ssnc'));

        var file = fs.createWriteStream(path.join(userData, 'ssnc', 'serials.json'));

        var request = https.get('https://raw.githubusercontent.com/MeatReed/NSMultiTools/additionalFiles/ssnc/serials.json', function(response) {
          response.on("finish", function() {
        
          }).pipe(file);
        });
      }
    }
  }
}
</script>
