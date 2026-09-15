<template>
  <div class="pb20">
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <template v-for="item in comTabs">
          <el-tab-pane :name="item.key" :key="item.key">
            <span slot="label">
              <span>{{ item.label }}</span>
              <span v-if="item.key === 'expenseItem'" class="ml5">
                <span v-if="formData.logisticsExpenseList.length"
                  >({{ formData.logisticsExpenseList.length }})</span
                >
              </span>
              <span v-if="item.key === 'assignedDetails'" class="ml5">
                <span v-if="comAssignedDetails.length">({{ comAssignedDetails.length }})</span>
              </span>
            </span>
          </el-tab-pane>
        </template>

        <el-tab-pane name="attachment">
          <span slot="label">
            <span>{{ $t('PURCHASE.attachmentInfo') }}</span>
            <span v-show="curFileList.length" class="ml5">({{ curFileList.length }})</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <div v-show="activeName === 'expenseItem'">
      <ExpenseItemTable
        :formData="formData"
        :countryId="countryId"
        :businessPartnerId="businessPartnerId"
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
    <div v-show="activeName === 'attachment'" :class="[isModified('attachment')]">
      <myUpload
        ref="uploadRef"
        :disabled="comDisFrom"
        :updateFileList="updateFileList"
        :fomType="'Sales Inquiry'"
        :limit="9"
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
    initCommonFileList: {
      type: Array,
      default() {
        return []
      }
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
    },
    initCommonFileList: {
      immediate: true,
      handler: function () {
        this.initFileList(this.initCommonFileList)
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
          label: this.$t('PURCHASE.productDetail'),
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
      const list = this.formData.logisticsExpenseList || []
      const showList = []
      list.forEach((item, index) => {
        const logisticsExpenseDetailList = item.logisticsExpenseDetailList || []
        logisticsExpenseDetailList.forEach((child, index2) => {
          child.expenseItemName = item.expenseItemName
          child.topIndex = index
          child.childIndex = index2
          showList.push(child)
        })
      })
      return showList
    }
  },
  methods: {
    initFileList(FileList) {
      const maxAttempts = 10 // 最大尝试次数
      const interval = 200 // 每次尝试的间隔时间（毫秒）
      let attempts = 0
      const retry = () => {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(() => {
            if (this.$refs.uploadRef) {
              this.$refs.uploadRef.initFileList(FileList)
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
    getFileIds() {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return false
      }
      return myFileIds
    },
    updateFileList(list) {
      this.curFileList = list
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
