<template>
  <div>
    <app-header />
    <v-content>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-app-bar dense>
              <v-toolbar-title>Catégorie Jeux</v-toolbar-title>
              <v-spacer />
              <v-btn nuxt to="/appstore/games">
                Voir plus
              </v-btn>
            </v-app-bar>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(item, index) of gamePackages" :key="index">
            <v-card class="mx-auto" max-width="344" outlined>
              <v-img
                class="white--text align-end"
                height="200px"
                :src="getIcon(item.name)"
              />
              <v-card-title>
                {{ item.name }}
              </v-card-title>

              <v-card-actions>
                <v-btn text @click="download(item.name)">
                  Télécharger
                </v-btn>
                <v-btn text @click="modalPackage(allPackages, item.name)">
                  Information
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-app-bar dense>
              <v-toolbar-title>Catégorie Outils</v-toolbar-title>
              <v-spacer />
              <v-btn nuxt to="/appstore/tools">
                Voir plus
              </v-btn>
            </v-app-bar>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(item, index) of toolPackages" :key="index">
            <v-card class="mx-auto" max-width="344" outlined>
              <v-img
                class="white--text align-end"
                height="200px"
                :src="getIcon(item.name)"
              />
              <v-card-title>
                {{ item.name }}
              </v-card-title>

              <v-card-actions>
                <v-btn text @click="download(item.name)">
                  Télécharger
                </v-btn>
                <v-btn text @click="modalPackage(allPackages, item.name)">
                  Information
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-app-bar dense>
              <v-toolbar-title>Catégorie Avancés</v-toolbar-title>
              <v-spacer />
              <v-btn nuxt to="/appstore/advances">
                Voir plus
              </v-btn>
            </v-app-bar>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(item, index) of advancedPackages" :key="index">
            <v-card class="mx-auto" max-width="344" outlined>
              <v-img
                class="white--text align-end"
                height="200px"
                :src="getIcon(item.name)"
              />
              <v-card-title>
                {{ item.name }}
              </v-card-title>

              <v-card-actions>
                <v-btn text @click="download(item.name)">
                  Télécharger
                </v-btn>
                <v-btn text @click="modalPackage(allPackages, item.name)">
                  Information
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="snackbarTimeout"
      top
      right
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="550">
      <v-card>
        <v-img
          class="white--text align-end"
          height="200px"
          :src="getIcon(modalTitle)"
        >
          <v-card-title>{{ modalTitle }}</v-card-title>
        </v-img>

        <v-card-actions>
          <v-btn text @click="download(modalTitle)">
            Télécharger
          </v-btn>
          <v-btn text @click="openLink(modalSource)">
            Source
          </v-btn>
        </v-card-actions>

        <v-card-subtitle class="pb-0">
          <strong>Catégorie : </strong>{{ modalCategory }}
        </v-card-subtitle>
        <v-card-subtitle class="pb-0">
          <strong>Version : </strong>{{ modalVersion }}
        </v-card-subtitle>
        <v-card-subtitle class="pb-0">
          <strong>Mise à jour le : </strong>{{ modalUpdated }}
        </v-card-subtitle>

        <br />
        <v-card-text>
          <div class="author"><strong>Auteur : </strong>{{ modalAuthor }}</div>
          <div v-html="getFormatedDesc(modalDesc)" />
          <div class="changelog">
            <strong>Changelog : </strong>
          </div>
          <div v-html="getFormatedDesc(modalChangelog)" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { remote } from 'electron'
import appHeader from '@/components/navigationAppstore'
import downloadUrl from 'url-download'
import path from 'path'

