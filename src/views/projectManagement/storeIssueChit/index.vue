<template>
  <div class="app-container">
    <el-tabs
      ref="tabsRef"
      type="card"
      :key="'tabs_' + tabsKey"
      v-model="activeName"
      @tab-click="tabClickHandler"
    >
      <template v-for="(item, index) in tabs">
        <el-tab-pane size="" :key="index" :name="item.value">
          <span slot="label">
            <div class="tabs-item-title">
              {{ item.name }}
              <el-badge
                :max="99"
                :key="item.value + badgeKey"
                class="tabs-item-badge"
                style="margin-left: 3px"
                :value="item.num"
              />
            </div>
          </span>
        </el-tab-pane>
      </template>
    </el-tabs>
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :isBtn="true"
      :topShowCount="1"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
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
      <right-toolbar
        ref="rightToolbar"
        :saveKey="curSaveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columnsInit="curColumns"
        :columns="configCurColumn"
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
      max-height="500"
      style="cursor: pointer"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in visibleCurColumns"
        :key="item.prop + item.colSortIndex + activeName"
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
          <template v-if="item.prop === 'totalQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum || 3) }}</template>
          </template>
          <template v-else-if="item.prop === 'balanceQty'">
            <template>{{ $numberStr(scope.row[item.prop], 3) }}</template>
          </template>
          <template v-else-if="item.prop === 'goodsReceivedNoteNo'">
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

      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="activeName === '5'"
      >
        <template slot-scope="scope">
          <div style="width: 100px; display: flex">
            <!-- 归还按钮暂时隐藏 -->
            <div style="width: 50%; display: flex; justify-content: center">
              <span :title="$t('SALES.return')">
                <svg-icon
                  icon-class="return"
                  class="primary-pointer"
                  style="font-size: 20px"
                  v-if="
                    scope.row.storeIssueChitStatus !== '9' &&
                    checkPermi(['projectManagement:storeIssueChit:return'])
                  "
                  @click="handleReturn(scope.row)"
                />
              </span>
            </div>
            <div style="width: 50%; display: flex; justify-content: center">
              <span :title="$t('uiBtn.close')">
                <svg-icon
                  icon-class="close"
                  class="primary-pointer"
                  style="font-size: 20px; color: #f00"
                  v-if="
                    checkPermi(['projectManagement:storeIssueChit:close']) &&
                    scope.row.balanceQty > 0
                  "
                  @click="handleClose(scope.row)"
                />
              </span>
            </div>
          </div>
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

    <!-- 归还 -->
    <returnDlg ref="returnDlg" @onSuccess="getList" />
    <!-- 关闭 -->
    <closeDlg ref="closeDlg" @onSuccess="getList" />
    <ToolTipShowListForFN ref="ToolTipShowList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/salesManagement/lang/index'
