<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom && !linkPR">
        <el-button @click="handleAddBtn" type="primary" icon="el-icon-plus" size="mini">{{
          $t('uiBtn.add')
        }}</el-button>
      </el-col>
      <el-col :span="1.5" v-if="!comDisFrom && !linkPR && addAdhocEntryAuth">
        <el-button @click="handleSddAdhocEntry" type="primary" icon="el-icon-plus" size="mini">{{
          $t('menu.addAdhocEntry')
        }}</el-button>
      </el-col>
      <el-col :span="1.5" v-if="!comDisFrom && !linkPR">
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
      </el-col>
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
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button
          @click="handleAddPendRFQProduct"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('PURCHASE.selectPendInquiryProduct') }}</el-button
        >
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
                  v-if="scope.row.isAdhocEntry === '1' && !comDisFrom && !scope.row.productId"
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
            <span>{{ (scope.row.externalPartNoListJson || []).join(', ') }}</span>
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
            <div
              v-if="(scope.row.documentList || []).length > 1"
              @mouseenter.stop="showPop($event, scope.row, 'documentNo')"
              @mouseleave="hidePop($event, scope.row)"
              class="ellipsis-text primary-link"
            >
              {{ scope.row[item.prop] }}
            </div>
            <span
              v-else
              class="ellipsis-text"
              :class="{ 'primary-link': documentTypeGetAuth(scope.row.documentType) }"
              @click="nav(scope.row, 'documentNo')"
              >{{ scope.row.documentNo }}</span
            >
          </template>
          <template v-else-if="item.prop === 'description'">
            <descriptionEditDlg
              v-if="!comDisFrom"
              v-model="scope.row.description"
              :maxlength="7000"
            />
            <template v-else><DescriptionToolTipShow :showStr="scope.row[item.prop]" /></template>
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            <template v-if="!comDisFrom && scope.row.isCustomProduct !== '1'">
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
            <template v-if="scope.row.isAdhocEntry === '1' && !comDisFrom && !scope.row.productId">
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
            <template v-if="!comDisFrom">
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

            <template v-else>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
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
              v-if="!comDisFrom && scope.row.isAdhocEntry === '1' && !scope.row.documentNo"
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
            <div>
              <!-- !linkPR && !comDisFrom -->
              <i
                v-if="!comDisFrom"
                class="el-icon el-icon-delete pointer mr10"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click.stop="handleDelRow(scope.$index, scope.row)"
              ></i>
            </div>
            <div>
              <svg-icon
                class="primary-pointer"
                icon-class="line"
                style="font-size: 20px"
                v-if="
                  scope.row.productId &&
                  purchaseQuotationRecordAuth &&
                  scope.row.isCustomProduct !== '1'
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
      @onSuccess="updateTable"
    />
    <selectProductTableForPendRFQ
      ref="selectProductTableForPendRFQ"
      @onSuccess="updateTableForPendRFQ"
      :dropShipping="dropShipping"
    />
    <importExcelDlg ref="importExcelDlg" @onSuccess="importSuccess" />

    <historyQuotationRecordsDlg ref="historyQuotationRecordsDlg" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="clickItem" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './components/selectProductTable'
import selectProductTableForPendRFQ from './components/selectProductTableForPendRFQ'

import historyQuotationRecordsDlg from '@/views/purchaseManagement/purchaseQuotation/components/historyQuotationRecordsDlg.vue'
import Sortable from 'sortablejs'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import { getSystemSetup } from '@/api/system/systemSetting'
import importExcelDlg from './components/importExcelDlg.vue'

