<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button @click="handleAddBtn" type="primary" icon="el-icon-plus" size="mini">{{
          $t('uiBtn.add')
        }}</el-button>
      </el-col>
      <el-col :span="1.5" v-if="!comDisFrom && !linkPR && addAdhocEntryAuth">
        <el-button @click="handleSddAdhocEntry" type="primary" icon="el-icon-plus" size="mini">{{
          $t('menu.addAdhocEntry')
        }}</el-button>
      </el-col>
      <!-- <el-col :span="1.5" v-if="!comDisFrom && !linkPR">
        <el-tooltip
          :disabled="rfqVendorList.length > 0"
          :content="$t('PURCHASE.selectSupplierToAdd')"
          placement="top"
        >
          <el-button
            @click="handleAddBtn('supplier')"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :disabled="rfqVendorList.length <= 0"
            >{{ $t('PURCHASE.addSupplierProduct') }}</el-button
          >
        </el-tooltip>
      </el-col> -->
      <el-col :span="1.5" v-if="false">
        <el-button
          :disabled="selected.length <= 0"
          @click="handleDelete"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          >{{ $t('uiBtn.delete') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="!comDisFrom && !linkPR">
        <el-button @click="handleImport" type="primary" icon="el-icon-upload2" size="mini">{{
          $t('uiBtn.import')
        }}</el-button>
      </el-col>

      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configCurColumn"
        :columnsInit="columns"
      >
      </right-toolbar>
      <span v-if="tableList.length > 0" class="fr mr20" style="line-height: 28px"
        >{{ $t('PURCHASE.totalProductLines') }} : {{ tableList.length }}
      </span>

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
      class="w100"
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      @row-click="$emit('rowClick', $event)"
      @sort-change="handleSortChange"
      :row-key="rowIdKey"
      :tree-props="{ children: 'tableChildList', hasChildren: 'hasChildren' }"
      :default-expand-all="false"
      v-table-tab
    >
      <el-table-column
        v-if="false"
        type="selection"
        key="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        v-if="!isShowDocumentNo"
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
        key="documentNo"
        prop="documentNo"
        :label="$t('PURCHASE.DocNo')"
        width="300"
        fixed="left"
        align="left"
        sortable="custom"
        v-if="isShowDocumentNo"
      >
        <template slot-scope="scope">
          <span
            v-if="
              getTableChildList(scope.row).length <= 0 && scope.row.levelNum === 1 && existLevel2
            "
            style="display: inline-block; width: 23px"
          ></span>
          <span
            v-if="getTableChildList(scope.row).length <= 0 && scope.row.levelNum === 2"
            style="display: inline-block; width: 4px"
          ></span>
          <span
            style="
              display: inline-block;
              margin-right: 4px;
              font-size: 12px;
              flex-shrink: 0;
              /* font-weight: bold; */
              /* color: #409eff; */
            "
            :class="[`level-${scope.row.levelNum}`, scope.row.isTopItem ? 'topItem' : '']"
            v-if="scope.row.productId || scope.row._isStockRow"
            >{{ scope.row.stage + '. ' }}</span
          >
          <span v-if="scope.row._isStockRow">{{ $t('PURCHASE.excessStock') }}</span>
          <span
            v-else-if="(scope.row.documentList || []).length >= 1"
            @mouseenter.stop="showPop($event, scope.row, 'documentNo')"
            @mouseleave="hidePop($event, scope.row)"
            class="primary-link ellipsis-text"
          >
            {{ scope.row.documentNo }}
          </span>
          <span
            v-else
            :class="{ 'primary-link ellipsis-text': documentTypeGetAuth(scope.row.documentType) }"
            @click="nav(scope.row, 'documentNo')"
            >{{ scope.row.documentNo }}</span
          >
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
            v-if="['productName', 'purchaseQty', 'purchaseUom', 'deliveryDate'].includes(item.prop)"
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName'">
            <div class="flexSb">
              <div class="flow1">
                <template
                  v-if="
                    scope.row.isAdhocEntry === '1' &&
                    !comDisFrom &&
                    !scope.row.productId &&
                    !scope.row._isRfqChild
                  "
                >
                  <el-input
                    style="width: 98%"
                    :title="scope.row.productName"
                    v-model="scope.row.productName"
                    :maxlength="200"
                    @input="
                      scope.row[item.prop + 'Error'] = false
                      scope.row['ROW-ERROR'] = false
                    "
                  />
                  <TablePropError v-if="scope.row[item.prop + 'Error']" />
                </template>

                <div class="flow1" :title="scope.row[item.prop]" v-else>
                  {{ scope.row[item.prop] }}
                </div>
              </div>

              <!-- 去掉重复询价提示语 scope.row.checkResult === '0' -->
              <div class="fs-0" v-if="scope.row.checkResult === '99999999999999'">
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <div v-if="scope.row.alreadyExistsOtherRfqProductList.length === 1">
                      {{
                        $t('PURCHASE.singleRepetition')
                          .replace('$1', scope.row.alreadyExistsOtherRfqProductList[0].productName)
                          .replace('$2', scope.row.alreadyExistsOtherRfqProductList[0].rfqNo)
                          .replace('$3', scope.row.alreadyExistsOtherRfqProductList[0].createdBy)
                      }}
                    </div>
                    <div v-if="scope.row.alreadyExistsOtherRfqProductList.length > 1">
                      <div style="font-weight: 700">{{ $t('PURCHASE.multipleRepetitions') }}</div>
                      <ul class="mt10">
                        <li
                          v-for="(item, index) in scope.row.alreadyExistsOtherRfqProductList"
                          :key="index"
                        >
                          {{
                            $t('PURCHASE.multipleRepetitionsProduct')
                              .replace('$1', item.rfqNo)
                              .replace('$2', item.createdBy)
                          }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- <i class="el-icon-warning ml10"></i> -->
                  <svg-icon icon-class="warning" class="ml10" style="height: 20px; width: 20px" />
                </el-tooltip>
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'externalPartNo'">
            <!-- <el-autocomplete
              style="width: 98%"
              v-model="scope.row.externalPartNo"
              :fetch-suggestions="
                (queryString, cb) => queryPositionSugg(queryString, cb, scope.row)
              "
              placeholder
              :clearable="false"
              :maxlength="200"
              v-if="!comDisFrom"
            /> -->
            <!-- <el-select
              style="width: 98%"
              v-model="scope.row.externalPartNoListJson"
              placeholder=""
              multiple
              collapse-tags
              class="log-msg-ellipsis"
              v-if="!comDisFrom && (scope.row.externalPartNoList || []).length > 0"
            >
              <el-option
                v-for="item in scope.row.externalPartNoList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select> -->
            <span>{{ showExternalPartNo(scope.row) }}</span>
          </template>
          <template
            v-else-if="
              item.prop === 'internalPartNo' &&
              scope.row.isCustomProduct !== '1' &&
              scope.row.isTemp !== '1'
            "
          >
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'documentNo'">
            <span v-if="scope.row._isStockRow">{{ $t('PURCHASE.excessStock') }}</span>
            <span
              v-else-if="(scope.row.documentList || []).length > 1"
              @mouseenter.stop="showPop($event, scope.row, 'documentNo')"
              @mouseleave="hidePop($event, scope.row)"
              class="primary-link"
            >
              {{ scope.row[item.prop] }}
            </span>
            <span
              v-else
              :class="{ 'primary-link': documentTypeGetAuth(scope.row.documentType) }"
              @click="nav(scope.row, 'documentNo')"
              >{{ scope.row.documentNo }}</span
            >
          </template>
          <template v-else-if="item.prop === 'description'">
            <descriptionEditDlg
              v-if="!comDisFrom && !scope.row._isRfqChild"
              v-model="scope.row.description"
              :maxlength="7000"
            />
            <template v-else-if="!scope.row._isRfqChild"
              ><DescriptionToolTipShow :showStr="scope.row[item.prop]"
            /></template>
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            <template
              v-if="!comDisFrom && (scope.row.isCustomProduct !== '1' || scope.row._isRfqChild)"
            >
              <el-input-number
                style="width: 98%"
                v-model="scope.row.purchaseQty"
                controls-position="right"
                v-thousandSplit="{ precision: scope.row.decimalNum, keepDec: false }"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999"
                @change="changeAdhocEntryQty(scope.$index, scope.row)"
                v-if="scope.row.isAdhocEntry === '1'"
                :key="'qty11' + scope.row.decimalNum"
              />
              <el-input-number
                v-else
                style="width: 98%"
                v-model="scope.row.purchaseQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999"
                @change="changePurchaseQty(scope.$index, scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{
              $numberStr(scope.row[item.prop], scope.row.decimalNum, scope.row.isAdhocEntry !== '1')
            }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <template
              v-if="
                scope.row.isAdhocEntry === '1' &&
                !comDisFrom &&
                !scope.row.productId &&
                !scope.row._isRfqChild
              "
            >
              <el-select
                style="width: 98%"
                v-model="scope.row.purchaseUom"
                :title="showUomLabel(scope.row.purchaseUom)"
                placeholder=""
                filterable
                @change="purchaseUomChange(scope.row)"
              >
                <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <!-- <el-select
              style="width: 98%"
              v-model="scope.row.purchaseUom"
              placeholder=""
              v-else-if="scope.row.productType === '2' && !linkPR && !comDisFrom"
            >
              <el-option
                v-for="item in dict.type.valuation_unit"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
            <span v-else :title="showUomLabel(scope.row[item.prop])">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else-if="item.prop === 'deliveryDate'">
            <template v-if="!comDisFrom && !scope.row._isRfqChild">
              <el-date-picker
                v-model="scope.row.deliveryDate"
                :picker-options="timeDatePickerOptions"
                @change="changeDeliveryDate(scope.$index, scope.row)"
                :format="fmtForYmd"
                value-format="timestamp"
                style="width: 98%"
                placeholder=""
                clearable
              ></el-date-picker>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else-if="!scope.row._isRfqChild">{{
              parseTime(scope.row[item.prop], fmtForYmd)
            }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-if="!scope.row._isRfqChild"
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="!(!comDisFrom && !scope.row._isRfqChild)"
            />
          </template>
          <template v-else-if="item.prop === 'productType'">
            <!-- <span v-if="scope.row.productType === '1'">{{ $t('PURCHASE.product') }}</span> -->
            <!-- <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
            <el-select
              style="width: 98%"
              v-model="scope.row.productType"
              placeholder=""
              filterable
              v-if="
                !comDisFrom &&
                scope.row.isAdhocEntry === '1' &&
                !scope.row.documentNo &&
                !scope.row._isRfqChild
              "
            >
              <el-option
                v-for="item in (dict.type.product_type || []).filter(
                  (i) => ['1', '2'].indexOf(i.value) !== -1
                )"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span v-else>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="
          !comDisFrom ||
          tableList.find(
            (x) => x.productId && x.isCustomProduct !== '1' && purchaseQuotationRecordAuth
          )
        "
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <div style="width: 30px">
              <!-- !linkPR && !comDisFrom -->
              <i
                v-if="!comDisFrom"
                class="el-icon el-icon-delete pointer mr10"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click.stop="handleDelRow(scope.$index, scope.row)"
              ></i>
            </div>
            <div style="width: 20px">
              <svg-icon
                class="primary-pointer"
                icon-class="line"
                style="font-size: 20px"
                v-if="
                  scope.row.productId &&
                  purchaseQuotationRecordAuth &&
                  scope.row.isProjectTempProduct !== '1' &&
                  scope.row.isCustomProduct !== '1' &&
                  !scope.row._isStockRow
                "
                @click.stop="handleViewHistoryChart(scope.row)"
              />
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <selectProductTable
      ref="selectProductTable"
      :rfqVendorList="rfqVendorList"
      :showOtherProduct="!comDisFrom && !linkPR"
      :showPendProduct="!comDisFrom"
      @onSuccess="updateTable"
      @updateTable1="updateTable1"
      @updateTableForPendRFQ="updateTableForPendRFQ"
      :rfqId="formData.rfqId"
    />
    <importExcelDlg ref="importExcelDlg" @onSuccess="importSuccess" />

    <historyQuotationRecordsDlg ref="historyQuotationRecordsDlg" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="clickItem" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './components/selectProductTable'

import historyQuotationRecordsDlg from '@/views/purchaseManagement/purchaseQuotation/components/historyQuotationRecordsDlg.vue'
import Sortable from 'sortablejs'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import { getSystemSetup } from '@/api/system/systemSetting'
import importExcelDlg from './components/importExcelDlg.vue'
import { queryCanSelectWarehouseListNoPage } from '@/api/purchaseManagement/requestForQuotation'
export default {
  dicts: ['valuation_unit', 'product_type'],
  mixins: [pageMixin],
  components: {
    selectProductTable,
    historyQuotationRecordsDlg,
    ToolTipShowListForFN,
    importExcelDlg
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    linkPR: {
      type: Boolean,
      default: false
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    rfqProductList: {
      type: Array,
      default() {
        return []
      }
    },
    rfqVendorList: {
      type: Array,
      default() {
        return []
      }
    },

    allUomList: {
      type: Array,
      default() {
        return []
      }
    },
    curClickProductRow: {
      type: Object,
      default() {
        return {}
      }
    },
    dropShipping: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    rfqProductList: {
      immediate: true,
      handler: function (selected) {
        this.createTableList = this.prepareRfqTree(JSON.parse(JSON.stringify(this.rfqProductList)))
        // this.tableList = JSON.parse(JSON.stringify(this.rfqProductList))
        this.tableList = this.createTableList
        this.changeTableList()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '35',
      savePath: 'purchaseMTable',
      columns: [
        /* {
          prop: 'productType',
          label: vm.$t('PURCHASE.productClass'),
          visible: true,
          minWidth: 120,
          tooltip: true,
          fixed: true,
          sortable: 'custom'
        }, */
        /* {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: 'left',
          sortable: 'custom'
        }, */
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 160,
          fixedWidth: vm.comDisFrom ? undefined : 160,
          required: true,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          fixedWidth: vm.comDisFrom ? undefined : 180,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 140,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 120,
          tooltip: true,
          required: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          visible: true,
          minWidth: 120,
          tooltip: true,
          required: true,
          sortable: 'custom'
        },

        {
          prop: 'deliveryDate',
          label: vm.$t('PURCHASE.requestedReceiptDate'),
          visible: true,
          colMinWidth: 160,
          tooltip: true,
          required: true,
          sortable: 'custom'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          fixedWidth: vm.comDisFrom ? undefined : 200,
          tooltip: false,
          sortable: 'custom'
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 90 * 24 * 60 * 60 * 1000
        }
      },
      tableList: [],
      selected: [],
      sortableDom: undefined,
      // rowIdKey: 'businessPartnerId',
      rowIdKey: '_rfqRowId',
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
      createTableList: [],
      rfqQtyBatchInput: undefined
    }
  },
  computed: {
    existLevel2() {
      const item = this.tableList.find((item) => this.getTableChildList(item).length > 0)
      return !!item
    },
    purchaseQuotationRecordAuth() {
      return this.checkPermi(['purchaseManagement:requestForQuotation:purchaseQuotationRecord'])
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    addAdhocEntryAuth() {
      return this.checkPermi(['purchaseManagement:requestForQuotation:addAdhocEntry'])
    },
    isShowDocumentNo() {
      return this.tableList.find(
        (x) => x.documentNo || (x.assignList || []).some((child) => child.documentNo)
      )
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      const flag = this.tableList.find((x) => x.costProjectCode)
      if (!flag) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      }
      const flag1 = this.tableList.find(
        (x) => x.documentNo || (x.assignList || []).some((child) => child.documentNo)
      )
      if (!flag1) {
        arr = arr.filter((x) => x.prop !== 'documentNo')
      }

      return arr
    },
    PRAuth() {
      return this.checkPermi(['purchaseManagement:purchaseRequisition:list'])
    },
    salesInquiryAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:list'])
    },
    SQAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:list'])
    },
    projectTemplateAuth() {
      return this.checkPermi(['projectManagement:projectTemplate:list'])
    },
    configCurColumn() {
      let arr = [...this.columns]
      arr = arr.filter((x) => x.prop !== 'documentNo')
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
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
    }
  },
  created() {
    this._stableCounter = 0
    this.getSystemSetup()
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    // 将子级行和备货行数量转换为可计算的数值，非法值按 0 处理。
    toQuantity(value) {
      const quantity = Number(value)
      return Number.isFinite(quantity) ? quantity : 0
    },
    // 兼容获取父级产品 ID，用于生成树形行唯一标识。
    getProductId(row = {}) {
      if (row.productId !== undefined && row.productId !== null) return row.productId
      return row.productID
    },
    // 兼容获取子级行来源单据 ID。
    getDocumentId(row = {}) {
      if (row.documentId !== undefined && row.documentId !== null) return row.documentId
      return row.documentID
    },
    // 生成父级行唯一标识，无产品 ID 时使用临时标识兜底。
    getParentRowId(row, index) {
      const productId = this.getProductId(row)
      if (productId !== undefined && productId !== null && productId !== '') {
        return String(productId)
      }
      return String(row.customId || row.productMainId || `adhoc-${index}`)
    },
    // 根据产品和来源单据生成来源子级行唯一标识。
    getSourceRowId(parent, child, index) {
      const productId = this.getProductId(parent)
      const documentId = this.getDocumentId(child)
      if (
        productId !== undefined &&
        productId !== null &&
        documentId !== undefined &&
        documentId !== null &&
        documentId !== ''
      ) {
        // 约定：来源子行唯一 ID = 产品 ID + 来源单据 ID
        return `${productId}${documentId}`
      }
      return `${this.getParentRowId(parent, index)}${child.documentNo || `child-${index}`}`
    },
    // 生成当前产品备货行的唯一标识。
    getStockRowId(parent, index) {
      // 约定：备货行唯一 ID = 产品 ID + beihuo
      return `${this.getParentRowId(parent, index)}beihuo`
    },
    // 获取来源子级行的 PR 原始数量，作为可分配数量上限。
    getPrQuantity(row = {}) {
      // 编辑回显以后端返回的 PR 原始数量为准，避免将已修改的采购数量当成 PR 上限。
      if (row.documentQty !== undefined && row.documentQty !== null && row.documentQty !== '') {
        return row.documentQty
      }
      if (
        row._prPurchaseQty !== undefined &&
        row._prPurchaseQty !== null &&
        row._prPurchaseQty !== ''
      ) {
        return row._prPurchaseQty
      }
      return row.purchaseQty
    },
    // 判断子级行是否为备货行，并兼容旧数据标识。
    isStockRow(row = {}, parent, index) {
      if (row._isStockRow || row.isExcessStock === '1') return true
      if (parent && row[this.rowIdKey] === this.getStockRowId(parent, index)) return true
      return !this.getDocumentId(row) && !row.documentNo
    },
    // 判断父级行是否需要展示来源子级行或备货行。
    shouldShowAssignRows(row = {}) {
      const assignList = Array.isArray(row.assignList) ? row.assignList : []
      return assignList.length > 1 || assignList.some((child) => child._isStockRow)
    },
    // 获取供树形表格展示的子级行列表。
    getTableChildList(row = {}) {
      return row.tableChildList || []
    },
    // 根据父级行创建或规范化备货行数据。
    createStockRow(parent, quantity, oldStockRow, index) {
      const stockRow = oldStockRow || { ...parent }
      delete stockRow.assignList
      delete stockRow._prPurchaseQty
      delete stockRow.costProjectName
      delete stockRow.costProjectId
      delete stockRow.costProjectCode

      this.$set(stockRow, 'stage', `${parent.stage}.${(parent.assignList || []).length + 1}`)
      this.$set(stockRow, 'levelNum', 2)
      this.$set(stockRow, '_isRfqChild', true)
      this.$set(stockRow, '_isStockRow', true)
      this.$set(stockRow, 'isExcessStock', '1')
      this.$set(stockRow, this.rowIdKey, this.getStockRowId(parent, index))

      this.$set(stockRow, 'purchaseQty', quantity)
      this.$set(stockRow, 'decimalNum', parent.decimalNum)
      this.$set(stockRow, 'includeDecimal', parent.includeDecimal)
      this.$set(stockRow, 'documentNo', undefined)
      this.$set(stockRow, 'documentId', undefined)
      this.$set(stockRow, 'documentID', undefined)
      this.$set(stockRow, 'documentType', undefined)
      this.$set(stockRow, 'documentList', [])
      this.$set(stockRow, 'purchaseRequisiteId', undefined)
      this.$set(stockRow, 'purchaseRequisiteDetailId', undefined)
      this.$set(stockRow, 'oldRfqDetailIdList', [])
      return stockRow
    },
    // 将询价产品及分配明细整理为父子树形行数据。
    prepareRfqTree(list = []) {
      return list.map((parent, parentIndex) => {
        parent.stage = parentIndex + 1
        parent.levelNum = 1
        this.$set(parent, this.rowIdKey, this.getParentRowId(parent, parentIndex))
        this.$set(parent, '_isRfqChild', false)
        this.$set(parent, '_isStockRow', false)

        Object.defineProperty(parent, 'tableChildList', {
          configurable: true,
          enumerable: false,
          get: () => (this.shouldShowAssignRows(parent) ? parent.assignList || [] : [])
        })

        const assignList = Array.isArray(parent.assignList) ? parent.assignList : []
        if (!assignList.length) return parent

        const sourceList = []

        assignList.forEach((child, childIndex) => {
          child.stage = `${parent.stage}.${childIndex + 1}`
          if (childIndex === 0) {
            child.isTopItem = true
          }
          child.levelNum = 2
          if (this.isStockRow(child, parent, parentIndex)) {
            sourceList.push(this.createStockRow(parent, child.purchaseQty, child, parentIndex))
            return
          }

          const prQuantity = this.getPrQuantity(child)
          this.$set(child, '_prPurchaseQty', prQuantity)
          this.$set(child, '_isRfqChild', true)
          this.$set(child, '_isStockRow', false)
          this.$set(child, this.rowIdKey, this.getSourceRowId(parent, child, childIndex))
          sourceList.push(child)
        })

        this.$set(parent, 'assignList', sourceList)
        return parent
      })
    },
    showExternalPartNo(row = {}) {
      return row.externalPartNo || ''
    },
    // 根据子级行对象查找所属父级行。
    findParentRow(childRow) {
      return this.createTableList.find((parent) =>
        (parent.assignList || []).some((child) => child === childRow)
      )
    },
    // 删除来源子级行后，将剩余来源单据信息同步到父级行。
    syncParentDocumentInfo(parent) {
      const sourceList = (parent.assignList || []).filter((child) => !child._isStockRow)
      const oldDocumentList = Array.isArray(parent.documentList) ? parent.documentList : []
      const documentMap = new Map()
      const curOldRfqDetailIdList = sourceList.map((item) => item.oldRfqDetailId)

      this.$set(parent, 'oldRfqDetailIdList', curOldRfqDetailIdList)
      sourceList.forEach((child) => {
        const documentId = this.getDocumentId(child)
        const documentNo = child.documentNo
        const documentKey =
          documentId !== undefined && documentId !== null && documentId !== ''
            ? `id-${documentId}`
            : `no-${documentNo}`
        if (!documentNo || documentMap.has(documentKey)) return

        const oldDocument = oldDocumentList.find((item) => {
          const oldDocumentId = this.getDocumentId(item)
          if (documentId !== undefined && documentId !== null && documentId !== '') {
            return String(oldDocumentId) === String(documentId)
          }
          return item.documentNo === documentNo
        })
        documentMap.set(
          documentKey,
          oldDocument || {
            documentId,
            documentNo,
            documentType: child.documentType
          }
        )
      })

      const documentList = Array.from(documentMap.values())
      const singleDocument = documentList.length === 1 ? documentList[0] : undefined
      const singleDocumentId = singleDocument ? this.getDocumentId(singleDocument) : undefined
      this.$set(parent, 'documentList', documentList)
      this.$set(parent, 'documentNo', documentList.map((item) => item.documentNo).join(', '))
      this.$set(parent, 'documentId', singleDocumentId)
      if (Object.prototype.hasOwnProperty.call(parent, 'documentID')) {
        this.$set(parent, 'documentID', singleDocumentId)
      }
      this.$set(parent, 'documentType', singleDocument && singleDocument.documentType)
    },
    // 重新生成父级行及其子级行的序号。
    refreshTreeStage() {
      this.createTableList.forEach((parent, parentIndex) => {
        const parentStage = parentIndex + 1
        this.$set(parent, 'stage', parentStage)
        ;(parent.assignList || []).forEach((child, childIndex) => {
          this.$set(child, 'stage', `${parentStage}.${childIndex + 1}`)
          this.$set(child, 'isTopItem', childIndex === 0)
        })
      })
    },
    // 获取父级行下的备货行。
    getStockRow(parent) {
      return (parent.assignList || []).find((child) => child._isStockRow)
    },
    // 按剩余数量新增、更新或移除备货行。
    setStockQuantity(parent, quantity) {
      const assignList = parent.assignList || []
      const stockIndex = assignList.findIndex((child) => child._isStockRow)
      const stockQuantity = this.toQuantity(quantity)
      if (stockQuantity <= 0) {
        if (stockIndex > -1) assignList.splice(stockIndex, 1)
        return
      }
      if (stockIndex > -1) {
        this.$set(assignList[stockIndex], 'purchaseQty', stockQuantity)
      } else {
        assignList.push(this.createStockRow(parent, stockQuantity, undefined, 0))
      }
    },
    // 汇总所有子级行数量并回写父级行采购数量。
    recalculateParentQuantity(parent) {
      const quantity = (parent.assignList || []).reduce(
        (total, child) => total + this.toQuantity(child.purchaseQty),
        0
      )
      let num = quantity
      if (num === 0) {
        num = undefined
      }
      this.$set(parent, 'purchaseQty', num)
      if (num) {
        this.$set(parent, 'purchaseQtyError', false)
        this.$set(parent, 'ROW-ERROR', false)
      }
    },
    // 将父级采购数量优先分配给来源子级行，剩余数量转为备货。
    distributeParentQuantity(parent) {
      // 清空父行时按 0 分配，清空来源数量并移除备货行。
      let remainQuantity = this.toQuantity(parent.purchaseQty)
      ;(parent.assignList || [])
        .filter((child) => !child._isStockRow)
        .forEach((child) => {
          const childQuantity = Math.min(remainQuantity, this.toQuantity(this.getPrQuantity(child)))
          let num = childQuantity
          if (num === 0) {
            num = undefined
          }
          this.$set(child, 'purchaseQty', num)
          if (num) {
            this.$set(child, 'purchaseQtyError', false)
            this.$set(child, 'ROW-ERROR', false)
          }
          remainQuantity = Math.max(remainQuantity - childQuantity, 0)
        })
      this.setStockQuantity(parent, remainQuantity)
      this.recalculateParentQuantity(parent)
    },
    // 子级数量变化后重新分配来源数量与备货数量，并回算父级数量。
    updateChildQuantity(row) {
      const parent = this.findParentRow(row)
      if (!parent) return

      if (row._isStockRow) {
        ;(parent.assignList || []).filter((child) => !child._isStockRow)
        if (this.toQuantity(row.purchaseQty) <= 0) this.setStockQuantity(parent, 0)
        this.recalculateParentQuantity(parent)
        return
      }
      const inputQuantity = row.purchaseQty
      const assignList = parent.assignList || []
      const prRows = assignList.filter((child) => !child._isStockRow)
      const stockRow = this.getStockRow(parent)

      this.$nextTick(() => {
        let availableStockQuantity = this.toQuantity((stockRow || {}).purchaseQty)
        const assignedQuantityMap = new Map()

        prRows.forEach((child) => {
          // 清空数量时按 0 参与分配，避免 NaN 传播到其他来源行。
          const childInputQuantity = this.toQuantity(
            child === row ? inputQuantity : child.purchaseQty
          )
          const prQuantity = this.toQuantity(this.getPrQuantity(child))
          const assignedQuantity = Math.min(childInputQuantity, prQuantity)
          const overflowQuantity = Math.max(childInputQuantity - prQuantity, 0)
          assignedQuantityMap.set(child, assignedQuantity)
          availableStockQuantity = availableStockQuantity + overflowQuantity
        })

        // 当前编辑行优先回补，再按原顺序补足其他 PR 行，全部补满后才保留备货。
        ;[row, ...prRows.filter((child) => child !== row)].forEach((child) => {
          const prQuantity = this.toQuantity(this.getPrQuantity(child))
          const assignedQuantity = assignedQuantityMap.get(child) || 0
          const shortageQuantity = Math.max(prQuantity - assignedQuantity, 0)
          const refillQuantity = Math.min(availableStockQuantity, shortageQuantity)
          const newQuantity = assignedQuantity + refillQuantity
          assignedQuantityMap.set(child, newQuantity)
          availableStockQuantity = Math.max(availableStockQuantity - refillQuantity, 0)
        })

        prRows.forEach((child) => {
          const assignedQuantity = assignedQuantityMap.get(child)
          this.$set(child, 'purchaseQty', assignedQuantity || undefined)
          if (assignedQuantity) {
            this.$set(child, 'purchaseQtyError', false)
            this.$set(child, 'ROW-ERROR', false)
          }
        })

        this.setStockQuantity(parent, availableStockQuantity)
        this.recalculateParentQuantity(parent)
        this.refreshTreeStage()
      })
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'productName':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            break
          case 'externalPartNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 190
            break
          case 'description':
            item.colMinWidth = vm.comDisFrom ? undefined : 160
            break
          case 'deliveryDate':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'purchaseQty':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'purchaseUom':
            item.fixedWidth = vm.comDisFrom ? undefined : 120
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    handleImport() {
      this.$refs.importExcelDlg.show()
    },
    importSuccess(list) {
      const addList = this.prepareRfqTree(list).filter((row) => {
        if (this.createTableList.find((item) => item[this.rowIdKey] === row[this.rowIdKey])) {
          return false
        }
        return true
      })
      if (addList.length > 0) {
        this.createTableList.push(...addList)
        this.tableList = this.createTableList
        this.changeTableList('update')
      }
    },

    handleSortChange({ prop, order }) {
      this.handlerTableList()
      if (!prop || !order) {
        this.tableList = (this.tableList || []).slice().sort((a, b) => {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        })
        return
      }
      // 根据排序字段和顺序对数据进行排序（保留稳定性：相等时回退到 _stableIndex）
      this.tableList = (this.tableList || []).slice().sort((a, b) => {
        const valueA = a[prop] !== undefined && a[prop] !== null ? a[prop] : ''
        const valueB = b[prop] !== undefined && b[prop] !== null ? b[prop] : ''

        if (valueA === valueB) {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        }

        if (order === 'ascending') {
          return valueA > valueB ? 1 : -1
        } else if (order === 'descending') {
          return valueA < valueB ? 1 : -1
        }
        return 0
      })
    },
    handlerTableList() {
      // let table = JSON.parse(JSON.stringify(this.createTableList))
      let table = this.createTableList
      if (this.queryParams.condition) {
        table = table.filter((item) => {
          return this.$isContain(this.queryParams.condition, [
            item.productName,
            item.internalPartNo,
            item.description
          ])
        })
      }
      // 确保每行有稳定索引，用于取消排序时恢复原始顺序
      table.forEach((row) => {
        if (row && row._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          this.$set(row, '_stableIndex', this._stableCounter)
        }
      })
      this.tableList = table
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
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const { rfqQtyBatchInput } = res.data
        this.rfqQtyBatchInput = rfqQtyBatchInput === '1'
      })
    },
    documentTypeGetAuth(documentType) {
      const auth = {
        2: this.PRAuth,
        11: this.salesInquiryAuth,
        12: this.SQAuth,
        36: this.projectTemplateAuth,
        39: true
      }
      return auth[documentType]
    },
    handleViewHistoryChart(row) {
      const params = {
        productId: row.productId,
        businessPartnerIdList: (this.rfqVendorList || []).map((item) => item.businessPartnerId)
      }
      this.$refs.historyQuotationRecordsDlg.handleOpen(params)
    },
    queryPositionSugg(queryString, cb, row) {
      let positionList = []
      if (row.externalPartNoOptions) {
        positionList = row.externalPartNoOptions
      } else {
        const list = row.externalPartNoList || []
        row.externalPartNoOptions = list.map((externalPartNo) => {
          return { value: externalPartNo }
        })
        positionList = row.externalPartNoOptions
      }

      let results
      if (queryString) {
        results = positionList.filter(
          (p) => p.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = positionList
      }
      cb(results)
    },

    showPop(e, row, type) {
      let list = []
      list = row.documentList.map((x) => {
        return {
          customName: x.documentNo + ' - ' + x.documentStatusShow,
          customId: x.documentId,
          type,
          documentType: x.documentType,
          itemClass: this.documentTypeGetAuth(x.documentType) ? 'primary-pointer' : ''
        }
      })

      const params = {
        labelKey: 'customName',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    clickItem(item) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      const { type, customId } = item
      if (type === 'documentNo') {
        if (!this.documentTypeGetAuth(item.documentType)) return
        if (item.documentType === '2') {
          this.$router.push({
            path: '/purchaseManagement/viewPurchaseRequisition',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
        if (item.documentType === '11') {
          this.$router.push({
            path: '/salesManagement/viewSalesInquiry',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
        if (item.documentType === '12') {
          this.$router.push({
            path: '/salesManagement/viewSalesQuotation',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
        if (item.documentType === '36') {
          this.$router.push({
            path: '/projectManagement/viewProjectTemplate',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }

        if (item.documentType === '39') {
          this.$router.push({
            path: '/productManagement/viewMixDesign',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
      }
    },
    nav(row, type) {
      if (type === 'internalPartNo') {
        if (row.isAdhocEntry === '1') {
          this.$router.push({
            path: '/productManagement/editProductInfo',
            query: {
              id: row.productMainId,
              timeId: Date.now(),
              back: '1'
            }
          })
        } else {
          this.$router.push({
            path: '/productManagement/viewExtendedProductInfo',
            query: {
              id: row.productMainId,
              timeId: Date.now()
            }
          })
        }
      } else if (type === 'documentNo') {
        if (!this.documentTypeGetAuth(row.documentType)) return
        if (row.documentType === '2') {
          this.$router.push({
            path: '/purchaseManagement/viewPurchaseRequisition',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
        if (row.documentType === '11') {
          this.$router.push({
            path: '/salesManagement/viewSalesInquiry',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
        if (row.documentType === '12') {
          this.$router.push({
            path: '/salesManagement/viewSalesQuotation',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
        if (row.documentType === '36') {
          this.$router.push({
            path: '/projectManagement/viewProjectTemplate',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }

        if (row.documentType === '39') {
          this.$router.push({
            path: '/productManagement/viewMixDesign',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
      }
    },
    initList(list) {
      // this.tableList = JSON.parse(JSON.stringify(list))
      this.createTableList = this.prepareRfqTree(JSON.parse(JSON.stringify(list)))
      this.tableList = this.createTableList
    },
    getList() {
      return this.createTableList
    },
    // 标记父级及子级行校验错误，并展开首个错误父级行。
    errorMessage(code) {
      this.$emit('scrollPageToTable')
      let firstErrorParent
      const updateRowError = (row) => {
        const hasError = code && !this.$resultOfBoolean(row[code])
        this.$set(row, 'ROW-ERROR', !!hasError)
        if (code) {
          this.$set(row, code + 'Error', !!hasError)
        } else {
          Object.keys(row).forEach((key) => {
            if (key.endsWith('Error')) this.$set(row, key, false)
          })
        }
        return hasError
      }

      this.createTableList.forEach((parent) => {
        let hasError = updateRowError(parent)
        // 当前只有采购数量要求校验来源子行和备货行。
        if (code === 'purchaseQty' || !code) {
          ;(parent.assignList || []).forEach((child) => {
            hasError = updateRowError(child) || hasError
          })
        }
        if (hasError && !firstErrorParent) firstErrorParent = parent
      })
      if (firstErrorParent && this.$refs.tables) {
        this.$refs.tables.toggleRowExpansion(firstErrorParent, true)
      }
      this.$nextTick(() => {
        this.scrollToErrorColumn()
      })
    },
    purchaseUomChange(row) {
      this.$set(row, 'purchaseUomError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    changeAdhocEntryQty(index, row) {
      this.$nextTick(() => {
        if (row.purchaseQty) {
          this.$set(row, 'purchaseQty', this.$num(row.purchaseQty, row.decimalNum))
        }
        this.changePurchaseQty(index, row)
      })
    },
    // 处理采购数量变更，并按父级行或子级行触发对应的数量联动。
    changePurchaseQty(index, row) {
      this.$set(row, 'purchaseQtyError', false)
      this.$set(row, 'ROW-ERROR', false)

      if ((row.assignList || []).some((child) => !child._isStockRow)) {
        this.$nextTick(() => {
          this.distributeParentQuantity(row)
        })
        return
      }
      if (row._isRfqChild) {
        this.updateChildQuantity(row)
        return
      }

      if (!this.rfqQtyBatchInput) return
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.purchaseQty) {
          const batchQuantity = topRow.purchaseQty
          const applyBatchQuantity = () => {
            console.log('11111 批量赋值')
            this.$nextTick(() => {
              this.tableList.forEach((item) => {
                console.log('222 批量赋值', topRow.includeDecimal !== item.includeDecimal)
                if (topRow.includeDecimal !== item.includeDecimal) return
                this.$set(item, 'purchaseQty', batchQuantity)
                this.$set(item, 'purchaseQtyError', false)
                this.$set(item, 'ROW-ERROR', false)
                // 批量赋值也要同步来源分配，保持父行、子行和备货数量一致。
                if ((item.assignList || []).some((child) => !child._isStockRow)) {
                  console.log('333 批量赋值')

                  this.distributeParentQuantity(item)
                }
              })
            })
          }
          const oldPurchaseQty = this.tableList.find((item, index) => index > 0 && item.purchaseQty)
          if (oldPurchaseQty) {
            this.$modal
              .confirm(this.$t('PURCHASE.purchaseQtyConfirm').replace('$1', topRow.purchaseQty))
              .then(applyBatchQuantity)
              .catch(() => {})
          } else {
            applyBatchQuantity()
          }
        }
      }
    },
    changeDeliveryDate(index, row) {
      this.$set(row, 'deliveryDateError', false)
      this.$set(row, 'ROW-ERROR', false)

      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.deliveryDate) {
          const oldDeliveryDate = this.tableList.find(
            (item, index) => index > 0 && item.deliveryDate
          )
          if (oldDeliveryDate) {
            const msg = this.parseTime(topRow.deliveryDate, this.fmtForYmd)
            this.$modal
              .confirm(this.$t('PURCHASE.committedDateConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'deliveryDate', topRow.deliveryDate)
                  this.$set(row, 'deliveryDateError', false)
                  this.$set(row, 'ROW-ERROR', false)
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'deliveryDate', topRow.deliveryDate)
              this.$set(row, 'deliveryDateError', false)
              this.$set(row, 'ROW-ERROR', false)
            })
          }
        }
      }
    },
    handleSddAdhocEntry() {
      this._stableCounter = (this._stableCounter || 0) + 1
      this.createTableList.push({
        isAdhocEntry: '1',
        productType: '1',
        includeDecimal: '1',
        decimalNum: 3,
        customId: +new Date(),
        [this.rowIdKey]: `adhoc-${Date.now()}`,
        _stableIndex: this._stableCounter
      })
      // this.$set(this.createTableList, this.createTableList.length, {
      //   isAdhocEntry: '1',
      //   productType: '1',
      //   includeDecimal: '1',
      //   decimalNum: 3,
      //   customId: +new Date(),
      //   productName: ''
      // })
      this.tableList = this.createTableList
    },
    handleAddBtn() {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      // this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
      const tableList = JSON.parse(JSON.stringify(this.createTableList))

      const allRfqDetailIdList = []
      this.createTableList.forEach((item) => {
        if (item.oldRfqDetailIdList && item.oldRfqDetailIdList.length > 0) {
          allRfqDetailIdList.push(...item.oldRfqDetailIdList)
        }
      })
      const tableList1 = JSON.parse(JSON.stringify(this.createTableList))
      const selectList = allRfqDetailIdList.map((x) => {
        return {
          rfqDetailId: x
        }
      })
      // console.log(tableList, '======================1145')
      this.$refs.selectProductTable.handleAdd({
        other: { tableList: (tableList || []).filter((x) => !x.purchaseRequisiteId) },
        pendProduct: { selectList, tableList: tableList1 || [] }
      })
    },
    updateTable(list) {
      // console.log(list, '===================1152')

      const isAdhocEntryProductIdList = this.createTableList.filter((x) => x.isAdhocEntry === '1')

      // console.log(isAdhocEntryProductIdList, '===============1156')
      let rows = []
      if (list.length > 0 && list.filter((x) => x.isAdhocEntry !== '1').length > 0) {
        const newProductIdList = list.map((x) => x.productId)
        const filterList = this.createTableList.filter((x) => {
          if (x.oldRfqDetailIdList && x.oldRfqDetailIdList.length > 0) {
            return true
          } else {
            return newProductIdList.includes(x.productId)
          }
        })

        const filterIdList = filterList.map((x) => x.productId)
        // 新选中的列表除去已存在的产品
        const newAddList = list.filter((x) => !filterIdList.includes(x.productId))
        rows = [...newAddList, ...filterList]
        const topRow = this.tableList[0]
        if (topRow && topRow.deliveryDate) {
          rows.forEach((row) => {
            this.$set(row, 'deliveryDate', topRow.deliveryDate)
          })
        }
      } else {
        rows = [...isAdhocEntryProductIdList]
      }

      // preserve or assign stable indices for incoming rows
      rows.forEach((r) => {
        if (r && r._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          r._stableIndex = this._stableCounter
        }
      })

      const treeRows = this.prepareRfqTree(rows)
      this.createTableList.length = 0
      this.createTableList.push(...treeRows)
      this.tableList = this.createTableList

      this.changeTableList('update')
      this.handleMergeRFQs()
    },
    updateTable1(list) {
      // console.log(list, '======================1178')
      const newProductIdList = list.map((x) => x.productId)
      const filterList = this.createTableList.filter((x) => {
        if (x.oldRfqDetailIdList && x.oldRfqDetailIdList.length > 0) {
          return true
        } else {
          return newProductIdList.includes(x.productId)
        }
      })
      const filterIdList = filterList.map((x) => x.productId)
      // 新选中的列表除去已存在的产品
      const newAddList = list.filter((x) => !filterIdList.includes(x.productId))
      const rows = this.prepareRfqTree([...newAddList, ...filterList])
      const topRow = this.tableList[0]
      if (topRow && topRow.deliveryDate) {
        rows.forEach((row) => {
          this.$set(row, 'deliveryDate', topRow.deliveryDate)
        })
      }
      this.createTableList.length = 0
      this.createTableList.push(...rows)
      this.tableList = this.createTableList
      // console.log(rows, '======================1178')

      this.$refs.selectProductTable.updateTable(JSON.parse(JSON.stringify(rows)))
    },
    handleMergeRFQs() {
      const selectList = this.tableList

      let dropShipping
      let receiveAddressName
      let warehouseId
      let warehouseName
      if (selectList.some((x) => x.dropShipping === '1')) {
        dropShipping = '1'
      } else {
        dropShipping = '0'
      }

      let receiveAddressList = selectList
        .filter((x) => x.dropReceiveAddress)
        .map((x) => ({
          value: x.dropReceiveAddress
        }))
      // 对 receiveAddressList 数组进行去重（基于 value 和 id）
      const uniqueMap = new Map()
      receiveAddressList.forEach((item) => {
        const key = `${item.value}`
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item)
        }
      })
      receiveAddressList = Array.from(uniqueMap.values())
      if (dropShipping === '1') {
        if (receiveAddressList.length === 1) {
          receiveAddressName = receiveAddressList[0].value
        }
        this.$emit('updateForm', {
          dropShipping,
          receiveAddressName
        })
      } else if (dropShipping === '0') {
        queryCanSelectWarehouseListNoPage({}).then((res) => {
          const warehouseList = res.data || []
          if (warehouseList.length === 1) {
            warehouseId = warehouseList[0].warehouseId
            warehouseName = warehouseList[0].warehouseName
          }
          this.$emit('updateForm', {
            dropShipping,
            warehouseId,
            warehouseName
          })
        })
      }
    },

    updateTableForPendRFQ(list, data) {
      const msg = data || {}
      this.$set(this.formData, 'ourRef', msg.ourRef)
      this.$set(this.formData, 'dropShipping', msg.dropShipping)
      this.$set(this.formData, 'rfqStatusShowStr', msg.rfqStatusShowStr)
      this.$set(this.formData, 'incotermAddressType', msg.incotermAddressType)
      this.$set(this.formData, 'receiveAddressId', msg.receiveAddressId)
      this.$set(this.formData, 'receiveAddressName', msg.receiveAddressName)
      this.$set(this.formData, 'addressForWarehouse', msg.addressForWarehouse || {})
      this.$set(this.formData, 'rfqStatus', msg.rfqStatus)
      this.$set(this.formData, 'requestedBy', msg.requestedBy)
      this.$set(this.formData, 'requestedMobileCode', msg.requestedMobileCode)
      this.$set(this.formData, 'requestedMobileNum', msg.requestedMobileNum)
      this.$set(this.formData, 'requestedMobilePhone', msg.requestedMobilePhone)
      this.$set(this.formData, 'requestedEmail', msg.requestedEmail)
      this.$set(this.formData, 'costProjectName', msg.costProjectName)
      this.$set(this.formData, 'costProjectId', msg.costProjectId)
      this.$set(this.formData, 'costProjectCode', msg.costProjectCode)
      this.$emit('updateInitFrom', msg)

      const newProductIdList = list.map((x) => x.productId)
      const filterList = this.createTableList.filter((x) => {
        if (x.oldRfqDetailIdList && x.oldRfqDetailIdList.length > 0) {
          return false
        } else {
          return !newProductIdList.includes(x.productId)
        }
      })
      const rows = this.prepareRfqTree([...list, ...filterList])
      const topRow = this.tableList[0]
      if (topRow && topRow.deliveryDate) {
        rows.forEach((row) => {
          this.$set(row, 'deliveryDate', topRow.deliveryDate)
        })
      }
      this.createTableList.length = 0
      this.createTableList.push(...rows)
      this.tableList = this.createTableList

      this.changeTableList('update')
      this.handleMergeRFQs()
    },

    changeTableList(type = '') {
      this.$emit('updateTable', this.createTableList, type)
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 选中多个删除
    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          this.tableList = this.tableList.filter((row) => {
            if (this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])) {
              return false
            }
            return true
          })
          this.changeTableList()
          this.selected = []
          this.clearSuppliersList()
        })
        .catch(() => {})
    },
    // 删除表格行，删除子级行时同步父级汇总和剩余来源单据信息。
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        const parentRow = this.findParentRow(row)
        if (parentRow) {
          const assignList = parentRow.assignList || []
          const childIndex = assignList.findIndex(
            (child) => child === row || child[this.rowIdKey] === row[this.rowIdKey]
          )
          if (childIndex > -1) assignList.splice(childIndex, 1)

          // 来源单子行全部删除时，备货行和父级汇总行一并删除。
          const hasDocumentChild = assignList.some((child) => !child._isStockRow)
          if (hasDocumentChild) {
            if (!row._isStockRow) this.syncParentDocumentInfo(parentRow)
            this.recalculateParentQuantity(parentRow)
          } else {
            this.createTableList = this.createTableList.filter(
              (item) => item[this.rowIdKey] !== parentRow[this.rowIdKey]
            )
          }
        } else {
          // 树表展开后 scope.$index 包含子行，父行按唯一行键删除更可靠。
          this.createTableList = this.createTableList.filter(
            (item) => item[this.rowIdKey] !== row[this.rowIdKey]
          )
        }
        this.refreshTreeStage()
        this.handlerTableList()
        this.clearSuppliersList()
        this.changeTableList()
      })
    },
    // 表格全选
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selected = vm.selected.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 行单个选择
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      /* const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      } */
      if (this.curClickProductRow.productId === row.productId && row.productId) {
        color = 'pointer table-SelectedRow-bgcolor'
      }
      // if (row.checkResult === '0') {
      //   color = 'table-warning-bgcolor'
      // }
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      const classList = []
      if (!row[column.property] && row[column.property + 'Error']) {
        classList.push('is-required-table-cell')
      }
      if (column.property === 'documentNo') {
        classList.push('bp-name-flex-cell')
      }
      return classList.join(' ')
    },
    initDraggable() {
      this.destroyDraggable()
      setTimeout(() => {
        const el = this.$refs.tables.$el.querySelectorAll(
          '.el-table__fixed-body-wrapper > table > tbody'
        )[0]
        this.sortableDom = Sortable.create(el, {
          handle: '.allowDrag',
          animation: 100,
          ghostClass: 'blue-background-class',
          onEnd: (evt) => {
            if (evt.oldIndex === evt.newIndex) return
            const targetRow = this.tableList.splice(evt.oldIndex, 1)[0]
            this.tableList.splice(evt.newIndex, 0, targetRow)
          }
        })
      }, 300)
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },
    clearSuppliersList() {
      this.$emit('clearSuppliersList')
    }
  }
}
</script>
<style>
.bp-name-flex-cell .cell {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
</style>
<style lang="scss" scoped>
/* 处理特殊单元格内容与展开折叠列的样式冲突 */
.level-2::before {
  content: '';
  position: absolute;
  left: 20px;
  top: -20px;
  width: 1px;
  height: 40px;
  border-left: 1px dashed #c0c4cc;
}
.topItem.level-2::before {
  top: 0px;
  height: 20px;
}
/* 二级横向虚线 (横线连接圆圈) */
.level-2::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 18px;
  width: 16px;
  border-top: 1px dashed #c0c4cc;
}
</style>
