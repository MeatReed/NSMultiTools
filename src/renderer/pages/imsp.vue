<template>
  <div>
    <app-header />
    <v-content>
      <p class="font-weight-black headline text-center">
        Is My Switch Patched?
      </p>
      <v-container
          class="fill-height lighten-5"
          
          fluid
        >
        <v-row
          align="center"
          justify="center"
        >
          <v-col>
            <v-container
              class="fill-height"
              fluid
            >
            <v-row>
              <v-col>
                <v-text-field
                  v-model="serialInput"
                  label="Numéro de série"
                  placeholder="Exemple : XAJ10011683536 ou XAJ1 0011683536"
                  @input="inputUpdate"
                />
                <v-alert
                  :value="valueAlert"
                  :type="typeSerial"
                >
                  {{ messageSerial }}
                </v-alert>
              </v-col>
            </v-row>
             </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click.stop="dialogSN = true">Où trouver son numéro de série ?</v-btn>
          </v-col>
          <v-col>
            <v-btn nuxt to="/inject">Injecter un payload sur sa Nintendo Switch</v-btn>
          </v-col>
        </v-row>
        <v-dialog
          v-model="dialogSN"
        >
          <v-card>
            <v-card-title class="headline">Où trouver son numéro de série ?</v-card-title>

            <v-card-text>
              Il y a trois façons de trouver le numéro de série de sa Nintendo Switch
              <ol>
                <li>Sur l'emballage de la console situé sur la face inférieure.</li>
                <li>Sur la console situé en bas.<v-img :src="require('../assets/serie.png')" aspect-ratio="2" /></li>
                <li>Ou dans les paramètres de la console en allant dans <kbd>Console</kbd> et ensuite <kbd>Numéro de série</kbd></li>
              </ol>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text
                @click="dialogSN = false"
              >
                Fermer
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
import fs from 'fs'
import path from 'path'

let userData = path.join(process.env.APPDATA, 'nsmultitools');

export default {
  components: {
    appHeader
  },
  data: () => ({
    serialInput: null,
    messageSerial: null,
    typeSerial: null,
    valueAlert: false,
    dialogSN: false
  }),
  methods: {
    inputUpdate() {
      if(this.serialInput.length === 0) {
        this.valueAlert = false
        return
      }

      let serials = fs.readFileSync(`${userData}/ssnc/serials.json`)

      let serialsParse = JSON.parse(serials);
      this.check(serialsParse ,this.serialInput)
    },
    send_data(serial_input, prefix, serial_digits, status, msg) {
      let data = {
        serial: serial_input,
        prefix: prefix,
        serial_digits: serial_digits,
        status: status || "incorrect"
      }
      this.messageSerial = status
      if(status === "safe") {
        this.valueAlert = true
        this.messageSerial = 'Votre Nintendo Switch n\'est pas patchée, vous pouvez correctement la hacker !'
        this.typeSerial = 'success'
      } else if(status === "warning") {
        this.valueAlert = true
        this.messageSerial = 'Il est impossible de déterminer si votre Nintendo Switch est hackable !'
        this.typeSerial = 'warning'
      } else if(status === "patched") {
        this.valueAlert = true
        this.messageSerial = 'Votre Nintendo Switch est patchée, vous ne pouvez pas la hacker !'
        this.typeSerial = 'error'
      } else {
        this.valueAlert = true
        this.messageSerial = 'Le numéro de série que vous avez saisi est incorrect !'
        this.typeSerial = 'error'
      }
    },
    check(serials, serial) {
      let serial_input = serial.replace(/\s/g, '')
      if (serial_input.length >= 4) {

        let first_part = serial_input.slice(0, 4).toUpperCase();
        let second_part = serial_input.slice(3, 10);;
        let category_serials;

        if (serial_input.length <= 10) return this.send_data(serial_input, first_part, serial_input.slice(3, 10));

        if (isNaN(second_part)) return this.send_data(serial_input, first_part, second_part);

        category_serials = serials[first_part];

        if (!category_serials) return this.send_data(serial_input, first_part, second_part);

        let category_serials_array = Object.entries(category_serials).sort()

        if (second_part <= parseInt(category_serials_array[0][0])) {
          return this.send_data(serial_input, first_part, second_part, category_serials_array[0][1]);
        } else {
          if (second_part <= parseInt(category_serials_array[1][0])) {
            return this.send_data(serial_input, first_part, second_part, category_serials_array[1][1]);
          } else {
            return this.send_data(serial_input, first_part, second_part, category_serials_array[2][1]);
          }
        }
      } else {
        return this.send_data(serial_input, null, null);
      }
    }
  }
}
</script>

<style scoped>
.col {
  text-align: center;
}
</style>
