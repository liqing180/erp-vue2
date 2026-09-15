<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="isCanSendNewBusinessPartner">
        <el-button @click="handleResendBP" type="primary" size="mini">{{
          $t('PURCHASE.solicitAdditionalQuotes')
        }}</el-button>
      </el-col>
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>

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

    <!-- :row-key="rowIdKey"
          class="hide-check-all"
    -->
    <!-- :row-class-name="tableRowClassName" -->
    <el-table
      border
      ref="tables"
      v-loading="loading"
      :data="curShowTableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      :row-key="rowIdKey"
      :tree-props="{ children: 'serviceSurchargeList', hasChildren: 'hasChildren' }"
      default-expand-all
      @sort-change="handleSortChange"
    >
      <!-- <el-table-column
        type="selection"
        key="selection"
        align="center"
        width="55"
        :selectable="selectable"
      ></el-table-column> -->
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
        v-for="item in getVisibleColumn(visibleColumn)"
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
          <span v-if="['contactPersonName'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else-if="['legalEntityBasicUnitPrice'].includes(item.prop)">
            <span>{{ column.label }}</span>
            <span v-if="legalEntityInfo.currencySymbol"
              >({{ legalEntityInfo.currencySymbol }})</span
            >
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="['purchaseQuotationNo'].includes(item.prop)">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="purchaseQuotation"
              @click="nav(scope.row, item.prop)"
            />
          </template>
          <template v-else-if="item.prop === 'productName'">
            <span v-if="scope.row.productId">{{ scope.row[item.prop] }}</span>
            <span v-if="!scope.row.productId">{{ scope.row.expenseItemName }}</span>
          </template>
          <template v-else-if="item.prop === 'contactPersonName'">
            <CommonSelect
              v-if="!comDisFrom"
              style="width: 98%"
              :id="scope.row.contactPersonId"
              :label="scope.row.contactPersonName"
              :title="scope.row.contactPersonName"
              idKey="contactPersonId"
              labelKey="contactPersonName"
              :options="scope.row.bpBusinessContactPersonList || []"
              @change="rowContactPersonChange($event, scope.row)"
            />
            <template v-else>{{ scope.row.contactPersonName }}</template>
          </template>
          <template v-else-if="item.prop === 'rfqPdf'">
            <svg-icon
              icon-class="pdf"
              class="primary-pointer"
              style="font-size: 20px"
              @click="handlePdf(scope.$index, scope.row)"
              v-if="!scope.row.pdfLoading"
            />
            <i
              v-if="scope.row.pdfLoading"
              class="el-icon el-icon-loading"
              style="font-size: 20px; color: #409eff"
            ></i>
          </template>

          <template v-else-if="item.prop === 'pqPdf'">
            <i
              v-if="(scope.row.commonFileListForPQ || []).length > 0"
              class="el-icon-folder-opened primary-pointer"
              style="font-size: 20px"
              @click="previewFile(scope.row.commonFileListForPQ)"
            ></i>
          </template>

          <template v-else-if="item.prop === 'unitPrice'">
            {{ $numberStr(scope.row.unitPrice, 2) }}
          </template>
          <template v-else-if="item.prop === 'legalEntityBasicUnitPrice'">
            {{ $numberStr(scope.row.legalEntityBasicUnitPrice, 2) }}
          </template>
          <template v-else-if="item.prop === 'taxAmount'">
            {{ $numberStr(scope.row.taxAmount, 2) }}
          </template>
          <template v-else-if="item.prop === 'warranty'">
            {{ $numberStr(scope.row.warranty, 0) }}
          </template>

          <template v-else-if="item.prop === 'purchaseQty'">
            <el-tooltip
              :content="`1 ${scope.row.purchaseUom} = ${scope.row.purchaseUomCoefficient} ${scope.row.basicUom}`"
              :disabled="!scope.row.purchaseQty"
              placement="top"
              effect="light"
              v-if="scope.row.productId"
            >
              <div class="ellipsis-text">
                <span>{{ $numberStr(scope.row.purchaseQty, scope.row.decimalNum) }}</span>
              </div>
            </el-tooltip>
            <template v-else>{{ scope.row.qty }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <span v-if="scope.row.productId" :title="showUomLabel(scope.row[item.prop])">{{
              scope.row[item.prop]
            }}</span>
            <span v-if="!scope.row.productId" :title="showUomLabel(scope.row.unit)">{{
              scope.row.unit
            }}</span>
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
        v-if="!comDisFrom || showPdf"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              v-if="!comDisFrom && !scope.row.rfqDetailId"
              class="el-icon el-icon-delete pointer mr5"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
            <div>
              <svg-icon
                v-if="showPdf && !scope.row.pdfLoading"
                icon-class="pdf"
                class="primary-pointer"
                style="font-size: 20px"
                @click="handlePdf(scope.$index, scope.row)"
              />
              <i
                v-if="showPdf && scope.row.pdfLoading"
                class="el-icon el-icon-loading"
                style="font-size: 20px; color: #409eff"
              ></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <selectSupplierTable
      ref="selectSupplierTable"
      :productIdList="productIdList"
      @onSuccess="updateTable"
    />

    <resendBPDlg
      ref="resendBPDlg"
      :productIdList="productIdList"
      :rfqId="formData.rfqId"
      @onSuccess="resendBPSuccess"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectSupplierTable from './components/selectSupplierTable'
import resendBPDlg from './components/resendBPDlg'
export default {
  mixins: [pageMixin],
  components: {
    selectSupplierTable,
    resendBPDlg
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    submitBtnShow: {
      type: Boolean,
      default: false
    },
    showPdf: {
      type: Boolean,
      default: false
    },
    rfqVendorList: {
      type: Array,
      default() {
        return []
      }
    },
    productIdList: {
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
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    curShowTableList() {
      const productId = this.curClickProductRow.productId
      if (productId) {
        return this.tableList.filter((item) => item.productId === productId)
      }
      return this.tableList
    },
    buttonAuthMsg() {
      return this.formData.buttonAuthMsg || {}
    },
    isCanSendNewBusinessPartner() {
      return this.buttonAuthMsg.isCanSendNewBusinessPartner === '1'
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    online_preview_url() {
      if (this.$store.state.user.online_preview_url) {
        return this.$store.state.user.online_preview_url
      }
      return ''
    }
  },
  watch: {
    rfqVendorList: {
      immediate: true,
      handler: function (selected) {
        // this.tableList = JSON.parse(JSON.stringify(this.rfqVendorList))
        this.createTableList = JSON.parse(JSON.stringify(this.rfqVendorList))

        this.createTableList.forEach((x, index) => {
          x.dateQuoted = this.parseTime(x.dateQuoted, this.fmtForYmdhms)
        })

        this.$nextTick(() => {
          this.selected = this.createTableList.filter((item) => item.isSelect === '1')
          this.$emit('changeSupplierTable', this.selected)
          this.createTableList.forEach((x, i) => {
            if (x.isSelect === '1') {
              this.$refs.tables.toggleRowSelection(this.createTableList[i], true)
            }
          })
        })
        this.tableList = this.createTableList
        this.changeTableList()
      }
    },
    curShowTableList: {
      handler() {
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.curShowTableList.forEach((item) => {
              if (row[this.rowIdKey] === item[this.rowIdKey]) {
                this.$refs.tables.toggleRowSelection(item, true)
              }
            })
          })
        })
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '37',
      savePath: 'purchaseMTable',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'purchaseQuotationNo',
          label: vm.$t('PURCHASE.purchaseQuotationNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
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
          prop: 'rfqPdf',
          label: vm.$t('PURCHASE.rfqPdf'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'pqPdf',
          label: vm.$t('PURCHASE.pqPdf'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PURCHASE.supplierCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'country',
          label: vm.$t('PURCHASE.country'),
          visible: true,
          width: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'incotermAbbreviation',
          label: vm.$t('PURCHASE.incoterm'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.quotationQty'),
          minWidth: 160,
          visible: true,
          padding: 60,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uom'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'legalEntityBasicUnitPrice',
          label: vm.$t('PURCHASE.basicReferenceAmount'),
          // minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          fixedWidth: 200,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'moq',
          label: vm.$t('PURCHASE.moq'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'taxRateShowStr',
          label: vm.$t('PURCHASE.tax'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'taxAmount',
          label: vm.$t('PURCHASE.taxAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'leadTime',
          label: vm.$t('PURCHASE.leadTimeDays'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'warranty',
          label: vm.$t('PURCHASE.warrantyDays'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('PURCHASE.paymentTerm'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'dateQuoted',
          label: vm.$t('PURCHASE.dateQuoted'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'validityForDay',
          label: vm.$t('PURCHASE.validityDays'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'pqResultShowStr',
          label: vm.$t('PURCHASE.result'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'rowTimeId',
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.supplierSearch1')}`,
          type: 'InputEle'
        }
      ],
      // 查询参数
      queryParams: {
        condition: undefined
      },
      createTableList: []
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    getVisibleColumn(VisibleColumn) {
      const fixedIndex = VisibleColumn.findIndex((item) => item.fixed)
      const firstIndex = fixedIndex >= 0 ? fixedIndex : 0
      return VisibleColumn.map((item, index) => {
        if (firstIndex === index) {
          return {
            ...item,
            colWidth: item.colWidth + 40
          }
        }
        return item
      })
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
            item.businessPartnerName,
            item.businessPartnerNo,
            item.remarks
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
    changeVirtualList(renderData) {
      this.virtualList = renderData
    },
    initList(list) {
      // this.tableList = JSON.parse(JSON.stringify(list))
      this.createTableList = JSON.parse(JSON.stringify(list))
      this.tableList = this.createTableList
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      // return true // 不禁用
      return this.submitBtnShow && row.pqResult === '1'
    },
    getList() {
      return this.createTableList
    },
    rowContactPersonChange(value, row) {
      const data = value || {}
      this.$set(row, 'businessContactPersonId', data.businessContactPersonId)
      this.$set(row, 'contactPersonId', data.contactPersonId)
      this.$set(row, 'contactPersonName', data.contactPersonName)
      this.$set(row, 'email', data.email)
      this.$set(row, 'mobileCode', data.mobileCode)
      this.$set(row, 'mobileNum', data.mobileNum)
      this.$set(row, 'mobilePhone', data.mobilePhone)
    },
    handleAddBtn() {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      // this.$refs.selectSupplierTable.handleAdd(alreadySelectIdList)
      const tableList = JSON.parse(JSON.stringify(this.createTableList))
      this.$refs.selectSupplierTable.handleAdd(tableList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          this.$set(item, 'email', undefined)
          const contactPersonList = item.bpBusinessContactPersonList || []
          contactPersonList.forEach((contactRow) => {
            if (contactRow.isDefault === '1') {
              this.rowContactPersonChange(contactRow, item)
            }
          })
        })
        // this.tableList = [...this.tableList, ...rows]
        // this.createTableList = rows
        this.createTableList.length = 0
        this.createTableList.push(...rows)
        this.tableList = this.createTableList
        this.changeTableList()
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.tableList.forEach((item) => {
              if (row[this.rowIdKey] === item[this.rowIdKey]) {
                this.$refs.tables.toggleRowSelection(item, true)
              }
            })
          })
        })
        // this.initDraggable()
      } else {
        this.tableList = []
        this.createTableList = []
      }
    },
    changeTableList() {
      this.resetSnNum(this.createTableList)
      this.$emit('updateTable', this.createTableList)
      const allList = []
      this.createTableList.forEach((item) => {
        allList.push(item)
        if (item.serviceSurchargeList) {
          item.serviceSurchargeList.forEach((child) => {
            allList.push({
              ...child,
              productName: child.expenseItemName,
              purchaseQty: child.qty
            })
          })
          allList.push(...item.serviceSurchargeList)
        }
      })
      this.$$getColumnContentMaxWidth(this.columns, allList)
    },
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
        item.snNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          this.resetSnNum(item.serviceSurchargeList, item.snNum)
        }
      })
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
        })
        .catch(() => {})
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        const findIndex = this.selected.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        if (findIndex !== -1) {
          this.selected.splice(findIndex, 1)
        }
      })
    },
    handlePdf(index, row) {
      this.$emit('handlePdfRow', row)
    },
    previewFile(fileList) {
      if (!this.online_preview_url) {
        return
      }
      const { url } = fileList[0]
      const url1 = window.btoa(url)
      // let http = 'https://file.keking.cn/onlinePreview?url='
      const http = this.online_preview_url
      const myUrl = `${http}${url1}`
      window.open(myUrl, '_blank')
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
      this.$emit('changeSupplierTable', vm.selected)
    },

    // 行单个选择
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this

      const index = this.selected.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selected.splice(index, 1)
      } else {
        this.selected.push(row)
      }

      this.$emit('changeSupplierTable', vm.selected)
    },

    tableRowClassName({ row, rowIndex }) {
      let color = ''
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      }
      return color
    },
    nav(row, type) {
      if (type === 'purchaseQuotationNo') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseQuotation',
          query: {
            id: row.purchaseQuotationId,
            timeId: Date.now()
          }
        })
      }
    },
    handleResendBP() {
      const alreadySelectIdList = this.tableList.map((item) => item.businessPartnerId)
      this.$refs.resendBPDlg.handleAdd(alreadySelectIdList)
    },
    resendBPSuccess() {
      this.$emit('resendBPSuccess')
    }
  }
}
</script>
