<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('INVENTORY.warehouse')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
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
      :max-height="tableMaxHeight"
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
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryCanSelectWarehouseListFromProjectProductionOut,
  queryCanSelectWarehouseListFromProjectProductionIn
} from '@/api/projectManagement/projectProduction'
import locale from '@/views/organization/lang/index'
export default {
  directives: {},
  dicts: ['warehouse_type'],
  mixins: [pageMixin],
  props: {
    salesOrderTransferOrderType: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '15',
      savePath: 'ITOTable',
      searchFormKey: Date.now(),
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tableList: [],
      tableMaxHeightResize: true,
      selected: '',
      visible: false,
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
      ]
    }
  },
  computed: {},
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleOpen(params) {
      this.alreadySelectWarehouseId = params.alreadySelectWarehouseId
      this.queryType = params.queryType
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = { ...this.queryParams }
      this.$trimOfObj(param)
      param.alreadySelectWarehouseId = this.alreadySelectWarehouseId
      if (this.salesOrderTransferOrderType) {
        param.salesOrderTransferOrderType = this.salesOrderTransferOrderType
      }
      let queryFN
      if (this.queryType === 'to') {
        queryFN = queryCanSelectWarehouseListFromProjectProductionIn
      } else {
        queryFN = queryCanSelectWarehouseListFromProjectProductionOut
      }
      param.menuPerms = this.menuKey.projectProduction
      queryFN(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.warehouseTypeShowStr = this.selectDictLabel(
              this.dict.type.warehouse_type,
              item.warehouseType
            )
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
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
    handleBack() {
      const vm = this
      this.tableList = []
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
    handleRowClick(row) {
      this.$emit('update', row, this.queryType)
      this.tableList = []
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
