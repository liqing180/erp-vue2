<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        v-if="!comDisFrom"
        :loading="btnLoading"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        :loading="btnLoading"
        size="mini"
        @click="handleSaveDraft"
        v-if="saveDraftBtnShow"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawBtnShow"
        :loading="btnLoading"
        @click="handleWithdraw"
        >{{ $t('menu.withdraw') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="updateCostShow"
        :loading="btnLoading"
        @click="handleUpdateCost"
        >{{ $t('menu.updateCost') }}
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
                  <el-form-item :label="`${$t('PRODUCT.salesOrderNo')}`" prop="salesOrderNo">
                    <SelectInput
                      :value="form.salesOrderNo"
                      :title="form.salesOrderNo"
                      @click="openSalesOrderTable"
                      @clear="salesOrderNoClear"
                      :clearable="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.associatedProjectName')}`">
                    <el-input
                      :value="form.projectName"
                      :title="form.projectName"
                      disabled
                    ></el-input>
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
                  <el-form-item :label="`${$t('PRODUCT.outboundWarehouse')}`" prop="outWarehouseId">
                    <SelectInput
                      clearable
                      :value="form.outWarehouseName"
                      :title="form.outWarehouseName"
                      @click="openWarehouseFormTable"
                      @clear="warehouseFromClear"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.inboundWarehouse')}`" prop="inWarehouseId">
                    <SelectInput
                      clearable
                      :value="form.inWarehouseName"
                      :title="form.inWarehouseName"
                      @click="openWarehouseToTable"
                      @clear="warehouseToClear"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.status')}`">
                    <el-input
                      :value="
                        selectDictLabel(
                          dict.type.project_template_status,
                          form.projectTemplateStatus
                        )
                      "
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.pic')}`" prop="picUserBy">
                    <SelectInput
                      :value="form.picUserBy"
                      :title="form.picUserBy"
                      @clear="picUserNameClear"
                      clearable
                      @click="openPicTable"
                      class="form-wd"
                      :disabled="comDisFrom"
                    />
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
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('SALES.logisticsType')}`">
                    <el-radio-group v-model="form.logisticsType" disabled>
                      <el-radio
                        v-for="dict in dict.type.logistics_type"
                        :key="dict.value"
                        :label="dict.value"
                      >
                        {{ dict.label }}</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="4">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.productionPersonnel')"
              :warning="collapseWarningForProductionPersonnel"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <picTable ref="picTable" :formData="form" />
            </div>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.productionAccessories')"
              :warning="collapseWarningForProductInfo"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button
                    @click="handleBtnAdd"
                    :disabled="loading || !form.salesOrderId || !form.outWarehouseId"
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    v-if="!comDisFrom"
                    >{{ $t('uiBtn.add') }}</el-button
                  >
                </el-col>
              </el-row>
              <el-table
                border
                max-height="600px"
                :data="form.projectProductionAccessoriesList"
                v-loading="loading"
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
                    <span v-if="['productionQty'].includes(item.prop)">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </span>
                    <span v-else>{{ column.label }}</span>
                  </template>
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'productionQty'">
                      <el-input-number
                        style="width: 98%"
                        v-model="scope.row.productionQty"
                        controls-position="right"
                        :min="1"
                        :max="scope.row.qty * 1"
                        @change="qtyChange(scope.row)"
                      />
                    </template>
                    <template v-else-if="item.prop === 'remarks'">
                      <descriptionEditDlg
                        v-model="scope.row.remarks"
                        :maxlength="200"
                      />
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

        <div class="form-card mt10">
          <el-collapse-item name="3">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PRODUCT.materialConsumption')"
              :warning="collapseWarningForContent"
            >
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <right-toolbar
                  :saveKey="saveKey"
                  :showSearchBtn="false"
                  :showRefreshBtn="false"
                  @queryTable="queryTable"
                  :columns="configColumn"
                  :columnsInit="columns"
                ></right-toolbar>
              </el-row>
              <el-table
                border
                ref="tables"
                max-height="600px"
                :row-key="rowIdKey"
                :data="form.projectProductionConsumptionList"
                lazy
                :default-expand-all="true"
                :tree-props="{
                  children: 'childProjectTemplateContentList',
                  hasChildren: 'hasChildren'
                }"
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
                  v-for="item in visibleCurColumns"
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
                    <span v-if="['consumptionQty'].includes(item.prop)">
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
                        <el-input-number
                          style="width: 98%"
                          v-model="scope.row.consumptionQty"
                          controls-position="right"
                          :precision="scope.row.includeDecimal === '1' ? 3 : 0"
                          v-thousandSplit="{ precision: scope.row.includeDecimal === '1' ? 3 : 0 }"
                          :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                          :max="maxQty(scope.row) * 1"
                          :disabled="scope.row.isDisabled === '1' || maxQty(scope.row) * 1 === 0"
                          @change="consumptionQtyChange(scope.row)"
                          v-if="scope.row.customIndex !== 1"
                        />
                      </template>
                      <template v-else-if="item.prop === 'plannedConsumptionQty'">
                        <span v-if="scope.row.customIndex !== 1">
                          {{
                            $numberStr(
                              scope.row[item.prop],
                              scope.row.includeDecimal === '1' ? 3 : 0
                            )
                          }}
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'purchaseUnitPrice'">{{
                        $numberStr(scope.row[item.prop], 2)
                      }}</template>
                      <template v-else-if="item.prop === 'remarks'">
                        <descriptionEditDlg
                          v-model="scope.row.remarks"
                          :maxlength="200"
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
              </el-table>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
    <!-- 成品名称 -->
    <selectProductTable ref="selectProductTable" @onSuccess="updateCombinationProductName" />
    <!-- 新增BOM配件 -->
    <selectProductNameTable
      ref="selectProductNameTable"
      :projectTemplateId="form.projectTemplateId"
      :outWarehouseId="form.outWarehouseId"
      @onSuccess="updateTable"
    />
    <selectPicTable ref="selectPicTable" :isSingle="true" @updatePic="updatePic" />
    <selectSalesOrderTable ref="selectSalesOrderTable" @update="updateSalesOrderNo" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import locale2 from '@/views/system/lang/index'
import selectPicTable from './components/selectPicTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'

import {
  queryProjectTemplateById,
  saveDraftProjectProduction,
  saveProjectProduction,
  withdrawProjectTemplate,
  updateUnitCost
} from '@/api/projectManagement/projectProduction'
import { queryDefaultWarehouse } from '@/api/inventoryManagement/warehouse'

import selectProductNameTable from './components/selectProductNameTable'
import selectProductTable from './components/selectProductTable'
import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import picTable from './components/picTable.vue'
import Big from 'big.js/big.mjs'

export default {
  name: 'AddFormPage',
  dicts: ['project_template_status', 'project_production_type', 'logistics_type', 'product_type'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    selectProductNameTable,
    selectProductTable,
    selectPicTable,
    selectSalesOrderTable,
    selectWarehouseTable,
    picTable
  },
  data() {
    const vm = this
    return {
      loading: false,
      saveKey: '2',
      activeNames: ['1', '2', '3', '4'],
      btnLoading: false,
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
            required: true,
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
          prop: 'projectTemplateNo',
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
          prop: 'plannedProductionQty',
          label: vm.$t('PRODUCT.plannedProductionQty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productionQty',
          label: vm.$t('PRODUCT.productionQty'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixedWidth: 200
        },
        {
          prop: 'stockInQty',
          label: vm.$t('PRODUCT.stockInQty'),
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
          fixedWidth: 200
        }
      ],
      columns1: [
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
          fixedWidth: 200
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
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          fixedWidth: 200
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
      projectProductionConsumptionListCreated: []
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
        if (this.editAuth && this.buttonAuthMsg.isCanUpdate === '1') {
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
      if (!this.checkPermi(['projectManagement:projectProduction:withdraw'])) {
        return false
      }
      let show = false
      if (this.rowId && this.buttonAuthMsg.isCanWithdraw === '1') {
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
    },
    visibleCurColumns() {
      const arr = this.columns1.filter((column) => column.visible === true)
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    minNum() {
      let num = 0
      const { subTotal, wastageAmount, adminAmount, markupAmount } = this.form
      if (subTotal) {
        num -= subTotal
      }
      if (wastageAmount) {
        num -= wastageAmount
      }
      if (adminAmount) {
        num -= adminAmount
      }
      if (markupAmount) {
        num -= markupAmount
      }

      return num
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
    // 生产配件的生产数量变化
    qtyChange(row) {
      const { bomAccessoriesId, plannedProductionQty, productionQty } = row
      let per
      const parentPer = []
      if (productionQty) {
        per = '*' + plannedProductionQty + ',/' + productionQty
        // 第一层级的除数被除数
        parentPer.push(per)
        const projectProductionConsumptionListCreated = JSON.parse(
          JSON.stringify(this.projectProductionConsumptionListCreated)
        )
        const e = projectProductionConsumptionListCreated.filter(
          (x) => bomAccessoriesId === x.bomAccessoriesId
        )[0]
        const index = this.form.projectProductionConsumptionList.findIndex(
          (x) => x.bomAccessoriesId === bomAccessoriesId
        )
        this.$set(this.form.projectProductionConsumptionList, index, { ...e })

        this.form.projectProductionConsumptionList.forEach((x) => {
          if (bomAccessoriesId === x.bomAccessoriesId) {
            this.$set(x, 'per', per)
            const count = (data) => {
              data.forEach((k) => {
                const { includeDecimal, plannedConsumptionQtyCopy } = k
                let parentPerCopy = JSON.parse(JSON.stringify(parentPer))
                // 转换第一层级的除数被除数符号
                parentPerCopy = this.symbolChange(parentPerCopy)
                parentPerCopy.push('*' + plannedConsumptionQtyCopy)
                const plannedConsumptionQty = this.perHandler(parentPerCopy, includeDecimal)
                this.$set(k, 'plannedConsumptionQty', plannedConsumptionQty)
                this.$set(k, 'consumptionQty', undefined)
                if (
                  k.childProjectTemplateContentList &&
                  k.childProjectTemplateContentList.length > 0
                ) {
                  count(k.childProjectTemplateContentList)
                }
              })
            }
            if (x.childProjectTemplateContentList && x.childProjectTemplateContentList.length > 0) {
              count(x.childProjectTemplateContentList)
            }
          }
        })
        this.projectProductionConsumptionListCreated.forEach((x) => {
          if (bomAccessoriesId === x.bomAccessoriesId) {
            this.$set(x, 'per', per)
          }
        })
      } else {
        per = undefined

        this.projectProductionConsumptionListCreated.forEach((x) => {
          if (bomAccessoriesId === x.bomAccessoriesId) {
            this.$set(x, 'per', undefined)
          }
        })
        const projectProductionConsumptionListCreated = JSON.parse(
          JSON.stringify(this.projectProductionConsumptionListCreated)
        )
        const e = projectProductionConsumptionListCreated.filter(
          (x) => bomAccessoriesId === x.bomAccessoriesId
        )[0]
        const index = this.form.projectProductionConsumptionList.findIndex(
          (x) => x.bomAccessoriesId === bomAccessoriesId
        )
        this.$set(this.form.projectProductionConsumptionList, index, { ...e })
      }
    },
    perHandler(data, includeDecimal) {
      const list = data
      console.log(list, '===')
      let numList = []
      let denList = []
      list.forEach((x) => {
        const arr = x.split(',')
        arr.forEach((m) => {
          if (m.indexOf('/') === -1) {
            numList.push(m)
          } else {
            denList.push(m)
          }
        })
      })
      console.log(numList, denList, '===')
      numList = numList.join(',').replace(/\*/g, '').split(',')
      denList = denList.join(',').replace(/\//g, '').split(',')
      let num = 1
      let den = 1
      numList.forEach((x) => {
        num = num * x
      })
      denList.forEach((x) => {
        den = den * x
      })
      return this.bigValue(num / den, includeDecimal)
    },
    symbolChange(data) {
      const list = JSON.parse(JSON.stringify(data))
      const listCopy = list.map((k) => {
        const arr = k.split(',')
        const arrCopy = arr.map((m) => {
          let str = m
          if (str.indexOf('/') !== -1) {
            str = str.replace('/', '*')
          } else if (str.indexOf('*') !== -1) {
            str = str.replace('*', '/')
          }
          return str
        })
        console.log(arrCopy, '===')
        k = arrCopy.join(',')
        return k
      })
      console.log(listCopy, '===')
      return listCopy
    },
    // 物料消耗的消耗数量变化
    consumptionQtyChange(row) {
      // 切割得到父级层级id
      const { fullId } = row
      const fullIds = fullId.split('-')
      const parentPer = []
      let parentIndex = 0
      let per
      let list = this.form.projectProductionConsumptionList
      list = list.filter((x) => x.fullId === fullIds[0])
      const isReplace = (data) => {
        data.forEach((x) => {
          if (x.bomAccessoriesId === fullIds[parentIndex]) {
            if (x.plannedConsumptionQtyCopy && x.consumptionQty) {
              per = '*' + x.plannedConsumptionQtyCopy + ',/' + x.consumptionQty
              if (parentPer.length > 0) {
                this.symbolChange(parentPer)
                const parentPerListCopy = this.symbolChange(parentPer)
                console.log(parentPerListCopy, '===')
                per += ',' + parentPerListCopy.join(',')
              }
              this.$set(x, 'per', per)
            } else if (parentIndex !== 0) {
              this.$set(x, 'per', undefined)
            }
            if (x.per) {
              parentPer.push(x.per)
            }
            if (parentIndex === fullIds.length - 1) {
              const { childProjectTemplateContentList } = x
              console.log(parentPer, '===')
              const childCompute = (child) => {
                child.forEach((childItem) => {
                  console.log(childItem, '===')
                  const { includeDecimal } = childItem
                  let parentPerCopy = JSON.parse(JSON.stringify(parentPer))
                  parentPerCopy = this.symbolChange(parentPerCopy)
                  if (parentPerCopy.length > 0) {
                    parentPerCopy.push('*' + childItem.plannedConsumptionQtyCopy)
                    const plannedConsumptionQty = this.perHandler(parentPerCopy, includeDecimal)
                    this.$set(childItem, 'plannedConsumptionQty', plannedConsumptionQty)
                  } else {
                    this.$set(
                      childItem,
                      'plannedConsumptionQty',
                      childItem.plannedConsumptionQtyCopy
                    )
                  }
                  if (childItem.consumptionQty) {
                    let qty = 0
                    if (!childItem.availableQty) {
                      qty += 0
                    } else {
                      qty += childItem.availableQty * 1000
                    }
                    if (!childItem.reservedQty) {
                      qty += 0
                    } else {
                      qty += childItem.reservedQty * 1000
                    }
                    qty = qty / 1000
                    qty =
                      childItem.plannedConsumptionQty * 1 > qty * 1
                        ? qty * 1
                        : childItem.plannedConsumptionQty * 1
                    if (childItem.consumptionQty > qty) {
                      this.$set(childItem, 'consumptionQty', qty)
                    }
                  }
                  if (
                    childItem.childProjectTemplateContentList &&
                    childItem.childProjectTemplateContentList.length > 0
                  ) {
                    childCompute(childItem.childProjectTemplateContentList)
                  }
                })
              }
              if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
                childCompute(childProjectTemplateContentList)
              }
              return
            }
            parentIndex++
          }
          if (x.childProjectTemplateContentList && x.childProjectTemplateContentList.length > 0) {
            isReplace(x.childProjectTemplateContentList)
          }
        })
      }
      isReplace(list)
      this.tableListDisabled()
    },
    // 消耗数量禁用
    tableListDisabled() {
      const isDisabled = (data, type = undefined) => {
        data.forEach((x) => {
          this.$set(x, 'isDisabled', type)
          if (type) {
            this.$set(x, 'consumptionQty', undefined)
          }
          const { plannedConsumptionQty, consumptionQty, childProjectTemplateContentList } = x
          if (
            consumptionQty &&
            plannedConsumptionQty &&
            consumptionQty * 1 === plannedConsumptionQty * 1
          ) {
            this.$set(x, 'childDisabled', '1')
          } else {
            this.$set(x, 'childDisabled', undefined)
          }
          if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
            isDisabled(childProjectTemplateContentList, x.childDisabled || x.isDisabled)
          }
        })
      }
      isDisabled(this.form.projectProductionConsumptionList)
    },
    handleAdd() {
      this.reset()
      // this.queryDefaultWarehouse()
    },
    openSalesOrderTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    updateSalesOrderNo(row) {
      // this.$set(this.form, 'salesOrderId', row.salesOrderId)
      const { projectTemplateId, ...params } = row
      this.form = Object.assign(this.form, { ...params })
      this.$set(this.form, 'projectTemplateId', projectTemplateId)
      const { warehouseId, warehouseName } = row || {}
      if (warehouseId) {
        this.$set(this.form, 'inWarehouseName', warehouseName)
        this.$set(this.form, 'inWarehouseId', warehouseId)
        this.$set(this.form, 'outWarehouseName', warehouseName)
        this.$set(this.form, 'outWarehouseId', warehouseId)
      }
      this.form.projectProductionAccessoriesList = []
      this.form.projectProductionConsumptionList = []
      // this.queryDefaultWarehouse()
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
        this.form.projectProductionAccessoriesList = []
      }
    },
    salesOrderNoClear() {
      this.$set(this.form, 'salesOrderId', undefined)
      this.$set(this.form, 'salesOrderNo', undefined)
      this.$set(this.form, 'projectName', undefined)
      this.warehouseToClear()
      this.warehouseFromClear()
      // this.form.projectProductionAccessoriesList = []
      // this.form.projectProductionConsumptionList = []
    },
    warehouseFromClear() {
      this.$set(this.form, 'outWarehouseName', undefined)
      this.$set(this.form, 'outWarehouseId', undefined)
      this.form.projectProductionAccessoriesList = []
      this.form.projectProductionConsumptionList = []
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
    // 打开pic弹窗
    openPicTable() {
      this.$refs.selectPicTable.handleOpen()
    },
    updatePic(row) {
      const { nickName, userId, mobilePhone, mobileCode, mobileNum } = row
      this.$set(this.form, 'picUserBy', nickName)
      this.$set(this.form, 'picUserId', userId)
      this.$set(this.form, 'mobilePhone', mobilePhone)
      this.$set(this.form, 'mobileCode', mobileCode)
      this.$set(this.form, 'mobileNum', mobileNum)
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryProjectTemplateById({ projectTemplateId: rowId }).then((res) => {
        const {
          projectProductionAccessoriesList,
          projectProductionConsumptionList,
          buttonAuthMsg,
          ...params
        } = res.data
        this.form = Object.assign(this.form, { ...params })
        this.form.projectProductionAccessoriesList = projectProductionAccessoriesList
        this.form.projectProductionConsumptionList = this.traverseTree(
          projectProductionAccessoriesList
        )
        this.projectProductionConsumptionListCreated = JSON.parse(
          JSON.stringify(this.form.projectProductionConsumptionList)
        )
        this.buttonAuthMsg = buttonAuthMsg || {}
        this.initContent = this.form.projectMsg || ''
      })
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'cell-class'
      }
    },
    handleWithdraw() {
      this.btnLoading = true
      const vm = this
      const confirm = vm.$t('PRODUCT.withdrawConfirm').replace('$1', this.form.projectTemplateNo)
      this.$modal
        .confirm(confirm)
        .then(() => {
          withdrawProjectTemplate({
            projectTemplateId: vm.rowId
          })
            .then((res) => {
              if (res.code === 200) {
                vm.$message.success(
                  vm.$t('PRODUCT.withdrawSuccess').replace('$1', this.form.projectTemplateNo)
                )
                this.cancel()
              }
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    handleUpdateCost() {
      this.btnLoading = true
      const vm = this
      const confirm = vm.$t('PRODUCT.updateCostSubmit')
      this.$modal
        .confirm(confirm)
        .then(() => {
          updateUnitCost({
            projectTemplateId: vm.rowId
          })
            .then((res) => {
              if (res.code === 200) {
                vm.$message.success(vm.$t('PRODUCT.updateCostSuccess'))
                this.cancel()
              }
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    handleClick() {},

    selectable(row, rowIndex) {
      if (row.isCanSelectUse !== '1' && row.isCanSelectReQuote !== '1') return false
      return true // 不禁用
    },
    openProductTable() {
      this.$refs.selectProductTable.handleAdd()
    },
    productClear() {
      this.$set(this.createForm, 'combinationProductName', undefined)
      this.$set(this.createForm, 'productId', undefined)
    },
    updateCombinationProductName(row) {
      const { productName, productId } = row
      this.$set(this.createForm, 'combinationProductName', productName)
      this.$set(this.createForm, 'productId', productId)
    },
    reset() {
      this.form = {
        salesOrderNo: undefined,
        associatedProjectName: undefined,
        productionNo: undefined,
        picUserBy: undefined,
        projectProductionType: '1',
        remarks: undefined,
        logisticsType: '3',
        projectProductionPersonList: [],
        projectProductionAccessoriesList: [],
        projectProductionConsumptionList: []
      }
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
      // const alreadySelectIdList = this.form.projectProductionAccessoriesList.map(
      //   (item) => item.productId
      // )
      const tableList = JSON.parse(JSON.stringify(this.form.projectProductionAccessoriesList))
      this.$refs.selectProductNameTable.handleOpen(tableList)
    },
    updateTable(list) {
      // if (list.length > 0) {
      // this.loading = true
      const rows = JSON.parse(JSON.stringify(list))
      // this.form.projectProductionAccessoriesList.push(...rows)
      // this.form.projectProductionConsumptionList.push(...rows)
      this.form.projectProductionAccessoriesList = rows
      this.form.projectProductionConsumptionList = rows
      this.form.projectProductionConsumptionList = this.traverseTree(
        this.form.projectProductionConsumptionList
      )
      this.projectProductionConsumptionListCreated = JSON.parse(
        JSON.stringify(this.form.projectProductionConsumptionList)
      )
      // }
    },
    traverseTree(nodes, parentId = '', index = 0) {
      index++
      return nodes.map((node) => {
        // 使用父级ID和当前节点ID拼接生成fullId
        let fullId = parentId ? `${parentId}-${node.bomAccessoriesId}` : node.bomAccessoriesId
        if (!parentId && node.bomAccessoriesType === '2') {
          fullId = +new Date()
        }
        // 如果当前节点有子节点，递归调用traverseTree处理子节点
        const childProjectTemplateContentList = node.childProjectTemplateContentList
          ? this.traverseTree(node.childProjectTemplateContentList, fullId, index)
          : []
        // 返回新的节点对象，包含原有属性及新的fullId属性
        return {
          ...node,
          fullId,
          customIndex: index,
          plannedConsumptionQtyCopy: node.plannedConsumptionQty,
          childProjectTemplateContentList: childProjectTemplateContentList.length
            ? childProjectTemplateContentList
            : undefined // 移除空数组的children属性
        }
      })
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/projectManagement/projectProduction' })
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.form.projectProductionAccessoriesList.splice(index, 1)
        this.form.projectProductionConsumptionList = this.traverseTree(
          this.form.projectProductionAccessoriesList
        )
        this.projectProductionConsumptionListCreated = JSON.parse(
          JSON.stringify(this.form.projectProductionConsumptionList)
        )
      })
    },

    toggleCheckedChildrens(selection, item, isChecked) {
      const _toggleCheckedChildrens = (data) => {
        // eslint-disable-next-line array-callback-return
        data.find((element) => {
          this.$refs.tables.toggleRowSelection(element, isChecked)
          if (isChecked && !selection.find((item) => item.fullId === element.fullId)) {
            selection.push(element)
          } else if (!isChecked && selection.find((item) => item.fullId === element.fullId)) {
            for (let i = selection.length - 1; i >= 0; i--) {
              if (selection[i].fullId === element.fullId) {
                selection.splice(i, 1)
                break
              }
            }
          }
          _toggleCheckedChildrens(element.child || [])
        })
      }
      _toggleCheckedChildrens(item.child || [])
    },
    async handleSaveDraft() {
      this.$refs.form.clearValidate()

      let isError = false
      this.$refs.form.validateField(['salesOrderNo'], (err) => {
        if (err) {
          isError = true
        }
      })
      if (isError) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      this.collapseWarningForBasicInfo = false
      const param = JSON.parse(JSON.stringify(this.form))

      this.btnLoading = true
      this.$modal
        .confirm(this.$t('PRODUCT.projectProductionSave'))
        .then(() => {
          saveDraftProjectProduction(param)
            .then((res) => {
              const { projectProductionNo } = res.data || {}
              this.$modal.msgSuccess(
                this.$t('PRODUCT.projectProductionSaveSuccess').replace('$1', projectProductionNo)
              )
              this.cancel()
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    // 消耗数量校验
    consumptionQtyValid() {
      let flag = false
      this.form.projectProductionConsumptionList.forEach((x) => {
        const consumptionQtyValue = (tree, callback) => {
          for (let i = 0; i < tree.length; i++) {
            if (flag) return
            const node = tree[i]
            const {
              plannedConsumptionQty,
              consumptionQty,
              childProjectTemplateContentList,
              isDisabled
            } = node
            if (isDisabled !== '1') {
              if (!consumptionQty) {
                if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
                  const isConsumptionQty = childProjectTemplateContentList.some(
                    (x) => x.consumptionQty
                  )
                  if (isConsumptionQty) {
                    consumptionQtyValue(childProjectTemplateContentList, callback)
                  } else {
                    callback(node)
                    return
                  }
                } else {
                  callback(node)
                  return
                }
                return
              }
              if (plannedConsumptionQty * 1 !== consumptionQty * 1) {
                if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
                  consumptionQtyValue(childProjectTemplateContentList, callback)
                } else {
                  callback(node)
                  return
                }
                return
              }
            }

            if (childProjectTemplateContentList && childProjectTemplateContentList.length > 0) {
              consumptionQtyValue(childProjectTemplateContentList, callback)
            }
          }
        }
        if (x.childProjectTemplateContentList && x.childProjectTemplateContentList.length > 0) {
          consumptionQtyValue(x.childProjectTemplateContentList, (node) => {
            flag = true
            this.collapseWarningForContent = true
            this.$modal.msgError(
              this.$t('PRODUCT.consumptionQtyMax').replace('$1', node.productName)
            )
          })
        }
      })

      return flag
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

      if (this.form.projectProductionPersonList.length <= 0) {
        this.$modal.msgError(this.$t('PRODUCT.productionPersonnelTableEmpty'))
        this.collapseWarningForProductionPersonnel = true
        return
      }
      this.collapseWarningForProductionPersonnel = false

      if (this.form.projectProductionAccessoriesList.length <= 0) {
        this.$modal.msgError(this.$t('PRODUCT.productionAccessoriesTableEmpty'))
        this.collapseWarningForProductInfo = true
        return
      }
      const productionQty = this.form.projectProductionAccessoriesList.some((x) => !x.productionQty)
      if (productionQty) {
        this.collapseWarningForProductInfo = true
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productionQty'))
        )
        return
      }
      this.collapseWarningForProductInfo = false

      const flag = this.consumptionQtyValid()
      if (flag) return

      this.collapseWarningForContent = false
      const param = JSON.parse(JSON.stringify(this.form))
      this.btnLoading = true
      this.$modal
        .confirm(this.$t('PRODUCT.projectProductionSubmit'))
        .then(() => {
          saveProjectProduction(param)
            .then((res) => {
              const { projectProductionNo } = res.data || {}
              this.$modal.msgSuccess(
                this.$t('PRODUCT.projectProductionSubmitSuccess').replace('$1', projectProductionNo)
              )
              this.cancel()
              this.btnLoading = false
            })
            .catch(() => {
              this.btnLoading = false
            })
        })
        .catch(() => {
          this.btnLoading = false
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
