<template>
  <div>
    <app-header />
    <v-content>
      <v-container
          class="fill-height"
          fluid
        >
        <v-row
          align="center"
          justify="start"
        >
          <v-col>
            <p class="font-weight-black display-4 text-center">
              En développement..
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { remote } from 'electron'
import usb from 'usb'
import { exec, spawn } from 'child_process'
import appHeader from '@/components/navigationHome'

export default {
  components: {
    appHeader
  },
  data: () => ({

  }),
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped>
.col {
  text-align: center;
}
</style>
