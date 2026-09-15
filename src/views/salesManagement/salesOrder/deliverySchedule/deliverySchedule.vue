<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="closeBtnShow" @click="handleClose"
        >{{ $t('uiBtn.close') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('menu.cancel') }}
      </el-button>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <div>
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle slot="title" :title="$t('ui.basicInfo')">
              </FormCollapseItemTitle>
              <el-form label-width="180px" @submit.native.prevent>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesOrderNo')}`">
                      <el-input
                        v-model="form.salesOrderNo"
                        :title="form.salesOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`">
                      <el-input
                        v-model="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.scheduleStatus')}`">
                      <el-input
                        v-model="form.deliveryScheduleStatusShowStr"
                        :title="form.deliveryScheduleStatusShowStr"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.contactPerson')}`">
                      <el-input
                        v-model="form.bpContactPersonName"
                        :title="form.bpContactPersonName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item :label="`${$t('SALES.incoterm')}`">
                      <el-input
                        v-model="form.incotermName"
                        :title="form.incotermName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.address')}`">
                      <el-input
                        v-if="form.incotermAddressType === '0'"
                        :value="$t('SALES.selfCollect')"
                        disabled
                      ></el-input>
                      <!-- :rows="shipToAddressRows" -->
                      <ToolTipShowObj
                        :mData="form.receiveAddressForPort || {}"
                        :showStr="form.district ? '' : form.receiveAddressName"
                        v-else-if="form.incotermAddressType === '1'"
                      >
                        <el-input
                          :value="form.receiveAddressName"
                          :title="form.district ? form.receiveAddressName : ''"
                          disabled
                        ></el-input>
                      </ToolTipShowObj>
                      <el-input
                        v-else
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.deliveryAddress')}`">
                      <el-input
                        :value="form.receiveAddress"
                        :title="form.receiveAddress"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.reason')">
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                        disabled
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="2">
              <FormCollapseItemTitle slot="title" :title="$t('SALES.productInfo')">
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-table
                  border
                  ref="tables"
                  v-loading="loading"
                  :data="tableList"
                  tooltip-effect="light"
                  :max-height="tableMaxHeight"
                >
                  <el-table-column
                    type="index"
                    :label="$t('ui.sn')"
                    width="60"
                    fixed="left"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="item in visibleColumn"
                    :key="item.prop + item.colSortIndex"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :min-width="getMinWidth(item)"
                    :show-overflow-tooltip="item.tooltip"
                    :fixed="item.fixed"
                    :sortable="item.sortable"
                    :align="item.align || 'left'"
                    header-align="center"
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'basicQtyStr'">
                        {{ scope.row.basicQtyStr ? scope.row.basicQtyStr : '-' }}
                      </template>
                      <template v-else-if="item.prop === 'balanceAckQtyForBasicStr'">
                        {{
                          scope.row.balanceAckQtyForBasicStr
                            ? scope.row.balanceAckQtyForBasicStr
                            : '-'
                        }}
                      </template>
                      <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="3">
              <FormCollapseItemTitle slot="title" :title="$t('menu.deliverySchedule')">
              </FormCollapseItemTitle>
              <div class="pb20">
                <deliveryScheduleInfo
                  :formData="form"
                  :buttonAuthMsg="buttonAuthMsg"
                  @submitSuccess="DSInfoSuccess"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="4">
              <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
                <template v-if="form.operationLogForLast">
                  <span
                    v-if="form.operationLogForLast.operatorBy"
                    class="info-item mr20"
                    :title="form.operationLogForLast.operatorBy"
                  >
                    {{ $t('ui.operName') }} : {{ form.operationLogForLast.operatorBy }}
                  </span>
                  <span v-if="form.operationLogForLast.operatorTime" class="info-item">
                    {{ $t('ui.operTime') }} : {{ parseTime(form.operationLogForLast.operatorTime) }}
                  </span>
                </template>
              </FormCollapseItemTitle>
              <div class="pb20">
                <SystemOperationLogTable :tableList="form.operationLogList || []" />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>

    <!-- 取消 -->
    <FormCancelDialog
      :id="form.salesOrderId"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <!-- 关闭 -->
    <FormCloseDialog
      :id="form.salesOrderId"
      :close-api-url="closedUrl"
      @submitSuccess="closeSubmitSuccess"
      ref="FormCloseDialog"
    />
  </FormPageLayout>
