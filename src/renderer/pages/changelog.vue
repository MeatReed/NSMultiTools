<template>
  <div>
    <app-header />
    <v-content>
      <v-container fluid v-if="$fetchState.pending">
        <v-row v-if="$fetchState.pending">
          <v-col class="text-center">
            <v-progress-circular
              :size="70"
              :width="7"
              indeterminate
              color="primary"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else fluid class="fill-witdh">
        <v-row v-for="(item, index) of gitRelease" :key="index">
          <v-col>
            <v-card class="mx-auto" outlined>
              <v-card-title>
                <v-badge
                  :color="item.prerelease ? 'orange' : 'green'"
                  :content="item.prerelease ? 'Pre-release' : 'Release'"
                  inline
                >
                  {{ item.name }}
                </v-badge>
              </v-card-title>
              <v-card-subtitle>
                Créer le {{ formatDate(item.created_at) }}
              </v-card-subtitle>
              <v-card-text>
                <div v-html="$md.render(item.body)" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import axios from 'axios'
import appHeader from '@/components/navigationHome'

export default {
  components: {
    appHeader,
  },
  data: () => ({
    gitRelease: null,
  }),
  async fetch() {
    const releaseResponse = await axios.get('https://api.github.com/repos/MeatReed/NSMultiTools/releases')
    this.gitRelease = releaseResponse.data
  },
  methods: {
    formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [day, month, year].join('/')
    },
  },
}
</script>

<style>
img {
  z-index: 0;
  position: relative;
  overflow: hidden;
  flex: 1 0 auto;
  max-width: 100%;
  display: flex;
}
</style>
