<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('menu.warehouse')"
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
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-click="handleRowDbclick"
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
          <el-tag
            v-else-if="item.prop === 'isDefault'"
            :type="scope.row.isDefault === '1' ? '' : 'danger'"
          >
            {{ scope.row.isDefault === '1' ? $t('ui.y') : $t('ui.n') }}
          </el-tag>
          <template v-else-if="item.prop === 'warehouseType'">{{
            selectDictLabel(dict.type.warehouse_type, scope.row[item.prop])
          }}</template>
          <!-- <template slot-scope="scope" v-else-if="item.prop === 'label'">
            <WarehouseAddressLabel
              :warehouse-address-in-row="scope.row.warehouseAddress"
            ></WarehouseAddressLabel>
          </template> -->
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
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
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryPCCanSelectWarehouseList } from '@/api/purchaseManagement/purchaseContract'
import locale from '@/views/organization/lang/index'
// import WarehouseAddressLabel from '@/views/purchaseManagement/purchaseContract/warehouseAddressLabel/warehouseAddressLabel.vue'

export default {
  // components: { WarehouseAddressLabel },
  dicts: ['warehouse_type'],
  mixins: [pageMixin],
  props: {},
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '3',
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
      // 列信息
      columns: [
        {
          prop: 'warehouseName',
          label: vm.$t('PURCHASE.warehouseName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'warehouseCode',
          label: vm.$t('PURCHASE.warehouseCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'warehouseType',
          propBy: 'warehouseTypeStr',
          label: vm.$t('PURCHASE.warehouseType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isDefault',
          label: vm.$t('ui.isDefault'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'label',
          label: vm.$t('PURCHASE.label'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 140,
          visible: true,
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
          placeholder: `${this.$t('PURCHASE.warehouseName')} / ${this.$t(
            'PURCHASE.warehouseCode'
          )}`,
          type: 'InputEle'
        }
      ]
    }
  },
  computed: {},
  watch: {
    value(selected) {
      this.selected = selected
    },
    selected(selected) {
      this.$emit('input', selected)
      if (selected === undefined) return
      this.dispatch('ElFormItem', 'el.form.change', [selected])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.selected = this.value
  },
  updated() {
    this.selected = this.value
  },
  methods: {
    handleOpen() {
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    getList() {
      const vm = this
      const param = this.queryParams
      this.loading = true
      this.$trimOfObj(param)
      queryPCCanSelectWarehouseList(param)
        .then((response) => {
          const rows = response.rows
          this.loading = false
          this.total = response.total
          rows.forEach((item) => {
            item.warehouseTypeStr = this.selectDictLabel(
              this.dict.type.warehouse_type,
              item.warehouseType
            )
          })
          this.tableList = rows

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
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
    handleRowDbclick(row) {
      this.$emit('updateWarehouse', row)
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
