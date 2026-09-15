<template>
  <div>
    <TradingProductTable :formData="formData" :comDisFrom="comDisFrom" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import TradingProductTable from './TradingProductTable'

export default {
  mixins: [pageMixin],
  components: {
    TradingProductTable
  },
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
