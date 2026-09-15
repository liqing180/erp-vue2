<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.product')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('PURCHASE.pass')" name="2"></el-tab-pane>
        <el-tab-pane :label="$t('PURCHASE.failed')" name="1"></el-tab-pane>
      </el-tabs>
    </el-row>
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
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'productName'">
            <commonProductAndPicture :row="scope.row" />
          </template>
          <template v-else-if="item.prop === 'picture'">
            <div v-if="scope.row.defaultImageUrl" style="line-height: 0; height: 30px">
              <el-image
                style="height: 100%"
                :src="scope.row.defaultImageUrl"
                :preview-src-list="[scope.row.defaultImageUrl]"
              />
            </div>
          </template>
          <template v-else-if="item.prop === 'valuationAmount'">{{
            $numberStr(scope.row.valuationAmount, 2)
          }}</template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'reservedQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'inTransitQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :selectedNum="
        $$getFilteredSelectedNum(
          filteredSelectedList,
          tableList,
          activeName === '1' ? selectList1 : selectList2,
          rowIdKey
        )
      "
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
      <el-button type="primary" @click="submit">{{ $t('uiBtn.save') }} </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryProductListForFailed,
  queryProductListForPass
} from '@/api/purchaseManagement/purchaseReturnOrder'

export default {
  directives: {},
  dicts: ['service_type'],
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
      saveKey: '13',
      savePath: 'PROTable',
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
      selectList1: [],
      selectList2: [],
      visible: false,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom',
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PURCHASE.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PURCHASE.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'reservedQty',
          label: vm.$t('PURCHASE.reservedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        /* {
          prop: 'unqualifiedQTY',
          label: vm.$t('PURCHASE.unqualifiedQTY'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        {
          prop: 'inTransitQty',
          label: vm.$t('PURCHASE.inTransitQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }
        // {
        //   prop: 'picture',
        //   label: vm.$t('ui.picture'),
        //   visible: true,
        //   width: 120
        // }
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
      /* 已经选择的联系人Id(过滤) */
      alreadySelectIdList: [],
      isCollapse: false,
      activeName: '2'
    }
  },
  computed: {
    selectIds() {
      if (this.activeName === '1') {
        return this.selectIds1
      } else {
        return this.selectIds2
      }
    },
    selectIds1() {
      return this.selectList1.map((item) => item[this.rowIdKey])
    },
    selectIds2() {
      return this.selectList2.map((item) => item[this.rowIdKey])
    }
  },
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleTabClick() {
      this.resetSearchForm(false)
      this.getList()
    },
    handleAdd(data = []) {
      this.alreadyProductList = data
      this.queryParams.productCategoryId = ''
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.activeName = '2'
      this.resetSearchForm()
    },

    queryTable() {
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables.clearSort()
      this.queryParams.productCategoryId = ''
      this.$refs.tree && this.$refs.tree.setCurrentKey(null)
      this.selectList1 = []
      this.selectList2 = []
      this.$refs.tables && this.$refs.tables.clearSelection()
      this.getList()
    },
    getList() {
      const vm = this
      const param = this.queryParams
      this.$trimOfObj(param)
      param.purchaseOrderId = this.formData.purchaseOrderId
      param.warehouseId = this.formData.warehouseId
      param.purchaseReturnId = this.formData.purchaseReturnId
      param.logisticsDocumentId = this.formData.logisticsDocumentId
      param.selectedIdList = this.$$getSelectedIdList(this.selectIds, this.rowIdKey)
      this.loading = true
      let queryFn
      if (this.activeName === '1') {
        // param.alreadyProductIdList = this.alreadyProductList // 产品说一个产品可以有多行，
        //   .map((x) => x[this.rowIdKey])
        queryFn = queryProductListForFailed
      } else {
        // param.alreadyProductIdList = this.alreadyProductList
        //   .map((x) => x[this.rowIdKey])
        queryFn = queryProductListForPass
      }
      const timer = Date.now()
      this.queryTime = timer
      queryFn(param)
        .then((response) => {
          if (timer !== this.queryTime) return
          this.loading = false
          this.filteredSelectedList = this.$$getFilteredSelectedList(response)
          // this.total = response.total
          const rows = response.data || []
          this.tableList = rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          if (this.activeName === '1') {
            this.$nextTick(() => {
              this.selectList1.forEach((row) => {
                this.tableList.forEach((item, index) => {
                  if (row[this.rowIdKey] === item[this.rowIdKey]) {
                    this.$refs.tables.toggleRowSelection(this.tableList[index], true)
                  }
                })
              })
            })
          } else {
            this.$nextTick(() => {
              this.selectList2.forEach((row) => {
                this.tableList.forEach((item, index) => {
                  if (row[this.rowIdKey] === item[this.rowIdKey]) {
                    this.$refs.tables.toggleRowSelection(this.tableList[index], true)
                  }
                })
              })
            })
          }
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.productCategoryId = data.id
      this.getList()
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handleSelectAll(selection) {
      const vm = this
      if (this.activeName === '1') {
        if (selection.length) {
          // 去重添加
          const curSelectedIds = this.selectList1.map((d) => d[this.rowIdKey])
          selection.forEach((item) => {
            if (!curSelectedIds.includes(item[this.rowIdKey])) {
              vm.selectList1.push(item)
            }
          })
        } else {
          // 删除table中在selection 中缓存的内容
          const delArr = this.tableList.map((item) => item[this.rowIdKey])
          vm.selectList1 = vm.selectList1.filter((item) => !delArr.includes(item[this.rowIdKey]))
        }
      }
      if (this.activeName === '2') {
        if (selection.length) {
          // 去重添加
          const curSelectedIds = this.selectList2.map((d) => d[this.rowIdKey])
          selection.forEach((item) => {
            if (!curSelectedIds.includes(item[this.rowIdKey])) {
              vm.selectList2.push(item)
            }
          })
        } else {
          // 删除table中在selection 中缓存的内容
          const delArr = this.tableList.map((item) => item[this.rowIdKey])
          vm.selectList2 = vm.selectList2.filter((item) => !delArr.includes(item[this.rowIdKey]))
        }
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      if (this.activeName === '1') {
        for (let i = 0; i < vm.selectList1.length; i++) {
          if (vm.selectList1[i][this.rowIdKey] === row[this.rowIdKey]) {
            return vm.selectList1.splice(i, 1)
          }
        }
        vm.selectList1.push(row)
      }
      if (this.activeName === '2') {
        for (let i = 0; i < vm.selectList2.length; i++) {
          if (vm.selectList2[i][this.rowIdKey] === row[this.rowIdKey]) {
            return vm.selectList2.splice(i, 1)
          }
        }
        vm.selectList2.push(row)
      }
    },
    handleRowClick(row, col) {
      if (col && col.property === 'picture') {
        return
      }
      if (this.activeName === '1') {
        const index = this.selectList1.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        const isSelected = index > -1
        if (isSelected) {
          this.selectList1.splice(index, 1)
        } else {
          this.selectList1.push(row)
        }
        this.$refs.tables.toggleRowSelection(row, !isSelected)
      }
      if (this.activeName === '2') {
        const index = this.selectList2.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        const isSelected = index > -1
        if (isSelected) {
          this.selectList2.splice(index, 1)
        } else {
          this.selectList2.push(row)
        }
        this.$refs.tables.toggleRowSelection(row, !isSelected)
      }
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
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    closed() {
      this.isCollapse = false
      this.selectList1 = []
      this.selectList2 = []
      this.tableList = []
      this.$refs.tables && this.$refs.tables.clearSelection()
      this.$refs.tree && this.$refs.tree.setCheckedKeys([])
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      const arr = this.selectList1.concat(this.selectList2)
      const time = Date.now()
      arr.forEach((item, index) => {
        item.rowProductId = item.productId + (time + index)
      })
      this.$emit('onSuccess', arr)
      // this.$emit('onSuccess', this.selectList)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}

.tree-box {
  flex-shrink: 0;
  position: relative;
  max-height: 600px;
  margin-right: 20px;
  //  transition: width 0.28s;
}
.tree {
  min-height: 200px;
  max-height: 500px;
  overflow: hidden auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.collapse-warp {
  position: absolute;
  top: 50%;
  right: -4px;
  z-index: 300;
  font-size: 16px;
  // background-color: #888;
  // right: 100%;
  // border: 1px solid #000;
  background-color: #fff;
  border-radius: 4px;
}
.tree::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.tree::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.tree::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
