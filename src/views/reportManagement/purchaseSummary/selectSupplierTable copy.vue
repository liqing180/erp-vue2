<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.supplier')"
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
      @select="handleSelectionChange"
      @row-click="handleRowClick"
      :row-class-name="'pointer'"
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
      <el-button type="primary" @click="submit">{{ $t('uiBtn.submit') }} </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryCanSelectVendorListForPurchaseSummary } from '@/api/reportManagement/purchaseSummary'
import locale from '@/views/organization/lang/index'

export default {
  dicts: ['bp_business_partner_status', 'bp_supplier_type', 'bp_supplier_group'],
  mixins: [pageMixin],
  props: {
    warehouseId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '5',
      savePath: 'reportMTable',
      searchFormKey: Date.now(),
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tableList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: [],
      selectList: [],
      rowIdKey: 'businessPartnerId',
      tableMaxHeightResize: true,
      selected: '',
      visible: false,
      columns: [
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PURCHASE.supplierCode'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'businessPartnerStatus',
          propBy: 'businessPartnerStatusStr',
          label: vm.$t('ui.status'),
          minWidth: 170,
          sortable: 'custom',
          visible: true,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'supplierType',
          propBy: 'supplierTypeStr',
          label: vm.$t('ui.supplierType'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'supplierGroup',
          propBy: 'supplierGroupStr',
          label: vm.$t('ui.supplierGroup'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'isCompetitor',
          label: vm.$t('PURCHASE.isCompetitor'),
          minWidth: 170,
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
          placeholder: `${this.$t('ui.supplierSearch')}`,
          type: 'InputEle'
        }
        // {
        //   name: 'supplierGroupList',
        //   label: vm.$t('ui.supplierGroup'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'dictValue',
        //   selectLabel: 'dictLabel',
        //   dict: 'bp_supplier_group',
        //   selectData: []
        // }
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
    handleOpen(alreadySelectIdList) {
      this.ids = alreadySelectIdList || []
      console.log(this.ids, '==============242========')
      // this.selectList = alreadySelectIdList || []
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      this.$trimOfObj(param)
      queryCanSelectVendorListForPurchaseSummary(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.businessPartnerStatusStr = this.selectDictLabel(
              this.dict.type.bp_business_partner_status,
              item.businessPartnerStatus
            )
            item.supplierTypeStr = this.selectDictLabel(
              this.dict.type.bp_supplier_type,
              item.supplierType
            )
            item.supplierGroupStr = this.selectDictLabel(
              this.dict.type.bp_supplier_group,
              item.supplierGroup
            )
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          this.$nextTick(() => {
            this.ids.forEach((row) => {
              this.tableList.forEach((item) => {
                if (row === item[this.rowIdKey]) {
                  this.$refs.tables.toggleRowSelection(item, true)
                }
              })
            })
          })
        })
        .catch((err) => {
          vm.table_loading = false
          window.console.error(err)
        })
    },
    selectable(row, rowIndex) {
      return true // 不禁用
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
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize, condition: '' }
      this.$refs.tables.clearSort()

      if (isGetList) {
        this.getList()
      }
    },
    closed() {
      this.resetSearchForm(false)
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
          vm.ids = vm.ids.filter((x) => x !== row[this.rowIdKey])
          return vm.selectList.splice(i, 1)
        }
      }
      vm.selectList.push(row)
    },
    handleRowClick(row) {
      const index = this.selectList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      const ids = this.selectList.map((x) => x.businessPartnerId) || []
      this.$emit('onSuccess', ids)
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
