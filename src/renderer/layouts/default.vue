<template>
  <v-app id="inspire">
    <v-content>
      <nuxt />
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