export default {
  components: {
    appHeader,
  },
  async asyncData({ $axios }) {
    try {
      const data = await $axios.$get(
        'https://www.switchbru.com/appstore/repo.json'
      )

      //Games
      const gamePackages = new Array()
      let gameIndex = 0
      await data.packages.forEach((element) => {
        if (element.category === 'game') {
          gameIndex = gameIndex + 1
          if (gameIndex > 8) {
            return
          }
          gamePackages.push(element)
        }
      })

      //Tools
      const toolPackages = new Array()
      let toolIndex = 0
      await data.packages.forEach((element) => {
        if (element.category === 'tool') {
          toolIndex = toolIndex + 1
          if (toolIndex > 8) {
            return
          }
          toolPackages.push(element)
        }
      })

      //Advanced
      const advancedPackages = new Array()
      let advancedIndex = 0
      await data.packages.forEach((element) => {
        if (element.category === 'advanced') {
          advancedIndex = advancedIndex + 1
          if (advancedIndex > 8) {
            return
          }
          advancedPackages.push(element)
        }
      })

      return {
        allPackages: data.packages,
        gamePackages: gamePackages,
        toolPackages: toolPackages,
        advancedPackages: advancedPackages,
      }
    } catch (err) {
      console.log(err)
    }
  },
  data: () => ({
    modalTitle: '',
    modalDesc: '',
    modalCategory: '',
    modalAuthor: '',
    modalChangelog: '',
    modalVersion: '',
    modalUpdated: '',
    modalSource: '',
    dialog: false,
    categories: [
      {
        id: 'games',
        name: 'Jeux',
        json_id: 'game',
        icon: 'fa-play',
      },
      {
        id: 'emulators',
        name: 'Emulateurs',
        json_id: 'emu',
        icon: 'fa-gamepad',
      },
      {
        id: 'tools',
        name: 'Outils',
        json_id: 'tool',
        icon: 'fa-cog',
      },
      {
        id: 'Advanced',
        name: 'Avancés',
        json_id: 'advanced',
        icon: 'fa-puzzle-piece',
      },
      {
        id: 'themes',
        name: 'Thèmes',
        json_id: 'theme',
        icon: 'fa-swatchbook',
      },
      {
        id: 'misc',
        name: 'Mics',
        json_id: '_misc',
        icon: 'fa-cubes',
      },
    ],
    snackbar: false,
    snackbarColor: '',
    snackbarMessage: '',
    snackbarTimeout: 6000,
  }),
  methods: {
    getFormatedDesc(e) {
      return (
        (e = e.replace(
          /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
          '<a href="$&">$&</a>'
        )),
        (e = e.replace(/^\s*\\n|\\n\s*$/g, '')),
        (e = e.replace(/\\t/g, '&#9;')),
        (e = e.replace(/\\n/g, '<br/>')),
        (e = e.replace(/(<script|<iframe).*?(\/script>|\/iframe>)/g, ''))
      )
    },
    openLink(link) {
      remote.shell.openExternal(link)
    },
    modalPackage(packages, name) {
      const select = packages.find((pkg) => pkg.name === name)
      this.modalTitle = select.name
      this.modalDesc = select.details.replace(/\n/g, '<br />')
      this.modalCategory = select.category
      this.modalAuthor = select.author
      this.modalChangelog = select.changelog
      this.modalVersion = select.version
      this.modalUpdated = select.updated
      this.modalSource = select.url
      this.dialog = true
    },
    async download(name) {
      let self = this
      var installPath = await remote.dialog.showSaveDialogSync({
        title: `Installation ${name}.zip`,
        defaultPath: `${name}.zip`,
      })
      var urlParse = path.parse(installPath)
      this.snackbarColor = 'success'
      this.snackbarMessage = `Installation en cours de ${name}.zip`
      this.snackbarTimeout = 0
      this.snackbar = true
      downloadUrl(
        `https://switchbru.com/appstore/zips/${name}.zip`,
        urlParse.dir
      ).on('close', function () {
        self.snackbar = false
        self.snackbarColor = 'success'
        self.snackbarMessage = `${name}.zip a été installé avec succès !`
        self.snackbarTimeout = 6000
        setTimeout(function () {
          self.snackbar = true
        }, 1000)
      })
    },
    getIcon: function (name) {
      return `https://www.switchbru.com/appstore/packages/${name}/icon.png`
    },
  },
}
</script>
