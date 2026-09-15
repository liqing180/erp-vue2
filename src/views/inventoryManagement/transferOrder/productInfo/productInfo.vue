<template>
  <div>
    <div>
      <SalesOrderProductTable
        :formData="formData"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        v-if="formData.salesOrderTransferOrderType === '1'"
      />
      <PickupProductTable
        :formData="formData"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        v-else-if="formData.salesOrderTransferOrderType === '2'"
      />
      <TradingProductTable
        v-else
        :formData="formData"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
      />
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import SalesOrderProductTable from './SalesOrderProductTable'
import PickupProductTable from './PickupProductTable'
import TradingProductTable from './TradingProductTable'

export default {
  mixins: [pageMixin],
  components: {
    SalesOrderProductTable,
    PickupProductTable,
    TradingProductTable
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    comDisFrom: {
      type: Boolean,
      default: false
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateProps: {
      type: Array,
      default() {
        return []
      }
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    }
  }
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
