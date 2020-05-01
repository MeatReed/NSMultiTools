<template>
  <div>
    <app-header />
    <v-content>
      <v-container fluid class="fill-witdh">
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
  created() {
    try {
      axios
        .get('https://api.github.com/repos/MeatReed/NSMultiTools/releases')
        .then(async (response) => {
          this.gitRelease = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (err) {
      console.log(err)
    }
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
