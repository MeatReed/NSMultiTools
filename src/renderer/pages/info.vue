<template>
  <div>
    <app-header />
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row id="menuIcons" align="center" justify="start">
          <v-col cols="4">
            <v-avatar tile size="250">
              <v-img
                src="https://cdn.discordapp.com/avatars/556940395473534986/d2c77c94ab7934b4862fb097bd9eecd9.png?size=4096"
              />
            </v-avatar>
          </v-col>
          <v-col cols="8">
            <v-card outlined>
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline mb-4">
                    Information
                  </div>
                  <v-list-item-title class="headline mb-1">
                    MeatReed
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Nuxt.js: {{ nuxt }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>Vue.js: {{ vue }}</v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Electron: {{ electron }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>Node: {{ node }}</v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Chrome: {{ chrome }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Platform: {{ platform }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions>
                <v-btn
                  text
                  @click="
                    openLink(
                      'https://www.youtube.com/channel/UCxcgIQ08IewI19Q_eiJxKRA'
                    )
                  "
                >
                  <v-icon>mdi-youtube</v-icon>Youtube
                </v-btn>
                <v-btn text @click="openLink('https://discord.gg/9q7E6df')">
                  <v-icon>mdi-discord</v-icon>Discord
                </v-btn>
                <v-btn text @click="openLink('https://github.com/MeatReed')">
                  <v-icon>mdi-github-circle</v-icon>Github
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { remote } from 'electron'
import appHeader from '@/components/navigationHome'

export default {
  components: {
    appHeader,
  },
  data() {
    return {
      chrome: process.versions.chrome,
      electron: process.versions.electron,
      node: process.versions.node,
      platform: require('os').platform(),
      vue: require('vue/package.json').version,
      nuxt: require('nuxt/package.json').version,
    }
  },
  methods: {
    openLink(link) {
      remote.shell.openExternal(link)
    },
  },
}
</script>

<style scoped>
.col {
  text-align: center;
}
</style>
