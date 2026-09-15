<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['inventoryManagement:transferOrder:add']"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['inventoryManagement:transferOrder:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>

      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
      <el-table-column
        v-if="checkPermi(['inventoryManagement:transferOrder:export'])"
        type="selection"
        width="50"
        align="center"
        :selectable="selectable"
      />
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
          <template v-if="item.prop === 'goodsReceivedNoteNo'">
            <div
              @mouseenter="showPop($event, scope.row)"
              @mouseleave="hidePop($event, scope.row)"
              v-if="
                scope.row.goodsReceivedNoteNoList && scope.row.goodsReceivedNoteNoList.length > 1
              "
            >
              <div class="ellipsis-text">{{ scope.row.goodsReceivedNoteNo }}</div>
            </div>
            <div v-else :title="scope.row.goodsReceivedNoteNo">
              {{ scope.row.goodsReceivedNoteNo }}
            </div>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>

      <!-- <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="100"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <svg-icon
            icon-class="list2"
            class="primary-pointer"
            style="font-size: 20px"
            @click="handleOperationLog(scope.row)"
          />
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />
    <ToolTipShowListForFN ref="ToolTipShowList" />
  </div>
</template>

<script>
import {
  queryTransferOrderList,
  querySearchList,
  queryOperationLogList
} from '@/api/inventoryManagement/transferOrder'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  name: 'TransferOrder',
  components: { systemOperationLogTableDlg, ToolTipShowListForFN },
  dicts: ['approved_status'],
  mixins: [pageMixin],
  data() {
    const vm = this

    return {
      saveKey: '1',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 日期范围
      dateRange: [],
      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/system/product/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/product/checkImportData',
        // 提交导入
        importUrl: '/system/product/importData',
        // 下载文件名
        fileName: 'Product Info'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('INVENTORY.transferOrderNo'), value: 'conditionForTransferOrderNo' },
            { label: this.$t('INVENTORY.deliveryNoticeNo'), value: 'conditionForDeliveryNoticeNo' },
            {
              label: this.$t('INVENTORY.goodsReceiptNoteNo'),
              value: 'conditionForGoodsReceiptNoteNo'
            }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: '',
          inputVal: '',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }, */

        {
          name: 'transferOrderStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'approvedStatusList',
          label: vm.$t('ui.processStatus'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'fromWarehouseIdList',
          label: vm.$t('INVENTORY.transferFrom'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'fromWarehouseId',
          selectLabel: 'fromWarehouseName',
          selectData: []
        },
        {
          name: 'toWarehouseIdList',
          label: vm.$t('INVENTORY.transferTo'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'toWarehouseId',
          selectLabel: 'toWarehouseName',
          selectData: []
        },
        {
          name: 'createdIdList',
          label: this.$t('ui.createdBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          multiple: false,
          selectValue: 'createdId',
          selectLabel: 'createdBy',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'transferOrderNo',
          label: vm.$t('INVENTORY.transferOrderNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'fromWarehouseName',
          label: vm.$t('INVENTORY.transferFrom'),
          visible: true,
          minWidth: 140,
          sortable: 'custom'
        },
        {
          prop: 'toWarehouseName',
          label: vm.$t('INVENTORY.transferTo'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'transferOrderStatus',
          propBy: 'transferOrderStatusStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'approvedStatus',
          propBy: 'approvedStatusStr',
          label: vm.$t('ui.processStatus'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'scheduledTransferDate',
          label: vm.$t('INVENTORY.scheduledTransferDate'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'deliveryNoticeNo',
          label: vm.$t('INVENTORY.deliveryNoticeNo'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'goodsReceivedNoteNo',
          label: vm.$t('INVENTORY.goodsReceivedNo'),
          minWidth: 140,
          visible: true,
          tooltip: false
          // sortable: 'custom'
        },
        {
          prop: 'stockedOutTime',
          label: vm.$t('INVENTORY.dateStockOut'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'stockedInTime',
          label: vm.$t('INVENTORY.dateStockIn'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'approvedBy',
          label: vm.$t('ui.approvedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'approvedTime',
          label: vm.$t('ui.approvedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],

      statusDicts: [],
      approvedStatusDicts: []
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
      return this.checkPermi(['organization:user:edit'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  async created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    const a = this.MyDictDataClass.getDictFn('transfer_order_status')
    const b = this.MyDictDataClass.getDictFn('approved_status')
    await Promise.all([a, b]).then((res) => {
      const res1 = res[0] || {}
      const res2 = res[1] || {}
      this.statusDicts = (res1 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.approvedStatusDicts = (res2 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData.forEach((item) => {
      if (item.name === 'transferOrderStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedStatusDicts
      }
    })
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    showPop(e, row, type) {
      const list = row.goodsReceivedNoteNoList || []
      const params = {
        // popoverTitle: this.$t('PURCHASE.DocNo'),
        // labelKey: 'goodsReceivedNoteNo',
        // itemClass: 'primary-pointer',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(queryOperationLogList, {
        transferOrderId: row.transferOrderId
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.transferOrderId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      if (row.adminFlag === 1) {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    /** 查询用户列表 */
    getList() {
      this.querySearchList()
      this.loading = true
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)

      queryTransferOrderList(params).then((response) => {
        const rows = response.rows || []
        rows.forEach((item) => {
          item.scheduledTransferDate = this.parseTime(item.scheduledTransferDate, this.fmtForYmd)
          item.stockedOutTime = this.parseTime(item.stockedOutTime, this.fmtForYmdhms)
          item.stockedInTime = this.parseTime(item.stockedInTime, this.fmtForYmdhms)
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.transferOrderStatusStr = this.selectDictLabel(
            this.statusDicts,
            item.transferOrderStatus
          )
          item.approvedStatusStr = this.selectDictLabel(
            this.approvedStatusDicts,
            item.approvedStatus
          )
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    querySearchList() {
      querySearchList({ labelType: '0' }).then((res) => {
        const data = res.data || {}
        const fromWarehouseList = data.fromWarehouseList || []
        const toWarehouseList = data.toWarehouseList || []
        const createdList = data.createdList || []

        this.conditionForTransferOrderNoList = (data.conditionForTransferOrderNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )
        this.conditionForDeliveryNoticeNoList = (data.conditionForDeliveryNoticeNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )
        this.conditionForGoodsReceiptNoteNoList = (
          data.conditionForGoodsReceiptNoteNoList || []
        ).map((item) => {
          return {
            value: item,
            label: item
          }
        })

        this.searchData.forEach((item) => {
          if (item.name === 'fromWarehouseIdList') {
            this.$set(item, 'selectData', fromWarehouseList)
          } else if (item.name === 'toWarehouseIdList') {
            this.$set(item, 'selectData', toWarehouseList)
          } else if (item.name === 'createdIdList') {
            this.$set(item, 'selectData', createdList)
          }
        })
        this.setFuzzyData()
      })
    },

    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
      this.queryParams.selectId = 'conditionForTransferOrderNo'
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForTransferOrderNo'
          item.inputVal = ''
        }
      })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData(e) {
      const item = this.searchData[e.index]
      if (item.name === 'selectAnInputName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = ''
          this.setFuzzyData()
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = ''
          this.setFuzzyData()
        } else {
          item.inputVal = e.value || ''
        }
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForTransferOrderNo') {
            this.$set(item, 'fuzzyData', this.conditionForTransferOrderNoList)
          } else if (item.selectId === 'conditionForDeliveryNoticeNo') {
            this.$set(item, 'fuzzyData', this.conditionForDeliveryNoticeNoList)
          } else if (item.selectId === 'conditionForGoodsReceiptNoteNo') {
            this.$set(item, 'fuzzyData', this.conditionForGoodsReceiptNoteNoList)
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.transferOrderId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/inventoryManagement/addTransferOrder',
        query: {
          timeId: Date.now()
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/inventoryManagement/editTransferOrder',
        query: {
          id: row.transferOrderId,
          timeId: Date.now()
        }
      })
    },
    /** 导出按钮操作 */
    /** 导出按钮操作 */
    openExport() {
      this.$refs.ExportDlgRef.open()
    },
    handleExport(data) {
      const vm = this
      const { exportType } = data
      let params = this.addDateRange(this.queryParams, this.dateRange)
      params = JSON.parse(JSON.stringify(params))
      params = this.$trimOfObj(params)
      params.exportType = exportType

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.transferOrderId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/transferOrder/export',
        params,
        `${this.getFileNameDate('Transfer Order')}.xlsx`
      )
        .then((res) => {
          vm.exportLoading = false
          vm.$refs.ExportDlgRef.hide()
          vm.$modal.msgSuccess(vm.$t('ui.exportSuccess'))
        })
        .catch(() => {
          vm.exportLoading = false
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
    margin-right: 10px;
  }
}
.dept-select {
  /deep/ .vue-treeselect--disabled .vue-treeselect__control {
    background-color: #f5f7fa;
  }
  /deep/ .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
