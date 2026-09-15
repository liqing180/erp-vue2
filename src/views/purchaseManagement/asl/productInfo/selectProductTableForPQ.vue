<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PRODUCT.productList')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <!-- <search-form
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
    </search-form> -->
    <el-form label-width="180px" @submit.native.prevent>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PRODUCT.supplierName')}`">
            <el-input
              :value="formData.businessPartnerName"
              :title="formData.businessPartnerName"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PRODUCT.supplierCode')}`">
            <el-input
              :value="formData.businessPartnerNo"
              :title="formData.businessPartnerNo"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.purchaseQuotationNo')}`">
            <el-input
              :value="formData.purchaseQuotationNo"
              :title="formData.purchaseQuotationNo"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div>
      <el-table
        v-loading="loading"
        border
        ref="tables"
        :data="tableList"
        :max-height="tableMaxHeight"
        @sort-change="handleSortChange"
        @row-click="handleRowClick"
        :row-class-name="'pointer'"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
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
            <template v-if="item.prop === 'productName'">
              <commonProductAndPicture :row="scope.row" />
            </template>
            <template v-else-if="item.prop === 'purchaseUom'">
              <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'categoryNameShowStr'">
              <ToolTipShowCategory :list="scope.row.categoryNameList || []">
                <div class="flow1">{{ scope.row[item.prop] }}</div>
              </ToolTipShowCategory>
            </template>
            <template v-else-if="item.prop === 'productType'">
              <span>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
            </template>
            <template v-else-if="item.prop === 'unitPrice'">{{
              $numberStr(scope.row[item.prop], 2)
            }}</template>
            <template v-else-if="item.prop === 'description'">
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :selectedNum="comSelectedNum"
        :saveKey="saveKey"
        :savePath="savePath"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

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
import { queryCanSelectProductList } from '@/api/purchaseManagement/asl'

export default {
  dicts: ['product_type'],
  mixins: [pageMixin],
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '6',
      savePath: 'aslTable',
      searchFormKey: Date.now(),
      btnLoading: false,
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'productId',
      tableList: [],
      filteredSelectedList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      alreadyProductIdList: [],
      visible: false,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: false,
          padding: 70
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'productType',
          label: vm.$t('PURCHASE.productClass'),
          visible: true,
          width: 150,
          tooltip: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          fixedWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          fixedWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        }

        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        /* {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory'),
          visible: true,
          minWidth: 200
          // tooltip: true
        }, */
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
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        }
      ],
      treeList: [],
      defaultProps: {
        children: 'child',
        label: 'categoryName'
      },
      isCollapse: false,
      filterText: undefined,
      filteredTreeData: []
    }
  },
  computed: {
    comSelectedNum() {
      return this.$$getFilteredSelectedNum(
        this.filteredSelectedList,
        this.tableList,
        this.selectList.filter((item) => !!item.purchaseQuotationDetailId),
        this.rowIdKey
      )
    }
  },
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleAdd(selectList, alreadyProductIdList) {
      this.alreadyProductIdList = alreadyProductIdList || []
      this.selectList = selectList || []
      // this.queryParams.productCategoryId = ''
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    queryTable() {
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables.clearSort()
      this.queryParams.productCategoryId = ''
      this.$refs.tree && this.$refs.tree.setCurrentKey(null)
      this.getList()
    },
    getList() {
      const vm = this
      const param = this.queryParams
      param.selectedIdList = this.$$getSelectedIdList(
        this.selectList.filter((item) => !!item.purchaseQuotationDetailId),
        this.rowIdKey
      )
      this.$trimOfObj(param)
      param.purchaseQuotationId = this.formData.purchaseQuotationId
      param.currencyId = this.formData.currencyId
      param.alreadyProductIdList = this.alreadyProductIdList
      this.loading = true
      queryCanSelectProductList(param)
        .then((response) => {
          this.loading = false
          this.total = response.total
          this.filteredSelectedList = this.$$getFilteredSelectedList(response)
          const rows = response.rows || []
          this.tableList = rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          this.$nextTick(() => {
            this.selectList.forEach((row) => {
              this.tableList.forEach((item, index) => {
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
    // 节点单击事件
    handleNodeClick(data) {
      this.$set(this.queryParams, 'productCategoryId', data.id)

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
    closed() {
      this.isCollapse = false
      this.selectList = []
      this.tableList = []
      this.$refs.tables.clearSelection()
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      this.$emit('onSuccess', this.selectList)
      setTimeout(() => {
        this.btnLoading = false
      }, 1000)
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
