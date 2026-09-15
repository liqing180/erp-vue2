<template>
  <div class="pb20">
    <div>
      <TradingProductTable
        ref="TradingProductTable"
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
        :currencyId="currencyId"
        :comDisFrom="comDisFrom"
        @updateProductList="$emit('updateProductList', $event)"
        :comIsDropShippingSO="comIsDropShippingSO"
      />
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'

import TradingProductTable from './TradingProductTable'

export default {
  mixins: [pageMixin],
  components: { TradingProductTable },
  props: {
    /* 是否是直运的SO */
    comIsDropShippingSO: {
      type: Boolean,
      default: false
    },
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
    totalDiscountChange() {},
    errorMessage(code) {
      this.$emit('scrollPageToTable')
      this.$refs.TradingProductTable && this.$refs.TradingProductTable.errorMessage(code)
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
