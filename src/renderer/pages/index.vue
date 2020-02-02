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
                <img id="menuIcon" class="v-image v-responsive mx-2"
                  :src="menuItem.img"
                />
              </v-slide-item>
             </v-slide-group>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn v-on:click="closeWindow" id="close-btn" class="mx-3" fab dark small color="red">
              <v-icon dark>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { remote } from 'electron'
import SystemInformation from '@/components/SystemInformation.vue'
import electron from 'electron'

export default {
  components: {
    SystemInformation
  },
  data () {
    return {
      menu: [
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        },
        {
          img: require('../assets/default.jpg'),
          to: { name: '/' }
        }
      ]
    }
  },
  methods: {
    openURL (url) {
      remote.shell.openExternal(url)
    },
    closeWindow: function (event) {
      var window = electron.remote.getCurrentWindow()
      window.close();
    }
  }
}
</script>

<style scoped>
.v-slide-group {
  background: #2D2D2D;
}

.container {
  padding-right: 100px !important;
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
