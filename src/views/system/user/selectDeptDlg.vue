<template>
  <!-- 授权用户 -->
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.dept')"
    :visible.sync="visible"
    width="1100px"
    top="5vh"
    append-to-body
    @closed="closed"
  >
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showMenu="false"
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

    <el-row>
      <el-table
        border
        :row-class-name="tableRowClassName"
        ref="tables"
        :data="userList"
        @row-click="handleRowClick"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        @sort-change="handleSortChange"
        :max-height="tableMaxHeight"
        v-loading="loading"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
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
          :min-width="item.minWidth"
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
            <dict-tag
              v-else-if="item.prop === 'sex'"
              :options="dict.type.sys_user_sex"
              :value="scope.row[item.prop]"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in customColumns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :show-overflow-tooltip="item.tooltip"
          :sortable="item.sortable"
          :align="item.align || 'left'"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-if="item.prop === 'isActive'"
              v-model="scope.row.isActive"
              active-value="1"
              inactive-value="0"
              :disabled="true"
            ></el-switch>
            <template v-else-if="item.prop === 'createdTime'">{{
              parseTime(scope.row.createdTime, fmtForYmdhms)
            }}</template>
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
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button :disabled="selected.length <= 0" type="primary" @click="handleSelectUser">{{
        $t('uiBtn.add')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryDepartmentList } from '@/api/system/user'
import pageMixin from '@/mixins/tableMinx'
// import searchForm from '@/components/Common/searchForm/Index.vue'
import { querySetupFieldByModuleId } from '@/api/operation/setup'
export default {
  dicts: ['sys_user_sex'],
  mixins: [pageMixin],
  // components: { searchForm },
  props: {
    customerId: {
      type: [Number, String]
    }
  },
  data() {
    const vm = this
    return {
      rowIdKey: 'departmentId',
      saveKey: '2',
      savePath: 'AddUser',
      searchFormKey: Date.now(),
      // 遮罩层
      visible: false,
      // 遮罩层
      loading: true,
      // 选中数组值
      selected: [],
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      columns: [
        {
          prop: 'legalEntityName',
          label: vm.$t('ui.legalEntity'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'branchCompanyName',
          label: vm.$t('menu.branchCompany'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'allSuperiorNames',
          label: vm.$t('ui.superiorDepartment'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'departmentName',
          label: vm.$t('ui.dept'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'picUserName',
          label: vm.$t('ui.pic'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'mobilePhone',
          label: vm.$t('ui.mobilePhone'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'email',
          label: vm.$t('ui.email'),
          minWidth: 120,
          visible: true,
          tooltip: true
        }
      ],
      searchData: [
        {
          name: 'condition',
          placeholder: `${vm.$t('ui.dept')} / ${vm.$t('ui.pic')}`,
          type: 'InputEle'
        }
      ],
      customColumns: [],
      /* 已经选择的联系人Id(过滤) */
      alreadySelectDepartmentIdList: []
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    plantIdList() {
      return this.selected.map((item) => item[this.rowIdKey])
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    // this.querySetupFieldByModuleId()
  },
  methods: {
    querySetupFieldByModuleId() {
      querySetupFieldByModuleId('9').then((res) => {
        const data = res.data || []
        this.customColumns = data.map((item) => {
          return {
            prop: item.fieldProp,
            label: item.fieldName,
            visible: true,
            minWidth: 200,
            tooltip: true
          }
        })
      })
    },

    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      for (const item of this.plantIdList.values()) {
        if (item === row[this.rowIdKey]) {
          color = 'pointer table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // 显示弹框
    handleAdd(alreadySelectDepartmentIdList) {
      this.selected = alreadySelectDepartmentIdList
      // this.alreadySelectDepartmentIdList = alreadySelectDepartmentIdList || []
      // this.selected = []
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.getList()
      this.visible = true
    },
    cancel() {
      this.visible = false
    },
    closed() {
      this.resetSearchForm(false)
    },
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.userList.map((item) => item[this.rowIdKey])
        vm.selected = vm.selected.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
    },
    handleRowClick(row) {
      const index = this.selected.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selected.splice(index, 1)
      } else {
        this.selected.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    // 查询表数据
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      // params.alreadySelectDepartmentIdList = this.alreadySelectDepartmentIdList
      queryDepartmentList(params).then((res) => {
        this.loading = false
        const list = res.data || []
        this.userList = list.map((item) => {
          delete item.remarks
          return item
        })
        // this.total = res.total
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.userList.forEach((item) => {
              if (row[this.rowIdKey] === item[this.rowIdKey]) {
                this.$refs.tables.toggleRowSelection(item, true)
              }
            })
          })
        })
      })
    },
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.selected = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      if (this.btnLoading) {
        return
      }
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 500)
      this.$emit('select', this.selected)
      this.cancel()
    }
  }
}
</script>
