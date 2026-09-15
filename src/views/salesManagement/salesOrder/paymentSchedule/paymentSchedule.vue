<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('SALES.paymentPlan')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div class="plan-dlg">
      <!-- 图表 -->
      <el-row>
        <el-col :span="6" class="per-card">
          <div class="shadow-card flex">
            <div class="progress mr20">
              <el-progress
                type="circle"
                :percentage="form.planBaseAmount && form.planBaseAmount > 0 ? 100 : 0"
                :stroke-width="8"
                color="#1F84FD"
                :show-text="false"
                :width="100"
              />
              <div class="inside flexCCen">
                <div class="inside-icon inside-icon-0">
                  <svg-icon icon-class="pay-1" class="primary-pointer" style="font-size: 20px" />
                </div>
                <div style="font-weight: 700">
                  {{ form.planBaseAmount && form.planBaseAmount > 0 ? '100%' : '-' }}
                </div>
              </div>
            </div>
            <div class="mt10">
              <div style="color: #909399">{{ $t('SALES.SOTotalAmount') }}</div>
              <div class="mt5" style="font-size: 15px; font-weight: 700">
                {{ form.currencySymbol }} {{ $numberStr(form.planBaseAmount, 2) }}
              </div>
              <div class="mt5" v-if="form.acrossPiCount && form.acrossPiCount > 0">
                {{ $t('SALES.acrossPI').replace('$1', $numberStr(form.acrossPiCount, 0)) }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="per-card">
          <div class="shadow-card flex">
            <div class="progress mr20">
              <el-progress
                type="circle"
                :percentage="issuedPIAmountPer ? issuedPIAmountPer : 0"
                :stroke-width="8"
                color="#1F84FD"
                :show-text="false"
                :width="100"
              />
              <div class="inside flexCCen">
                <div class="inside-icon inside-icon-1">
                  <svg-icon icon-class="money-1" class="primary-pointer" style="font-size: 20px" />
                </div>
                <div style="font-weight: 700">
                  {{ issuedPIAmountPer ? issuedPIAmountPer + '%' : '-' }}
                </div>
              </div>
            </div>
            <div class="mt10">
              <div style="color: #909399">{{ $t('SALES.issuedPIAmount') }}</div>
              <div class="mt5" style="font-size: 15px; font-weight: 700">
                {{ form.currencySymbol }} {{ $numberStr(form.issuedAmount, 2) }}
              </div>
              <div class="mt5" v-if="form.acrossPiCount && form.acrossPiCount > 0">
                {{ $t('SALES.acrossPI').replace('$1', $numberStr(form.acrossPiCount, 0)) }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="per-card">
          <div class="shadow-card flex">
            <div class="progress mr20">
              <el-progress
                type="circle"
                :percentage="$resultOfBoolean(issuedPIAmountPer) ? 100 - issuedPIAmountPer : 0"
                :stroke-width="8"
                color="#28B463"
                :show-text="false"
                :width="100"
              />
              <div class="inside flexCCen">
                <div class="inside-icon inside-icon-2">
                  <i class="el-icon-bank-card pointer" style="font-size: 20px; color: #28b463"></i>
                </div>
                <div style="font-weight: 700">
                  {{ $resultOfBoolean(issuedPIAmountPer) ? 100 - issuedPIAmountPer + '%' : '-' }}
                </div>
              </div>
            </div>
            <div class="mt10">
              <div style="color: #909399">{{ $t('SALES.remainingPIAmount') }}</div>
              <div class="mt5" style="font-size: 15px; font-weight: 700">
                {{ form.currencySymbol }} {{ $numberStr(form.remainingAmount, 2) }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="per-card">
          <div class="shadow-card flex">
            <div class="progress mr20">
              <el-progress
                type="circle"
                :percentage="form.piCount ? 100 : 0"
                :stroke-width="8"
                color="#C6B4FB"
                :show-text="false"
                :width="100"
              />
              <div class="inside flexCCen">
                <div class="inside-icon inside-icon-3">
                  <i class="el-icon-document pointer" style="color: #c6b4fb; font-size: 20px"></i>
                </div>
                <div style="font-weight: 700">
                  {{ $numberStr(form.piCount, 0) }}
                </div>
              </div>
            </div>
            <div class="mt10">
              <div style="color: #909399">{{ $t('SALES.noOfPIs') }}</div>
              <div class="mt5" style="font-size: 15px; font-weight: 700">
                {{ $numberStr(form.piCount, 0) }}
              </div>
              <div class="mt5" v-if="form.acrossStageCount && form.acrossStageCount > 0">
                {{ $t('SALES.acrossStage').replace('$1', $numberStr(form.acrossStageCount, 0)) }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 付款条款摘要 -->
      <div class="mt10 shadow-card">
        <div style="font-size: 16px; font-weight: 700">
          <i
            class="el-icon-document mr10"
            style="
              color: #4292ca;
              font-size: 18px;
              padding: 3px;
              background: #e0f1fe;
              border-radius: 5px;
            "
          ></i>
          <span style="color: #211e25">
            {{ $t('SALES.paymentTermSummary') }}
          </span>
        </div>
        <el-row class="mt10" :gutter="50">
          <el-col :span="8">
            <div style="color: #898890">{{ $t('SALES.paymentTermCode') }}</div>
            <div class="mt5" style="color: #242329; font-weight: 700">
              {{ form.paymentTermCode }}
            </div>
          </el-col>
          <el-col :span="8" style="border-left: 1px solid #d3cdcd; border-right: 1px solid #d3cdcd">
            <div style="color: #898890">{{ $t('SALES.paymentTermName') }}</div>
            <div class="mt5" style="color: #242329; font-weight: 700">
              {{ form.paymentTermName }}
            </div>
          </el-col>
          <el-col :span="8">
            <div style="color: #898890">{{ $t('SALES.paymentCurrency') }}</div>
            <div class="mt5" style="color: #242329; font-weight: 700">{{ form.currencyName }}</div>
          </el-col>
        </el-row>
        <el-row class="mt20">
          <el-col :span="24">
            <div style="color: #898890">{{ $t('SALES.paymentTermDescription') }}</div>
            <div class="mt5" style="color: #444348; font-weight: 500">
              {{ form.paymentTermDescription }}
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 付款计划 -->
      <paymentScheduleTable ref="paymentScheduleTable" class="mt20" :isPath="isPath" @back="back" />

      <!-- 明细标题 有关联PI显示 -->
      <PIBreakdownTable
        v-if="form.piBreakdown && form.piBreakdown.length > 0"
        ref="PIBreakdownTable"
        class="mt10"
        :isPath="isPath"
        @back="back"
      />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import locale from '@/views/salesManagement/lang/index'
import paymentScheduleTable from './paymentScheduleTable'
import PIBreakdownTable from './PIBreakdownTable'
import { queryBySalesOrderId } from '@/api/salesManagement/salesOrder'
export default {
  name: 'PaymentSchedule',
  components: { paymentScheduleTable, PIBreakdownTable },
  props: {
    salesOrderId: {
      type: String,
      default: ''
    },
    isPath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      saveKey: '1',
      rowId: undefined,
      form: {},
      activeNames: ['1', '2', '3', '4'],
      loading: false,
      visible: false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    issuedPIAmountPer() {
      const { planBaseAmount, issuedAmount } = this.form
      if (!this.$resultOfBoolean(planBaseAmount)) return ''
      return Math.ceil(((issuedAmount * 100) / (planBaseAmount * 100)) * 100)
    },
    remainingAmountPer() {
      const { planBaseAmount, remainingAmount } = this.form
      if (!this.$resultOfBoolean(planBaseAmount)) return ''
      return Math.ceil((remainingAmount / planBaseAmount) * 100)
    }
  },
  methods: {
    open() {
      this.visible = true
      this.getInfo()
    },
    getInfo() {
      queryBySalesOrderId({ salesOrderId: this.salesOrderId }).then((res) => {
        this.form = res.data || {}
        this.$nextTick(() => {
          this.$refs.paymentScheduleTable && this.$refs.paymentScheduleTable.init(this.form)
          this.$refs.PIBreakdownTable && this.$refs.PIBreakdownTable.init(this.form)
        })
      })
    },
    closed() {
      this.reset()
    },
    reset() {
      this.form = {}
      this.tableList = []
      this.buttonAuthMsg = {}
      this.activeNames = ['1', '2', '3', '4']
    },
    back() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-dlg {
  padding: 5px 20px 0;
  max-height: 75vh;
  overflow: hidden auto;
}
.shadow-card {
  padding: 10px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.progress {
  position: relative;
}
.inside {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .inside-icon {
    padding: 5px;
    border-radius: 50%;
  }
  .inside-icon-0 {
    background: #d1e9fe;
  }
  .inside-icon-1 {
    background: #e8f2fd;
  }
  .inside-icon-2 {
    background: #e5f6ec;
  }
  .inside-icon-3 {
    background: #f2eefd;
  }
}
</style>
