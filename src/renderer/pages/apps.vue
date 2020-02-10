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
                dark
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
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { remote } from 'electron'
import appHeader from '@/components/navigationHome'

export default {
  components: {
    appHeader
  },
  data: () => ({
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
      }
    ]
  }),
  methods: {
    openURL (url) {
      remote.shell.openExternal(url)
    },
    closeWindow: function (event) {
      var window = remote.getCurrentWindow()
      window.close();
    }
  }
}
</script>

<style scoped>
.col {
  text-align: center;
}
</style>
