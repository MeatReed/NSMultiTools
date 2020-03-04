<template>
  <v-progress-circular v-if="loading" indeterminate :value="loadingVal" />
</template>

<script>
export default {
  data: () => ({
    loading: false,
    loadingVal: 0
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
    increase(num) {
      this.loadingVal = num
    }
  }
}
</script>
