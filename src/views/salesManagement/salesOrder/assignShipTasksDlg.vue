<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PRODUCT.product')"
    :visible.sync="visible"
    width="1200px"
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

    <div class="mt20" style="display: flex; align-items: flex-start" v-loading="loading">
      <div class="tree-box" :style="{ width: isCollapse ? '2px' : '240px' }">
        <div class="tree">
          <el-radio-group class="w100" v-model="warehouseId" @change="warehouseIdChange">
            <div
              class="item-node"
              :class="{ nodeActive: warehouseId === item }"
              v-for="item in warehouseList"
              :key="item.warehouseId"
            >
              <el-radio class="item-node-radio ellipsis-text" :label="item.warehouseId">{{
                item.warehouseName + (item.isSelect === '1' ? ` (${$t('ui.default')})` : '')
              }}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <div class="collapse-warp">
          <i
            :class="isCollapse === true ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
            @click="isCollapse = !isCollapse"
          ></i>
        </div>
        <div class="menu-resize" :data-collapse="isCollapse" v-dragTree v-show="!isCollapse"></div>
      </div>
      <div class="w100" style="overflow: hidden">
        <el-table
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
            <template slot="header" slot-scope="{ column }">
              <span v-if="['qty'].includes(item.prop)">
                <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
              </span>
              <span v-else>{{ column.label }}</span>
            </template>
            <template slot-scope="scope">
              <template v-if="item.prop === 'qty'">
                <div style="height: 28px">
                  <el-input-number
                    v-thousandSplit="{ precision: scope.row.decimalNum }"
                    style="width: 98%"
                    size="mini"
                    v-if="selectIds.includes(scope.row[rowIdKey])"
                    v-model="scope.row.qty"
                    :disabled="scope.row.maxQty <= 0"
                    controls-position="right"
                    :precision="scope.row.decimalNum"
                    :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                    :max="scope.row.maxQty || 0"
                  />
                  <template v-else>{{
                    $numberStr(scope.row[item.prop], scope.row.decimalNum)
                  }}</template>
                </div>
              </template>
              <template v-else-if="item.prop === 'qtyOnHand'">
                <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                <template v-else>{{
                  $numberStr(scope.row[item.prop], scope.row.decimalNum)
                }}</template>
              </template>

              <template v-else-if="item.prop === 'availableQty'">
                <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                <template v-else>{{
                  $numberStr(scope.row[item.prop], scope.row.decimalNum)
                }}</template>
              </template>
              <template v-else-if="item.prop === 'documentReservedQty'">
                <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                <template v-else>{{
                  $numberStr(scope.row[item.prop], scope.row.decimalNum)
                }}</template>
              </template>
              <template v-else-if="item.prop === 'pendShippingQty'">
                <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                <template v-else>{{
                  $numberStr(scope.row[item.prop], scope.row.decimalNum)
                }}</template>
              </template>
              <template v-else-if="item.prop === 'salesUom'">
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
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        :disabled="selectList.length <= 0"
        :loading="btnLoading"
        @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryCanSelectWarehouseListHaveDataPermissionsNoPage,
  querySOSelectProductListFromDelivery,
  dealAddProductMsg
} from '@/api/salesManagement/salesOrder'
// import { queryRFQCanSelectProductList as querySOSelectProductListFromDelivery } from '@/api/purchaseManagement/requestForQuotation'

export default {
  directives: {
    // transferDom
  },
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
      saveKey: '26',
      savePath: 'salesMTable',
      searchFormKey: Date.now(),
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      rowIdKey: 'productId',
      tableList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      visible: false,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true,
          fixed: true
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
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
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
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory'),
          visible: true,
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'salesUom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'documentReservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'pendShippingQty',
          label: vm.$t('PRODUCT.pendShipmentQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.salesQTY1'),
          visible: true,
          minWidth: 200,
          fixedWidth: 160,
          padding: 60,
          tooltip: true,
          fixed: 'right'
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
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        }
      ],
      warehouseId: 8,
      warehouseList: [],
      defaultProps: {
        children: 'child',
        label: 'categoryName'
      },
      /* 已经选择的联系人Id(过滤) */
      alreadySelectIdList: [],
      isCollapse: false
    }
  },
  computed: {
    selectIds() {
      return this.selectList.map((item) => item[this.rowIdKey])
    }
  },
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleAdd() {
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.queryCanSelectWarehouseListHaveDataPermissionsNoPage()
    },
    queryCanSelectWarehouseListHaveDataPermissionsNoPage() {
      queryCanSelectWarehouseListHaveDataPermissionsNoPage({
        needSelectWarehouseId: this.formData.warehouseId
      }).then((res) => {
        this.warehouseList = res.data || []
        const topRow = this.warehouseList[0]
        if (topRow) {
          this.warehouseId = topRow.warehouseId
        }
        this.getList()
      })
    },
    queryTable() {
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables.clearSort()
      this.getList()
    },
    warehouseIdChange() {
      this.getList()
    },
    getList() {
      const vm = this
      if (!this.warehouseId) return
      const param = this.queryParams
      this.$trimOfObj(param)
      this.queryParams.warehouseId = this.warehouseId
      this.queryParams.salesOrderId = this.formData.salesOrderId
      this.loading = true
      querySOSelectProductListFromDelivery(param)
        .then((response) => {
          this.loading = false
          this.tableList = response.data || []
          console.log(this.selectList)
          this.$nextTick(() => {
            this.selectList.forEach((row, sIndex) => {
              this.tableList.forEach((item, index) => {
                if (row[this.rowIdKey] === item[this.rowIdKey]) {
                  this.$set(item, 'qty', row.qty)
                  this.selectList[sIndex] = item
                  this.$refs.tables.toggleRowSelection(item, true)
                }
              })
            })
          })
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    selectable(row, rowIndex) {
      if (!row.maxQty) {
        return false
      }
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
      if (!row.maxQty) {
        return
      }
      if (column && column.property === 'qty') {
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
      const { pageSize, warehouseId } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize, warehouseId }
      this.$refs.tables.clearSort()
      this.getList()
    },
    closed() {
      this.isCollapse = false
      this.selectList = []
      this.tableList = []
      this.$refs.tables.clearSelection()
      // this.$refs.tree.setCheckedKeys([])
    },
    submit() {
      if (this.btnLoading) return
      if (this.selectList.length <= 0) {
        return
      }
      const qtyReq = this.selectList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return
      }
      this.$modal
        .confirm(this.$t('SALES.soAssignConfirm'))
        .then(() => {
          this.btnLoading = true

          return dealAddProductMsg({
            salesInquiryProductList: this.selectList,
            businessPartnerId: this.formData.businessPartnerId,
            currencyId: this.formData.currencyId,
            customerGroup: this.formData.customerGroup
          })
        })
        .then((response) => {
          this.btnLoading = false
          this.$modal.msgSuccess(this.$t('SALES.soAssignSuccess').replace('$1', response.msg))
          this.cancel()
          this.visible = false
        })
        .catch(() => {
          this.btnLoading = false
        })
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
  margin-right: 20px;
  //  transition: width 0.28s;
  .item-node {
    box-sizing: border-box;
    margin: 6px;
    border: 1px solid #f2f2f2;
    border-radius: 4px;
    &:hover {
      background: #f5f7fa;
    }
  }
  .item-node-radio {
    display: block;
    padding: 0 20px;
    height: 34px;
    line-height: 34px;
  }
  .nodeActive {
    border: 1px solid #0e6eff;
  }
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
