<template>
  <formPage :propTimeId="timeId" :propRuleType="ruleType" />
</template>

<script>
import formPage from './formPage'
export default {
  name: 'AddCodeRule',
  components: {
    formPage
  },
  data() {
    return {
      timeId: undefined,
      ruleType: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.ruleType = this.$route.query.ruleType
  },
  activated() {
    this.timeId = this.$route.query.timeId
    this.ruleType = this.$route.query.ruleType
  }
}
</script>
