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
          v-hasPermi="['inventoryManagement:inventoryInitialization:add']"
          >{{ $t('menu.add') }}</el-button
        >
      </el-col>
      <right-toolbar
        ref="rightToolbar"
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
        @autoRefresh="autoRefresh"
        :refreshTimeSaveKey="'1'"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
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
    </el-table>

    <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <ToolTipShowListForFN ref="ToolTipShowList" />
  </div>
</template>

<script>
import {
  queryInventoryInitializationList,
  querySearchList
} from '@/api/inventoryManagement/inventoryInitialization'
import locale from '@/views/inventoryManagement/lang/index'
import pageMixin from '@/mixins/tableMinx'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  name: 'InventoryInitialization',
  components: { ToolTipShowListForFN },
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '1',
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 日期范围
      dateRange: [],
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
          placeholder: `${this.$t('INVENTORY.warehouseName')} / ${this.$t(
            'INVENTORY.warehouseCode'
          )}`
        },
        // {
        //   name: 'selectAnInputName',
        //   minSelectWidth: 140,
        //   label: '',
        //   type: 'SelectAnInput',
        //   selectValue: 'value',
        //   selectLabel: 'label',
        //   selectData: [
        //     {
        //       label: this.$t('INVENTORY.inventoryInitializationNo'),
        //       value: 'conditionForInventoryInitializationNo'
        //     },
        //     {
        //       label: this.$t('INVENTORY.goodsReceiptNoteNo'),
        //       value: 'conditionForGoodsReceiptNoteNo'
        //     }
        //   ],
        //   selectName: 'selectId',
        //   inputName: 'inputVal',
        //   selectId: '',
        //   inputVal: '',
        //   fuzzyData: [],
        //   defaultProps: {
        //     value: 'value',
        //     label: 'label'
        //   }
        // },
        {
          name: 'inventoryInitializationStatusList',
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
          name: 'SelectAnMultipleSelectName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnMultipleSelect',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.createdBy'), value: 'createdIdList' },
            { label: this.$t('ui.modifiedBy'), value: 'modifiedIdList' },
            { label: this.$t('ui.approvedBy'), value: 'approvedIdList' }
          ],
          selectName: 'selectId2',
          inputName: 'inputVal2',
          selectId: 'createdIdList',
          inputVal: [],
          filterable: false,
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
        },
        {
          name: 'dateRange1',
          label: vm.$t('ui.modifiedTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateModifiedTime',
          endDate: 'endDateModifiedTime'
        },
        {
          name: 'dateRange2',
          label: vm.$t('ui.approvedTime1'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateApprovedTime',
          endDate: 'endDateApprovedTime'
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'inventoryInitializationNo',
          label: vm.$t('INVENTORY.inventoryInitializationNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'warehouseName',
          label: vm.$t('INVENTORY.warehouseName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'warehouseCode',
          label: vm.$t('INVENTORY.warehouseCode'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        /* {
          prop: 'reason',
          label: vm.$t('INVENTORY.reason'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        }, */
        {
          prop: 'inventoryInitializationStatus',
          propBy: 'inventoryInitializationStatusStr',
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
        // {
        //   prop: 'operatorBy',
        //   label: vm.$t('INVENTORY.operator'),
        //   minWidth: 140,
        //   visible: true,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'goodsReceivedNoteNo',
          label: vm.$t('INVENTORY.goodsReceivedNo'),
          minWidth: 140,
          visible: true,
          tooltip: false
          // sortable: 'custom'
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
      approvedStatusDicts: [],
      createdList: [],
      modifiedList: [],
      approvedList: [],
      operatorList: [],
      conditionForGoodsReceiptNoteNoList: [],
      conditionForInventoryInitializationNoList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
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
    const a = this.MyDictDataClass.getDictFn('inventory_initialization_status')
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
      if (item.name === 'inventoryInitializationStatusList') {
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
        labelKey: '',
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
    autoRefresh() {
      this.getList({ noLoading: true })
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
    getList(query) {
      this.querySearchList()
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (params.inputVal2 && params.selectId2) {
        params[params.selectId2] = params.inputVal2
      }
      params = this.$trimOfObj(params)

      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      queryInventoryInitializationList(params).then((response) => {
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.operatorTime = this.parseTime(item.operatorTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.inventoryInitializationStatusStr = this.selectDictLabel(
            this.statusDicts,
            item.inventoryInitializationStatus
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
      querySearchList({}).then((res) => {
        const {
          warehouseList,
          operatorList,
          modifiedList,
          approvedList,
          createdList,
          conditionForGoodsReceiptNoteNoList,
          conditionForInventoryInitializationNoList
        } = res.data
        this.searchData.forEach((item) => {
          if (item.name === 'warehouseIdList') {
            this.$set(item, 'selectData', warehouseList)
          }
        })

        this.createdList = (createdList || []).map((item) => {
          return {
            value: item.createdId,
            label: item.createdBy
          }
        })
        this.operatorList = (operatorList || []).map((item) => {
          return {
            value: item.operatorId,
            label: item.operatorBy
          }
        })
        this.approvedList = (approvedList || []).map((item) => {
          return {
            value: item.approvedId,
            label: item.approvedBy
          }
        })
        this.modifiedList = (modifiedList || []).map((item) => {
          return {
            value: item.modifiedId,
            label: item.modifiedBy
          }
        })
        this.conditionForInventoryInitializationNoList = (
          conditionForInventoryInitializationNoList || []
        ).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForGoodsReceiptNoteNoList = (conditionForGoodsReceiptNoteNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )

        this.setFuzzyData()
        this.setCreatedListData()
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
      this.queryParams.selectId = 'conditionForInventoryInitializationNo'
      this.queryParams.selectId2 = 'createdIdList'
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForInventoryInitializationNo'
          item.inputVal = ''
        }
        if (item.name === 'SelectAnMultipleSelectName') {
          item.selectId = 'createdIdList'
          item.inputVal = []
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
          if (item.selectId === 'conditionForGoodsReceiptNoteNo') {
            this.$set(item, 'fuzzyData', this.conditionForGoodsReceiptNoteNoList)
          } else if (item.selectId === 'conditionForInventoryInitializationNo') {
            this.$set(item, 'fuzzyData', this.conditionForInventoryInitializationNoList)
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },
    setCreatedListData() {
      this.searchData.forEach((item) => {
        if (item.name === 'SelectAnMultipleSelectName') {
          if (item.selectId === 'createdIdList') {
            this.$set(item, 'selectData2', this.createdList)
          } else if (item.selectId === 'approvedIdList') {
            this.$set(item, 'selectData2', this.approvedList)
          } else if (item.selectId === 'modifiedIdList') {
            this.$set(item, 'selectData2', this.modifiedList)
          } else {
            this.$set(item, 'selectData2', [])
          }
        }
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/inventoryManagement/addInventoryInitialization',
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
        path: '/inventoryManagement/viewInventoryInitialization',
        query: {
          id: row.inventoryInitializationId,
          timeId: Date.now()
        }
      })
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
