<template>
  <div>
    <app-header />
    <v-content>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-app-bar
              dense
            >
              <v-toolbar-title>Catégorie Jeux</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn nuxt to="/appstore/games">
                Voir plus
              </v-btn>
            </v-app-bar>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(item, index) of gamePackages" :key="index">
            <v-card
              class="mx-auto"
              max-width="344"
              outlined
            >
              <v-img
                class="white--text align-end"
                height="200px"
                :src="getIcon(item.name)"
                @error="imgUrlAlt"
              />
              <v-card-title>
                {{ item.name }}
              </v-card-title>

              <v-card-actions>
                <v-btn text v-on:click="download(item.name)">Télécharger</v-btn>
                <v-btn
                  text
                  v-on:click="modalPackage(allPackages ,item.name)"
                >
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
            <v-app-bar
              dense
            >
              <v-toolbar-title>Catégorie Outils</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn nuxt to="/appstore/tools">
                Voir plus
              </v-btn>
            </v-app-bar>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(item, index) of toolPackages" :key="index">
            <v-card
              class="mx-auto"
              max-width="344"
              outlined
            >
              <v-img
                class="white--text align-end"
                height="200px"
                :src="getIcon(item.name)"
                @error="imgUrlAlt"
              />
              <v-card-title>
                {{ item.name }}
              </v-card-title>

              <v-card-actions>
                <v-btn text v-on:click="download(item.name)">Télécharger</v-btn>
                <v-btn
                  text
                  v-on:click="modalPackage(allPackages ,item.name)"
                >
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
            <v-app-bar
              dense
            >
              <v-toolbar-title>Catégorie Avancés</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn nuxt to="/appstore/advances">
                Voir plus
              </v-btn>
            </v-app-bar>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(item, index) of advancedPackages" :key="index">
            <v-card
              class="mx-auto"
              max-width="344"
              outlined
            >
              <v-img
                class="white--text align-end"
                height="200px"
                :src="getIcon(item.name)"
                @error="imgUrlAlt"
              />
              <v-card-title>
                {{ item.name }}
              </v-card-title>

              <v-card-actions>
                <v-btn text v-on:click="download(item.name)">Télécharger</v-btn>
                <v-btn
                  text
                  v-on:click="modalPackage(allPackages ,item.name)"
                >
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
        <v-card-text>
          <div class="author"><strong>Auteur : </strong>{{ modalAuthor }}</div>
          <div v-html="getFormatedDesc(modalDesc)"></div>
          <div class="changelog"><strong>Changelog : </strong></div>
          <div v-html="getFormatedDesc(modalChangelog)"></div>
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
    appHeader
  },
  async asyncData({ $axios }) {
    try {
      const data = await $axios.$get('https://www.switchbru.com/appstore/repo.json')

      //Games
      const gamePackages = new Array;
      let gameIndex = 0;
      await data.packages.forEach((element, index) => {
        if(element.category === "game") {
          gameIndex = gameIndex + 1
          if (gameIndex > 8) {
            return;
          }
          gamePackages.push(element)
        }
      });

      //Tools
      const toolPackages = new Array;
      let toolIndex = 0;
      await data.packages.forEach((element, index) => {
        if(element.category === "tool") {
          toolIndex = toolIndex + 1
          if (toolIndex > 8) {
            return;
          }
          toolPackages.push(element)
        }
      });

      //Advanced
      const advancedPackages = new Array;
      let advancedIndex = 0;
      await data.packages.forEach((element, index) => {
        if(element.category === "advanced") {
          advancedIndex = advancedIndex + 1
          if (advancedIndex > 8) {
            return;
          }
          advancedPackages.push(element)
        }
      });

      return {
        allPackages: data.packages,
        gamePackages: gamePackages,
        toolPackages: toolPackages,
        advancedPackages: advancedPackages
      }
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    getFormatedDesc(e) {
        return e = e.replace(/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim, '<a href="$&">$&</a>'), e = e.replace(/^\s*\\n|\\n\s*$/g, ""), e = e.replace(/\\t/g, "&#9;"), e = e.replace(/\\n/g, "<br/>"), e = e.replace(/(<script|<iframe).*?(\/script>|\/iframe>)/g, "")
    },
    openLink(link) {
        remote.shell.openExternal(link);
    },
    modalPackage(packages, name) {
      const select = packages.find(pkg => pkg.name === name)
      this.modalTitle = select.name
      this.modalDesc = select.details.replace(/\n/g, "<br />")
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
        defaultPath: `${name}.zip`
      });
      var urlParse = path.parse(installPath);
      this.snackbarColor = "success"
      this.snackbarMessage = `Installation en cours de ${name}.zip`
      this.snackbarTimeout = 0
      this.snackbar = true
      downloadUrl(`https://switchbru.com/appstore/zips/${name}.zip`, urlParse.dir)
      .on('close', function () {
        self.snackbar = false
        self.snackbarColor = "success"
        self.snackbarMessage = `${name}.zip a été installé avec succès !`
        self.snackbarTimeout = 6000
        setTimeout(function(){
          self.snackbar = true
        }, 1000);
      });
    },
    getIcon: function(name) {
      return `https://www.switchbru.com/appstore/packages/${name}/icon.png`
    },
    imgUrlAlt(event) {
      event = "data:image/png;base64,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"
    }
  },
  data: () => ({
    modalTitle: "",
    modalDesc: "",
    modalCategory: "",
    modalAuthor: "",
    modalChangelog: "",
    modalVersion: "",
    modalUpdated: "",
    modalSource: "",
    dialog: false,
    categories: [
			{
        id: "games",
        name: "Jeux",
				json_id: "game",
				icon: "fa-play"
			},
			{
        id: "emulators",
        name: "Emulateurs",
				json_id: "emu",
				icon: "fa-gamepad"
			},
			{
        id: "tools",
        name: "Outils",
				json_id: "tool",
				icon: "fa-cog"
			},
			{
				id: "Advanced",
        name: "Avancés",
				json_id: "advanced",
				icon: "fa-puzzle-piece"
			},
			{
				id: "themes",
        name: "Thèmes",
				json_id: "theme",
				icon: "fa-swatchbook"
			},
			{
				id: "misc",
        name: "Mics",
				json_id: "_misc",
				icon: "fa-cubes"
			}
    ],
    snackbar: false,
    snackbarColor: "",
    snackbarMessage: "",
    snackbarTimeout: 6000
  })
}
</script>