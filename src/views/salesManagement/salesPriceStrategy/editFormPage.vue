<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        v-if="!comDisFrom"
        size="mini"
        :disabled="submitLoading"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <!-- <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('menu.approval1') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="withdrawBtnShow" @click="handleWithdraw"
        >{{ $t('menu.withdraw') }}
      </el-button> -->
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card">
          <el-collapse-item name="1">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('menu.productInfo')"
              :warning="collapseWarningForBasicInfo"
            >
            </FormCollapseItemTitle>
            <el-form
              ref="createForm"
              :model="createForm"
              :rules="createRules"
              label-width="180px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.productName')}`">
                    <el-input
                      v-model="createForm.productName"
                      :title="createForm.productName"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`">
                    <el-input
                      v-model="createForm.internalPartNo"
                      :title="createForm.internalPartNo"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.salesOrganization')}`" prop="departmentId">
                    <CommonSelect
                      :id="createForm.departmentId"
                      :label="createForm.departmentName"
                      :title="createForm.allSuperiorName"
                      idKey="departmentId"
                      labelKey="departmentName"
                      :options="deptOptions"
                      @change="departmentChange"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.pricingUnit')}`" prop="salesUom">
                    <el-select
                      v-model="createForm.salesUom"
                      :title="showUomLabel(createForm.salesUom)"
                      @change="salesUomChange"
                      placeholder=""
                      style="width: 100%"
                      disabled
                    >
                      <el-option
                        v-for="item in createForm.uomList || []"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.currency')}`">
                    <el-input v-model="createForm.currency" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.purchaseCost')}`">
                    <el-input :value="$numberStr(createForm.purchaseCost, 2)" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.costOfGoods')}`">
                    <el-input :value="$numberStr(createForm.costOfGoods, 2)" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.salesCost')}`">
                    <el-input :value="$numberStr(createForm.salesCost, 2)" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.recommendedRetailPrice')}`">
                    <el-input
                      :value="$numberStr(createForm.recommendedRetailPrice, 2)"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.marketPrice')}`">
                    <div @mouseenter="showPop($event)" @mouseleave="hidePop($event)">
                      <el-input :value="$numberStr(createForm.marketPrice, 2)" disabled></el-input>
                    </div>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.RRP')}`">
                    <el-input
                      :value="$numberStr(createForm.salesRetailPrice, 2)"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col> -->
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.remarks')">
                    <MyInput
                      type="textarea"
                      v-model="createForm.remarks"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('SALES.priceList')"
              :warning="collapseWarningForPriceList"
            >
            </FormCollapseItemTitle>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5" v-if="!comDisFrom">
                <el-button
                  type="primary"
                  :disabled="priceTableList.length >= 50"
                  size="mini"
                  @click="addRow"
                  >{{ $t('uiBtn.add') }}</el-button
                >
              </el-col>
              <right-toolbar
                :saveKey="saveKey"
                :showRefreshBtn="false"
                :columns="configColumn"
                :columnsInit="columns"
              ></right-toolbar>
            </el-row>

            <el-table
              border
              ref="tables"
              :key="'a' + tableKey"
              class="mb20"
              :data="priceTableList"
              v-table-tab
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
                <template slot="header" slot-scope="{ column }">
                  <span v-if="['salesPartNo', 'unitPrice', 'priceType'].includes(item.prop)">
                    <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                  </span>
                  <span v-else>{{ column.label }}</span>
                </template>
                <template slot-scope="scope">
                  <template v-if="item.prop === 'salesPartNo'">
                    <div
                      v-if="!comDisFrom && !scope.row.salesPriceStrategyDetailId"
                      style="width: 98%"
                    >
                      <CommonSelect
                        :filterable="true"
                        :id="scope.row.salesPartNo"
                        :label="scope.row.salesPartNo"
                        idKey="salesPartNo"
                        labelKey="salesPartNo"
                        :loading="scope.row.checklistItemLoading"
                        :options="scope.row.canSelectSalesCodeOptions"
                        @visible-change="salesCodeItemVisible($event, scope.row)"
                        @change="salesCodeChange($event, scope.row)"
                      />
                    </div>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>

                  <template v-else-if="item.prop === 'salesRetailPrice'">{{
                    $numberStr(scope.row[item.prop], 2)
                  }}</template>

                  <!-- <template v-else-if="item.prop === 'priceType'">
                    {{ selectDictLabel(priceTypeDicts, scope.row.priceType) }}
                  </template> -->

                  <template v-else-if="item.prop === 'priceType'">
                    <!-- {{ selectDictLabel(dict.type.s_price_type, scope.row.priceType) }} -->

                    <el-select
                      v-if="!comDisFrom && !scope.row.salesPriceStrategyDetailId"
                      style="width: 98%"
                      v-model="scope.row.priceType"
                      placeholder=""
                      @change="priceTypeChange($event, scope.row, scope.$index)"
                    >
                      <el-option
                        v-for="dict in priceTypeDicts || []"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      >
                      </el-option>
                    </el-select>

                    <span v-else>
                      {{ selectDictLabel(priceTypeDicts, scope.row.priceType) }}
                    </span>
                  </template>

                  <template v-else-if="item.prop === 'unitPrice'">
                    <el-input-number
                      v-thousandSplit="{ precision: 2 }"
                      v-if="!comDisFrom"
                      style="width: 98%"
                      v-model="scope.row.unitPrice"
                      controls-position="right"
                      :precision="2"
                      :min="0.01"
                      :max="999999999999.99"
                    />
                    <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>

                  <template v-else-if="item.prop === 'isActive'">
                    <el-switch
                      v-model="scope.row.isActive"
                      :disabled="comDisFrom"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </template>

                  <template v-else-if="item.prop === 'remarks'">
                    <descriptionEditDlg
                      v-model="scope.row.remarks"
                      :maxlength="200"
                      :disabled="comDisFrom"
                    />
                  </template>

                  <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!comDisFrom"
                :label="$t('ui.action')"
                key="action"
                align="center"
                width="100"
                class-name="small-padding fixed-width"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div class="flexCen">
                    <!-- <i
                      class="el-icon-circle-plus"
                      style="font-size: 24px; border: none; margin-right: 5px"
                      @click.stop="addCheckRow(scope.$index)"
                      v-if="priceTableList.length < 50"
                    ></i> -->
                    <!-- <i
                      class="el-icon-remove"
                      style="font-size: 24px; border: none; color: #f56c6c"
                      v-if="priceTableList.length > 1 && !scope.row.salesPriceStrategyDetailId"
                      @click.stop="delCheckRow(scope.$index)"
                    ></i> -->
                    <div style="width: 20px; margin-right: 5px">
                      <i
                        v-if="scope.row.salesPartNo && scope.row.priceType"
                        class="el-icon el-icon-s-data pointer"
                        style="font-size: 20px; color: #1890ff"
                        @click="handleChart(scope.$index, scope.row)"
                      ></i>
                    </div>
                    <div style="width: 20px">
                      <i
                        class="el-icon el-icon-delete pointer"
                        style="font-size: 20px; color: #f56c6c"
                        :title="$t('uiBtn.delete')"
                        v-if="!scope.row.salesPriceStrategyDetailId"
                        @click.stop="delCheckRow(scope.$index)"
                      ></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </div>
        <div class="form-card mt10" v-if="createForm.operationLogForLast">
          <el-collapse-item name="4">
            <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
              <template v-if="createForm.operationLogForLast">
                <span
                  v-if="createForm.operationLogForLast.operatorBy"
                  class="info-item mr20"
                  :title="createForm.operationLogForLast.operatorBy"
                >
                  {{ $t('ui.operName') }} : {{ createForm.operationLogForLast.operatorBy }}
                </span>
                <span v-if="createForm.operationLogForLast.operatorTime" class="info-item">
                  {{ $t('ui.operTime') }} :
                  {{ parseTime(createForm.operationLogForLast.operatorTime) }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <div class="pb20">
              <SystemOperationLogTable :tableList="createForm.operationLogList || []" />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>

    <chartDlg ref="chartDlg" />

    <popover-svc
      ref="pop1"
      trigger="hover"
      placement="top"
      :close-delay="0"
      :visible-arrow="true"
      popper-class="pop-warp"
      :offset="-30"
    >
      <div @mouseenter="mouseenterCur($event)" class="pop-box">
        <el-table :data="popoverData.competitorList || []" border>
          <el-table-column
            :label="$t('menu.competitor')"
            width="160"
            align="center"
            prop="competitor"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.competitor }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('SALES.competitivePrice')"
            width="160"
            align="center"
            prop="competitorPrice"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ $numberStr(scope.row.competitorPrice, 2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </popover-svc>
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

import { queryUserDepartment } from '@/api/system/user'
import chartDlg from './chartDlg'

import {
  updateSalesPriceList,
  querySalesPriceStrategyById,
  approvedSalesPriceStrategy,
  withdrawSalesPriceStrategy,
  querySalesPartNoByProductId
  // queryCanSelectChecklistItemList
} from '@/api/salesManagement/salesPriceStrategy'

import { Popover } from 'element-ui'
const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}

