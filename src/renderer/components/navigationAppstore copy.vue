<template>
<header class="appstore-header">
  <v-app-bar
      app
      clipped-left
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5">Switch Appstore</span>
      <v-text-field
        solo-inverted
        flat
        hide-details
        label="Search"
      />
      <v-spacer />
    </v-app-bar>
    <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    dark
  >
    <v-list
      dense
      nav
    >

      <nuxt-link
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        class="v-list-item v-list-item--link theme--dark"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </nuxt-link>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <nuxt-link to="/" class="v-btn v-btn--block v-btn--contained theme--dark v-size--default grey">
          Accueil
        </nuxt-link>
      </div>
      <div class="pa-2">
        <v-btn v-on:click="closeWindow" block color="red">Fermer</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
  </header>
</template>

<script>
import { remote } from 'electron'

export default {
  methods: {
    closeWindow: function(event) {
      var window = remote.getCurrentWindow()
      window.close();
    },
  },
  data: () => ({
    drawer: null,
    items: [
      { title: 'Accueil', icon: 'mdi-home', to: '/appstore' },
      { title: 'Jeux', icon: 'mdi-play', to: '/appstore/games' },
      { title: 'Emulateurs', icon: 'mdi-gamepad-variant-outline', to: '/appstore/emulators' },
      { title: 'Outils', icon: 'mdi-tools', to: '/appstore/tools' },
      { title: 'Avancés', icon: 'mdi-puzzle-outline', to: '/appstore/advanced' },
      { title: 'Thèmes', icon: 'mdi-bookshelf', to: '/appstore/themes' },
      { title: 'Misc', icon: 'mdi-cube-outline', to: '/appstore/misc' }
    ],
    right: null
  }),
}
</script>