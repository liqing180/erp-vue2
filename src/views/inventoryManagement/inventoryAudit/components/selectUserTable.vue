<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.user')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
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
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      :row-class-name="'pointer'"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      :max-height="tableMaxHeight"
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
          <dict-tag
            v-if="item.prop === 'status'"
            :options="dict.type.user_status"
            :value="scope.row[item.prop]"
          />
          <template v-else>{{ scope.row[item.prop] }}</template>
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
      <el-button type="primary" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryUsersNeedSameDepartment } from '@/api/inventoryManagement/inventoryAudit'

export default {
  dicts: ['user_status'],
  mixins: [pageMixin],
  props: {},
  data() {
    return {
      saveKey: '2',
      savePath: 'IMTable',
      searchFormKey: Date.now(),
      btnLoading: false,
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tableList: [],
      selectList: [],
      rowIdKey: 'userId',
      tableMaxHeightResize: true,
      selected: '',
      visible: false,
      columns: [
        {
          prop: 'employeeNo',
          label: this.$t('ui.employeeNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'userName',
          label: this.$t('ui.userId'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'nickName',
          label: this.$t('ui.userName'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'departmentName',
          label: this.$t('menu.department'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'postName',
          label: this.$t('ui.position'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'email',
          label: this.$t('ui.email'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'mobilePhone',
          label: this.$t('ui.mobilePhone'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'status',
          label: this.$t('ui.status'),
          visible: true,
          minWidth: 170,
          colMinWidth: 90,
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
          placeholder: `${this.$t('ui.userId')} / ${this.$t('ui.userName1')} / ${this.$t(
            'ui.employeeNo'
          )}`,
          type: 'InputEle'
        }
      ]
    }
  },
  computed: {},
  beforeCreate() {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleAdd(alreadySelectIdList) {
      this.selectList = alreadySelectIdList || []
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    getList() {
      const vm = this
      const param = this.queryParams
      this.$trimOfObj(param)
      this.loading = true
      // param.alreadySelectUserIdList = this.alreadySelectIdList
      param.menuPerms = this.menuKey.inventoryAudit
      queryUsersNeedSameDepartment(param)
        .then((response) => {
          this.loading = false
          this.total = response.total
          this.tableList = response.rows
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
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
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
    },
    selectable(row, rowIndex) {
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
    handleRowClick(row, column) {
      if (column && column.property === 'picture') {
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
    closed() {
      this.isCollapse = false
      this.selectList = []
      this.tableList = []
      this.$refs.tables.clearSelection()
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      this.$emit('onSuccess', this.selectList)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
</style>
