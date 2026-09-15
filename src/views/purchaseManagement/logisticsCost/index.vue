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
      :isBtn="true"
      v-show="showSearch"
      @updateSearchData="updateSearchData"
    />

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          v-if="addAuth"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
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
          v-hasPermi="['purchaseManagement:logisticsCost:export']"
          >{{ $t('uiBtn.export') }}</el-button
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
      class="mt10"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleDblclick"
      style="cursor: pointer"
      row-key="logisticsDocumentId"
      :tree-props="{ children: 'reviseList', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="checkPermi(['purchaseManagement:logisticsCost:export'])"
      >
      </el-table-column>
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
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
          <span v-if="['reallyTotalAmountForLegalEntityShowStr'].includes(item.prop)">
            <span class="item-label">{{ column.label }}</span>
            <span class="ml5" v-if="legalEntityInfo.currencyCode">{{
              `(${legalEntityInfo.currencyCode})`
            }}</span>
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row.isActive"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'shippingAgentName'">
            <!-- <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, item.prop)"
            /> -->

            <div
              @mouseenter="showPop($event, scope.row, 'shippingAgentName')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text" :class="{ 'primary-link': BPAuth }">
                {{ scope.row.shippingAgentName }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'documentNoShowStr'">
            <div
              @mouseenter="showPop($event, scope.row, 'documentNoShowStr')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div
                class="ellipsis-text"
                :class="{ 'primary-link': documentTypeGetAuth(scope.row.documentType) }"
              >
                {{ scope.row.documentNoShowStr }}
              </div>
            </div>
          </template>
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

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="documentClick" />
    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

import { queryLogisticsCostList, querySearchList } from '@/api/purchaseManagement/logisticsCost'

export default {
  name: 'LogisticsCost',
  dicts: ['logistics_document_type'],
  components: { ToolTipShowListForFN },
  mixins: [pageMixin],
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
          prop: 'logisticsDocumentNo',
          label: vm.$t('PURCHASE.logisticsCostNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'documentTypeShowStr',
          label: vm.$t('PURCHASE.documentType'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'documentNoShowStr',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'shippingAgentName',
          label: vm.$t('PURCHASE.shippingAgent'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'country',
          label: vm.$t('PURCHASE.country'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true
        },
        /* {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }, */
        {
          prop: 'reallyTotalAmountForLegalEntityShowStr',
          label: vm.$t('PURCHASE.totalAmount'),
          colMinWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'picUserName',
          label: vm.$t('ui.pic'),
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
          placeholder: `${this.$t('PURCHASE.shippingAgentSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForDocumentNo' },
            {
              label: this.$t('PURCHASE.logisticsCostNo'),
              value: 'conditionForLogisticsDocumentNo'
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
          name: 'conditionDocumentType',
          label: vm.$t('PURCHASE.documentType'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'SelectAnMultipleSelectName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnMultipleSelect',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.createdBy'), value: 'createdIdList' },
            { label: this.$t('ui.pic'), value: 'picUserIdList' }
          ],
          selectName: 'selectId2',
          inputName: 'inputVal2',
          selectId: 'createdIdList',
          inputVal: [],
          filterable: true,
          selectData2: [],
          selectValue2: 'value',
          selectLabel2: 'label'
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
      importOptions: {
        // 下载模板
        downFileUrl: '/system/productSheet/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/productSheet/checkImportData',
        // 提交导入
        importUrl: '/system/productSheet/importData',
        // 下载文件名
        fileName: 'productInformationSheet'
      },
      conditionForLogisticsNoList: [],
      conditionForDocumentNoList: []
    }
  },
  watch: {},
  computed: {
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    addAuth() {
      return this.checkPermi(['purchaseManagement:logisticsCost:add'])
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    POAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:list'])
    },
    PROAuth() {
      return this.checkPermi(['purchaseManagement:purchaseReturnOrder:list'])
    },
    SGRAuth() {
      return this.checkPermi(['salesManagement:salesGoodsReturn:list'])
    },
    SICAuth() {
      return this.checkPermi(['projectManagement:storeIssueChit:list'])
    },
    TOAuth() {
      return this.checkPermi(['inventoryManagement:transferOrder:list'])
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
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
      this.queryParams.selectId = 'conditionForDocumentNo'
      this.queryParams.selectId2 = 'createdIdList'

      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForDocumentNo'
          item.inputVal = ''
        }
        if (item.name === 'SelectAnMultipleSelectName') {
          item.selectId = 'createdIdList'
          item.inputVal = []
        }
      })
      this.searchFormKey = Date.now()
    },
    getList() {
      this.querySearchList()

      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      if (param.inputVal && param.selectId) {
        param[param.selectId] = param.inputVal
      }
      if (param.inputVal2 && param.selectId2) {
        param[param.selectId2] = param.inputVal2
      }
      param = this.$trimOfObj(param)
      this.loading = true
      queryLogisticsCostList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            this.setItemDict(item)
            if (item.reviseList) {
              item.reviseList.forEach((child) => {
                // child.purchaseQuotationIdKey = child.purchaseQuotationId + index
                this.setItemDict(child)
              })
            }
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.tableList = []
          this.loading = false
        })
    },
    setItemDict(item) {
      item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
      item.documentNoShowStr = (item.documentJson || []).map((item) => item.no).join(', ')
      item.totalAmount = this.$numberStr(item.totalAmount, 2)
    },
    onDictReady() {
      this.searchData.forEach((x) => {
        if (x.name === 'conditionDocumentType') {
          this.$set(x, 'selectData', [...this.dict.type.logistics_document_type])
        }
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const data = res.data || {}
        const { conditionForLogisticsNoList, conditionForDocumentNoList } = res.data

        this.conditionForLogisticsNoList = this.handle(conditionForLogisticsNoList)
        this.conditionForDocumentNoList = this.handle(conditionForDocumentNoList)

        this.createdList = (data.createdList || []).map((item) => {
          return {
            value: item.createdId,
            label: item.createdBy
          }
        })

        this.picUserList = (data.picUserList || []).map((item) => {
          return {
            value: item.picUserId,
            label: item.picUserBy
          }
        })
        this.setFuzzyData()
        this.setCreatedListData()
      })
    },
    handle(data = []) {
      if (!data || data.length <= 0) return []
      return data.map((item) => {
        return {
          value: item,
          label: item
        }
      })
    },

    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.logisticsDocumentId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      // if (!row.logisticsDocumentId) return false
      return true // 不禁用
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/purchaseManagement/addLogisticsCost',
        query: {
          timeId: Date.now()
        }
      })
    },
    handleDblclick(row, column, event) {
      if (column && column.type === 'selection') {
        return
      }
      if (!row.logisticsDocumentId) return
      /* 展开收起的时候会触发行双击 */
      if (event && event.target && event.target.className === 'el-icon-arrow-right') {
        return
      }
      this.$router.push({
        path: '/purchaseManagement/viewLogisticsCost',
        query: {
          id: row.logisticsDocumentId,
          timeId: Date.now()
        }
      })
    },
    nav(row, type) {
      if (type === 'shippingAgentName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.shippingAgentId,
            timeId: Date.now()
          }
        })
      } else if (type === 'stockCertificateNo') {
        this.$router.push({
          path: '/inventoryManagement/viewStockCertificate',
          query: {
            id: row.stockCertificateId,
            timeId: Date.now()
          }
        })
      }
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      this.searchFormKey = Date.now()
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
      } else if (item.name === 'SelectAnMultipleSelectName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = []
          this.setCreatedListData()
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = []
          this.setCreatedListData()
        } else {
          item.inputVal = e.value || []
        }
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForLogisticsDocumentNo') {
            this.$set(item, 'fuzzyData', this.conditionForLogisticsNoList)
          } else if (item.selectId === 'conditionForDocumentNo') {
            this.$set(item, 'fuzzyData', this.conditionForDocumentNoList)
          }
        }
      })
    },
    setCreatedListData() {
      this.searchData.forEach((item) => {
        if (item.name === 'SelectAnMultipleSelectName') {
          if (item.selectId === 'createdIdList') {
            this.$set(item, 'selectData2', this.createdList)
          } else if (item.selectId === 'picUserIdList') {
            this.$set(item, 'selectData2', this.picUserList)
          } else {
            this.$set(item, 'selectData2', [])
          }
        }
      })
    },

    documentTypeGetAuth(documentType) {
      const auth = {
        1: this.POAuth,
        16: this.PROAuth,
        15: this.SGRAuth,
        23: this.SICAuth,
        22: this.TOAuth
      }
      return auth[documentType]
    },

    showPop(e, row, type) {
      let list = []
      if (type === 'documentNoShowStr') {
        list = row.documentJson || []
        list.forEach((i) => {
          i.documentType = row.documentType + ''
        })

        const params = {
          popoverTitle: this.$t('PURCHASE.DocNo'),
          labelKey: 'no',
          itemClass: this.documentTypeGetAuth(row.documentType) ? 'primary-pointer' : '',
          list
        }
        if (list.length > 0 && this.$refs.ToolTipShowList) {
          this.$refs.ToolTipShowList.showPop(e, params)
        }
      } else if (type === 'shippingAgentName') {
        list = row.shippingAgentShowJson || []
        list = list.map((x) => {
          return {
            customName: x.shipAgentName,
            customId: x.shipAgentId,
            itemClass: this.BPAuth ? 'primary-pointer' : '',
            type
          }
        })
        const params = {
          popoverTitle: this.$t('PURCHASE.shippingAgent'),
          labelKey: 'customName',
          itemClass: this.BPAuth ? 'primary-pointer' : '',
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
    documentClick(item) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()

      if (item.type === 'shippingAgentName') {
        if (!this.BPAuth) return
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: item.customId,
            timeId: Date.now()
          }
        })
        return
      }
      if (!this.documentTypeGetAuth(item.documentType)) return
      if (item.documentType === '1') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseOrder',
          query: {
            id: item.id,
            timeId: Date.now()
          }
        })
      } else if (item.documentType === '16') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseReturnOrder',
          query: {
            id: item.id,
            timeId: Date.now()
          }
        })
      } else if (item.documentType === '15') {
        this.$router.push({
          path: '/salesManagement/viewSalesGoodsReturn',
          query: {
            id: item.id,
            timeId: Date.now()
          }
        })
      } else if (item.documentType === '23') {
        this.$router.push({
          path: '/projectManagement/viewStoreIssueChit',
          query: {
            id: item.id,
            timeId: Date.now()
          }
        })
      } else if (item.documentType === '22') {
        this.$router.push({
          path: '/inventoryManagement/viewTransferOrder',
          query: {
            id: item.id,
            timeId: Date.now()
          }
        })
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.logisticsDocumentId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    settingHandleCommand(command) {
      switch (command) {
        case 'active':
          this.handleChangeUsersStatus('active')
          break
        case 'inactive':
          this.handleChangeUsersStatus('inactive')
          break
        default:
          break
      }
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
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (params.inputVal2 && params.selectId2) {
        params[params.selectId2] = params.inputVal2
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.logisticsDocumentId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/pLogisticsDocument/export',
        params,
        `${this.getFileNameDate('Logistics Cost')}.xlsx`
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
