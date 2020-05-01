<template>
  <div>
    <app-header />
    <get-appstore-category category="tool" />
  </div>
</template>

<script>
import appHeader from '@/components/navigationAppstore'
import getAppstoreCategory from '@/components/getAppstoreCategory'

export default {
  components: {
    appHeader,
    getAppstoreCategory,
  },
}
</script>
