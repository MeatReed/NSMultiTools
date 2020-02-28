<template>
  <div>
    <app-header />
    <get-appstore-category category="misc" category2="_misc" category3="concept"/>
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
