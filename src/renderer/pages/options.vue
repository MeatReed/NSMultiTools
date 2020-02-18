<template>
  <div>
    <app-header />
    <v-content>
      <p class="font-weight-black headline text-center">
        Options
      </p>
      <v-container
          class="fill-height"
          fluid
        >
        <v-row>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-switch
              v-model="modelSwitch"
              label="Mode sombre"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { remote } from 'electron'
import appHeader from '@/components/navigationHome'
import path from 'path'
import db from 'electron-db'
 
let userData = path.join(process.env.APPDATA, 'nsmultitools');

export default {
  components: {
    appHeader
  },
  data: ({ $vuetify }) => ({
    modelSwitch: $vuetify.theme.dark
  }),
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    }
  },
  watch: {
    modelSwitch() {
      if(this.$vuetify.theme.dark === true) {
        this.$vuetify.theme.dark = false
        db.updateRow('config', {"dark": true}, {"dark": false}, (succ, msg) => {
          console.log("Success: " + succ);
          console.log("Message: " + msg);
        });
      } else {
        this.$vuetify.theme.dark = true
        db.updateRow('config', {"dark": false}, {"dark": true}, (succ, msg) => {
          console.log("Success: " + succ);
          console.log("Message: " + msg);
        });
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
