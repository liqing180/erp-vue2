<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      :title="$t('bp.vehicleList')"
      :visible.sync="open"
      width="1200px"
      append-to-body
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
        :topShowCount="2"
      >
        <!-- <el-row :gutter="10" class="mb8"> -->
        <right-toolbar
          :saveKey="saveKey"
          :showSearch.sync="showSearch"
          @queryTable="queryTable"
          :columns="configColumn"
          :columnsInit="columns"
        ></right-toolbar>
        <!-- </el-row> -->
      </search-form>

      <el-table
        border
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
        ref="tables"
        :data="tableList"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        @sort-change="handleSortChange"
        :max-height="600"
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
          :align="item.align || 'center'"
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
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">{{ $t('uiBtn.back') }}</el-button>
        <el-button
          type="primary"
          @click="handleSelectUser"
          :loading="btnLoading"
          :disabled="selected.length <= 0"
          >{{ $t('uiBtn.save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryTruckList, queryTruckPlantForZoneId } from '@/api/businessPartner/businessPartner'

export default {
  name: 'productDlg',
  components: {},
  props: {
    zoneId: {
      type: String,
      default: ''
    },
    addressList: {
      type: Array,
      default: () => []
    },
    projectList: {
      type: Array,
      default: () => []
    },
    comDisFrom: {
      type: Boolean,
      default: false
    }
  },
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      btnLoading: false,
      saveKey: '8',
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 角色表格数据
      tableList: [],
      // 弹出层标题
      dateRange: [],
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      // 列信息
      columns: [
        {
          prop: 'licensePlateNo',
          label: vm.$t('mapLang.vehicleNo'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },

        {
          prop: 'truckCode',
          label: vm.$t('mapLang.truckCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'driverName',
          label: vm.$t('mapLang.driversName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'plantName',
          label: vm.$t('notification.plant'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'zoneName',
          label: vm.$t('ui.zone'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      searchData: [
        {
          name: 'condition',
          placeholder: `${vm.$t('mapLang.vehicleNo')} / ${vm.$t('mapLang.truckCode')}`,
          type: 'InputEle'
        },
        {
          name: 'plantIdList',
          label: vm.$t('notification.plant'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          selectData: []
        }
      ],
      searchFormKey: Date.now(),
      open: false,
      createTableList: [],
      // 项目id
      projectTimerId: '',
      alreadySelectMixDesignIdList: [],
      selected: []
    }
  },
  beforeCreate() {},
  async created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    plantIdList() {
      return this.selected.map((item) => item.truckId)
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      for (const item of this.plantIdList.values()) {
        if (item === row.truckId) {
          color = 'pointer table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // 显示弹框
    handleAdd(alreadySelectMixDesignIdList) {
      this.selected = alreadySelectMixDesignIdList || []
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.queryTruckPlantForZoneId()
      this.getList()
      this.open = true
    },
    cancel() {
      this.open = false
    },
    closed() {
      this.resetSearchForm(false)
      this.$nextTick(() => {
        this.searchFormKey = this.searchFormKey + 1
      })
      this.selected = []
      this.tableList = []
    },
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d.truckId)
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item.truckId)) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item.truckId)
        vm.selected = vm.selected.filter((item) => !delArr.includes(item.truckId))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i].truckId === row.truckId) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
    },
    handleRowClick(row) {
      const index = this.selected.findIndex((item) => item.truckId === row.truckId)
      const isSelected = index > -1
      if (isSelected) {
        this.selected.splice(index, 1)
      } else {
        this.selected.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    queryTruckPlantForZoneId() {
      const params = {
        zoneId: this.zoneId
      }
      queryTruckPlantForZoneId(params).then((res) => {
        const data = (res.data || []).filter((x) => x.dictValue !== '1')
        this.$set(this.searchData[1], 'selectData', data || [])
      })
    },
    // 查询表数据
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      params.zoneId = this.zoneId
      queryTruckList(params).then((res) => {
        this.loading = false
        this.tableList = res.rows || []
        this.total = res.total
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.tableList.forEach((item) => {
              if (row.truckId === item.truckId) {
                this.$refs.tables.toggleRowSelection(item, true)
              }
            })
          })
        })
      })
    },
    /** 搜索 */
    handleSearchForm(query) {
      const param = this.$trimOfObj(query)
      this.queryParams = { ...param }
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
      this.$emit('onSuccess', this.selected)
      this.cancel()
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
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
  }
  .con-right {
    margin-left: 10px;
    line-height: 0;
  }
}
</style>
