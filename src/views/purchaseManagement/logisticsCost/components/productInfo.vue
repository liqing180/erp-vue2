<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="1">
      <FormCollapseItemTitle
        slot="title"
        :title="$t('PURCHASE.productInfo')"
        :warning="collapseWarningForProductInfo"
      >
        <!-- <span class="info-item mr20">
          {{ $t('PURCHASE.shippingAgent') }} : {{ formData.shippingAgentName }}
        </span>
        <span class="info-item mr20"> {{ $t('ui.currency') }} : {{ formData.currency }} </span> -->
      </FormCollapseItemTitle>
      <TradingProductTable
        :formData="formData"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        :comAssignedDetails="comAssignedDetails"
        @handleRowAssign="handleRowAssign"
      />
    </el-collapse-item>
    <div class="form-card collapse-item-content-pt0" style="border-top: 10px solid #e8edf0">
      <el-collapse-item name="2">
        <FormCollapseItemTitle
          slot="title"
          :title="$t('PURCHASE.ShippingAgentFeeDetails')"
          :warning="collapseWarningForShippingAgentFeeDetails"
        >
        </FormCollapseItemTitle>

        <ExpenseItemTable
          ref="ExpenseItemTable"
          :formData="formData"
          :countryId="countryId"
          :currencyId="currencyId"
          :modifyHighlight="modifyHighlight"
          :comDisFrom="comDisFrom"
          :currencyOptions="currencyOptions"
          @calculateExpenseItem="calculateTableList"
        />
      </el-collapse-item>
    </div>
  </el-collapse>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import TradingProductTable from './TradingProductTable'
import ExpenseItemTable from './ExpenseItemTable'

export default {
  mixins: [pageMixin],
  components: {
    ExpenseItemTable,
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
    countryId: {
      type: String,
      default: ''
    },
    shippingAgentId: {
      type: String,
      default: ''
    },
    currencyId: {
      type: String,
      default: ''
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
    },
    inQuotation() {
      return this.formData.salesInquiryStatus === '4'
    },
    currencyOptions: {
      type: Array,
      default() {
        return []
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
      activeName: 'expenseItem',
      totalForm: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      activeNames: ['1', '2'],
      collapseWarningForProductInfo: false,
      collapseWarningForShippingAgentFeeDetails: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comTabs() {
      const list = [
        {
          label: this.$t('PURCHASE.detailsOfExpenses'),
          key: 'expenseItem'
        },
        {
          label: this.$t('PURCHASE.assignedDetails'),
          key: 'assignedDetails'
        }
      ]
      return list.filter((item) => item)
    },
    comAssignedDetails() {
      // const list = this.formData.logisticsDocumentExpenses || []
      // let showList = []

      // const list = this.formData.logisticsDocumentProductList || []
      // if (this.formData.logisticsDocumentId) {
      //   showList = this.formData.logisticsDocumentProductList || []
      // } else {
      //   list.forEach((item, index) => {
      //     const logisticsDocumentProducts = item.logisticsDocumentProducts || []
      //     logisticsDocumentProducts.forEach((child, index2) => {
      //       child.logisticsDocumentExpenseItem = item.logisticsDocumentExpenseItem
      //       child.topIndex = index
      //       child.childIndex = index2
      //       showList.push({ ...child })
      //     })
      //   })
      // }

      // return showList
      return this.formData.logisticsDocumentProductList || []
    }
  },
  methods: {
    handleRowAssign() {
      this.$refs.ExpenseItemTable && this.$refs.ExpenseItemTable.handleRowAssign()
    },
    errorMessage(code) {
      this.$emit('scrollPageToTable')
      this.$refs.ExpenseItemTable && this.$refs.ExpenseItemTable.errorMessage(code)
    },
    initTableFileList() {
      const maxAttempts = 20 // 最大尝试次数
      const interval = 200 // 每次尝试的间隔时间（毫秒）
      let attempts = 0
      const retry = () => {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(() => {
            if (this.$refs.ExpenseItemTable) {
              this.$refs.ExpenseItemTable.initTableFileList()
            } else {
              retry()
            }
          }, interval)
        } else {
          console.log('无法获取组件')
        }
      }
      retry()
    },
    calculateTableList() {
      const list = this.formData.logisticsDocumentExpenses || []
      if (list.length <= 0) return
      this.$refs.ExpenseItemTable.calculateOneDetail(list)
    },
    handleTabClick() {},

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
