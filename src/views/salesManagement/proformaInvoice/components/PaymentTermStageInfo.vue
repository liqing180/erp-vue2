<template>
  <div class="paymentTermStageInfo">
    <div>
      <el-form
        ref="form2"
        label-position="top"
        @submit.native.prevent
        label-width="160px"
        class="pb20"
        :model="pipForm"
      >
        <el-row :gutter="120">
          <el-col :span="8">
            <el-form-item :label="`${$t('SALES.paymentTerm')}`">
              <el-input
                :value="pipFormData.paymentTermNo"
                :title="pipFormData.paymentTermNo"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="`${$t('SALES.paymentStage')}`"
              prop="paymentPlanDetailId"
              required
            >
              <ComparisonInput
                v-if="isModified('stageName')"
                :beforeValue="getBeforeValue('stageName')"
                :afterValue="getAfterValue('stageName', pipFormData.stageName)"
              />
              <SelectInput
                v-else
                :value="pipFormData.stageName"
                :title="pipFormData.stageName"
                :clearable="false"
                @click="openSelectStageNameDlg"
                :disabled="true"
                class="form-wd"
              />
              <!-- <el-input
                v-else
                :value="pipFormData.stageName"
                :title="pipFormData.stageName"
                disabled
              /> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('SALES.stagePercentage')}`">
              <el-input
                :value="pipFormData.percentage ? pipFormData.percentage + '%' : ''"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="120">
          <el-col :span="8">
            <el-form-item :label="`${$t('SALES.soTotalAmount')}`">
              <el-input
                :value="
                  (pipFormData.currencySymbol || '') +
                  ' ' +
                  $numberStr(pipFormData.soTotalAmount, 2)
                "
                :title="
                  (pipFormData.currencySymbol || '') +
                  ' ' +
                  $numberStr(pipFormData.soTotalAmount, 2)
                "
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('SALES.stageAmount')}`">
              <el-input
                :value="
                  (pipFormData.currencySymbol || '') + ' ' + $numberStr(pipFormData.stageAmount, 2)
                "
                :title="
                  (pipFormData.currencySymbol || '') + ' ' + $numberStr(pipFormData.stageAmount, 2)
                "
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('SALES.currentPIAmount')}`">
              <el-input
                :value="
                  (pipFormData.currencySymbol || '') +
                  ' ' +
                  $numberStr(pipFormData.currentProformaInvoiceAmount, 2)
                "
                :title="
                  (pipFormData.currencySymbol || '') +
                  ' ' +
                  $numberStr(pipFormData.currentProformaInvoiceAmount, 2)
                "
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="120">
          <el-col :span="8">
            <el-form-item :label="`${$t('SALES.dueDate2')}`">
              <el-date-picker
                :value="pipFormData.dueDate"
                :editable="false"
                disabled
                type="date"
                :format="fmtForYmd"
                :style="{ width: '100%' }"
                placeholder
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('SALES.dueDays')}`">
              <el-input :value="pipFormData.dueDays" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('SALES.currentStageStatus')}`">
              <el-input
                :value="
                  selectDictLabel(
                    dict.type.payment_plan_stage_status,
                    pipFormData.currentStageStatus
                  )
                "
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('SALES.paymentTermDescription')}`">
              <MyInput
                type="textarea"
                :value="pipFormData.paymentTermDescription"
                :autosize="{ minRows: 1, maxRows: 8 }"
                resize="none"
                show-word-limit
                :disabled="true"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 选择付款阶段弹窗 -->
    <SelectStageNameDlg
      ref="SelectStageNameDlg"
      :pipFormData="pipFormData"
      :salesOrderId="formData.salesOrderId"
    />
    <!-- 付款计划 -->
    <paymentScheduleTable
      ref="paymentScheduleTable"
      class="mt10"
      :propRowId="formData.salesOrderId"
      isPath="pi"
    />

    <!-- 明细标题 有关联PI显示 -->
    <PIBreakdownTable
      ref="PIBreakdownTable"
      class="mt10"
      isPath="pi"
      :propRowId="formData.salesOrderId"
    />
  </div>
</template>

<script>
import paymentScheduleTable from '@/views/salesManagement/salesOrder/paymentSchedule/paymentScheduleTable'
import PIBreakdownTable from '@/views/salesManagement/salesOrder/paymentSchedule/PIBreakdownTable'
import SelectStageNameDlg from './SelectStageNameDlg.vue'
export default {
  dicts: ['payment_plan_stage_status'],
  components: {
    paymentScheduleTable,
    PIBreakdownTable,
    SelectStageNameDlg
  },
  props: {
    comDisFrom: Boolean,
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateMsgList: {
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
    pipFormData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    pipFormData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.pipForm = newValue || {}
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  data() {
    return {
      pipForm: {}
    }
  },
  methods: {
    isModified(prop) {
      return this.modifyHighlight && this.basicUpdateMsgList.some((item) => item.name === prop)
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      return item.beforeValue
    },
    getAfterValue(prop, fallback) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop)
      return item && item.afterValue !== undefined ? item.afterValue : fallback
    },
    fillterFUN(searchVal, treeNode) {
      return treeNode.data.props.title.toLowerCase().includes(searchVal.toLowerCase())
    },
    paymentStageChange() {
      this.$nextTick(() => {
        console.log(this.pipForm.paymentPlanDetailId)
        if (this.$refs.cascaderRef) {
          this.$refs.cascaderRef.toggleDropDownVisible()
        }
        this.$emit('paymentStageChange')
      })
    },
    openSelectStageNameDlg() {
      this.$refs.SelectStageNameDlg.handleOpen()
    }
  }
}
</script>

<style lang="scss" scoped>
.paymentTermStageInfo {
  padding: 10px 20px 0;
  background: #fff;
  font-size: 12px;
}
</style>