export default {
  mixins: [pageMixin],
  components: {
    SystemOperationLogTable,
    chartDlg,
    popoverSvc
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
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      tableKey: Date.now(),
      saveKey: '39',
      activeNames: [],
      timeId: '',
      submitLoading: false,
      createForm: {},
      collapseWarningForBasicInfo: false,
      createRules: {
        departmentId: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        salesUom: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },

      priceTableList: [],
      salesCodeOptions: [],
      collapseWarningForPriceList: false,

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanWithdraw: '0',
        isCanUpdate: '0'
      },
      deptOptions: [],

      columns: [
        {
          prop: 'priceType',
          label: vm.$t('SALES.priceType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'salesPartNo',
          label: vm.$t('SALES.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'salesRetailPrice',
          label: vm.$t('SALES.RRP'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('SALES.discountedPrice'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      popoverData: {}
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
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
        this.$nextTick((res) => {
          this.tableKey = Date.now()
        })
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['salesManagement:salesPriceStrategy:edit'])
    },
    comDisFrom() {
      if (this.rowId) {
        if (!this.editAuth) {
          return true
        }
      }
      return false
    },
    approvedBtnShow() {
      if (!this.checkPermi(['salesManagement:salesPriceStrategy:approval'])) {
        return false
      }
      let show = false
      if (this.createForm.salesPriceStrategyId && this.buttonAuthMsg.isCanApproved === '1') {
        show = true
      }
      return show
    },
    withdrawBtnShow() {
      if (!this.checkPermi(['salesManagement:salesPriceStrategy:withdraw'])) {
        return false
      }
      let show = false
      if (this.createForm.salesPriceStrategyId && this.buttonAuthMsg.isCanWithdraw === '1') {
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
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  activated() {},
  methods: {
    salesUomChange() {
      querySalesPriceStrategyById({
        productId: this.rowId,
        salesUom: this.createForm.salesUom
      }).then((res) => {
        const data = res.data || {}
        this.$set(this.createForm, 'purchaseCost', data.purchaseCost)
        this.$set(this.createForm, 'costOfGoods', data.costOfGoods)
        this.$set(this.createForm, 'salesCost', data.salesCost)
        this.$set(this.createForm, 'recommendedRetailPrice', data.recommendedRetailPrice)
        this.$set(this.createForm, 'marketPrice', data.marketPrice)
        this.$set(this.createForm, 'competitorList', data.competitorList || [])

        this.$set(this.createForm, 'salesRetailPrice', data.salesRetailPrice)
      })
    },
    async initDesc() {
      const a = this.MyDictDataClass.getDictFn('s_price_type')
      return Promise.all([a]).then((res) => {
        const res1 = res[0] || {}
        this.priceTypeDicts = (res1 || []).map((item) => {
          return {
            label: item.dictLabel,
            value: item.dictValue
          }
        })
        console.log(this.priceTypeDicts, '===649')
      })
    },
    async handleUpdate() {
      this.reset()
      await this.initDesc()

      querySalesPriceStrategyById({ productId: this.rowId }).then((res) => {
        const data = res.data || {}
        const salesPriceStrategyDetails = data.salesPriceStrategyDetails || []

        this.priceTableList = salesPriceStrategyDetails
        // if (this.priceTableList.length <= 0) {
        //   this.priceTableList.push({ isActive: '1' })
        // }

        this.createForm = { ...data }
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.queryUserDepartment()
        this.querySalesPartNoByProductId()
        this.$$getColumnContentMaxWidth(this.columns, this.priceTableList)

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },

    reset() {
      this.createForm = {
        checklistTemplateName: undefined,
        remarks: undefined
      }
      this.priceTableList = []
      this.collapseWarningForBasicInfo = false
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('createForm')
    },

    showPop(e) {
      const list = this.createForm.competitorList || []
      if (list.length <= 0) {
        return
      }
      this.$set(this.popoverData, 'competitorList', list)

      this.$set(this.popoverData, 'hide', false)
      this.$refs.pop1.popBy(e.target)
    },
    hidePop(e) {
      if (this.popoverData) {
        this.popoverData.hide = true
      }
      setTimeout(() => {
        this.popoverData.hide && this.$refs.pop1.close()
      }, 300)
    },
    mouseenterCur() {
      if (this.popoverData) {
        this.popoverData.hide = false
      }
    },

    queryUserDepartment() {
      queryUserDepartment({}).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          if (item.isDefault === '1' && !this.createForm.departmentId) {
            this.$set(this.createForm, 'departmentId', item.departmentId)
            this.$set(this.createForm, 'departmentName', item.departmentName)
            this.$set(this.createForm, 'allSuperiorName', item.allSuperiorName)
          }
        })
      })
    },
    departmentChange(item) {
      this.$set(this.createForm, 'departmentId', item.departmentId)
      this.$set(this.createForm, 'departmentName', item.departmentName)
      this.$set(this.createForm, 'allSuperiorName', item.allSuperiorName)
    },

    querySalesPartNoByProductId() {
      querySalesPartNoByProductId({ productId: this.createForm.productId }).then((res) => {
        const data = res.data || []
        this.salesCodeOptions = data
      })
    },
    addRow() {
      this.priceTableList.push({ isActive: '1', priceType: undefined })
    },
    addCheckRow(index) {
      this.priceTableList.splice(index + 1, 0, {})
    },
    delCheckRow(index) {
      this.priceTableList.splice(index, 1)
    },
    handleChart(index, row) {
      const params = {
        salesPartId: row.salesPartId,
        productId: this.createForm.productId,
        priceType: row.priceType
      }
      this.$refs.chartDlg.openChart(params)
    },
    // 价格类型
    priceTypeChange(e, row, rowIndex) {
      this.$set(row, 'priceType', e)
      const { salesPartNo } = row
      if (e && !!salesPartNo) {
        this.priceTableList.forEach((item, index) => {
          if (row.productId === item.productId && rowIndex !== index) {
            if (item.priceType && item.priceType === e && salesPartNo === item.salesPartNo) {
              this.$set(row, 'salesPartNo', undefined)
            }
          }
        })
      }
      this.salesCodeItemVisible(true, row)
    },
    salesCodeItemVisible(visible, row) {
      if (visible) {
        // const salesCodeSelectCount = {}
        // this.priceTableList.forEach((item) => {
        //   if (item.salesPartNo) {
        //     if (salesCodeSelectCount[item.salesPartNo] === undefined) {
        //       salesCodeSelectCount[item.salesPartNo] = 1
        //     } else {
        //       salesCodeSelectCount[item.salesPartNo] += 1
        //     }
        //   }
        // })
        // const list = this.salesCodeOptions.filter((item) => {
        //   const num = salesCodeSelectCount[item.salesPartNo] || 0
        //   return num <= 0 || item.salesPartNo === row.salesPartNo
        // })
        // this.$set(row, 'canSelectSalesCodeOptions', list)

        const salesPartNoSelectCount = {}
        this.priceTableList.forEach((item, index) => {
          if (item.salesPartNo && item.priceType) {
            if (salesPartNoSelectCount[item.priceType + '-' + item.salesPartNo] === undefined) {
              salesPartNoSelectCount[item.priceType + '-' + item.salesPartNo] = 1
            } else {
              salesPartNoSelectCount[item.priceType + '-' + item.salesPartNo] += 1
            }
          }
        })
        const list = this.salesCodeOptions.filter((item) => {
          const num = salesPartNoSelectCount[row.priceType + '-' + item.salesPartNo] || 0
          return num <= 0 || item.salesPartNo === row.salesPartNo
        })
        this.$set(row, 'canSelectSalesCodeOptions', list)
      } else {
        this.$set(row, 'canSelectSalesCodeOptions', [])
      }
    },
    salesCodeChange(select, row) {
      this.$set(row, 'salesPartNo', select.salesPartNo)
      this.$set(row, 'salesPartId', select.salesPartId)
      this.$set(row, 'salesRetailPrice', select.salesRetailPrice)
    },

    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'salesPartNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'unitPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'priceType':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 240
            break
        }
      })
    },

    update(param) {
      const vm = this
      vm.submitLoading = true
      updateSalesPriceList(param)
        .then((res) => {
          vm.$message.success(`${vm.$t('SALES.priceStrategySubmitSuccess')}`)
          this.cancel()
          vm.submitLoading = false
        })
        .catch(() => {
          vm.submitLoading = false
        })
    },
    // 取消按钮
    cancel() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/salesManagement/salesPriceStrategy' })
    },
    submitForm() {
      const vm = this
      this.$refs.createForm.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (valid) {
          const salesCodeReq = this.priceTableList.find((item) => {
            return !this.$resultOfBoolean(item.salesPartNo)
          })
          if (salesCodeReq) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesPartNo'))
            )
            this.collapseWarningForPriceList = true
            return
          }

          const priceTypeReq = this.priceTableList.find((item) => {
            return !this.$resultOfBoolean(item.priceType)
          })
          if (priceTypeReq) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.priceType'))
            )
            this.collapseWarningForPriceList = true
            return
          }

          const unitPriceReq = this.priceTableList.find((item) => {
            return !this.$resultOfBoolean(item.unitPrice)
          })
          if (unitPriceReq) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.discountedPrice'))
            )
            this.collapseWarningForPriceList = true
            return
          }
          this.collapseWarningForPriceList = false

          const confirm = vm
            .$t('SALES.priceStrategySubmitConfirm')
            .replace('$1', vm.createForm.checklistTemplateName)
          this.$modal.confirm(confirm).then(() => {
            const param = this.$trimOfObj(JSON.parse(JSON.stringify(vm.createForm)))
            param.salesPriceStrategyDetails = this.priceTableList
            if (this.rowId) {
              vm.update(param)
            }
          })
        } else {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('menu.productInfo'))
          )
        }
      })
    },

    handleApproved() {
      const vm = this
      const confirm = vm.$t('SALES.priceStrategyApproveConfirm')
      this.$modal.confirm(confirm).then(() => {
        approvedSalesPriceStrategy({ businessId: vm.createForm.salesPriceStrategyId }).then(
          (res) => {
            if (res.code === 200) {
              vm.$message.success(`${vm.$t('SALES.priceStrategyApproveSuccess')}`)
              this.cancel()
            }
          }
        )
      })
    },

    handleWithdraw() {
      const vm = this
      const confirm = vm.$t('SALES.priceStrategyWithdrawConfirm')
      this.$modal.confirm(confirm).then(() => {
        withdrawSalesPriceStrategy({
          salesPriceStrategyId: vm.createForm.salesPriceStrategyId
        }).then((res) => {
          if (res.code === 200) {
            vm.$message.success(`${vm.$t('SALES.priceStrategyWithdrawSuccess')}`)
            this.cancel()
          }
        })
      })
    }
  }
}
</script>
