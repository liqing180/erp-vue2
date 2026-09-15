<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.product')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div style="position: relative">
      <search-form
        ref="searchForm"
        v-model="queryParams"
        :searchData="searchData"
        :handleQuery="handleSearchForm"
        :resetQuery="resetSearchForm"
        :showCustom="false"
        :showMenu="false"
        v-show="showSearch"
      >
        <right-toolbar
          :saveKey="activeName"
          :savePath="savePath"
          :showSearch.sync="showSearch"
          :showSearchBtn="false"
          @queryTable="queryTable"
          :columns="configColumn"
          :columnsInit="columns"
        ></right-toolbar>
      </search-form>
      <div class="department-data" v-if="showAllAuth">
        <el-checkbox @change="getList" v-model="isOnlyDefaultDept">{{
          $t('menu.departmentData')
        }}</el-checkbox>
      </div>
    </div>

    <!--   -->
    <div class="mt10">
      <el-table
        border
        ref="tables"
        :data="tableList"
        v-loading="loading"
        :max-height="tableMaxHeight"
        @sort-change="handleSortChange"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        :row-class-name="'pointer'"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
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
            <template v-if="item.prop === 'receivedQty'">
              <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            </template>
            <template v-else-if="item.prop === 'unitPrice'">
              <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'lineTotal'">
              <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'productName'">
              <commonProductAndPicture :row="scope.row" />
            </template>
            <template v-else-if="item.prop === 'purchaseUom'">
              <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'description'">
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :selectedNum="selectList1.length"
        :saveKey="saveKey"
        :savePath="savePath"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryLCReceivedNoteDetailBatchList,
  querySearchFromLCReceivedNoteDetailBatchList
} from '@/api/purchaseManagement/logisticsCost'
export default {
  directives: {
    // transferDom
  },
  mixins: [pageMixin],
  props: {
    currencyId: {
      type: String,
      default: ''
    },
    logisticsDocumentId: {
      type: String,
      default: ''
    },
    documentType: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '5',
      savePath: 'LCostTable',
      activeName: '1',
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'id',
      tableList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList1: [],
      visible: false,
      columns: [
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.storeIssueChitNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true,
          fixed: true
        },
        {
          prop: 'leadTime',
          label: vm.$t('PURCHASE.BatchNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          padding: 70,
          tooltip: false
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom'
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PURCHASE.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('PURCHASE.deliveryTime'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'receivedQty',
          label: vm.$t('PURCHASE.stockInQty'),
          visible: true,
          minWidth: 200,
          fixedWidth: 160,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'documentCreatedBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'documentCreatedTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }

        // {
        //   prop: 'picture',
        //   label: vm.$t('ui.picture'),
        //   visible: true,
        //   width: 120
        // }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: '',
        conditionForPR: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        },
        {
          name: 'conditionForStoreIssueChitNo',
          label: this.$t('PURCHASE.storeIssueChitNo'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }
      ],
      // 请求的时间戳
      queryTime: undefined,
      isOnlyDefaultDept: false
    }
  },
  computed: {
    selectIds() {
      return this.selectIds1
    },
    selectIds1() {
      return this.selectList1.map((item) => item[this.rowIdKey])
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    showAllAuth() {
      return this.checkPermi(['purchaseManagement:logisticsCost:departmentData'])
    }
  },
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible('1', this.columns)
  },
  updated() {},
  methods: {
    handleAdd(alreadySelectIdList) {
      this.selectList1 = alreadySelectIdList || []
      if (this.selectList1.length > 0) {
        this.selectList1.forEach((x, i) => {
          if (!x.id) {
            x.id = Date.now() + i + ''
          }
        })
      }
      this.visible = true
      this.activeName = '1'
      this.resetSearchForm()
    },
    querySearchFromLCReceivedNoteDetailBatchList() {
      const param = {}
      param.currencyId = this.currencyId
      param.documentType = this.documentType
      param.logisticsDocumentId = this.logisticsDocumentId
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      // param.documentDetailIdList = this.alreadySelectIdList
      param.menuPerms = this.menuKey.logisticsCost

      querySearchFromLCReceivedNoteDetailBatchList(param).then((res) => {
        const data = res.data || {}
        const conditionForStoreIssueChitNoList = (data.conditionForStoreIssueChitNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )
        this.searchData[1].fuzzyData = conditionForStoreIssueChitNoList
      })
    },
    getList() {
      this.querySearchFromLCReceivedNoteDetailBatchList()
      const timer = Date.now()
      this.queryTime = timer
      const vm = this
      const param = this.queryParams
      param.currencyId = this.currencyId
      param.documentType = this.documentType
      param.logisticsDocumentId = this.logisticsDocumentId
      param.selectedProductList = this.selectList1
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      // param.documentDetailIdList = this.alreadySelectIdList
      this.loading = true
      const queryFn = queryLCReceivedNoteDetailBatchList
      param.menuPerms = this.menuKey.logisticsCost
      this.$trimOfObj(param)

      queryFn(param)
        .then((response) => {
          if (timer !== this.queryTime) return
          this.loading = false
          this.total = response.total
          const rows = response.rows || []
          rows.forEach((item) => {
            item.qty = item.receivedQty
            // item.lineTotal = item.logisticsLineTotal
            // item.unitPrice = item.averageUnitPriceForBasic
            // item.documentId = item.storeIssueChitId
            // item.documentNo = item.storeIssueChitNo
            // item.documentDetailId = item.storeIssueChitProductId
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.documentCreatedTime = this.parseTime(item.documentCreatedTime, this.fmtForYmdhms)
          })
          this.tableList = response.rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          this.$nextTick(() => {
            this.selectList1.forEach((row) => {
              this.tableList.forEach((item, index) => {
                if (row[this.rowIdKey] === item[this.rowIdKey]) {
                  item.qty = row.qty
                  this.$refs.tables.toggleRowSelection(this.tableList[index], true)
                }
              })
            })
          })
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    qtyChange(row) {
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      if (row.unitPrice && row.qty) {
        const lineTotal = row.unitPrice * row.qty
        this.$set(row, 'lineTotal', lineTotal)
      } else {
        this.$set(row, 'lineTotal', undefined)
      }
      const findItem = this.selectList1.find((item) => row[this.rowIdKey] === item[this.rowIdKey])
      if (findItem) {
        this.$set(findItem, 'qty', row.qty)
        this.$set(findItem, 'lineTotal', row.lineTotal)
      }
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selectList1.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selectList1.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selectList1 = vm.selectList1.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selectList1.length; i++) {
        if (vm.selectList1[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selectList1.splice(i, 1)
        }
      }
      vm.selectList1.push(row)
    },
    handleRowClick(row, col) {
      if (col && col.property === 'picture') {
        return
      }
      const index = this.selectList1.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (col && col.property === 'qty') {
        if (isSelected) return
      }
      if (isSelected) {
        this.selectList1.splice(index, 1)
      } else {
        this.selectList1.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    closed() {
      this.selectList1 = []
      this.tableList = []
      this.$refs.tables.clearSelection()
    },
    submit() {
      const leadTimes = this.selectList1.filter((x) => x.leadTime)
      if (leadTimes.length !== 0 && leadTimes.length !== this.selectList1.length) {
        this.$modal.msgError(this.$t('PURCHASE.keepOnlyOneType'))
        this.btnLoading = false
        return
      }
      const qtyReq = this.selectList1.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty')))
        this.btnLoading = false
        return
      }
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      this.$emit('onSuccess', this.selectList1)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
