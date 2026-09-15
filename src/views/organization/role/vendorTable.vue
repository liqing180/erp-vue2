<template>
  <el-dialog
    v-dialogDrag
    :title="isCustomer === '1' ? $t('menu.customer') : $t('organization.vendor')"
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
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      @row-click="handleRowClick"
      max-height="600px"
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
        :min-width="item.minWidth"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
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
          <template v-else-if="item.prop === 'isCompetitor'">
            <el-tag v-if="scope.row.isCompetitor === '1'">{{ $t('ui.y') }}</el-tag>
            <el-tag v-if="scope.row.isCompetitor === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'businessPartnerStatus'"
            >{{
              selectDictLabel(dict.type.bp_business_partner_status, scope.row.businessPartnerStatus)
            }}
          </template>
          <template v-else-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
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
import { queryCanAddVendorList, queryCanAddCustomerList } from '@/api/organization/role'

export default {
  mixins: [pageMixin],
  dicts: ['bp_business_partner_status'],
  props: {
    alreadyIdList: {
      type: Array,
      default() {
        return []
      }
    },
    isCustomer: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    const vm = this
    return {
      saveKey: '12',
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
          placeholder: `${vm.$t('organization.businessPartnerNo')} / ${vm.$t(
            'organization.businessPartnerName'
          )} `,
          type: 'InputEle'
        }
      ],
      columns: [
        {
          prop: 'businessPartnerNo',
          label: vm.$t('organization.businessPartnerNo'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('organization.businessPartnerName'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('organization.country'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'businessPartnerStatus',
          label: vm.$t('ui.status'),
          minWidth: 170,
          sortable: 'custom',
          visible: true,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('organization.currency'),
          minWidth: 170,
          visible: true,
          // sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'isCompetitor',
          label: vm.$t('organization.isCompetitor'),
          minWidth: 170,
          visible: true,
          tooltip: true
        }
      ],
      rowIdKey: 'businessPartnerId'
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
    handleOpen(list) {
      this.selectList = list || []
      // this.queryParams.condition = ''
      this.$set(this.queryParams, 'condition', '')
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.visible = true
      this.getList()
    },
    getList() {
      const param = this.queryParams
      // param.alreadyIdList = this.alreadyIdList
      this.loading = true
      let api = queryCanAddVendorList
      if (this.isCustomer === '1') {
        api = queryCanAddCustomerList
      }
      api(param)
        .then((response) => {
          this.tableList = response.rows || []
          this.total = response.total
          this.loading = false

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
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      for (const item of this.comIds.values()) {
        if (item === row.businessPartnerId) {
          color = 'pointer table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable() {
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
      const index = this.selectList.findIndex(
        (item) => item.businessPartnerId === row.businessPartnerId
      )
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
      // this.$nextTick(() => {
      //   this.searchFormKey = this.searchFormKey + 1
      // })
      this.selectList = []
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      this.$emit('onSuccess', this.selectList)
      this.visible = false
    },
    back() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
