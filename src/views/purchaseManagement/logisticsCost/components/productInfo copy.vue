<template>
  <div class="pb20">
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <template v-for="item in comTabs">
          <el-tab-pane :name="item.key" :key="item.key">
            <span slot="label">
              <span>{{ item.label }}</span>
              <span v-if="item.key === 'expenseItem'" class="ml5">
                <span v-if="formData.logisticsDocumentExpenses.length"
                  >({{ formData.logisticsDocumentExpenses.length }})</span
                >
              </span>
              <span v-if="item.key === 'assignedDetails'" class="ml5">
                <span v-if="comAssignedDetails.length">({{ comAssignedDetails.length }})</span>
              </span>
            </span>
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-row>
    <div v-show="activeName === 'expenseItem'">
      <ExpenseItemTable
        ref="ExpenseItemTable"
        :formData="formData"
        :countryId="countryId"
        :currencyId="currencyId"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
      />
    </div>
    <div v-show="activeName === 'assignedDetails'" key="assignedDetails">
      <TradingProductTable
        :formData="formData"
        :modifyHighlight="modifyHighlight"
        :comDisFrom="comDisFrom"
        :comAssignedDetails="comAssignedDetails"
      />
    </div>
  </div>
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
      curFileList: []
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
      const list = this.formData.logisticsDocumentExpenses || []
      const showList = []
      list.forEach((item, index) => {
        const logisticsDocumentProducts = item.logisticsDocumentProducts || []
        logisticsDocumentProducts.forEach((child, index2) => {
          child.logisticsDocumentExpenseItem = item.logisticsDocumentExpenseItem
          child.topIndex = index
          child.childIndex = index2
          showList.push({ ...child })
        })
      })

      return showList
    }
  },
  methods: {
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
