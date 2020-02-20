<template>
<header class="appstore-header">
  <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5">Switch Appstore</span>
      <v-autocomplete
        v-model="select"
        :items="itemsPackage"
        :loading="isLoading"
        :search-input.sync="search"
        item-text="name"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="hidden-sm-and-down"
        item-value="API"
        placeholder="Rechercher"
        return-object
      />
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
  <v-dialog
      v-model="dialog"
      max-width="550"
    >
      <v-card>
        <v-img
          class="white--text align-end"
          height="200px"
          :src="getIcon(modalTitle)"
        >
          <v-card-title>{{ modalTitle }}</v-card-title>
        </v-img>

        <v-card-actions>
          <v-btn text v-on:click="download(modalTitle)">Télécharger</v-btn>
          <v-btn text v-on:click="openLink(modalSource)">Source</v-btn>
        </v-card-actions>

        <v-card-subtitle class="pb-0"><strong>Catégorie : </strong>{{ modalCategory }}</v-card-subtitle>
        <v-card-subtitle class="pb-0"><strong>Version : </strong>{{ modalVersion }}</v-card-subtitle>
        <v-card-subtitle class="pb-0"><strong>Mise à jour le : </strong>{{ modalUpdated }}</v-card-subtitle>
        <br />
        <v-card-text class="text--primary">
          <div class="author"><strong>Auteur : </strong>{{ modalAuthor }}</div>
          <div v-html="getFormatedDesc(modalDesc)"></div>
          <div class="changelog"><strong>Changelog : </strong></div>
          <div v-html="getFormatedDesc(modalChangelog)"></div>
        </v-card-text>
      </v-card>
    </v-dialog>
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
    } catch (err) {
      console.log(err)
    }
  },
  data: () => ({
    nameLimit: 60,
    packages: [],
    isLoading: false,
    select: null,
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
    modalTitle: "",
    modalDesc: "",
    modalCategory: "",
    modalAuthor: "",
    modalChangelog: "",
    modalVersion: "",
    modalUpdated: "",
    modalSource: "",
    dialog: false,
  }),
  computed: {
    itemsPackage() {
      return this.packages.map(entry => {
        const Name = entry.name.length > this.nameLimit
          ? entry.name.slice(0, this.nameLimit) + '...'
          : entry.name

        return Object.assign({}, entry, { Name })
      })
    }
  },
  watch: {
    select(val) {
      if (!val) {
        this.modalTitle = val.name
        this.modalDesc = val.details.replace(/\n/g, "<br />")
        this.modalCategory = val.category
        this.modalAuthor = val.author
        this.modalChangelog = val.changelog
        this.modalVersion = val.version
        this.modalUpdated = val.updated
        this.modalSource = val.url
        this.dialog = false
      }

      this.modalTitle = val.name
      this.modalDesc = val.details.replace(/\n/g, "<br />")
      this.modalCategory = val.category
      this.modalAuthor = val.author
      this.modalChangelog = val.changelog
      this.modalVersion = val.version
      this.modalUpdated = val.updated
      this.modalSource = val.url
      this.dialog = true
    },
    search (val) {

        if (this.isLoading) return

        this.isLoading = true

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
    getFormatedDesc(e) {
        return e = e.replace(/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim, '<a href="$&">$&</a>'), e = e.replace(/^\s*\\n|\\n\s*$/g, ""), e = e.replace(/\\n/g, "<br/>"), e = e.replace(/(<script|<iframe).*?(\/script>|\/iframe>)/g, "")
    },
    openLink(link) {
        remote.shell.openExternal(link);
    },
    download(name) {
      remote.shell.openExternal(`https://switchbru.com/appstore/zips/${name}.zip`);
    },
    getIcon: function(name) {
      return `https://www.switchbru.com/appstore/packages/${name}/icon.png`
    },
    closeWindow: function(event) {
      var window = remote.getCurrentWindow()
      window.close();
    }
  }
}
</script>