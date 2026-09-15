<template>
  <addFromPage :propTimeId="timeId" />
</template>

<script>
import addFromPage from './addFromPage'

export default {
  name: 'AddSupplierContract',
  components: {
    addFromPage
  },
  data() {
    return {
      timeId: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
  },
  activated() {
    this.timeId = this.$route.query.timeId
  },
  methods: {}
}
</script>
<style lang="scss"></style>