import returnDlg from './components/returnDlg.vue'
import closeDlg from './components/closeDlg.vue'
import {
  queryLabelCount,
  querySearchList,
  queryStoreIssueChitList
} from '@/api/projectManagement/storeIssueChit'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  name: 'StoreIssueChit',
  mixins: [pageMixin, tableDataMixin],
  dicts: ['store_issue_chit_status', 'store_issue_chit_type'],
  components: { returnDlg, closeDlg, ToolTipShowListForFN },
  data() {
    return {
      saveKey: '1',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      // 请求的时间戳
      queryTime: undefined,
      statusDicts: [],
      typeDicts: [],
      approvedStatusDicts: [],
      rowIdKey: 'storeIssueChitId'
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['projectManagement:storeIssueChit:add'])
    },
    curColumns() {
      return this.columnsData[this.activeName] || []
    },
    curSaveKey() {
      return this.columnsSaveKeys[this.activeName] || []
    },
    configCurColumn() {
      let arr = [...this.curColumns]
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectName')
      } else {
        const flag = this.tableList.some((x) => x.costProjectName)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectName')
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
    },
    visibleCurColumns() {
      let arr = this.curColumns.filter((column) => column.visible === true)
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectName')
      } else {
        const flag = this.tableList.some((x) => x.costProjectName)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectName')
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
    },
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

    const a = this.MyDictDataClass.getDictFn('store_issue_chit_status')
    const b = this.MyDictDataClass.getDictFn('store_issue_chit_type')
    const c = this.MyDictDataClass.getDictFn('approved_status')
    await Promise.all([a, b, c]).then((res) => {
      const res1 = res[0] || {}
      const res2 = res[1] || {}
      const res3 = res[2] || {}
      this.statusDicts = (res1 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.typeDicts = (res2 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.approvedStatusDicts = (res3 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData0.forEach((item) => {
      if (item.name === 'storeIssueChitStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'storeIssueChitTypeList') {
        item.selectData = this.typeDicts
      } else if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedStatusDicts
      }
    })
    this.searchData1.forEach((item) => {
      if (item.name === 'storeIssueChitStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'storeIssueChitTypeList') {
        item.selectData = this.typeDicts
      } else if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedStatusDicts
      }
    })

    this.searchData = this.searchData0
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
    initQueryParams(isResetDate = true) {
      const { pageSize, dateRange, startDateCreatedTime, endDateCreatedTime } = this.queryParams
      this.queryParams = {
        pageNum: 1,
        pageSize,
        dateRange,
        startDateCreatedTime,
        endDateCreatedTime
      }
      if (isResetDate) {
        const end = this.appointTime(Date.now(), '23:59:59')
        const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
        this.$set(this.queryParams, 'dateRange', [startTimer, end])
        this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
        this.$set(this.queryParams, 'endDateCreatedTime', end)
      }

      this.queryParams.selectId = 'conditionForSO'
      this.queryParams.selectId2 = 'createdIdList'
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForSO'
          item.inputVal = ''
        }
        if (item.name === 'SelectAnMultipleSelectName') {
          item.selectId = 'createdIdList'
          item.inputVal = []
        }
      })
    },
    tabClickHandler() {
      if (this.activeName === '0') {
        this.searchData = this.searchData0
      } else {
        this.searchData = this.searchData1
      }
      this.initQueryParams(false)
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row[this.rowIdKey]) {
          color = 'table-SelectedRow-bgcolor'
        }
      }

      return color
    },
    queryLabelCount() {
      queryLabelCount({}).then((res) => {
        const data = res.data || {}
        this.tabs.forEach((item, index) => {
          this.$set(item, 'num', data[item.value])
        })
        this.$nextTick(() => {
          this.badgeKey++
        })
      })
    },
    /** 查询用户列表 */
    getList(query) {
      this.$store.dispatch('getInventoryTaskCount')
      const timer = Date.now()
      this.queryTime = timer
      this.queryLabelCount()
      this.querySearchList()
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }

      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      params.labelType = this.activeName
      queryStoreIssueChitList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.closedTime = this.parseTime(item.closedTime, this.fmtForYmdhms)
          item.returnBy = this.parseTime(item.returnBy, this.fmtForYmd)
          item.cancelledTime = this.parseTime(item.cancelledTime, this.fmtForYmdhms)
          item.storeIssueChitTypeStr = this.selectDictLabel(this.typeDicts, item.storeIssueChitType)
          item.storeIssueChitStatusStr = this.selectDictLabel(
            this.statusDicts,
            item.storeIssueChitStatus
          )
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
      })
    },
    querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const data = res.data || {}
        const customerList = data.customerList || []
        const warehouseList = data.warehouseList || []
        const requiredList = data.requiredList || []

        this.searchData.forEach((item) => {
          if (item.name === 'businessPartnerIdList') {
            this.$set(item, 'selectData', customerList)
          } else if (item.name === 'warehouseIdList') {
            this.$set(item, 'selectData', warehouseList)
          } else if (item.name === 'requiredIdList') {
            this.$set(item, 'selectData', requiredList)
          }
        })
      })
    },
    handleReturn(row) {
      this.$refs.returnDlg.handleAdd(row)
    },
    handleClose(row) {
      this.$refs.closeDlg.handleAdd(row)
    },
    /** 搜索 */
    handleSearchForm() {
      // const param = this.$trimOfObj(query)
      // this.queryParams = { ...param }
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      // this.searchFormKey = Date.now()
      this.$refs.tables.clearSort()
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/projectManagement/addStoreIssueChit',
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
        path: '/projectManagement/editStoreIssueChit',
        query: {
          id: row[this.rowIdKey],
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
.flexSb {
  display: flex;
  justify-content: space-between;
}
.flexCen {
  display: flex;
  justify-content: center;
}
</style>
