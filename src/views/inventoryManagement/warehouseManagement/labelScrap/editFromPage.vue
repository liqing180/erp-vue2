<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        v-if="submitBtnShow && !approvedBtnShow"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <el-button type="primary" size="mini" v-if="isShowEditBtn" @click="exitComparison">
        {{ $t('uiBtn.edit') }}
      </el-button>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <div>
        <div class="form-card mb10" v-if="isComparison">
          <div class="legend-bar">
            <span class="legend-text">{{ $t('ui.legend') }}</span>
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block add"></span>{{ $t('ui.added') }}</span
            >
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block edit"></span>{{ $t('ui.modified') }}</span
            >
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block del"></span>{{ $t('ui.deleted') }}</span
            >
          </div>
        </div>
        <div
          class="form-card reject-card collapse-item-content-pt0 mb10"
          v-if="isComparison && (form.operationLogForLastReject || {}).operatorBy"
        >
          <el-collapse v-model="activeNames">
            <el-collapse-item name="11">
              <FormCollapseItemTitle slot="title" :title="$t('ui.rejectionOpinion')" />
              <div class="mb10">
                <div class="reject-remarks">
                  {{ form.operationLogForLastReject.operationDescription }}
                </div>
                <div class="reject-by">
                  {{ $t('ui.rejectedBy1') }}：{{ form.operationLogForLastReject.operatorBy }} |
                  {{ parseTime(form.operationLogForLastReject.operatorTime, fmtForYmdhms) }}
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('WAREHOUSE.operator')}`">
                      <el-input v-model="form.createdBy" :title="form.createdBy" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('WAREHOUSE.scrNo')}`">
                      <el-input v-model="form.scrapNo" :title="form.scrapNo" disabled> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.processStatus')}`">
                      <el-input
                        :value="selectDictLabel(dict.type.approved_status, form.approvedStatus)"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('remarks')]">
                      <MyInput
                        type="textarea"
                        v-model="form.remarks"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        resize="none"
                        show-word-limit
                        :maxlength="300"
                        :disabled="comDisFrom"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload
                        ref="uploadRef"
                        :disabled="comDisFrom"
                        :modifyHighlight="modifyHighlight"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" ref="collapseScrollPage">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('WAREHOUSE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-row :gutter="10" class="mb8">
                  <!-- <el-col :span="1.5">
                    <el-button
                      @click="handleAddBtn"
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      >{{ $t('uiBtn.add') }}</el-button
                    >
                  </el-col> -->
                  <right-toolbar
                    :showSearchBtn="false"
                    :showRefreshBtn="false"
                    :saveKey="saveKey"
                    :savePath="savePath"
                    :columns="configColumn"
                    :columnsInit="columns"
                  ></right-toolbar>
                </el-row>
                <el-table
                  border
                  ref="tables"
                  :row-class-name="tableRowClassName"
                  :key="'table' + modifyHighlight"
                  :cell-class-name="tableCellClassName"
                  :data="comTableList"
                  v-table-tab
                  row-key="rowTimeId"
                >
                  <el-table-column
                    type="index"
                    key="index"
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
                    v-for="item in comVisibleColumn"
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
                    <template slot="header" slot-scope="{ column }">
                      <span
                        v-if="
                          ['locationCode', 'labelNo', 'productName', 'scrapQty', 'reason'].includes(
                            item.prop
                          )
                        "
                      >
                        <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                      </span>
                      <span v-else>{{ column.label }}</span>
                    </template>
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'locationCode' && scope.row.isTotal !== '1'">
                        <el-input
                          v-model="scope.row.locationCode"
                          :title="scope.row.locationCode"
                          class="input"
                          :placeholder="$t('WAREHOUSE.locationCodePlaceholder')"
                          maxlength="50"
                          @blur="locationCodeSearch(scope.row, scope.$index)"
                          style="width: 98%"
                          @keyup.enter.native="locationCodeSearch(scope.row, scope.$index)"
                          @input="
                            scope.row[item.prop + 'Error'] = false
                            scope.row['ROW-ERROR'] = false
                          "
                          :disabled="scope.row.isLocationCodeReadonly === '1'"
                          :ref="'locationRef' + scope.$index"
                          v-if="!comDisFrom"
                        >
                        </el-input>
                        <template v-else>{{ scope.row[item.prop] }}</template>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>
                      <template v-else-if="item.prop === 'labelNo' && scope.row.isTotal !== '1'">
                        <el-input
                          :ref="'labelNoRef' + scope.$index"
                          v-model="scope.row.labelNo"
                          :title="scope.row.labelNo"
                          class="input"
                          :placeholder="$t('WAREHOUSE.labelNoPlaceholder')"
                          maxlength="50"
                          @blur="labelNoSearch(scope.row, scope.$index)"
                          style="width: 98%"
                          @keyup.enter.native="labelNoSearch(scope.row, scope.$index)"
                          @input="
                            scope.row[item.prop + 'Error'] = false
                            scope.row['ROW-ERROR'] = false
                          "
                          v-if="!comDisFrom"
                        >
                        </el-input>
                        <template v-else>{{ scope.row[item.prop] }}</template>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>
                      <template
                        v-else-if="item.prop === 'productName' && scope.row.isTotal !== '1'"
                      >
                        <CommonSelect
                          v-if="
                            !scope.row.labelNo &&
                            (scope.row.ivtProductList || []).length > 0 &&
                            !comDisFrom
                          "
                          style="width: 98%"
                          :id="scope.row.productId"
                          :label="scope.row.productName"
                          :title="scope.row.productName"
                          idKey="productId"
                          labelKey="productName"
                          :options="scope.row.ivtProductList || []"
                          @change="productChange($event, scope.row)"
                        />
                        <template v-else>{{ scope.row[item.prop] }}</template>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>

                      <template v-else-if="item.prop === 'scrapQty' && scope.row.isTotal !== '1'">
                        <el-input-number
                          :key="scope.row.decimalNum + 'aa'"
                          v-model="scope.row.scrapQty"
                          controls-position="right"
                          :precision="scope.row.decimalNum"
                          v-thousandSplit="{ precision: scope.row.decimalNum }"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="scope.row.availableQty"
                          :disabled="!scope.row.availableQty"
                          @change="changeScrapQty(scope.row)"
                          v-if="!comDisFrom"
                        />
                        <template v-else>{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</template>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>
                      <template v-else-if="item.prop === 'reason' && scope.row.isTotal !== '1'">
                        <el-select
                          v-model="scope.row.reason"
                          placeholder=""
                          style="width: 100%"
                          clearable
                          @change="changeReason(scope.row)"
                          v-if="!comDisFrom"
                        >
                          <el-option
                            v-for="item in (dict.type.label_scrap_reason || []).filter(
                              (i) => i.value !== 'Inventory Difference'
                            )"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                        <template v-else>{{
                          selectDictLabel(dict.type.label_scrap_reason, scope.row.reason)
                        }}</template>
                        <TablePropError v-if="scope.row[item.prop + 'Error']" />
                      </template>
                      <template
                        v-else-if="item.prop === 'availableQty' && scope.row.isTotal !== '1'"
                      >
                        {{ scope.row.availableQtyShowStr }}
                      </template>
                      <template v-else-if="item.prop === 'scrapAmount'">
                        <template v-if="!scope.row.isTotal">{{
                          $numberStr(scope.row[item.prop], 2)
                        }}</template>
                        <template v-else>{{ $numberStr(comScrapAmount, 2) }}</template>
                      </template>

                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('ui.action')"
                    key="action"
                    align="center"
                    min-width="120"
                    class-name="small-padding fixed-width"
                    fixed="right"
                    v-if="!comDisFrom"
                  >
                    <template slot-scope="scope">
                      <div class="flexCen">
                        <i
                          class="el-icon-circle-plus primary-pointer"
                          style="font-size: 24px; border: none; margin-right: 5px"
                          :title="$t('uiBtn.add')"
                          @click.stop="handleAddBtn(scope.$index)"
                          v-if="!scope.row.isTotal && tableList.length < 20"
                        ></i>
                        <i
                          v-if="!scope.row.isTotal && tableList.length > 1"
                          class="el-icon-remove"
                          :title="$t('uiBtn.delete')"
                          style="font-size: 24px; border: none; color: #f56c6c"
                          @click.stop="handleDelRow(scope.$index)"
                        ></i>
                        <!-- <i
                          class="el-icon el-icon-delete pointer"
                          style="font-size: 20px; color: #f56c6c"
                          :title="$t('uiBtn.delete')"
                          @click="handleDelRow(scope.$index)"
                        ></i> -->
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="3">
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
    <ApprovedDialog
      :id="form.scrapId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
      :formData="approvedFormData"
      formDataKey="scrap"
    />
    <RejectDialog
      :id="form.scrapId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.scrapId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <RevisionComparisonDlg module-key="scrap" ref="RevisionComparisonDlg" />
  </FormPageLayout>
