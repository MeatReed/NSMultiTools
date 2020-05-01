<template>
  <v-app id="inspire">
    <v-content>
      <nuxt keep-alive />
    </v-content>
    <v-footer app>
      <span>Made by MeatReed</span>
      <v-spacer />
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import config from 'electron-json-config'

export default {
  beforeCreate() {
    if (!config.has('dark')) {
      config.set('dark', true)
    }
    this.$vuetify.theme.dark = config.get('dark')
  },
}
</script>

<style>
* {
  font-family: 'Montserrat';
}

::-webkit-scrollbar {
  display: none;
}

p {
  color: #ffffff;
}

.author {
  color: #ffffff;
}

.changelog {
  color: #ffffff;
}
</style>
