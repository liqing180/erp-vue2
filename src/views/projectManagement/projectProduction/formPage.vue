<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="withdrawBtnShow" @click="handleWithdraw"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>

    <template v-slot:content>
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
              ref="form"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              label-width="180px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.projectCode')}`" prop="costProjectCode">
                    <!-- <SelectInput
                      :value="form.costProjectCode"
                      :title="form.costProjectCode"
                      @clear="costProjectNameClear"
                      :clearable="!comDisFrom"
                      @click="openCostProjectNameTable"
                      class="form-wd"
                    /> -->

                    <CommonSelectAndList
                      :id="form.costProjectId"
                      :label="form.costProjectCode"
                      idKey="costProjectId"
                      labelKey="costProjectCode"
                      :clearable="!comDisFrom"
                      filterable
                      :options="costProjectList"
                      :disabled="comDisFrom"
                      :loading="costProjectCodeLoading"
                      @change="updateCostProjectName"
                      @handleOpen="openCostProjectNameTable"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.outboundWarehouse')}`" prop="outWarehouseId">
                    <SelectInput
                      :clearable="!comDisFrom"
                      :value="form.outWarehouseName"
                      :title="form.outWarehouseName"
                      @click="openWarehouseFormTable"
                      @clear="warehouseFromClear"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.productionNo')}`">
                    <el-input
                      v-model="form.projectProductionNo"
                      :title="form.projectProductionNo"
                      class="form-wd"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.customerName')}`" prop="businessPartnerName">
                    <ToolTipShowList
                      :list="(form.businessPartnerList || []).map((x) => x.businessPartnerName)"
                      popoverTitle=""
                    >
                      <el-input v-model="form.businessPartnerName" class="form-wd" disabled />
                    </ToolTipShowList>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.productionType')}`">
                    <el-input
                      :value="
                        selectDictLabel(
                          dict.type.project_production_type,
                          form.projectProductionType
                        )
                      "
                      class="form-wd"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.status')}`">
                    <el-input
                      :value="
                        selectDictLabel(
                          dict.type.project_production_status,
                          form.projectProductionStatus
                        )
                      "
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.salesOrderNo')}`" prop="salesOrderNo">
                    <SelectInput
                      :value="form.salesOrderNo"
                      :title="form.salesOrderNo"
                      @click="openSalesOrderTable"
                      @clear="salesOrderNoClear"
                      :clearable="true"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.remarks')" prop="remarks">
                    <MyInput
                      type="textarea"
                      v-model="form.remarks"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="300"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="3">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.materialConsumption')"
              :warning="collapseWarningForProductInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button
                    @click="handleBtnAdd"
                    :disabled="loading || !form.outWarehouseId || comDisFrom"
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    v-if="!comDisFrom"
                    >{{ $t('uiBtn.add') }}</el-button
                  >
                </el-col>
                <right-toolbar
                  :saveKey="saveKey"
                  :savePath="savePath"
                  :showSearchBtn="false"
                  :showRefreshBtn="false"
                  @queryTable="queryTable"
                  :columns="configColumn"
                  :columnsInit="columns"
                ></right-toolbar>

                <search-form
                  ref="searchForm"
                  v-model="queryParams"
                  :searchData="searchData"
                  :handleQuery="handleSearchForm"
                  :resetQuery="resetSearchForm"
                  :showCustom="false"
                  :topShowCount="1"
                  :isProductCustomSearch="true"
                />
              </el-row>
              <el-table
                border
                ref="tables"
                max-height="600px"
                :row-key="rowIdKey"
                :data="projectProductionConsumptionList"
                v-loading="loading"
                :header-cell-class-name="cellClass"
                class="table"
              >
                <el-table-column
                  type="index"
                  key="index"
                  :label="$t('ui.sn')"
                  width="60"
                  fixed="left"
                  align="center"
                  class-name="allowDrag"
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
                  :min-width="item.minWidth"
                  :show-overflow-tooltip="item.tooltip"
                  :fixed="item.fixed"
                  :sortable="item.sortable"
                  :align="item.align || 'left'"
                  header-align="center"
                >
                  <template slot="header" slot-scope="{ column }">
                    <span v-if="['plannedConsumptionQty'].includes(item.prop)">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </span>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="scope.row.bomAccessoriesType !== '2'">
                      <template v-if="item.prop === 'productType'">
                        <!-- <span v-if="scope.row.productType === '1'">{{
                          $t('PRODUCT.product')
                        }}</span>
                        <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
                        <span>{{
                          selectDictLabel(dict.type.product_type, scope.row.productType)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'unitCost'">
                        <el-input-number
                          style="width: 98%"
                          :precision="2"
                          v-thousandSplit="{ precision: 2 }"
                          :min="0.01"
                          :max="999999999.99"
                          v-model="scope.row.unitCost"
                          controls-position="right"
                          v-if="!comDisFrom && scope.row.isCanUpdateUnitCost === '1'"
                        />
                        <span v-else>{{ $numberStr(scope.row[item.prop], 2) }}</span>
                      </template>

                      <template v-else-if="item.prop === 'consumptionQty'">
                        {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
                        <!-- <el-input-number
                          style="width: 98%"
                          v-model="scope.row.consumptionQty"
                          controls-position="right"
                          :precision="scope.row.includeDecimal === '1' ? 3 : 0"
                          v-thousandSplit="{ precision: scope.row.includeDecimal === '1' ? 3 : 0 }"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="maxQty(scope.row) * 1"
                          :disabled="scope.row.isDisabled === '1' || maxQty(scope.row) * 1 === 0"
                          @change="consumptionQtyChange(scope.row)"
                        /> -->
                      </template>
                      <template v-else-if="item.prop === 'stockOutQty'">
                        <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
                      </template>
                      <template v-else-if="item.prop === 'qtyOnHand'">
                        <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                        <span v-else>{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'availableQty'">
                        <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                        <span v-else>{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'reservedQty'">
                        <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                        <span v-else class="primary-link" @click="openReservedDetail(scope.row)">{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'returnedQty'">
                        <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
                      </template>
                      <template v-else-if="item.prop === 'plannedConsumptionQty'">
                        <el-input-number
                          style="width: 98%"
                          v-model="scope.row.plannedConsumptionQty"
                          controls-position="right"
                          :precision="scope.row.decimalNum"
                          v-thousandSplit="{ precision: scope.row.decimalNum }"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="scope.row.availableQty"
                          :disabled="!scope.row.availableQty || scope.row.availableQty * 1 <= 0"
                          @change="consumptionQtyChange(scope.row)"
                          v-if="!comDisFrom"
                        />
                        <!-- :max="maxQty(scope.row) * 1" -->
                        <span v-else>{{
                          $numberStr(scope.row[item.prop], scope.row.decimalNum)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'purchaseUnitPrice'">{{
                        $numberStr(scope.row[item.prop], 2)
                      }}</template>
                      <template v-else-if="item.prop === 'remarks'">
                        <descriptionEditDlg
                          v-model="scope.row.remarks"
                          :maxlength="200"
                          :disabled="comDisFrom"
                        />
                      </template>
                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
                    <template v-else>
                      <template v-if="item.prop === 'productType'">
                        <!-- <span v-if="scope.row.productType === '1'">{{
                          $t('PRODUCT.product')
                        }}</span>
                        <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
                        <span>{{
                          selectDictLabel(dict.type.product_type, scope.row.productType)
                        }}</span>
                      </template>
                      <template v-else-if="item.prop === 'productName'">
                        <span
                          >{{ scope.row[item.prop] }} ({{ $t('PRODUCT.max') }}
                          {{ scope.row.maxQty }}, {{ $t('PRODUCT.min') }}
                          {{ scope.row.minQty }})</span
                        >
                      </template>
                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
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
                        class="el-icon-delete pointer"
                        style="font-size: 20px; color: #f56c6c"
                        :title="$t('uiBtn.delete')"
                        @click="handleDelRow(scope.$index, scope.row)"
                      ></i>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="rowId">
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
    </template>
    <!-- 成品名称 -->
    <!-- 新增BOM配件 -->
    <selectProductNameTable
      ref="selectProductNameTable"
      :projectProductionId="form.projectProductionId"
      :warehouseId="form.outWarehouseId"
      :costProjectId="form.costProjectId"
      @onSuccess="updateTable"
    />
    <selectSalesOrderTable ref="selectSalesOrderTable" @update="updateSalesOrderNo" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />

    <selectCostProjectTable
      ref="selectCostProjectTable"
      :departmentId="form.departmentId"
      @update="updateCostProjectName"
    />

    <!-- 取消 -->
    <FormCancelDialog
      :id="form.projectProductionId"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <!-- 占用详情 -->
    <reservedDetailsDlg ref="reservedDetailsDlg" />
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import locale2 from '@/views/system/lang/index'
import selectWarehouseTable from './components/selectWarehouseTable.vue'

import {
  queryProjectProductionById,
  submitProjectProduction,
  withdrawProjectProduction,
  cancelledProjectProduction
} from '@/api/projectManagement/projectProductionNew'
import { queryDefaultWarehouse } from '@/api/inventoryManagement/warehouse'
import { queryCanSelectCostProjectListForPage } from '@/api/projectManagement/project'

import selectProductNameTable from './components/selectProductNameTable'
import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import Big from 'big.js/big.mjs'
import selectCostProjectTable from './components/selectCostProjectTable.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import reservedDetailsDlg from '@/views/inventoryManagement/inventoryReport/reservedDetailsDlg.vue'

export default {
  name: 'AddFormPage',
  dicts: ['project_production_status', 'project_production_type', 'logistics_type', 'product_type'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    selectProductNameTable,
    selectSalesOrderTable,
    selectWarehouseTable,
    selectCostProjectTable,
    FormCancelDialog,
    SystemOperationLogTable,
    reservedDetailsDlg
  },
  data() {
    const vm = this
    return {
      cancelledUrl: cancelledProjectProduction,
      loading: false,
      savePath: 'projectMTable',
      saveKey: '2', // 状态===已完成设置 3
      activeNames: ['1', '2', '3', '4'],
      submitLoading: false,
      previewPDFLoading: false,
      rowIdKey: 'fullId',
      rowId: '',
      timeId: '',
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForContent: false,
      collapseWarningForProductionPersonnel: false,
      rules: {
        salesOrderNo: [
          {
            required: false,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        picUserBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        inWarehouseId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        outWarehouseId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        costProjectCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        businessPartnerName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'reservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'plannedConsumptionQty',
          label: vm.$t('PRODUCT.plannedConsumptionQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'consumptionQty',
          label: vm.$t('PRODUCT.consumptionQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true,
          colMinWidth: 120
        },
        {
          prop: 'stockOutQty',
          label: vm.$t('PRODUCT.outboundQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('PRODUCT.returnQty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          colMinWidth: 200
        }
      ],
      // 状态===已完成，使用独立的数据缓存
      columnsToCompleted: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: false,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: false,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'reservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: false,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'plannedConsumptionQty',
          label: vm.$t('PRODUCT.plannedConsumptionQty'),
          visible: false,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'consumptionQty',
          label: vm.$t('PRODUCT.consumptionQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true,
          colMinWidth: 120
        },
        {
          prop: 'stockOutQty',
          label: vm.$t('PRODUCT.outboundQTY'),
          visible: false,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('PRODUCT.returnQty'),
          visible: false,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          colMinWidth: 200
        }
      ],
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanPreviewPDF: '0'
      },
      initContent: '',
      config: {
        width: '100%', // px
        height: 640, // px
        contentReadOnly: false,
        isShowToolBar: true,
        disabled: false,
        buttonsOption: [
          {
            componentName: 'BtnServTpl',
            isShow: true
          }
        ]
      },
      // 物料消耗数据缓存
      projectProductionConsumptionListCreated: [],
      projectProductionConsumptionList: [],
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch1')}`,
          type: 'InputEle'
        }
      ],
      // 查询参数
      queryParams: {
        condition: undefined
      },
      costProjectList: [],
      costProjectCodeLoading: false
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
    isView: {
      type: Boolean,
      default: false
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
        } else {
          this.handleAdd()
        }
        this.queryCanSelectCostProjectListForPage()
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['projectManagement:projectProduction:edit'])
    },
    comDisFrom() {
      let dis = true
      if (this.rowId) {
        if (this.editAuth && this.buttonAuthMsg.isCanSubmit === '1') {
          dis = false
        }
      } else {
        return !this.editAuth
      }
      return dis
    },
    saveDraftBtnShow() {
      let show = false
      if (this.rowId) {
        if (this.editAuth && this.buttonAuthMsg.isCanSaveDraft === '1') {
          show = true
        }
      } else {
        return this.editAuth
      }
      return show
    },
    withdrawBtnShow() {
      if (!this.checkPermi(['projectManagement:projectProduction:withdrawApprove'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanWithdraw === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['projectManagement:projectProduction:cancel'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanCancelled === '1') {
        show = true
      }
      return show
    },
    updateCostShow() {
      if (!this.checkPermi(['projectManagement:projectProduction:updateCost'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanUpdateUnitCost === '1') {
        show = true
      }
      return show
    },
    previewPDFShow() {
      if (!this.checkPermi(['projectManagement:projectProduction:previewPDF'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanPreviewPDF === '1') {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['projectManagement:projectProduction:printPDF'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanPrintPDF === '1') {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['projectManagement:projectProduction:exportPDF'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanDownloadPDF === '1') {
        show = true
      }
      return show
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
  },
  created() {
    this.reset()
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    openReservedDetail(row) {
      this.$refs.reservedDetailsDlg.handleOpen({ ...row, warehouseId: this.form.outWarehouseId })
    },
    queryCanSelectCostProjectListForPage() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        departmentId: this.departmentId
      }
      this.$trimOfObj(param)
      this.costProjectCodeLoading = true
      queryCanSelectCostProjectListForPage(param)
        .then((response) => {
          const rows = response.rows || []
          this.costProjectList = rows
          this.costProjectCodeLoading = false
        })
        .catch((err) => {
          this.costProjectCodeLoading = false
          window.console.error(err)
        })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.handlerTableList()
    },
    /** 重置 */
    resetSearchForm() {
      this.$refs.tables && this.$refs.tables.clearSort()
    },
    handlerTableList() {
      let table = this.projectProductionConsumptionListCreated
      if (this.queryParams.condition) {
        table = table.filter((item) => {
          return this.$isContain(this.queryParams.condition, [
            item.productName,
            item.internalPartNo,
            item.description
          ])
        })
      }
      this.projectProductionConsumptionList = table
    },
    openCostProjectNameTable() {
      this.$refs.selectCostProjectTable.handleOpen(this.form.costProjectId)
    },
    // 清空pic
    costProjectNameClear() {
      this.$set(this.form, 'costProjectName', undefined)
      this.$set(this.form, 'costProjectId', undefined)
      this.$set(this.form, 'costProjectCode', undefined)

      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
    },
    updateCostProjectName(row) {
      const { costProjectName, costProjectId, costProjectCode, businessPartnerList } = row
      if (!costProjectId || this.form.costProjectId !== costProjectId) {
        this.projectProductionConsumptionListCreated = []
        this.projectProductionConsumptionList = []
      }
      this.$set(this.form, 'costProjectName', costProjectName)
      this.$set(this.form, 'costProjectId', costProjectId)
      this.$set(this.form, 'costProjectCode', costProjectCode)
      if (row.costProjectId && businessPartnerList && businessPartnerList.length > 0) {
        this.$set(this.form, 'businessPartnerList', businessPartnerList || [])
      } else {
        this.$set(this.form, 'businessPartnerList', [])
      }

      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
    },
    maxQty(row) {
      const { plannedConsumptionQty, availableQty, reservedQty } = row
      let qty = 0
      if (!availableQty) {
        qty += 0
      } else {
        qty += availableQty * 1000
      }
      if (!reservedQty) {
        qty += 0
      } else {
        qty += reservedQty * 1000
      }
      qty = qty / 1000
      if (qty === 0) {
        return 0
      }
      return plannedConsumptionQty * 1 > qty * 1 ? qty * 1 : plannedConsumptionQty * 1
    },
    // 小数上取整
    bigValue(e, type) {
      let res
      if (type === '1') {
        const big = new Big(e)
        const num = Math.pow(10, 3)
        const value = Math.ceil(big.times(num)) / num
        res = new Big(value).toFixed(3).toString()
      } else {
        res = Math.ceil(e)
      }
      return res
    },
    consumptionQtyChange(row) {},
    handleAdd() {
      this.reset()
      this.queryDefaultWarehouse()
    },
    openSalesOrderTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    updateSalesOrderNo(row) {
      // this.$set(this.form, 'salesOrderId', row.salesOrderId)
      const { projectProductionId, ...params } = row
      this.form = Object.assign(this.form, { ...params })
      this.$set(this.form, 'projectProductionId', projectProductionId)
      const { warehouseId, warehouseName } = row || {}
      if (warehouseId) {
        this.$set(this.form, 'inWarehouseName', warehouseName)
        this.$set(this.form, 'inWarehouseId', warehouseId)
        this.$set(this.form, 'outWarehouseName', warehouseName)
        this.$set(this.form, 'outWarehouseId', warehouseId)
      }
      this.projectProductionConsumptionList = []
      this.projectProductionConsumptionListCreated = []
    },
    queryDefaultWarehouse() {
      queryDefaultWarehouse({ menuPerms: this.menuKey.projectProduction }).then((res) => {
        const { warehouseId, warehouseName } = res.data || {}
        if (warehouseId) {
          this.$set(this.form, 'inWarehouseName', warehouseName)
          this.$set(this.form, 'inWarehouseId', warehouseId)
          this.$set(this.form, 'outWarehouseName', warehouseName)
          this.$set(this.form, 'outWarehouseId', warehouseId)
        }
      })
    },
    openWarehouseFormTable() {
      const params = {
        queryType: 'from'
        // alreadySelectWarehouseId: this.form.inWarehouseId
      }
      this.$refs.selectWarehouseTable.handleOpen(params)
    },
    openWarehouseToTable() {
      const params = {
        queryType: 'to'
        // alreadySelectWarehouseId: this.form.outWarehouseId
      }
      this.$refs.selectWarehouseTable.handleOpen(params)
    },
    updateWarehouse(row, type) {
      if (type === 'to') {
        this.$set(this.form, 'inWarehouseName', row.warehouseName)
        this.$set(this.form, 'inWarehouseId', row.warehouseId)
      } else {
        this.$set(this.form, 'outWarehouseName', row.warehouseName)
        this.$set(this.form, 'outWarehouseId', row.warehouseId)
        this.projectProductionConsumptionList = []
        this.projectProductionConsumptionListCreated = []
      }
    },
    salesOrderNoClear() {
      this.$set(this.form, 'salesOrderId', undefined)
      this.$set(this.form, 'salesOrderNo', undefined)
      this.$set(this.form, 'projectName', undefined)
      this.warehouseToClear()
      this.warehouseFromClear()
    },
    warehouseFromClear() {
      this.$set(this.form, 'outWarehouseName', undefined)
      this.$set(this.form, 'outWarehouseId', undefined)
      this.projectProductionConsumptionList = []
      this.projectProductionConsumptionListCreated = []
    },
    warehouseToClear() {
      this.$set(this.form, 'inWarehouseName', undefined)
      this.$set(this.form, 'inWarehouseId', undefined)
    },
    // 清空pic
    picUserNameClear() {
      this.$set(this.form, 'picUserBy', undefined)
      this.$set(this.form, 'picUserId', undefined)
      this.$set(this.form, 'mobilePhone', undefined)
      this.$set(this.form, 'mobileCode', undefined)
      this.$set(this.form, 'mobileNum', undefined)
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryProjectProductionById({ projectProductionId: rowId }).then((res) => {
        const { buttonAuthMsg, projectProductionConsumptionList } = res.data
        this.form = res.data || {}
        this.projectProductionConsumptionListCreated = projectProductionConsumptionList || []
        this.projectProductionConsumptionList = this.projectProductionConsumptionListCreated
        this.buttonAuthMsg = buttonAuthMsg || {}
        this.initContent = this.form.projectMsg || ''
        if (this.form.projectProductionStatus === '6') {
          this.saveKey = '3'
          this.columns = this.columnsToCompleted
          this.$$initColumnVisible(this.saveKey, this.columns)
        }
        this.$$getColumnContentMaxWidth(this.columns, this.projectProductionConsumptionListCreated)
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        // this.projectProductionConsumptionList.splice(index, 1)
        this.projectProductionConsumptionList.splice(index, 1)
        this.projectProductionConsumptionListCreated =
          this.projectProductionConsumptionListCreated.filter(
            (x) => x.productMainId !== row.productMainId
          )
        this.$$getColumnContentMaxWidth(this.columns, this.projectProductionConsumptionListCreated)
      })
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'cell-class'
      }
    },
    handleWithdraw() {
      const vm = this
      const confirm = vm.$t('PRODUCT.withdrawConfirm1').replace('$1', this.form.projectProductionNo)
      this.$modal
        .confirm(confirm)
        .then(() => {
          this.submitLoading = true
          withdrawProjectProduction({
            projectProductionId: vm.rowId
          })
            .then((res) => {
              if (res.code === 200) {
                vm.$message.success(
                  vm.$t('PRODUCT.withdrawSuccess1').replace('$1', this.form.projectProductionNo)
                )
                this.cancel()
              }
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace(
          '$1',
          `${this.$t('PRODUCT.associatedProjectName')} [${vm.form.projectProductionNo}]`
        )
      )
      vm.cancel()
    },

    handleClick() {},

    selectable(row, rowIndex) {
      if (row.isCanSelectUse !== '1' && row.isCanSelectReQuote !== '1') return false
      return true // 不禁用
    },
    reset() {
      this.form = {
        salesOrderNo: undefined,
        associatedProjectName: undefined,
        productionNo: undefined,
        picUserBy: undefined,
        projectProductionType: '1',
        remarks: undefined,
        logisticsType: '3'
      }
      this.projectProductionConsumptionList = []
      this.projectProductionConsumptionListCreated = []
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForContent = false
      this.collapseWarningForProductionPersonnel = false
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form')
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (row.isErr === '1' && column.property === 'uom' && row.productType === '1') {
        cellClass = 'is-err-table-cell'
      }
      return cellClass
    },
    handleBtnAdd() {
      const tableList = JSON.parse(JSON.stringify(this.projectProductionConsumptionListCreated))
      this.$refs.selectProductNameTable.handleOpen(tableList)
    },
    updateTable(list) {
      const rows = JSON.parse(JSON.stringify(list))
      this.projectProductionConsumptionListCreated = rows
      this.projectProductionConsumptionList = this.projectProductionConsumptionListCreated
      this.$$getColumnContentMaxWidth(this.columns, this.projectProductionConsumptionListCreated)

      // this.projectProductionConsumptionList = rows
      // this.projectProductionConsumptionListCreated = JSON.parse(
      //   JSON.stringify(this.projectProductionConsumptionList)
      // )
    },
    // 取消按钮
    cancel() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/projectManagement/projectProduction' })
    },

    async submitForm() {
      const valid1 = await this.$refs.form.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      this.collapseWarningForBasicInfo = false

      if (this.projectProductionConsumptionListCreated.length <= 0) {
        this.$modal.msgError(this.$t('PRODUCT.materialConsumptionTableEmpty'))
        this.collapseWarningForProductInfo = true
        return
      }
      const plannedConsumptionQty = this.projectProductionConsumptionListCreated.some(
        (x) => !x.plannedConsumptionQty
      )
      if (plannedConsumptionQty) {
        this.collapseWarningForProductInfo = true
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.plannedConsumptionQty'))
        )
        return
      }
      this.collapseWarningForProductInfo = false

      const param = JSON.parse(JSON.stringify(this.form))
      param.projectProductionConsumptionList = this.projectProductionConsumptionListCreated
      this.$modal
        .confirm(this.$t('PRODUCT.projectProductionSubmit'))
        .then(() => {
          console.log('=====================922')
          const funApi = submitProjectProduction
          this.submitLoading = true
          funApi(param)
            .then((res) => {
              console.log(res, '=======925')
              const { projectProductionNo } = res.data || {}
              this.$modal.msgSuccess(
                this.$t('PRODUCT.projectProductionSubmitSuccess').replace('$1', projectProductionNo)
              )
              this.cancel()
              this.submitLoading = false
            })
            .catch((err) => {
              console.log(err, '=======934')
              this.submitLoading = false
            })
        })
        .catch(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.table {
  /deep/ .cell-class .cell .el-checkbox__inner {
    display: none;
    position: relative;
  }
}
.table {
  /deep/ .cell-class .cell:before {
    content: '';
    position: absolute;
  }
}
.unit {
  flex-shrink: 0;
  min-width: 30px;
  padding: 0 8px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
.border-line-solid {
  height: 1px;
  width: 100%;
  border-top: 1px solid #dcdfe6;
  // background-color: #dcdfe6;
  margin-bottom: 20px;
}
.border-line-dashed {
  height: 1px;
  width: 100%;
  border-top: 2px dashed #dcdfe6;
  // background-color: #dcdfe6;
  margin-bottom: 20px;
  border-spacing: 6px;
}
</style>
