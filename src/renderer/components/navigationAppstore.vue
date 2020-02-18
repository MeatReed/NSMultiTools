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
        <v-btn nuxt :to="localePath('/apps')" block color="grey">
          {{ $t('appstore.applications') }}
        </v-btn>
      </div>
      <div class="pa-2">
        <v-btn v-on:click="closeWindow" block color="red">
          {{ $t('appstore.close') }}
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
  data: ({ localePath, $i18n }) => ({
    nameLimit: 60,
    packages: [],
    isLoading: false,
    model: null,
    search: null,
    drawer: null,
    items: [
      { title: $i18n.t('appstore.home'), icon: 'mdi-home', to: localePath('/appstore') },
      { title: $i18n.t('appstore.games'), icon: 'mdi-play', to: localePath('/appstore/games') },
      { title: $i18n.t('appstore.emulators'), icon: 'mdi-gamepad-variant-outline', to: localePath('/appstore/emulators') },
      { title: $i18n.t('appstore.tools'), icon: 'mdi-tools', to:  localePath('/appstore/tools')},
      { title: $i18n.t('appstore.advanced'), icon: 'mdi-puzzle-outline', to: localePath('/appstore/advanced') },
      { title: $i18n.t('appstore.themes'), icon: 'mdi-bookshelf', to: localePath('/appstore/themes') },
      { title: $i18n.t('appstore.misc'), icon: 'mdi-cube-outline', to: localePath('/appstore/misc') }
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