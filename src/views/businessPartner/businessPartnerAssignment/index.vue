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
      :topShowCount="1"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="assignmentAuth"
          :disabled="multiple"
          type="primary"
          size="mini"
          @click="handleAssignment"
          >{{ $t('menu.assignment') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="importAuth"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col>

      <right-toolbar
        ref="rightToolbar"
        :saveKey="activeName"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columnsInit="curColumns"
        :columns="configCurColumn"
        @autoRefresh="autoRefresh"
        :refreshTimeSaveKey="'1'"
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
      max-height="500"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        key="selection"
        width="50"
        align="center"
        v-if="assignmentAuth"
        :selectable="selectable"
      />
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
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row[item.prop]"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template
            v-else-if="['internalPartNo', 'businessPartnerName', 'rfqNo'].includes(item.prop)"
          >
            <span class="primary-link" @click="nav(scope.row, item.prop)">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else-if="item.prop === 'corporateNameShow'">
            <div @mouseenter="showPop($event, scope.row)" @mouseleave="hidePop($event, scope.row)">
              <div class="ellipsis-text">{{ scope.row[item.prop] }}</div>
            </div>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="80"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <svg-icon
              icon-class="tree"
              class="primary-pointer"
              style="font-size: 20px"
              @click="handleRowAssignment(scope.row)"
            />
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

    <ToolTipShowListForFN ref="ToolTipShowList" />
    <!-- 导入 -->
    <importExcelDlg ref="importExcelDlg" @onSuccess="getList" />
    <assignmentDlg ref="assignmentDlg" @onSuccess="getList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/businessPartner/lang/index'
import {
  queryUnAssignmentList,
  queryUnAssignmentSearchList,
  queryAssignmentList,
  queryAssignmentSearchList,
  queryCountList
} from '@/api/businessPartner/bpAssignment'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import importExcelDlg from './importExcelDlg.vue'
import assignmentDlg from './assignmentDlg.vue'

export default {
  name: 'BusinessPartnerAssignment',
  mixins: [pageMixin, tableDataMixin],
  components: { importExcelDlg, assignmentDlg, ToolTipShowListForFN },
  data() {
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      supplierTypeDicts: [],
      supplierGroupDicts: [],
      customerTypeDicts: [],
      customerGroupDicts: [],
      businessPartnerTypeDicts: [],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {
    assignmentAuth() {
      return (
        this.activeName !== '2' &&
        this.checkPermi(['businessPartner:businessPartnerAssignment:assignment'])
      )
    },
    importAuth() {
      if (this.activeName === '2') {
        return this.checkPermi(['businessPartner:businessPartnerAssignment:import'])
      }
      return false
    },
    curColumns() {
      return this.columnsData[this.activeName] || []
    },
    configCurColumn() {
      const arr = [...this.curColumns]
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
      const arr = this.curColumns.filter((column) => column.visible === true)
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
    // $$initColumnVisible 在 ./tableDataMixin.js 调用了
    const a = this.MyDictDataClass.getDictFn('bp_supplier_type')
    const b = this.MyDictDataClass.getDictFn('bp_supplier_group')
    const c = this.MyDictDataClass.getDictFn('bp_customer_type')
    const d = this.MyDictDataClass.getDictFn('bp_customer_group')
    const e = this.MyDictDataClass.getDictFn('business_partner_type')
    await Promise.all([a, b, c, d, e]).then((res) => {
      const res1 = res[0] || {}
      const res2 = res[1] || {}
      const res3 = res[2] || {}
      const res4 = res[3] || {}
      const res5 = res[4] || {}
      this.supplierTypeDicts = (res1 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.supplierGroupDicts = (res2 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.customerTypeDicts = (res3 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.customerGroupDicts = (res4 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.businessPartnerTypeDicts = (res5 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData0.forEach((item) => {
      if (item.name === 'supplierTypeList') {
        item.selectData = this.supplierTypeDicts
      } else if (item.name === 'supplierGroupList') {
        item.selectData = this.supplierGroupDicts
      }
    })
    this.searchData1.forEach((item) => {
      if (item.name === 'customerTypeList') {
        item.selectData = this.customerTypeDicts
      } else if (item.name === 'customerGroupList') {
        item.selectData = this.customerGroupDicts
      }
    })
    this.searchData2.forEach((item) => {
      if (item.name === 'supplierTypeList') {
        item.selectData = this.supplierTypeDicts
      } else if (item.name === 'supplierGroupList') {
        item.selectData = this.supplierGroupDicts
      } else if (item.name === 'customerTypeList') {
        item.selectData = this.customerTypeDicts
      } else if (item.name === 'customerGroupList') {
        item.selectData = this.customerGroupDicts
      } else if (item.name === 'businessPartnerTypeList') {
        item.selectData = this.businessPartnerTypeDicts
      }
    })
    this.searchData = this.searchData0
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    showPop(e, row) {
      const list = []
      const corporate = row.corporates || []
      corporate.forEach((item) => {
        list.push(item)
        if (item.child && item.child.length > 0) {
          item.child.forEach((childItem) => {
            childItem.itemClass = 'pl-20'
            list.push(childItem)
          })
        }
      })
      // const list = row.purchaseQuotationDetailList || [
      //   { name: '法人公司1' },
      //   {
      //     name: '分公司2分公司2分公司2分公司2分公司2分公司2分公司2分公司2分公司2分公司2分公司2',
      //     itemClass: 'pl-20'
      //   },
      //   { name: '法人公司3' }
      // ]
      const params = {
        // popoverTitle: this.$t('PURCHASE.DocNo'),
        labelKey: 'name',
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

    tabClickHandler() {
      if (this.activeName === '0') {
        this.searchData = this.searchData0
      } else if (this.activeName === '1') {
        this.searchData = this.searchData1
      } else {
        this.searchData = this.searchData2
      }
      this.resetSearchForm()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.businessPartnerMainId) {
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
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    queryCountList() {
      queryCountList({}).then((res) => {
        const data = res.data || {}
        this.tabs.forEach((item, index) => {
          this.$set(item, 'num', data[item.value])
        })
        // this.$set(this.tabs[0], 'num', '')
        // this.$set(this.tabs[1], 'num', data['0'])
        this.$nextTick(() => {
          this.badgeKey++
        })
      })
    },
    /** 查询用户列表 */
    getList(query) {
      const timer = Date.now()
      this.queryTime = timer
      this.queryCountList()
      this.queryUnAssignmentSearchList()
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)

      if (params.corporateIdList && params.corporateIdList.length > 0) {
        params.corporateId = params.corporateIdList[params.corporateIdList.length - 1]
      } else {
        params.corporateId = undefined
      }
      delete params.corporateIdList
      let queryFN
      if (this.activeName === '0') {
        queryFN = queryUnAssignmentList
        params.businessPartnerType = '1'
      } else if (this.activeName === '1') {
        queryFN = queryUnAssignmentList
        params.businessPartnerType = '0'
      } else {
        queryFN = queryAssignmentList
        // params.businessPartnerType = this.activeName
      }
      queryFN(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.supplierType = this.selectDictLabel(this.supplierTypeDicts, item.supplierType)
          item.supplierGroup = this.selectDictLabel(this.supplierGroupDicts, item.supplierGroup)
          item.customerType = this.selectDictLabel(this.customerTypeDicts, item.customerType)
          item.customerGroup = this.selectDictLabel(this.customerGroupDicts, item.customerGroup)
          item.businessPartnerTypeShowStr = this.selectDictLabels(
            this.businessPartnerTypeDicts,
            item.businessPartnerType || ''
          )
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
      })
    },
    queryUnAssignmentSearchList() {
      const params = {}
      let queryFN
      if (this.activeName === '0') {
        queryFN = queryUnAssignmentSearchList
        params.businessPartnerType = '1'
      } else if (this.activeName === '1') {
        queryFN = queryUnAssignmentSearchList
        params.businessPartnerType = '0'
      } else {
        queryFN = queryAssignmentSearchList
        // params.businessPartnerType = this.activeName
      }
      queryFN(params).then((res) => {
        const data = res.data || {}
        const countryList = data.countryList || []
        const corporateList = data.corporates || []
        this.handle(corporateList)

        this.searchData.forEach((item) => {
          if (item.name === 'countryIdList') {
            this.$set(item, 'selectData', countryList)
          } else if (item.name === 'corporateIdList') {
            this.$set(item, 'selectData', corporateList)
          }
        })
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.handle(x.child)
          } else {
            x.children = undefined
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
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData(e) {},

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.businessPartnerMainId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleRowAssignment(row) {
      let type
      let isEdit = false
      switch (this.activeName) {
        case '0':
          type = '1'
          break
        case '1':
          type = '0'
          break
        case '2':
          type = row.businessPartnerType
          isEdit = true
          break
      }
      this.$refs.assignmentDlg.handleOpen([row.businessPartnerMainId], type, isEdit)
    },
    /** 新增按钮操作 */
    handleAssignment() {
      let type
      switch (this.activeName) {
        case '0':
          type = '1'
          break
        case '1':
          type = '0'
          break
      }
      this.$refs.assignmentDlg.handleOpen(this.ids, type)
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (this.activeName !== '2') return
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/businessPartner/viewBpAssignment',
        query: {
          id: row.businessPartnerMainId,
          timeId: Date.now()
        }
      })
    },
    nav(row, type) {
      if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerMainId,
            timeId: Date.now()
          }
        })
      }
    },
    /* 查看操作日志 */
    handleOperationLog(row) {},

    /** 导出按钮操作 */
    /** 导出按钮操作 */
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importExcelDlg.show()
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
