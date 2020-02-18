<template>
<header class="appstore-header">
  <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5">Switch Appstore</span>
      <v-autocomplete
        v-model="model"
        :items="itemsPackage"
        :loading="isLoading"
        :search-input.sync="search"
        color="white"
        hide-no-data
        item-value="API"
        placeholder="Rechercher"
        prepend-icon="mdi-database-search"
        return-object="true"
      ></v-autocomplete>
      <v-spacer />
      <v-btn v-on:click="closeWindow" icon color="red">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
    v-model="drawer"
    app
    clipped
  >
    <v-list
      dense
      nav
    >

      <v-list-item
        v-for="item in items"
        :key="item.title"
        nuxt
        :to="item.to"
      >
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
        <v-btn nuxt to="/apps" block color="grey">
          Applications
        </v-btn>
      </div>
      <div class="pa-2">
        <v-btn v-on:click="closeWindow" block color="red">
          Fermer
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
  </header>
</template>

<script>
import { remote } from 'electron'

export default {
  async asyncData({ $axios }) {
    try {
      const data = await $axios.$get('https://www.switchbru.com/appstore/repo.json')

      return {
        allPackages: data.packages
      }
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    nameLimit: 60,
    packages: [],
    isLoading: false,
    model: null,
    search: null,
    drawer: null,
    items: [
      { title: 'Accueil', icon: 'mdi-home', to:'/appstore' },
      { title: 'Jeux', icon: 'mdi-play', to:'/appstore/games' },
      { title: 'Emulateurs', icon: 'mdi-gamepad-variant-outline', to:'/appstore/emulators' },
      { title: 'Outils', icon: 'mdi-tools', to:'/appstore/tools' },
      { title: 'Avancés', icon: 'mdi-puzzle-outline', to:'/appstore/advanced' },
      { title: 'Thèmes', icon: 'mdi-bookshelf', to:'/appstore/themes' },
      { title: 'Misc', icon: 'mdi-cube-outline', to:'/appstore/misc' }
    ],
    right: null
  }),
  computed: {
      fields() {
        if (!this.model) return []

        return Object.keys(this.model).map(key => {
          console.log(this.model)
          return {
            key,
            value: this.model[key] || 'n/a',
          }
        })
      },
      itemsPackage() {
        return this.packages.map(entry => {
          const Name = entry.name.length > this.nameLimit
            ? entry.name.slice(0, this.nameLimit) + '...'
            : entry.name

          return Object.assign({}, entry, { Name })
        })
      },
  },
  watch: {
    search (val) {

        if (this.isLoading) return

        this.isLoading = true
        fetch('https://www.switchbru.com/appstore/repo.json')
          .then(res => res.json())
          .then(res => {
            const { packages } = res
            this.packages = packages
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      }
  },
  methods: {
    closeWindow: function(event) {
      var window = remote.getCurrentWindow()
      window.close();
    }
  }
}
</script>