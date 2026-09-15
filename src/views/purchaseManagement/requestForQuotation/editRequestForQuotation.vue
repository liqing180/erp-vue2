<template>
  <div>
    <editFromPage
      ref="FromPage"
      :propTimeId="timeId"
      :propRowId="rowId"
      :rfqDetailId="rfqDetailId"
      :dataType="dataType"
      :isView="true"
    />
  </div>
</template>

<script>
import editFromPage from './editFromPage'

export default {
  name: 'EditRequestForQuotation',
  components: {
    editFromPage
  },
  props: {
    dataType: {
      type: [String, Number],
      default: '1' // todo:1, history:2, 管理员todo: 3
    }
  },
  data() {
    return {
      timeId: undefined,
      rowId: undefined,
      rfqDetailId: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.rfqDetailId = this.$route.query.rfqDetailId
  },
  activated() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.rfqDetailId = this.$route.query.rfqDetailId
  },
  methods: {}
}
</script>
<style lang="scss"></style>
