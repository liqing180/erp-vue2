<template>
  <formPage :propTimeId="timeId" />
</template>

<script>
import formPage from './formPage'
export default {
  name: 'AddSafetyStock',
  components: {
    formPage
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
  }
}
</script>
