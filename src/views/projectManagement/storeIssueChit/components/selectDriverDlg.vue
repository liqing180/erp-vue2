<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('SALES.driver')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    append-to-body
  >
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
        :saveKey="saveKey"
        :savePath="savePath"
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>

    <el-table
      border
      ref="tables"
      :data="tableList"
      max-height="600"
      v-loading="loading"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
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
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :saveKey="saveKey"
      :savePath="savePath"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryCanSelectDriverList } from '@/api/projectManagement/storeIssueChit'
export default {
  mixins: [pageMixin],
  name: 'SelectDriverDlg',
  dicts: ['sys_driver_type'],
  data() {
    const vm = this
    return {
      saveKey: '3',
      savePath: 'selectDriverDlg',
      searchFormKey: Date.now(),
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'productId',
      tableList: [],
      visible: false,
      columns: [
        {
          prop: 'driverCode',
          label: vm.$t('SALES.driverCode'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true,
          fixed: true
        },
        {
          prop: 'driverName',
          label: vm.$t('SALES.driverName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'driverType',
          propBy: 'driverTypeStr',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'mobilePhone',
          label: vm.$t('ui.mobileNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
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
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('SALES.driverName')} / ${this.$t('SALES.code')}`,
          type: 'InputEle'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleOpen() {
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    getList() {
      const param = this.queryParams
      this.loading = true
      queryCanSelectDriverList(param)
        .then((response) => {
          this.loading = false
          this.total = response.total
          const rows = response.rows || []
          rows.forEach((item) => {
            item.driverTypeStr = this.selectDictLabel(
              this.dict.type.sys_driver_type,
              item.driverType
            )
          })
          this.tableList = rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          this.loading = false
          window.console.error(err)
        })
    },
    handleRowClick(row) {
      this.$emit('onSuccess', row)
      this.handleBack()
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
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}

.tree-box {
  flex-shrink: 0;
  position: relative;
  max-height: 600px;
  margin-right: 20px;
  transition: width 0.28s;
}
.tree {
  min-height: 200px;
  overflow: hidden auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.collapse-warp {
  position: absolute;
  top: 50%;
  right: -4px;
  z-index: 300;
  font-size: 16px;
  // background-color: #888;
  // right: 100%;
  // border: 1px solid #000;
  background-color: #fff;
  border-radius: 4px;
}
.tree::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.tree::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.tree::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