</template>
<script>
import locale from '@/views/salesManagement/lang/index'
import pageMixin from '@/mixins/tableMinx'
import deliveryScheduleInfo from './deliveryScheduleInfo'
import {
  queryDeliveryScheduleById,
  cancelledDeliverySchedule,
  closeDeliverySchedule
} from '@/api/salesManagement/salesOrder'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import FormCloseDialog from '@/views/bpm/history/closeDialog/formCloseDialog'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
export default {
  name: 'DeliverySchedule',
  mixins: [pageMixin],
  components: {
    deliveryScheduleInfo,
    FormCancelDialog,
    FormCloseDialog,
    SystemOperationLogTable
  },
  data() {
    const vm = this
    return {
      saveKey: '1',
      rowId: undefined,
      form: {},
      activeNames: ['1', '2', '3', '4'],
      loading: false,
      tableList: [],
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'salesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'salesOrderProductStatusShowStr',
          label: vm.$t('SALES.deliveryStatus'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'basicQtyStr',
          label: vm.$t('SALES.orderQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'balanceAckQtyForBasicStr',
          label: vm.$t('SALES.balanceQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'stockOutQtyForBasicStr',
          label: vm.$t('SALES.shippedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'ackQtyForBasicStr',
          label: vm.$t('SALES.receivedQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'cumulativeVarianceQtyForBasicStr',
          label: vm.$t('SALES.cumulativeVariance'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }
      ],
      buttonAuthMsg: {
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanSubmit: '0'
      },
      cancelledUrl: cancelledDeliverySchedule,
      closedUrl: closeDeliverySchedule
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.$$initColumnVisible(this.saveKey, this.columns)
    /*
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    */
    this.rowId = this.$route.query.id
    this.timeId = this.$route.query.timeId
    this.getDataInfo()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.rowId = this.$route.query.id
    if (this.$route.query.timeId !== this.timeId) {
      this.reset()
    }
    this.timeId = this.$route.query.timeId
    this.getDataInfo()
  },
  computed: {
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    closeBtnShow() {
      return (
        this.checkPermi(['salesManagement:salesOrder:close']) &&
        this.buttonAuthMsg.isCanClosed === '1'
      )
    },
    cancelBtnShow() {
      return (
        this.checkPermi(['salesManagement:salesOrder:cancel']) &&
        this.buttonAuthMsg.isCanCancelled === '1'
      )
    }
  },
  methods: {
    reset() {
      this.form = {}
      this.tableList = []
      this.buttonAuthMsg = {}
      this.activeNames = ['1', '2', '3', '4']
    },
    DSInfoSuccess() {
      this.getDataInfo()
    },
    getDataInfo() {
      if (!this.rowId) {
        return
      }
      queryDeliveryScheduleById({ salesOrderId: this.rowId }).then((res) => {
        const data = res.data || {}
        const salesOrder = data.salesOrder || {}
        salesOrder.operationLogForLast = data.operationLogForLast
        salesOrder.operationLogList = data.operationLogList
        this.form = salesOrder
        let list = salesOrder.productOrServiceList || []
        if (salesOrder.salesQuotationType === 'Project') {
          list = salesOrder.salesOrderProductList || []
        }

        list.forEach((item) => {
          if (!this.$resultOfBoolean(item.basicQty)) {
            item.salesOrderProductStatusShowStr = ''
          }

          item.basicQtyStr = this.$numberStr(item.basicQty, item.decimalNum)
          item.balanceAckQtyForBasicStr = this.$numberStr(
            item.balanceQtyForBasicForDeliverySchedule < 0
              ? 0
              : item.balanceQtyForBasicForDeliverySchedule,
            item.decimalNum
          )
          item.stockOutQtyForBasicStr = this.$numberStr(item.stockOutQtyForBasic, item.decimalNum)
          item.ackQtyForBasicStr = this.$numberStr(item.ackQtyForBasic, item.decimalNum)
          item.cumulativeVarianceQtyForBasicStr = this.$numberStr(
            item.cumulativeVarianceQtyForBasic,
            item.decimalNum
          )
        })
        this.tableList = list
        this.buttonAuthMsg = data.buttonAuthMsg || {}
      })
    },
    back() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/salesOrder' })
    },
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    handleClose() {
      this.$refs.FormCloseDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace('$1', `${this.$t('SALES.salesOrder')}`)
      )
      vm.back()
    },
    closeSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.closedSuccess')}`.replace('$1', `${this.$t('SALES.salesOrder')}`)
      )
      vm.back()
    }
  }
}
</script>
