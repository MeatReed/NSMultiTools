<template>
  <div>
    <app-header />
    <v-content>
      <div class="font-weight-bold headline text-center">
        Options
      </div>
      <v-container class="fill-height" fluid>
        <v-row />
        <v-row>
          <v-col class="d-flex justify-center">
            <v-switch v-model="modelSwitch" label="Mode sombre" />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import appHeader from '@/components/navigationHome'
import config from 'electron-json-config'

export default {
  components: {
    appHeader,
  },
  data: ({ $vuetify }) => ({
    modelSwitch: $vuetify.theme.dark,
  }),
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
  },
  watch: {
    modelSwitch() {
      if (this.$vuetify.theme.dark === true) {
        this.$vuetify.theme.dark = false
        config.set('dark', false)
      } else {
        this.$vuetify.theme.dark = true
        config.set('dark', true)
      }
    },
  },
}
</script>

<style scoped>
.col {
  text-align: center;
}
</style>
