<template>
  <v-app id="inspire">
    <app-header />
    <v-content>
      <v-container
          class="fill-height"
          fluid
        >
        <v-row
          align="center"
          justify="center"
        >
           <v-col class="justify-center">
            <h1 v-if="error.statusCode === 404">Page non trouvée</h1>
            <h1 v-else>Une erreur s'est produite</h1>
            <br />
            <v-btn nuxt to="/">Accueil</v-btn>
           </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-footer
      app
    >
      <span>Make by MeatReed</span>
      <v-spacer />
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import appHeader from '@/components/navigationHome'

export default {
  name: 'NuxtError',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  components: {
    appHeader
  },
  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },
    message () {
      return this.error.message || '<%= messages.client_error %>'
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
    display: none;
}

body {
  font-family: Helvetica, sans-serif;
}

p {
  color: #FFFFFF;
}

.author {
  color: #FFFFFF;
}

.changelog {
  color: #FFFFFF;
}
</style>