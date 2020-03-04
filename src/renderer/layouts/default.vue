<template>
  <v-app id="inspire">
    <v-content>
      <nuxt />
    </v-content>
    <v-footer app>
      <span>Made by MeatReed</span>
      <v-spacer />
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import db from 'electron-db'

export default {
  beforeCreate() {
    db.getField('config', 'dark', (succ, data) => {
      this.$vuetify.theme.dark = data[0]
    })
  }
}
</script>

<style>
* {
  font-family: "Montserrat";
}

::-webkit-scrollbar {
  display: none;
}

.v-content {
  padding: 56px 29px 36px 0px !important;
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
