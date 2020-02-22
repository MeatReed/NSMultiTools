<template>
  <v-progress-circular
    indeterminate
    :value="loadingVal"
    v-if="loading"
  ></v-progress-circular>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    loadingVal: 0
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    },
    increase (num) {
      this.loadingVal = num
    }
  }
}
</script>