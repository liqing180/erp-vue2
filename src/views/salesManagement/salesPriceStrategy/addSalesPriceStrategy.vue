<template>
  <addFormPage :propRowId="rowId" :propTimeId="timeId" />
</template>

<script>
import addFormPage from './addFormPage'
export default {
  name: 'AddSalesPriceStrategy',
  components: {
    addFormPage
  },
  data() {
    return {
      timeId: undefined,
      rowId: undefined
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
