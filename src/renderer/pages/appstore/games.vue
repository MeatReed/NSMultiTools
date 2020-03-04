<template>
  <div>
    <app-header />
    <get-appstore-category category="game" />
  </div>
</template>

<script>
import appHeader from '@/components/navigationAppstore'
import getAppstoreCategory from '@/components/getAppstoreCategory'

export default {
  components: {
    appHeader,
    getAppstoreCategory
  }
}
</script>
