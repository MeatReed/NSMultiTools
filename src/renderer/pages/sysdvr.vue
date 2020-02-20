<template>
  <div>
    <app-header />
    <v-content>
      <div class="font-weight-bold headline text-center">
        SysDVR
      </div>
      <v-container
          class="fill-height"
          fluid
        >
        <v-row>
         <v-col class="d-flex justify-center mb-6">
            <v-radio-group row label="Canaux de diffusion:">
              <v-radio label="Vidéo" />
              <v-radio label="Audio" />
              <v-radio label="Tout" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center mb-6">
            <v-radio-group row label="Méthode du flux:">
              <v-radio label="RTSP(Recommandé)" />
              <v-radio label="mvp" />
            </v-radio-group>
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
  }
}
</script>

<style scoped>
.col {
  text-align: center;
}
</style>
