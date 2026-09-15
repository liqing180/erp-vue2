<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      :title="$t('mapLang.address')"
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
        :topShowCount="1"
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
        ref="tables"
        :row-class-name="tableRowClassName"
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @sort-change="handleSortChange"
        :max-height="600"
      >
        <el-table-column type="selection" width="55" align="center" :selectable="selectable" />
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">{{ $t('uiBtn.back') }}</el-button>
        <el-button
          type="primary"
          @click="submitForm"
          :loading="btnLoading"
          :disabled="selectList.length <= 0"
          >{{ $t('uiBtn.save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'

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
      selectList: [],
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
      // 查询参数
      queryParams: {
        condition: undefined,
        isActive: ''
      },
      // 列信息
      columns: [
        {
          prop: 'label',
          label: vm.$t('ui.label'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },

        {
          prop: 'address1',
          label: vm.$t('ui.addressLine1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'address2',
          label: vm.$t('ui.addressLine2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'location',
          label: vm.$t('ui.locationPrecinct'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'city',
          label: vm.$t('ui.cityTown'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'province',
          label: vm.$t('ui.provinceState'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'postalCode',
          label: vm.$t('ui.postalCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
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
          placeholder: `${vm.$t('ui.label')}`,
          type: 'InputEle'
        }
      ],
      searchFormKey: Date.now(),
      open: false,
      createTableList: [],
      // 项目id
      projectTimerId: ''
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
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = 'pointer'
      for (const item of this.ids.values()) {
        if (item === row.rowTimeId) {
          color = 'pointer table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      // return false // 禁用
      return true // 不禁用
    },
    getList() {
      const table = JSON.parse(JSON.stringify(this.createTableList))
      if (this.queryParams.condition) {
        this.tableList = table.filter((item) => {
          return this.$isContain(this.queryParams.condition, [item.label])
        })
      } else {
        this.tableList = table
      }
    },

    updateAddress(e) {
      if (e.businessAddressId) {
        const index = this.tableList.findIndex((x) => x.rowTimeId === e.businessAddressId)
        e.isNewCustomerAddress = 0
        this.tableList.splice(index, 1, e)
        this.createTableList.splice(index, 1, e)
      } else if (e.rowTimeId) {
        const index = this.tableList.findIndex((x) => x.rowTimeId === e.rowTimeId)
        e.isNewCustomerAddress = 1
        this.tableList.splice(index, 1, e)
        this.createTableList.splice(index, 1, e)
      } else {
        e.rowTimeId = new Date().getTime()
        e.isNewCustomerAddress = 1
        this.tableList.push(e)
        this.createTableList.push(e)
      }
      this.$emit('updateAddress', this.tableList)
    },
    /** 搜索 */
    handleSearchForm(query) {
      const param = this.$trimOfObj(query)
      this.queryParams = { ...param }
      if (!this.queryParams.dateType && this.carrierOrderStatus === '0') {
        this.queryParams.dateType = this.searchData[1].selectData[0].dictValue
      }
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      if (this.carrierOrderStatus === '0') {
        this.searchData[1].selectId = this.searchData[1].selectData[0].dictValue
        this.searchData[1].date = []
        const { pageSize } = this.queryParams
        this.queryParams = { pageNum: 1, pageSize, dateType: this.searchData[1].selectId }
      } else {
        const { pageSize } = this.queryParams
        this.queryParams = { pageNum: 1, pageSize }
      }
      this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    handleRowClick(row) {
      const index = this.selectList.findIndex((item) => item.rowTimeId === row.rowTimeId)
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.ids = this.selectList.map((item) => item.rowTimeId)
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.rowTimeId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd(data) {
      const { customerAddressList, rowTimeId } = data
      this.selectList = customerAddressList || []
      this.reset()
      this.tableList = JSON.parse(JSON.stringify(this.addressList))
      console.log(this.addressList, '===330')
      this.tableList = this.tableList.filter(
        (x) =>
          (!x.projectIdList || x.projectIdList.length === 0 || rowTimeId === x.projectIdList) &&
          x.isActive === '1' &&
          x.address1
      )
      this.createTableList = JSON.parse(JSON.stringify(this.tableList))
      this.open = true
      this.$nextTick(() => {
        customerAddressList.forEach((row) => {
          this.tableList.forEach((item) => {
            if (row.rowTimeId === item.rowTimeId) {
              this.$refs.tables.toggleRowSelection(item, true)
            }
          })
        })
      })
    },
    handleDelete() {
      let createIds = []
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          createIds = JSON.parse(JSON.stringify(this.ids))
          return (this.tableList = this.tableList.filter(
            (x) => this.ids.indexOf(x.rowTimeId) === -1
          ))
        })
        .then(() => {
          this.createTableList = this.createTableList.filter(
            (x) => createIds.indexOf(x.rowTimeId) === -1
          )
          this.$emit('updateAddress', this.tableList)
        })
        .catch(() => {})
    },
    closed() {
      this.resetSearchForm(false)
      this.$nextTick(() => {
        this.searchFormKey = this.searchFormKey + 1
      })
    },
    reset() {},
    /** 提交按钮 */
    submitForm: function () {
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 500)
      this.$emit('updateAddress', this.selectList)
      this.open = false
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
