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
                  :label="$t('imsp.sn')"
                  :placeholder="$t('imsp.example')"
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
            <v-btn @click.stop="dialog = true">{{ $t('imsp.where') }}</v-btn>
          </v-col>
          <v-col>
            <v-btn nuxt to="/inject">{{ $t('imsp.injectMessage') }}</v-btn>
          </v-col>
        </v-row>
        <v-dialog
          v-model="dialog"
        >
          <v-card>
            <v-card-title class="headline">{{ $t('imsp.where') }}</v-card-title>

            <v-card-text>
              {{ $t('imsp.threeways') }}
              <ol>
                <li>{{ $t('imsp.packaging') }}</li>
                <li>{{ $t('imsp.console') }}<v-img :src="require('../assets/serie.png')" aspect-ratio="2" /></li>
                <li>{{ $t('imsp.parameterMsgOne') }} <kbd>Console</kbd> {{ $t('imsp.parameterMsgTwo') }} <kbd>{{ $t('imsp.sn') }}</kbd></li>
              </ol>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text
                @click="dialog = false"
              >
                {{ $t('imsp.close') }}
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
    dialog: false
  }),
  mounted () {

  },
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
        this.messageSerial = this.$i18n.t('imsp.success')
        this.typeSerial = 'success'
      } else if(status === "warning") {
        this.valueAlert = true
        this.messageSerial = this.$i18n.t('imsp.warning')
        this.typeSerial = 'warning'
      } else if(status === "patched") {
        this.valueAlert = true
        this.messageSerial = this.$i18n.t('imsp.patched')
        this.typeSerial = 'error'
      } else {
        this.valueAlert = true
        this.messageSerial = this.$i18n.t('imsp.incorrect')
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
          };
        };

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