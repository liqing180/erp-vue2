<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.specialOrder') }}</div>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <!-- 基本信息 -->
        <div class="form-card">
          <el-collapse-item name="1">
            <FormCollapseItemTitle slot="title" :title="$t('ui.basicInfo')">
            </FormCollapseItemTitle>

            <el-form ref="form" :model="form" label-width="200px" disabled>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.specialPurchaseOrderNo')}`">
                    <el-input v-model="form.specialOrderNo" :title="form.specialOrderNo" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.productName')}`">
                    <el-input v-model="form.productName" :title="form.productName" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.internalPartNo')}`">
                    <el-input v-model="form.internalPartNo" :title="form.internalPartNo" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.uom')}`">
                    <el-input v-model="form.uom" :title="showUomLabel(form.uom)" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.inventoryCategory')}`">
                    <ToolTipShowCategory :list="form.categoryNameList || []">
                      <el-input v-model="form.productCategoryName" />
                    </ToolTipShowCategory>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.processApproval')}`">
                    <el-input
                      :value="
                        selectDictLabel(dict.type.i_special_order_status, form.specialOrderStatus)
                      "
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.totalTags')}`">
                    <el-input v-model="form.labelQty" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.totalOrderAmount')}`">
                    <el-input :value="$numberStr(form.totalOrderAmount, 2)" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.percentage')}`">
                    <el-input :value="form.totalOrderAmountPerShowStr" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle slot="title" :title="$t('STOCKIN.shippingInfo')">
            </FormCollapseItemTitle>

            <el-form ref="form" :model="form" label-width="200px" disabled>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.documentNo')}`">
                    <el-input v-model="form.documentNo" :title="form.documentNo" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.purchasePerson')}`">
                    <el-input v-model="form.documentCreatedBy" :title="form.documentCreatedBy" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.receiptTime')}`">
                    <el-date-picker
                      v-model="form.receiptTime"
                      :format="fmtForYmdhms"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.productQty')}`">
                    <el-input v-model="form.productQty" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.specialQty')}`">
                    <el-input v-model="form.specialQty" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.percentage')}`">
                    <el-input :value="form.specialQtyPerShowStr" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.productAmount')}`">
                    <el-input :value="$numberStr(form.productAmount, 2)" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.specialAmount')}`">
                    <el-input :value="$numberStr(form.specialAmount, 2)" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('STOCKIN.percentage')}`">
                    <el-input :value="form.specialAmountPerShowStr" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="3">
            <FormCollapseItemTitle slot="title" :title="$t('STOCKIN.checklist')">
            </FormCollapseItemTitle>
            <checkListTable :list="form.specialOrderDetailList || []" :topMsg="form" />
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>

    <ApprovedDialog
      :id="form.specialOrderId"
      :taskId="taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.specialOrderId"
      :taskId="taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
  </FormPageLayout>
</template>

<script>
import {
  querySpecialOrderById,
  approvedSpecialOrder,
  rejectedSpecialOrder
} from '@/api/stockInManagement/specialOrder'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/stockInManagement/lang/index'
import checkListTable from './checkListTable.vue'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
export default {
  name: 'LabelPrinting',
  dicts: ['i_special_order_status'],
  mixins: [pageMixin],
  components: { checkListTable, ApprovedDialog, RejectDialog },
  data() {
    return {
      activeNames: ['1', '2', '3'],
      rowId: '',
      timeId: '',
      form: {},
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      },
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedSpecialOrder,
      rejectedUrl: rejectedSpecialOrder
    }
  },
  props: {
    taskId: {
      type: String,
      default: ''
    },
    comeFrom: {
      type: [String],
      // 1:update进入，2:审批流进入
      default: '1'
    },
    dataType: {
      type: [String, Number],
      default: '1' // todo:1, history:2, 管理员todo: 3
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    approvedBtnShow() {
      if (!this.checkPermi(['wms:stockInManagement:specialOrder:approval'])) {
        return false
      }
      let show = false
      if (this.dataType === '3') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.specialOrderId &&
        this.buttonAuthMsg.isCanApproved === '1'
      ) {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      if (!this.checkPermi(['wms:stockInManagement:specialOrder:reject'])) {
        return false
      }
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.specialOrderId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id

    this.handleUpdate()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      this.handleUpdate()
    }
  },
  methods: {
    handleUpdate() {
      this.reset()
      querySpecialOrderById({ specialOrderId: this.rowId })
        .then((res) => {
          const data = res.data || {}
          this.form = { ...data }
          this.buttonAuthMsg = data.buttonAuthMsg || {}
        })
        .catch(() => {})
    },
    updatePage() {
      this.handleUpdate()
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    // 表单重置
    reset() {
      this.form = {
        specialOrderId: undefined,
        specialOrderNo: undefined,
        documentNo: undefined
      }
      this.activeNames = ['1', '2', '3']
    },
    /* 审批 */
    handleApproved() {
      this.aplVisible = true
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.approvedSuccess')}`.replace('$1', `[${vm.form.specialOrderNo}]`)
      )
      this.aplVisible = false
      vm.back()
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    // 驳回
    handleRejected() {
      this.rjVisible = true
    },
    rjSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.rejectedSuccess')}`.replace('$1', `[${vm.form.specialOrderNo}]`)
      )
      this.rjVisible = false
      vm.back()
    },
    rjVisibleChange(data) {
      this.rjVisible = data || false
    }
  }
}
</script>
<style lang="scss" scoped>
.count {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #515a6e;
  font-size: 15px;
  font-weight: 700;
  height: 40px;
  padding: 0 30px;
  line-height: 40px;
  border-bottom: 1px solid #e6ebf5;
}
</style>