export default {
  dicts: ['valuation_unit', 'product_type'],
  mixins: [pageMixin],
  components: {
    selectProductTable,
    selectProductTableForPendRFQ,
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
    }
  },
  watch: {
    rfqProductList: {
      immediate: true,
      handler: function (selected) {
        this.createTableList = JSON.parse(JSON.stringify(this.rfqProductList))
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
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          fixed: false,
          sortable: 'custom'
        },
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
          colMinWidth: 120,
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
      rowIdKey: 'productMainId',
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
    purchaseQuotationRecordAuth() {
      return this.checkPermi(['purchaseManagement:requestForQuotation:purchaseQuotationRecord'])
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    addAdhocEntryAuth() {
      return this.checkPermi(['purchaseManagement:requestForQuotation:addAdhocEntry'])
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      const flag = this.tableList.find((x) => x.costProjectCode)
      if (!flag) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      }
      const flag1 = this.tableList.find((x) => x.documentNo)
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
    console.log('11111112')
    this.getSystemSetup()
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
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
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'purchaseQty':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'purchaseUom':
            item.fixedWidth = vm.comDisFrom ? undefined : 120
            break
        }
      })
    },
    handleImport() {
      this.$refs.importExcelDlg.show()
    },
    importSuccess(list) {
      const addList = list.filter((row) => {
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
        return
      }
      // 根据排序字段和顺序对数据进行排序
      this.tableList.sort((a, b) => {
        const valueA = a[prop] !== undefined && a[prop] !== null ? a[prop] : ''
        const valueB = b[prop] !== undefined && b[prop] !== null ? b[prop] : ''
        if (order === 'ascending') {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0
        } else if (order === 'descending') {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0
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
          customName: x.documentNo,
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
      this.createTableList = JSON.parse(JSON.stringify(list))
      this.tableList = this.createTableList
    },
    getList() {
      return this.createTableList
    },
    errorMessage(code) {
      this.$emit('scrollPageToTable')

      // this.createTableList.forEach((item) => {
      //   if (!this.$resultOfBoolean(item[code])) {
      //     this.$set(item, code + 'Error', true)
      //   }
      // })

      let rowIndex
      this.createTableList.forEach((item, index) => {
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
    changePurchaseQty(index, row) {
      this.$set(row, 'purchaseQtyError', false)
      this.$set(row, 'ROW-ERROR', false)

      if (!this.rfqQtyBatchInput) return
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.purchaseQty) {
          const oldPurchaseQty = this.tableList.find((item, index) => index > 0 && item.purchaseQty)
          if (oldPurchaseQty) {
            this.$modal
              .confirm(this.$t('PURCHASE.purchaseQtyConfirm').replace('$1', topRow.purchaseQty))
              .then(() => {
                this.tableList.forEach((row) => {
                  if (topRow.includeDecimal === row.includeDecimal) {
                    this.$set(row, 'purchaseQty', topRow.purchaseQty)
                  }
                })
              })
          } else {
            this.tableList.forEach((row) => {
              if (topRow.includeDecimal === row.includeDecimal) {
                this.$set(row, 'purchaseQty', topRow.purchaseQty)
              }
            })
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
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'deliveryDate', topRow.deliveryDate)
            })
          }
        }
      }
    },
    handleSddAdhocEntry() {
      this.createTableList.push({
        isAdhocEntry: '1',
        productType: '1',
        includeDecimal: '1',
        decimalNum: 3,
        customId: +new Date(),
        [this.rowIdKey]: Date.now()
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
    handleAddBtn(type = '') {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      // this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
      const tableList = JSON.parse(JSON.stringify(this.createTableList))
      this.$refs.selectProductTable.handleAdd(tableList, type)
    },
    updateTable(list) {
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
      const rows = [...newAddList, ...filterList]
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
    },
    handleAddPendRFQProduct() {
      const allRfqDetailIdList = []
      this.createTableList.forEach((item) => {
        if (item.oldRfqDetailIdList && item.oldRfqDetailIdList.length > 0) {
          allRfqDetailIdList.push(...item.oldRfqDetailIdList)
        }
      })
      const tableList = JSON.parse(JSON.stringify(this.createTableList))
      const selectList = allRfqDetailIdList.map((x) => {
        return {
          rfqDetailId: x
        }
      })
      this.$refs.selectProductTableForPendRFQ.handleAdd(selectList, tableList)
    },
    updateTableForPendRFQ(list) {
      const newProductIdList = list.map((x) => x.productId)
      const filterList = this.createTableList.filter((x) => {
        if (x.oldRfqDetailIdList && x.oldRfqDetailIdList.length > 0) {
          return false
        } else {
          return !newProductIdList.includes(x.productId)
        }
      })
      const rows = [...list, ...filterList]
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
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        // this.createTableList = JSON.parse(JSON.stringify(this.tableList))
        this.createTableList = this.createTableList.filter((x) =>
          x.customId ? x.customId !== row.customId : x[this.rowIdKey] !== row[this.rowIdKey]
        )
        const findIndex = this.selected.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        if (findIndex !== -1) {
          this.selected.splice(findIndex, 1)
        }
        this.clearSuppliersList()
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
      let cellClass = ''
      if (
        this.createTableList.find(
          (item) => !item[column.property] && item[column.property + 'Error']
        )
      ) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
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

<style></style>
