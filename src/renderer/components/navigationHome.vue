<template>
  <header class="home-header">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5">NSMultiTools</span>
      <v-spacer />
      <v-btn icon nuxt to="/">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon color="red" @click="closeWindow">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" nuxt :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn nuxt to="/options" block>
            Options
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </header>
</template>

<script>
import { remote } from 'electron'

export default {
  data: () => ({
    drawer: false,
    items: [
      //{ title: 'Accueil', icon: 'mdi-home', to: '/' },
      { title: 'Applications', icon: 'mdi-application', to: '/' },
      { title: 'Information', icon: 'mdi-play', to: '/info' },
      { title: 'Changelog', icon: 'mdi-post', to: '/changelog' },
    ],
  }),
  methods: {
    closeWindow: function () {
      var window = remote.getCurrentWindow()
      window.close()
    },
  },
}
</script>