</template>

<script>
import RevisionComparisonDlg from '@/components/RevisionComparison'
import {
  saveScrap,
  checkLocationCodeForScrap,
  checkLabelInventoryForScrap,
  queryNonLabelProductListForScrap,
  withdrawApproved,
  approvedScrap,
  rejectedScrap,
  cancelledScrap,
  queryScrapById
} from '@/api/inventoryManagement/labelScrap'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/inventoryManagement/lang/index'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
export default {
  dicts: ['label_scrap_reason', 'approved_status'],
  mixins: [pageMixin],
  components: {
    RevisionComparisonDlg,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    SystemOperationLogTable
  },
  data() {
    const vm = this

    return {
      submitLoading: false,
      saveKey: '1',
      savePath: 'ScrapRTable',
      activeNames: ['1', '2', '3'],
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
      rules: {},
      /* 表格部分 */
      columns: [
        {
          prop: 'locationCode',
          label: vm.$t('WAREHOUSE.locationCode'),
          visible: true,
          minWidth: 200,
          fixedWidth: 180,
          tooltip: true
        },
        {
          prop: 'labelNo',
          label: vm.$t('WAREHOUSE.labelNo'),
          visible: true,
          minWidth: 180,
          fixedWidth: 180,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('WAREHOUSE.productName'),
          visible: true,
          minWidth: 200,
          fixedWidth: 180,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('WAREHOUSE.internalPartNo'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },

        {
          prop: 'warehouseStructureCode',
          label: vm.$t('WAREHOUSE.location1'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'sourceBy',
          label: vm.$t('WAREHOUSE.source'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'availableQty',
          propBy: 'availableQtyShowStr',
          label: vm.$t('WAREHOUSE.scrapableQty'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'scrapQty',
          label: vm.$t('WAREHOUSE.scrapQty'),
          visible: true,
          minWidth: 180,
          fixedWidth: 180,
          tooltip: true
        },
        {
          prop: 'scrapAmount',
          label: vm.$t('WAREHOUSE.scrapAmount'),
          align: 'right',
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'reason',
          label: vm.$t('ui.reason'),
          visible: true,
          minWidth: 180,
          fixedWidth: 180,
          tooltip: true
        }
      ],
      tableList: [],
      rowIdKey: 'rowTimeId',
      collapseWarningForProductInfo: false,
      serviceSurchargeListOptions: [],
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      },
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      detailListCur: [],
      commonFileListCur: [],
      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedScrap,
      rejectedUrl: rejectedScrap,
      cancelledUrl: cancelledScrap,
      approvedFormData: undefined
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    propRowId: {
      type: String,
      default: ''
    },
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
  watch: {
    propTimeId: {
      immediate: true,
      handler: function () {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        if (this.rowId) {
          this.handleUpdate()
        }
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      if (this.form.approvedStatus !== '1') {
        arr = arr.filter((item) => {
          const is = item.prop !== 'scrapAmount'
          return is
        })
      }
      if (this.comDisFrom) {
        arr = arr.filter((item) => {
          const is = item.prop !== 'availableQty'
          return is
        })
      }
      return arr
    },
    comTableList() {
      if (this.form.approvedStatus === '1') {
        if (this.tableList.length > 1) {
          return [...this.tableList, { isTotal: '1', rowTimeId: '999' }]
        } else {
          return this.tableList
        }
      }
      return this.tableList
    },
    comScrapAmount() {
      const amountList = this.tableList.map((item) => item.scrapAmount)
      let total = 0
      amountList.forEach((amount) => {
        if (amount) {
          total += amount
        }
      })
      return total
    },
    editAuth() {
      // return this.checkPermi(['wms:warehouseManagement:labelScrap:edit'])
      return true
    },
    comDisFrom() {
      if (this.approvedBtnShow && this.isComparison) {
        return true
      }
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.scrapId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    isShowEditBtn() {
      return (
        this.editAuth &&
        ['1', '3'].includes(this.dataType) &&
        this.form.scrapId &&
        this.buttonAuthMsg.isCanUpdate === '1' &&
        this.approvedBtnShow &&
        this.isComparison
      )
    },
    submitBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.scrapId && this.buttonAuthMsg.isCanUpdate === '1') {
        show = true
      }
      return show
    },
    approvedBtnShow() {
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.scrapId &&
        this.buttonAuthMsg.isCanApproved === '1'
      ) {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.scrapId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['wms:warehouseManagement:labelScrap:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.scrapId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      let show = false
      if (this.dataType !== '2' && this.form.scrapId && this.buttonAuthMsg.isCanCancelled === '1') {
        show = true
      }
      return show
    },
    modifyHighlight() {
      return (
        this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.isComparison
      )
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.scrapId)
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'labelNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'productName':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'scrapQty':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryScrapById({
        scrapId: rowId,
        taskId: this.taskId || this.form.taskId
      }).then((res) => {
        const data = res.data || {}

        const list = data.scrapDetailList || []
        let timer = Date.now()
        list.forEach((item) => {
          timer++
          item.rowTimeId = timer
          this.$set(
            item,
            'availableQtyShowStr',
            `${this.$numberStr(item.availableQty, item.decimalNum)} ${item.uom || ''}`
          )
          item.locationCode = item.warehouseStructureCodeParents
        })
        this.tableList = list
        this.changeTableList()
        this.form = data

        this.buttonAuthMsg = data.buttonAuthMsg || {}

        this.initVersionComparison(data, list)
      })
    },
    initVersionComparison(data, currentDetailList) {
      const updateMsg = data.updateMsg || {}
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      const onlyDeleted = (list) => cloneList(list).filter((item) => item.updateType === '3')

      this.updateMsg = updateMsg
      this.basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
      this.basicUpdateProps = this.basicUpdateMsgList.map((item) => item.name)
      if (
        (updateMsg.beforeCommonFileList || []).length ||
        (updateMsg.afterCommonFileList || []).length
      ) {
        this.basicUpdateProps.push('attachment')
      }
      this.detailListCur = cloneList(currentDetailList)
      this.commonFileListCur = cloneList(data.commonFileList)
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      const deletedDetailList = onlyDeleted(updateMsg.beforeDetailList).map((item, index) => {
        item.rowTimeId = item.rowTimeId || `${Date.now()}-deleted-${index}`
        return item
      })
      this.tableList = this.isComparison
        ? [...cloneList(currentDetailList), ...deletedDetailList]
        : cloneList(currentDetailList)
      this.changeTableList()
      this.$nextTick(() => {
        this.$refs.uploadRef &&
          this.$refs.uploadRef.initFileList(
            this.isComparison
              ? [...cloneList(data.commonFileList), ...onlyDeleted(updateMsg.beforeCommonFileList)]
              : this.commonFileListCur
          )
      })
    },
    back(type) {
      this.$emit('back', type)
    },
    reset() {
      this.form = {
        remarks: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.tableList = []
      this.activeNames = ['1', '2', '3', '11']
      setTimeout(() => {}, 300)
      this.resetForm('form1')
      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.detailListCur = []
      this.commonFileListCur = []
    },

    /* 表单部分End */

    /* 表格部分Start */
    handleAddBtn(index) {
      const addRow = {
        rowTimeId: +new Date(),
        labelNo: undefined,
        scrapQty: undefined,
        reason: undefined
      }
      this.tableList.splice(index + 1, 0, addRow)
    },
    // 行删除
    handleDelRow(index) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
      })
    },
    locationCodeSearch(row, rowIndex) {
      this.$nextTick(() => {
        const refList = this.$refs['locationRef' + rowIndex]
        refList[0]?.blur()
        refList[2]?.blur()
      })
      const locationCode = row.locationCode || ''
      row.locationCode = locationCode.trim()
      if (!row.locationCode) {
        this.clearRow(row)
        return
      }
      const timer = Date.now()
      row.queryTimer1 = timer
      checkLocationCodeForScrap({ locationCode: row.locationCode })
        .then((res) => {
          if (row.queryTimer1 !== timer) return
          const data = res.data || {}
          if (data.isSuccess === '1') {
            if (row.labelNo) {
              this.labelNoSearch(row, rowIndex, '1')
            }
            this.queryNonLabelProductListForScrap(row)
          } else {
            this.$modal.msgError(data.text)
          }
        })
        .catch(() => {
          if (row.queryTimer1 !== timer) return
          this.clearRow(row)
          /* this.$nextTick(() => {
            const refList = this.$refs['locationRef' + rowIndex]
            refList[0]?.focus()
            refList[2]?.focus()
          }) */
        })
    },
    labelNoSearch(row, rowIndex, isInputType = '2') {
      // isInputType 1: 输入位置触发，2：输入标签触发
      const labelNo = row.labelNo || ''
      row.labelNo = labelNo.trim()
      if (!row.labelNo) {
        this.clearRow(row)
        this.$set(row, 'isLocationCodeReadonly', '0')
        return
      }
      const timer = Date.now()
      row.queryTimer2 = timer
      // T-B1 ILL0869  ILL0883
      checkLabelInventoryForScrap({
        labelNo: row.labelNo,
        locationCode: row.locationCode,
        warehouseId: this.form.warehouseId,
        scrapId: this.form.scrapId
      })
        .then((res) => {
          if (row.queryTimer2 !== timer) return
          this.$set(row, 'isLocationCodeReadonly', '0')
          const data = res.data || {}
          const labelDetail = data.labelDetail || {}
          const labelInventoryRecordList = data.labelInventoryRecordList || []
          if (data.isSuccess === '1') {
            if (labelInventoryRecordList.length === 1) {
              this.setNewMsg(row, labelDetail)
              this.$set(row, 'locationCode', data.warehouseStructureCode)
              this.$set(row, 'isLocationCodeReadonly', '1')
              this.queryNonLabelProductListForScrap(row)
            } else if (row.locationCode) {
              this.setNewMsg(row, labelDetail)
            }
          } else {
            this.clearRow(row)
            if (data.type === '2') {
              this.$nextTick(() => {
                const refList = this.$refs['locationRef' + rowIndex]
                refList[0]?.focus()
                refList[2]?.focus()
              })
              return
            }
            this.$modal.msgError(data.text)
          }
        })
        .catch(() => {
          if (row.queryTimer2 !== timer) return
          this.clearRow(row)
        })
    },

    // 标签 ILL0844
    // 位置 N-B1 T-B1
    queryNonLabelProductListForScrap(row) {
      const locationCode = row.locationCode
      queryNonLabelProductListForScrap({
        locationCode,
        warehouseId: this.form.warehouseId,
        scrapId: this.form.scrapId
      }).then((res) => {
        if (locationCode === row.locationCode) {
          const data = res.data || {}
          this.$set(row, 'ivtProductList', data.ivtProductList || [])
        }
      })
    },

    productChange(select, row) {
      this.$set(row, 'productNameError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$set(row, 'productId', select.productId)
      this.$set(row, 'productMainId', select.productMainId)
      this.$set(row, 'productName', select.productName)
      this.$set(row, 'internalPartNo', select.internalPartNo)
      this.$set(row, 'description', select.description)
      this.$set(row, 'productType', select.productType)
      this.$set(row, 'alias', select.alias)
      this.$set(row, 'brand', select.brand)
      this.$set(row, 'chineseName', select.chineseName)
      this.$set(row, 'includeDecimal', select.includeDecimal)
      this.$set(row, 'decimalNum', select.decimalNum)
      this.$set(row, 'availableQty', select.availableQty)
      this.$set(row, 'uom', select.uom)
      this.$set(row, 'scrapQty', undefined)
      this.$set(
        row,
        'availableQtyShowStr',
        `${this.$numberStr(row.availableQty, row.decimalNum)} ${row.uom || ''}`
      )
      this.$set(row, 'inventoryCost', select.inventoryCost)
      this.changeTableList()
    },
    changeScrapQty(row) {
      this.$set(row, 'scrapQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    changeReason(row) {
      this.$set(row, 'reasonError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    clearRow(row) {
      // 定义需要保留的属性名
      const keepKeys = [
        'locationCode',
        'labelNo',
        'ivtProductList',
        'labelNo',
        'reason',
        'rowTimeId'
      ]
      for (const key in row) {
        // 如果不是保留属性，就清空值
        if (!keepKeys.includes(key)) {
          this.$set(row, key, undefined)
        }
      }
    },
    setNewMsg(row, newData) {
      // 定义需要保留的属性名
      const keepKeys = [
        'locationCode',
        'labelNo',
        'ivtProductList',
        'scrapQty',
        'reason',
        'rowTimeId'
      ]
      for (const key in newData) {
        // 如果不是保留属性，就清空值
        if (!keepKeys.includes(key)) {
          this.$set(row, key, newData[key])
        }
      }
      if (row.scrapQty && row.scrapQty > row.qty) {
        row.scrapQty = undefined
      }
      this.$set(
        row,
        'availableQtyShowStr',
        `${this.$numberStr(row.availableQty, row.decimalNum)} ${row.uom || ''}`
      )
      this.$set(row, 'productNameError', false)
      this.$set(row, 'ROW-ERROR', false)

      this.changeTableList()
    },

    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },

    errorMessage(code) {
      this.scrollPageToTable()

      let rowIndex
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          this.$set(item, 'ROW-ERROR', true)
          this.$set(item, code + 'Error', true)
          if (!this.$resultOfBoolean(rowIndex)) {
            rowIndex = index
          }
        } else {
          this.$set(item, 'ROW-ERROR', false)
          if (code) {
            this.$set(item, code + 'Error', false)
          } else {
            Object.keys(item).forEach((key) => {
              if (key.endsWith('Error')) {
                this.$set(item, key, false)
              }
            })
          }
        }
      })
      this.$nextTick(() => {
        this.scrollToErrorColumn()
      })
    },
    scrollPageToTable() {
      try {
        if (!this.$refs.collapseScrollPage) return
        const offsetTop = this.$refs.collapseScrollPage.offsetTop
        if (!this.$refs.FormPageLayoutRef) return
        const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
        if (pageContent) {
          pageContent.scrollTo({
            top: offsetTop - 50, // pageContent 没有使用定位
            behavior: 'smooth' // 平滑滚动
          })
        }
      } catch (err) {}
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }
      if (!row[column.property] && row[column.property + 'Error']) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    },
    /* 表格部分End */

    async submitForm(submitType) {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
      }
      if (valid1) {
        const myFileIds = this.$refs.uploadRef.getFileIds()
        if (myFileIds === false) {
          return
        }
        let param = { ...this.form }
        const detailList = this.tableList
        if (detailList.length > 0) {
          const locationCodeReq = detailList.find((item) => {
            if (!(item.locationCode || '').trim()) {
              return true
            }
            return false
          })
          if (locationCodeReq) {
            this.errorMessage('locationCode')
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('WAREHOUSE.locationCode'))
            )
            this.collapseWarningForProductInfo = true
            return
          }

          const productNameReq = detailList.find((item) => {
            if (!(item.productName || '').trim()) {
              return true
            }
            return false
          })
          if (productNameReq) {
            this.errorMessage('productName')
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('WAREHOUSE.productName'))
            )
            this.collapseWarningForProductInfo = true
            return
          }

          const scrapQtyReq = detailList.find((item) => {
            if (!this.$resultOfBoolean(item.scrapQty)) {
              return true
            }
            return false
          })
          if (scrapQtyReq) {
            this.errorMessage('scrapQty')
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('WAREHOUSE.scrapQty'))
            )
            this.collapseWarningForProductInfo = true
            return
          }
          const reasonReq = detailList.find((item) => {
            return !item.reason
          })
          if (reasonReq) {
            this.errorMessage('reason')
            this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.reason')))
            this.collapseWarningForProductInfo = true
            return
          }
        }

        this.collapseWarningForProductInfo = false
        detailList.forEach((item) => {
          item.warehouseStructureCodeParents = item.locationCode
        })
        param.scrapDetailList = detailList
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileList = myFileIds

        if (submitType === 'approvedAndSubmit') {
          // 审批流带提交功能
          this.approvedFormData = param
          this.aplVisible = true
          return
        }
        const confirmMsg = this.$t('WAREHOUSE.scrapSubmitConfirm')
        const successMsg = this.$t('WAREHOUSE.scrapSubmitSuccess')
        const submitFn = saveScrap

        this.$modal
          .confirm(confirmMsg)
          .then(() => {
            this.submitLoading = true
            return submitFn(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
            this.back()
            this.submitLoading = false
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    },
    /* 审批 */
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.scrapId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleApproved() {
      if (!this.submitBtnShow) {
        this.approvedFormData = undefined
        this.aplVisible = true
      } else {
        this.submitForm('approvedAndSubmit')
      }
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(`${vm.$t('ui.approvedSuccess')}`.replace('$1', `[${vm.form.scrapNo}]`))
      this.aplVisible = false
      vm.back('onApprovedSuccess')
    },
    handleRejected() {
      this.rjVisible = true
    },
    rjVisibleChange(data) {
      this.rjVisible = data || false
    },
    rjSubmitSuccess() {
      const vm = this
      vm.$message.success(`${vm.$t('ui.rejectedSuccess')}`.replace('$1', `[${vm.form.scrapNo}]`))
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(`${vm.$t('ui.cancelledSuccess')}`.replace('$1', `[${vm.form.scrapNo}]`))
      vm.back('onCancelSuccess')
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
      return ''
    },
    exitComparison() {
      this.isComparison = false
      this.tableList = JSON.parse(JSON.stringify(this.detailListCur))
      this.changeTableList()
      this.$nextTick(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList(this.commonFileListCur)
      })
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      return item.beforeValue
    },
    getAfterValue(prop, fallback) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop)
      return item && item.afterValue !== undefined ? item.afterValue : fallback
    }
  }
}
</script>
<style lang="scss">
.legend-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  .legend-text {
    color: #606266;
  }
  .legend-divider {
    width: 1px;
    height: 14px;
    background: #e0e0e0;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .color-block {
    width: 16px;
    height: 16px;
    border: 1px solid;
    border-radius: 4px;
  }
  .color-block.add {
    background-color: #d2e3fc;
    border-color: #1a73e8;
  }
  .color-block.edit {
    background-color: #f0f7ff;
    border-color: #c2d7fb;
  }
  .color-block.del {
    background-color: #f5f5f4;
    border-color: #78716c;
  }
}
.reject-card {
  .reject-remarks {
    padding: 0 14px 8px;
  }
  .reject-by {
    padding: 0 14px;
    color: #909399;
  }
}
</style>
