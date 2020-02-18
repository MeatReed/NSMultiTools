<template>
  <div>
    <app-header />
    <v-content>
      <v-container fluid class="fill-witdh">
        <v-row>
          <v-col>
            <v-hover
              v-slot:default="{ hover }"
              open-delay="200"
            >
              <v-card
                class="mx-auto"
                :elevation="hover ? 16 : 2"
                outlined
              >
                <v-card-title>
                  News test 1
                </v-card-title>
                <v-card-subtitle>
                  Fait par MeatReed
                </v-card-subtitle>
                <v-img
                  height="300"
                  color="grey"
                  src="https://images8.alphacoders.com/102/1026968.jpg"
                />
              </v-card>
            </v-hover>
          </v-col>
          <v-col>
            <v-hover
              v-slot:default="{ hover }"
              open-delay="200"
            >
              <v-card
                class="mx-auto"
                :elevation="hover ? 16 : 2"
                outlined
              >
                <v-card-title>
                  News test 2
                </v-card-title>
                <v-card-subtitle>
                  Fait par MeatReed
                </v-card-subtitle>
                <v-img
                  height="300"
                  color="grey"
                  src="https://images8.alphacoders.com/102/1026968.jpg"
                />
              </v-card>
            </v-hover>
          </v-col>
          <v-col>
            <v-hover
              v-slot:default="{ hover }"
              open-delay="200"
            >
              <v-card
                class="mx-auto"
                :elevation="hover ? 16 : 2"
                outlined
              >
                <v-card-title>
                  News test 3
                </v-card-title>
                <v-card-subtitle>
                  Fait par MeatReed
                </v-card-subtitle>
                <v-img
                  height="300"
                  color="grey"
                  src="https://images8.alphacoders.com/102/1026968.jpg"
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
import path from 'path'
import db from 'electron-db'

export default {
  components: {
    appHeader
  },
  beforeCreate() {
    db.getField('config', 'dark', (succ, data) => {
      this.$vuetify.theme.dark = data[0]
    })
  }
}
</script>