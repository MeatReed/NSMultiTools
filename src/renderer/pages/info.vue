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
          <v-col cols="4">
            <v-avatar tile size="250">
              <v-img
                src="https://cdn.discordapp.com/avatars/556940395473534986/18a11fb44332ef788333eaf9be1853ba.png?size=2048"
              />
            </v-avatar>
          </v-col>
          <v-col cols="8">
            <v-card
              outlined
              dark
            >
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Information</div>
                <v-list-item-title class="headline mb-1">MeatReed</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </v-card>
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
    </v-row>
  </v-container>
</template>

<script>
import { remote } from 'electron'
import electron from 'electron'

export default {
  data() {
    return {
      chrome: process.versions.chrome,
      electron: process.versions.electron,
      node: process.versions.node,
      platform: require('os').platform(),
      vue: require('vue/package.json').version,
      nuxt: require('nuxt/package.json').version
    }
  },
  methods: {
    closeWindow: function (event) {
      var window = electron.remote.getCurrentWindow()
      window.close();
    }
  }
}
</script>

<style scoped>
.v-slide-group {
  background: #2D2D2D;
}

.container {
  padding-right: 100px !important;
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
