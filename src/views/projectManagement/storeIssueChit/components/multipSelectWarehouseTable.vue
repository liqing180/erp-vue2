<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('INVENTORY.warehouse')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <search-form
      class="mt10"
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
      class="mt10 hide-check-all"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      @row-click="handleRowClick"
      :max-height="tableMaxHeight"
    >
      <el-table-column type="selection" width="55" align="center" :selectable="selectable" />
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
          <template v-else-if="item.prop === 'isDefault'">
            <el-tag v-if="scope.row.isDefault === '1'">{{ $t('ui.y') }}</el-tag>
            <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
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
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submit">{{
        $t('uiBtn.save')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryCanSelectWarehouseListHaveDataPermissions } from '@/api/salesManagement/salesInquiry'

export default {
  mixins: [pageMixin],
  dicts: ['warehouse_type'],
  props: {
    alreadyIdList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {},
  data() {
    const vm = this
    return {
      saveKey: '21',
      savePath: 'projectMDlg',
      searchFormKey: Date.now(),
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      visible: false,
      // 选中数组
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      btnLoading: false,
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('INVENTORY.warehouseName')} / ${this.$t(
            'INVENTORY.warehouseCode'
          )}`,
          type: 'InputEle'
        }
      ],
      columns: [
        {
          prop: 'warehouseCode',
          label: vm.$t('INVENTORY.warehouseCode'),
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
          prop: 'warehouseType',
          propBy: 'warehouseTypeShowStr',
          label: vm.$t('INVENTORY.warehouseType'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'isDefault',
          label: vm.$t('ui.isDefault'),
          visible: true,
          sortable: 'custom',
          minWidth: 120
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          sortable: 'custom',
          minWidth: 120,
          tooltip: true
        },
        {
          prop: 'label',
          label: vm.$t('INVENTORY.label'),
          visible: true,
          minWidth: 120,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('INVENTORY.country'),
          visible: true,
          minWidth: 120,
          tooltip: true
        }
      ],
      rowIdKey: 'warehouseId',
      disEditWarehouseIdList: []
    }
  },
  watch: {},
  computed: {
    comIds() {
      return this.selectList.map((item) => item[this.rowIdKey])
    }
  },
  created() {},
  methods: {
    handleOpen(list, disEditWarehouseIdList) {
      this.selectList = JSON.parse(JSON.stringify(list || []))
      this.disEditWarehouseIdList = disEditWarehouseIdList || []
      // this.queryParams.condition = ''
      this.$set(this.queryParams, 'condition', '')
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.visible = true
      this.getList()
    },
    getList() {
      // param.alreadyIdList = this.alreadyIdList
      this.loading = true
      const param = this.queryParams
      this.$trimOfObj(param)
      param.warehouseTypeList = ['1', '2']
      param.menuPerms = this.menuKey.storeIssueChit

      queryCanSelectWarehouseListHaveDataPermissions(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.warehouseTypeShowStr = this.selectDictLabel(
              this.dict.type.warehouse_type,
              item.warehouseType
            )
          })
          this.tableList = rows
          this.total = response.total
          this.loading = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          this.$nextTick(() => {
            this.selectList.forEach((row) => {
              this.tableList.forEach((item) => {
                if (row[this.rowIdKey] === item[this.rowIdKey]) {
                  this.$refs.tables.toggleRowSelection(item, true)
                }
              })
            })
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.warehouseTypeShowStr = this.selectDictLabel(
          this.dict.type.warehouse_type,
          item.warehouseType
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      for (const item of this.comIds.values()) {
        if (item === row[this.rowIdKey]) {
          color = 'pointer table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row) {
      if (this.disEditWarehouseIdList.includes(row[this.rowIdKey])) {
        return false
      }
      // return false // 禁用
      return true // 不禁用
    },
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selectList.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selectList.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selectList = vm.selectList.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selectList.length; i++) {
        if (vm.selectList[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selectList.splice(i, 1)
        }
      }
      vm.selectList.push(row)
    },
    handleRowClick(row) {
      if (this.disEditWarehouseIdList.includes(row[this.rowIdKey])) {
        return
      }
      const index = this.selectList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    /** 排序触发事件 */
    // handleSortChange(column, prop, order) {
    //   this.queryParams.orderByColumn = column.prop
    //   this.queryParams.isAsc = column.order
    //   this.getList()
    // },
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
      this.resetSearchForm(false)
      this.selectList = []
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      this.$emit('update', this.selectList)
      this.visible = false
    },
    back() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
