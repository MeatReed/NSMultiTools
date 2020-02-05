<template>
  <v-container
      class="fill-height"
      fluid
    >
    <v-row
      id="menuIcons"
      align="center"
      justify="start"
    >
      <v-col>
        <v-row>
          <v-col>
            <v-sheet
              class="mx-auto"
            >
             <v-slide-group multiple show-arrows>
              <v-slide-item
                v-for="(menuItem, key) of menu"
                :key="key"
              >
                <nuxt-link v-if="menuItem.to.name" :to="menuItem.to.name">
                  <v-img id="menuIcon" class="v-image v-responsive mx-2"
                    :src="menuItem.img"
                  />
                </nuxt-link>
                <v-img v-else id="menuIcon" class="v-image v-responsive mx-2"
                  :src="menuItem.img"
                />
              </v-slide-item>
             </v-slide-group>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn v-on:click="closeWindow" v-on="on" id="close-btn" class="mx-3" fab dark small color="red">
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
            <nuxt-link to="/info" class="mx-3 v-btn v-btn--contained v-btn--fab v-btn--round theme--dark v-size--small grey">
              <v-icon dark>mdi-information-outline</v-icon>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { remote } from 'electron'


export default {
  data: () => ({
    menu: [
      {
        name: "Switch Appstore",
        img: require('../assets/appstorenx.png'),
        to: { name: '/appstore' }
      },
      {
        name: "Inject Payload",
        img: require('../assets/smashFistIcon.png'),
        to: { name: '/inject' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '/' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '' }
      },
      {
        img: require('../assets/default.jpg'),
        to: { name: '' }
      }
    ]
  }),
  methods: {
    openURL (url) {
      remote.shell.openExternal(url)
    },
    closeWindow: function (event) {
      var window = remote.getCurrentWindow()
      window.close();
    }
  }
}
</script>

<style scoped>
.v-slide-group {
  background: #2D2D2D;
}

#menuIcons {
  padding-left: 20px;
}

#menuIcon {
  height: 250px;
  width: 250px;
}

.align-center {
    align-items: center !important;
}

.justify-start {
    justify-content: flex-start !important;
}

.col {
  text-align: center;
}
</style>
