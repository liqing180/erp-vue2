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
      @updateSearchData="updateSearchData"
    />

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['inventoryManagement:stockLog:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>
      <right-toolbar
        ref="rightToolbar"
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
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
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
          <template v-if="item.prop === 'stockCertificateNo'">
            <span class="primary-link" @click="nav(scope.row, 'stockCertificateNo')">{{
              scope.row.stockCertificateNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'documentNo'">
            <span v-if="scope.row.documentType === '40'">{{ scope.row.documentNo }}</span>
            <span
              v-else
              :class="{ 'primary-link': documentTypeGetAuth(scope.row) }"
              @click="nav(scope.row, 'documentNo')"
              >{{ scope.row.documentNo }}</span
            >
          </template>
          <template v-else-if="item.prop === 'revisedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'beforeQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'afterQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
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

    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/inventoryManagement/lang/index'
import { queryStockLogList, querySearchList } from '@/api/inventoryManagement/stockLog'

export default {
  name: 'StockLog',
  dicts: ['i_inventory_type', 'i_stock_certificate_document_type'],
  mixins: [pageMixin],
  components: {},
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      loading: false,
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
      selectList: [],
      // 显示搜索条件
      showSearch: true,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('INVENTORY.productName'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('INVENTORY.internalPartNo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'consignorName',
          label: vm.$t('INVENTORY.consignor'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'customerName',
          label: vm.$t('INVENTORY.customer'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'stockCertificateNo',
          label: vm.$t('INVENTORY.certificateNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'warehouseName',
          label: vm.$t('INVENTORY.warehouseName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'documentNo',
          label: vm.$t('INVENTORY.associatedDocNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'stockOutInNoteNo',
          label: vm.$t('INVENTORY.stockOutStockInNote'),
          visible: true,
          minWidth: 210,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'documentType',
          propBy: 'documentTypeStr',
          label: vm.$t('INVENTORY.documentType'),
          visible: true,
          minWidth: 240,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'batchNo',
          label: vm.$t('INVENTORY.batchNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'inventoryType',
          propBy: 'inventoryTypeStr',
          label: vm.$t('INVENTORY.inventoryType'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'revisedQty',
          propBy: 'revisedQtyShowStr',
          label: vm.$t('INVENTORY.revisedQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'beforeQty',
          label: vm.$t('INVENTORY.before'),
          visible: true,
          minWidth: 200,
          padding: 60,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'afterQty',
          label: vm.$t('INVENTORY.after'),
          visible: true,
          minWidth: 200,
          padding: 60,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('INVENTORY.operator'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('INVENTORY.time'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
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
            { label: this.$t('INVENTORY.certificateNo'), value: 'conditionForStockCertificateNo' },
            { label: this.$t('INVENTORY.associatedDocNo'), value: 'conditionForDocumentNo' },
            {
              label: this.$t('INVENTORY.stockOutStockInNote'),
              value: 'conditionForStockOutInNoteNo'
            },
            { label: this.$t('INVENTORY.batchNo'), value: 'conditionForBatchNo' }
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
          name: 'warehouseIdList',
          label: vm.$t('INVENTORY.warehouseName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'customerIdList',
          label: vm.$t('INVENTORY.customer'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'inventoryTypeIdList',
          label: this.$t('INVENTORY.inventoryType'),
          type: 'MultipleSelectEle',
          multiple: false,
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'i_inventory_type',
          selectData: []
        },
        {
          name: 'consignorIdList',
          label: vm.$t('INVENTORY.consignor'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'id',
          selectLabel: 'legalEntityName',
          selectData: []
        },
        {
          name: 'createdIdList',
          label: vm.$t('INVENTORY.operator'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
          selectData: []
        },
        {
          name: 'documentTypeList',
          label: this.$t('INVENTORY.documentType'),
          type: 'MultipleSelectEle',
          filterable: true,
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'i_stock_certificate_document_type',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('INVENTORY.time'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      importOptions: {
        // 下载模板
        downFileUrl: '/inventory/warehouseAssignment/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/inventory/warehouseAssignment/checkImportData',
        // 提交导入
        importUrl: '/inventory/warehouseAssignment/importData',
        // 下载文件名
        fileName: 'Warehouse Assignment'
      },
      conditionForBatchNoList: [],
      conditionForDocumentNoList: [],
      conditionForStockCertificateNoList: [],
      conditionForStockOutInNoteNoList: [],
      createdInitTimer: undefined,
      warehouseName: undefined
    }
  },
  watch: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    POAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:list'])
    },
    TOAuth() {
      return this.checkPermi(['inventoryManagement:transferOrder:list'])
    },
    preDeliveryNoticeAuth() {
      return this.checkPermi(['salesManagement:preDeliveryNotice:list'])
    },
    salesGoodsReturnAuth() {
      return this.checkPermi(['salesManagement:salesGoodsReturn:list'])
    },
    purchaseReturnOrderAuth() {
      return this.checkPermi(['purchaseManagement:purchaseReturnOrder:list'])
    },
    inventoryAuditAuth() {
      return this.checkPermi(['inventoryManagement:inventoryAudit:list'])
    },
    emergencyGoodsReceiptAuth() {
      return this.checkPermi(['inventoryManagement:emergencyGoodsReceipt:list'])
    },
    SICAuth() {
      return this.checkPermi(['projectManagement:storeIssueChit:list'])
    },
    consignmentOrderAuth() {
      return this.checkPermi(['purchaseManagement:consignmentOrder:list'])
    },
    projectProductionAuth() {
      return this.checkPermi(['projectManagement:projectProduction:list'])
    },
    projectAuth() {
      return this.checkPermi(['projectManagement:project:list'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    const { pageSize } = this.queryParams
    this.queryParams = { pageNum: 1, pageSize }
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.initQueryParams()
    this.defaultParams()
    this.querySearchList()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.defaultParams()
    this.querySearchList()
    this.getList()
  },
  methods: {
    defaultParams() {
      this.warehouseId = this.$route.query.warehouseId || ''
      this.warehouseName = this.$route.query.warehouseName || ''
      if (this.warehouseId) {
        this.$set(this.queryParams, 'warehouseIdList', [
          this.warehouseId + '-' + this.warehouseName
        ])
      } else {
        this.$set(this.queryParams, 'warehouseIdList', [])
      }

      this.searchFormKey = Date.now()
    },
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
      // this.searchData[1].selectId = 'conditionForStockCertificateNo'
      // this.queryParams.selectId = 'conditionForStockCertificateNo'
      // this.searchData[1].inputVal = ''
      this.searchFormKey = Date.now()
    },
    querySearchList() {
      querySearchList({}).then((res) => {
        const {
          createdList,
          warehouseList,
          legalEntityList,
          vendorList,
          conditionForBatchNoList,
          conditionForDocumentNoList,
          conditionForStockCertificateNoList,
          conditionForStockOutInNoteNoList
        } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'createdIdList') {
            this.$set(x, 'selectData', createdList)
          } else if (x.name === 'warehouseIdList') {
            this.$set(x, 'selectData', warehouseList)
          } else if (x.name === 'consignorIdList') {
            this.$set(x, 'selectData', legalEntityList)
          } else if (x.name === 'customerIdList') {
            this.$set(x, 'selectData', vendorList)
          }
        })
        this.conditionForBatchNoList = this.handle(conditionForBatchNoList)
        this.conditionForDocumentNoList = this.handle(conditionForDocumentNoList)
        this.conditionForStockCertificateNoList = this.handle(conditionForStockCertificateNoList)
        this.conditionForStockOutInNoteNoList = this.handle(conditionForStockOutInNoteNoList)

        /* 处理库存报表跳转携带的仓库ID */
        if (this.queryParams.warehouseIdList && this.queryParams.warehouseIdList.length > 0) {
          const newIds = []
          this.queryParams.warehouseIdList.forEach((id) => {
            if (!id.includes('-')) {
              const findItem = warehouseList.find((item) => item.warehouseId.includes(id))
              if (findItem) {
                newIds.push(findItem.warehouseId)
              }
            } else {
              newIds.push(id)
            }
          })
          this.$set(this.queryParams, 'warehouseIdList', newIds)
        }
        this.setFuzzyData()
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
    getList(query) {
      let params = { ...this.queryParams }
      params.productId = this.$route.query.productId || undefined
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)

      this.loading = true
      queryStockLogList(params)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.documentTypeStr = this.selectDictLabel(
              this.dict.type.i_stock_certificate_document_type,
              item.documentType
            )
            item.inventoryTypeStr = this.selectDictLabel(
              this.dict.type.i_inventory_type,
              item.inventoryType
            )
          })

          this.tableList = rows
          this.total = response.total
          this.loading = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.documentTypeStr = this.selectDictLabel(
          this.dict.type.i_stock_certificate_document_type,
          item.documentType
        )
        item.inventoryTypeStr = this.selectDictLabel(
          this.dict.type.i_inventory_type,
          item.inventoryType
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    documentTypeGetAuth(row) {
      let auth = false
      switch (row.documentType) {
        case '0':
          auth = true
          break
        case '1':
          auth = this.POAuth
          break
        case '3':
        case '22':
          auth = this.TOAuth
          break
        case '2':
        case '14':
          auth = this.preDeliveryNoticeAuth
          break
        case '15':
          auth = this.salesGoodsReturnAuth
          break
        case '16':
          auth = this.purchaseReturnOrderAuth
          break
        case '17':
          if (row.inventoryType === '1') {
            auth = this.POAuth
          } else {
            auth = this.preDeliveryNoticeAuth
          }
          break
        case '33':
          if (row.relevanceDocumentType === '22') {
            auth = this.TOAuth
          } else if (row.relevanceDocumentType === '14') {
            auth = this.preDeliveryNoticeAuth
          }
          break
        case '24':
          auth = this.inventoryAuditAuth
          break
        case '26':
          auth = this.inventoryAuditAuth
          break
        case '27':
          auth = this.emergencyGoodsReceiptAuth
          break
        case '28':
          auth = this.projectAuth
          break
        case '4':
        case '23':
          auth = this.SICAuth
          break
        case '30':
          auth = this.consignmentOrderAuth
          break
        case '31':
          auth = true
          break
        case '37':
          auth = this.projectProductionAuth
          break
      }
      return auth
    },
    nav(row, type) {
      if (type === 'documentNo') {
        if (!this.documentTypeGetAuth(row)) {
          return
        }
        switch (row.documentType) {
          case '0':
            this.$router.push({
              path: '/inventoryManagement/viewInventoryInitialization',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '1':
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseOrder',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '3':
          case '22':
            this.$router.push({
              path: '/inventoryManagement/viewTransferOrder',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '2':
          case '14':
            this.$router.push({
              path: '/salesManagement/viewPreDeliveryNotice',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '15':
            this.$router.push({
              path: '/salesManagement/viewSalesGoodsReturn',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '16':
            this.$router.push({
              path: '/purchaseManagement/viewPurchaseReturnOrder',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '17':
            if (row.inventoryType === '1') {
              this.$router.push({
                path: '/purchaseManagement/viewPurchaseOrder',
                query: {
                  id: row.documentId,
                  timeId: Date.now()
                }
              })
            } else {
              this.$router.push({
                path: '/salesManagement/viewPreDeliveryNotice',
                query: {
                  id: row.documentId,
                  timeId: Date.now()
                }
              })
            }

            break
          case '33':
            if (row.relevanceDocumentType === '22') {
              this.$router.push({
                path: '/inventoryManagement/viewTransferOrder',
                query: {
                  id: row.documentId,
                  timeId: Date.now()
                }
              })
            } else if (row.relevanceDocumentType === '14') {
              this.$router.push({
                path: '/salesManagement/viewPreDeliveryNotice',
                query: {
                  id: row.documentId,
                  timeId: Date.now()
                }
              })
            }

            break
          case '24':
            this.$router.push({
              path: '/inventoryManagement/viewInventoryAudit',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '26':
            this.$router.push({
              path: '/inventoryManagement/viewInventoryAdjustment',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break

          case '4':
          case '23':
            this.$router.push({
              path: '/projectManagement/viewStoreIssueChit',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '27':
            this.$router.push({
              path: '/inventoryManagement/viewEmergencyGoodsReceipt',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '30':
            this.$router.push({
              path: '/purchaseManagement/viewConsignmentOrder',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '31':
            this.$router.push({
              path: '/purchaseManagement/viewConsignmentPickUp',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '28':
            this.$router.push({
              path: '/projectManagement/viewProject',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
          case '37':
            this.$router.push({
              path: '/projectManagement/viewProjectProduction',
              query: {
                id: row.documentId,
                timeId: Date.now()
              }
            })
            break
        }
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
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.stockLogId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleRowClick(row) {
      const index = this.selectList.findIndex((item) => item.stockLogId === row.stockLogId)
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.ids = this.selectList.map((item) => item.stockLogId)
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    handleAdd(row) {
      this.$refs.selectProductNameTable.handleOpen()
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/inventoryManagement/warehouseManagement/viewWarehouse',
        query: { id: row.warehouseId, timeId: +new Date() }
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
      if (e.childType === 'all') {
        this.searchData[e.index].selectId = ''
        this.searchData[e.index].inputVal = ''
        this.setFuzzyData()
      } else if (e.childType === 'select') {
        this.searchData[e.index].selectId = e.value
        this.searchData[e.index].inputVal = ''
        this.setFuzzyData()
      } else {
        this.searchData[e.index].inputVal = e.value || ''
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForBatchNo') {
            this.$set(item, 'fuzzyData', this.conditionForBatchNoList)
          } else if (item.selectId === 'conditionForDocumentNo') {
            this.$set(item, 'fuzzyData', this.conditionForDocumentNoList)
          } else if (item.selectId === 'conditionForStockCertificateNo') {
            this.$set(item, 'fuzzyData', this.conditionForStockCertificateNoList)
          } else if (item.selectId === 'conditionForStockOutInNoteNo') {
            this.$set(item, 'fuzzyData', this.conditionForStockOutInNoteNoList)
          }
        }
      })
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
      params.productId = this.$route.query.productId || undefined
      params = this.$trimOfObj(params)
      params.exportType = exportType
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.stockLogId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/stockLog/export',
        params,
        `${this.getFileNameDate('Stock Log')}.xlsx`
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
