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
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['projectManagement:projectTransfer:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>

      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
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
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      @selection-change="handleSelectionChange"
      style="cursor: pointer"
      :max-height="tableMaxHeight"
    >
      <!-- <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="checkPermi(['projectManagement:projectTransfer:edit'])"
      /> -->
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
        <template slot="header" slot-scope="{ column }">
          <template v-if="['transferAmount'].includes(item.prop)">
            <span>{{ column.label }}</span>
            <span v-if="legalEntityInfo.currencySymbol"
              >({{ legalEntityInfo.currencySymbol }})</span
            >
          </template>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'productNames'">
            <div
              @mouseenter="showPop($event, scope.row, 'productName')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'transferFromBusinessPartnerName'">
            <div
              @mouseenter="showPop($event, scope.row, 'transferFromBusinessPartnerName')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text" :class="{ 'primary-link': BPAuth }">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'transferToBusinessPartnerName'">
            <div
              @mouseenter="showPop($event, scope.row, 'transferToBusinessPartnerName')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text" :class="{ 'primary-link': BPAuth }">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'totalCost'">{{
            $numberStr(scope.row[item.prop], 2)
          }}</template>
          <template v-else-if="item.prop === 'transferAmount'">{{
            $numberStr(scope.row[item.prop], 2)
          }}</template>
          <template v-else-if="item.prop === 'totalAmount'">{{
            $numberStr(scope.row[item.prop], 2)
          }}</template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <!-- 导入 -->
    <!-- <importExcelDlg ref="importExcelDlg" @onSuccess="getList" /> -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="clickItem" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import {
  querySearchList,
  queryCostProjectTransferList
} from '@/api/projectManagement/projectTransfer'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  name: 'ProjectTransfer',
  dicts: ['project_template_status'],
  mixins: [pageMixin],
  components: { ToolTipShowListForFN },
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      loading: false,
      columns: [
        {
          prop: 'costProjectTransferNo',
          label: vm.$t('PRODUCT.projectTransferOrderNo'),
          visible: true,
          minWidth: 140,
          sortable: 'custom'
        },
        {
          prop: 'transferFromCostProjectName',
          label: vm.$t('PRODUCT.transferFrom'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'transferFromBusinessPartnerName',
          label: vm.$t('PRODUCT.transferFromCustomer'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'transferToCostProjectName',
          label: vm.$t('PRODUCT.transferTo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'transferToBusinessPartnerName',
          label: vm.$t('PRODUCT.transferToCustomer'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'productNames',
          label: vm.$t('PRODUCT.product'),
          minWidth: 200,
          visible: true,
          // sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'transferAmount',
          label: vm.$t('PRODUCT.transferAmount'),
          visible: true,
          colMinWidth: 180,
          padding: 50,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PRODUCT.productSearch')} / ${vm.$t(
            'PRODUCT.projectTransferOrderNo'
          )}`
        },
        {
          name: 'costProjectIdList',
          label: vm.$t('INVENTORY.project'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'costProjectId',
          selectLabel: 'costProjectName',
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('INVENTORY.customer1'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          filterable: true,
          selectData: []
        },
        {
          name: 'createdIdList',
          label: vm.$t('ui.createdBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDate',
          endDate: 'endDate'
        }
      ],
      importOptions: {
        // 下载模板
        downFileUrl: '/system/productCategory/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/productCategory/checkImportData',
        // 提交导入
        importUrl: '/system/productCategory/importData',
        // 下载文件名
        fileName: 'Product Category'
      }
    }
  },
  watch: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['projectManagement:projectTransfer:edit'])
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    BPAuth() {
      return this.checkPermi(['businessPartner:businessPartner:list'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    showPop(e, row, type) {
      if (type === 'productName') {
        const list = row.costProjectTransferProductList || []
        const params = {
          // popoverTitle: this.$t('PURCHASE.DocNo'),
          labelKey: 'productName',
          // itemClass: 'primary-pointer',
          list
        }
        if (list.length > 0 && this.$refs.ToolTipShowList) {
          this.$refs.ToolTipShowList.showPop(e, params)
        }
      }
      if (type === 'transferFromBusinessPartnerName') {
        let list = row.transferFromBusinessPartnerList || []
        list = list.map((x) => {
          return {
            customName: x.businessPartnerName,
            customId: x.businessPartnerId,
            itemClass: this.BPAuth ? 'primary-pointer' : '',
            type
          }
        })
        const params = {
          labelKey: 'customName',
          list
        }
        if (list.length > 0 && this.$refs.ToolTipShowList) {
          this.$refs.ToolTipShowList.showPop(e, params)
        }
      }
      if (type === 'transferToBusinessPartnerName') {
        let list = row.transferToBusinessPartnerList || []
        list = list.map((x) => {
          return {
            customName: x.businessPartnerName,
            customId: x.businessPartnerId,
            itemClass: this.BPAuth ? 'primary-pointer' : '',
            type
          }
        })
        const params = {
          labelKey: 'customName',
          list
        }
        if (list.length > 0 && this.$refs.ToolTipShowList) {
          this.$refs.ToolTipShowList.showPop(e, params)
        }
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    clickItem(item) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      const { type, customId } = item
      if (type === 'transferFromBusinessPartnerName' || type === 'transferToBusinessPartnerName') {
        if (!this.BPAuth) return
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: customId,
            timeId: Date.now()
          }
        })
      } else if (type === 'purchaseQuotationNo') {
        if (!this.PQAuth) return
        this.$router.push({
          path: '/purchaseManagement/editPurchaseQuotation',
          query: {
            id: customId,
            timeId: Date.now(),
            backType: '2'
          }
        })
      } else if (type === 'internalPartNo') {
        if (item.internalPartNo === 'Adhoc Entry') {
          this.$router.push({
            path: '/productManagement/editProductInfo',
            query: {
              id: customId,
              timeId: Date.now(),
              back: '1'
            }
          })
        } else {
          if (item.isCustomProduct === '1') return
          this.$router.push({
            path: '/productManagement/viewExtendedProductInfo',
            query: {
              id: customId,
              timeId: Date.now()
            }
          })
        }
      } else if (type === 'documentNo') {
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
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDate', startTimer)
      this.$set(this.queryParams, 'endDate', end)
    },
    getList() {
      this.querySearchList()

      this.ids = []
      this.single = true
      this.multiple = true

      const param = { ...this.queryParams }
      if (this.queryParams.parentId && this.queryParams.parentId.length > 0) {
        param.parentId = this.queryParams.parentId[this.queryParams.parentId.length - 1]
      } else {
        param.parentId = undefined
      }
      this.loading = true
      queryCostProjectTransferList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.projectTemplateStatusStr = this.selectDictLabel(
              this.dict.type.project_template_status,
              item.projectTemplateStatus
            )
          })
          this.tableList = rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.projectTemplateStatusStr = this.selectDictLabel(
          this.dict.type.project_template_status,
          item.projectTemplateStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const { businessPartnerList, costProjectList, createdList } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'businessPartnerIdList') {
            this.$set(x, 'selectData', businessPartnerList)
          } else if (x.name === 'costProjectIdList') {
            this.$set(x, 'selectData', costProjectList)
          } else if (x.name === 'createdIdList') {
            this.$set(x, 'selectData', createdList)
          }
        })
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.projectTransferId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.handle(x.child)
          }
        })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.projectTransferId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handleAdd(row) {
      this.$router.push({
        path: '/projectManagement/addProjectTransfer',
        query: { timeId: +new Date() }
      })
    },
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/projectManagement/editProjectTransfer',
        query: { id: row.costProjectTransferId, timeId: +new Date() }
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

      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    },
    handleSelectAll() {
      const isAllSelected = this.$refs.tables.store.states.isAllSelected
      const _handleSelectAll = (data) => {
        data.forEach((item) => {
          this.$refs.tables.toggleRowSelection(item, isAllSelected)
          _handleSelectAll(item.child || [])
        })
      }
      _handleSelectAll(this.tableList)
    },
    handleSelect(selection, current) {
      // 判断selection中是否存在current,若是存在那么就代表是被勾选上了,若是不存在代表是取消勾选了
      const isChecked = !!selection.find((item) => item.id === current.id)
      // 如果当前项被取消勾选
      if (!isChecked) {
        // 那么其所有的祖先也应该被取消勾选
        // this.uncheckedParents(selection, current)
        // 那么其所有的后代也应该被取消勾选
        this.toggleCheckedChildrens(selection, current, false)
      } else {
        // 如果当前项被勾选
        // 那么若同一组的元素都被勾选了,那么父元素将也被勾选,依次往上类推
        // this.checkedParents(selection)
        // 那么其所有的后代都要被勾选
        this.toggleCheckedChildrens(selection, current, true)
      }
    },
    toggleCheckedChildrens(selection, item, isChecked) {
      const _toggleCheckedChildrens = (data) => {
        // eslint-disable-next-line array-callback-return
        data.find((element) => {
          this.$refs.tables.toggleRowSelection(element, isChecked)
          if (isChecked && !selection.find((item) => item.id === element.id)) {
            selection.push(element)
          } else if (!isChecked && selection.find((item) => item.id === element.id)) {
            for (let i = selection.length - 1; i >= 0; i--) {
              if (selection[i].id === element.id) {
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
    checkedParents(selection) {
      const _checkedParents = (element) => {
        const children = element.child
        if (children && children.length) {
          const allChildrenChecked = children.every((child) => {
            return _checkedParents(child)
          })
          if (allChildrenChecked) {
            this.$refs.tables.toggleRowSelection(element, true)
            if (!selection.find((item) => item.id === element.id)) {
              selection.push(element)
            }
          }
        }
        return selection.find((item) => item.id === element.id)
      }
      this.tableList.forEach((element) => {
        _checkedParents(element)
      })
    },
    uncheckedParents(selection, item) {
      const _uncheckedParents = (data) => {
        return data.find((element) => {
          if (element.id === item.id) {
            return true
          } else if (_uncheckedParents(element.child || [])) {
            this.$refs.tables.toggleRowSelection(element, false)
            for (let i = selection.length - 1; i >= 0; i--) {
              if (selection[i].id === element.id) {
                selection.splice(i, 1)
                break
              }
            }
            return true
          } else {
            return false
          }
        })
      }
      _uncheckedParents(this.tableList)
    },
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
        params.exportIdList = vm.tableList.map((item) => item.projectTransferId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/system/productCategory/export',
        params,
        `${this.getFileNameDate('Product Category')}.xlsx`
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

<style scoped></style>
