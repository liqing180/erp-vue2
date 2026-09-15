<template>
  <div class="pb20">
    <div v-if="formData.salesQuotationType === 'MixDesign'" key="Product111">
      <TradingProductTable2
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :comDisFrom="comDisFrom"
      />
    </div>
    <div v-else key="Product222">
      <TradingProductTable
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :comDisFrom="comDisFrom"
      />
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'

import TradingProductTable from './TradingProductTable'
import TradingProductTable2 from './TradingProductTable2'

export default {
  mixins: [pageMixin],
  components: { TradingProductTable, TradingProductTable2 },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    countryId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    currencyId: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || {}
      }
    }
  },
  data() {
    return {
      activeName: '1',
      totalForm: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
    totalDiscountChange() {}
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
