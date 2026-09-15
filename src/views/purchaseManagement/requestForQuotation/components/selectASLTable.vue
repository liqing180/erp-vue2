<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('menu.ASLItems')"
    :visible.sync="visible"
    width="1100px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <!-- <el-tabs v-model="activeName" size="mini" type="card" @tab-click="handleClick">
      <el-tab-pane :label="$t('PURCHASE.Standard')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('PURCHASE.DropShipping')" name="2"></el-tab-pane>
    </el-tabs> -->
    <div style="position: relative">
      <search-form
        ref="searchForm"
        v-model="queryParams"
        :searchData="searchData"
        :handleQuery="handleSearchForm"
        :resetQuery="resetSearchForm"
        :showCustom="false"
        :showMenu="false"
        :topShowCount="0"
        :isShowAllBtn="false"
        :isShowRefreshBtn="false"
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
      <div class="department-data" v-if="showAllAuth">
        <el-checkbox @change="getList" v-model="isOnlyDefaultDept">{{
          $t('menu.departmentData')
        }}</el-checkbox>
      </div>
    </div>

    <div class="mt10">
      <el-table
        border
        ref="tables"
        :data="tableList"
        :max-height="tableMaxHeight"
        v-loading="loading"
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
            <template v-else-if="item.prop === 'isActive'">
              <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
              <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                $t('uiBtn.inactive')
              }}</el-tag>
            </template>
            <template v-else-if="item.prop === 'unitPrice'">
              {{ $numberStr(scope.row.unitPrice, 2) }}
            </template>
            <template v-else-if="item.prop === 'prBalancePurchaseQty'">
              {{ $numberStr(scope.row.prBalancePurchaseQty, scope.row.decimalNum) }}
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
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        @click="submit"
        :disabled="selectList.length <= 0"
        v-if="checkPermi(['requestForQuotation:pendInquiry:ASLItems'])"
        >{{ $t('menu.createPO') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryASLPendingOrderProductList,
  queryASLPendingOrderProductListForSearch
} from '@/api/purchaseManagement/requestForQuotation'

export default {
  dicts: ['bp_business_partner_status', 'bp_supplier_type', 'bp_supplier_group'],
  mixins: [pageMixin],
  props: {
    productIdList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    const vm = this
    return {
      isOnlyDefaultDept: false,
      saveKey: '42',
      savePath: 'purchaseMTable',
      searchFormKey: Date.now(),
      activeName: '1',
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'purchaseRequisiteDetailId',
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
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: false,
          padding: 70,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
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
          prop: 'prBalancePurchaseQty',
          label: vm.$t('PURCHASE.pendPurchaseQTY'),
          visible: true,
          // sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.deliveryAddress'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseRequisiteNo',
          label: vm.$t('PURCHASE.purchaseRequisitionNo'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'requiredBy',
          label: vm.$t('PURCHASE.requiredBy'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        // {
        //   name: 'condition',
        //   placeholder: `${this.$t('ui.supplierSearch')}`,
        //   type: 'InputEle'
        // },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('PURCHASE.supplierName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'productIdList',
          label: vm.$t('PURCHASE.productName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'productId',
          selectLabel: 'productName',
          selectData: []
        },
        // {
        //   name: 'conditionForPO',
        //   label: vm.$t('PURCHASE.purchaseRequisitionNo'),
        //   type: 'InputEle',
        //   isLine: false
        // }
        {
          name: 'conditionForPR',
          label: this.$t('PURCHASE.purchaseRequisitionNo'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        },
        {
          name: 'requiredIdList',
          label: vm.$t('PURCHASE.requiredBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'requiredId',
          selectLabel: 'requiredBy',
          selectData: []
        },
        {
          name: 'createdIdList',
          label: vm.$t('ui.createdBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
          selectData: []
        }
      ],
      /* 已经选择的联系人Id(过滤) */
      alreadySelectIdList: []
    }
  },
  computed: {
    showAllAuth() {
      return this.checkPermi(['purchaseManagement:requestForQuotation:departmentData'])
    }
  },
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleClick() {
      this.selectList = []
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables && this.$refs.tables.clearSort()
      this.$refs.searchForm && this.$refs.searchForm.resetForm()
      // this.queryTable()
    },
    handleAdd(alreadySelectIdList = []) {
      this.activeName = '1'
      this.selectList = alreadySelectIdList
      // this.alreadySelectIdList = alreadySelectIdList || []
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    queryTable() {
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables.clearSort()
      this.getList()
    },
    querySearchList() {
      const param = {}
      // if (this.activeName === '1') {
      //   param.dropShipping = '0'
      // } else {
      //   param.dropShipping = '1'
      // }
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      queryASLPendingOrderProductListForSearch(param).then((res) => {
        console.log('===')
        const { businessPartnerList, productList, conditionForPRList, createdList, requiredList } =
          res.data
        const conditionForSOList1 = (conditionForPRList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.searchData.forEach((x, i) => {
          if (x.name === 'businessPartnerIdList') {
            this.$set(this.searchData[i], 'selectData', businessPartnerList)
          } else if (x.name === 'productIdList') {
            this.$set(this.searchData[i], 'selectData', productList)
          } else if (x.name === 'conditionForPR') {
            this.$set(x, 'fuzzyData', conditionForSOList1)
          } else if (x.name === 'requiredIdList') {
            this.$set(this.searchData[i], 'selectData', requiredList)
          } else if (x.name === 'createdIdList') {
            this.$set(this.searchData[i], 'selectData', createdList)
          }
        })
      })
    },
    getList() {
      this.querySearchList()
      const vm = this
      const param = this.queryParams
      this.$trimOfObj(param)
      param.alreadyBusinessPartnerIdList = this.alreadySelectIdList
      this.loading = true
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      param.menuPerms = this.menuKey.RFQ
      // if (this.activeName === '1') {
      //   param.dropShipping = '0'
      // } else {
      //   param.dropShipping = '1'
      // }

      queryASLPendingOrderProductList(param)
        .then((response) => {
          const rows = response.rows || []
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

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
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
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
      this.selectList = []
      this.resetSearchForm(false)
    },
    submit() {
      // 从 selectList 中取出 id 和 name，组成新的数组
      const data = this.selectList.map((x) => ({
        id: x.businessPartnerId,
        name: this.activeName === '1' ? x.receiveAddressId : x.receiveAddressName
      }))
      console.log(data, '============ 提取后的数组')

      // 判断数组中的每一项 id 和 name 是否都相同
      const isSame = data.every((item) => item.id === data[0].id && item.name === data[0].name)

      if (!isSame) {
        this.$modal.msgError(this.$t('PURCHASE.sameVendor'))
        return
      }

      if (this.btnLoading) return
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
      // this.$emit('onSuccess', this.selectList)
      console.log('转PO')
      this.$router.push({
        path: '/purchaseManagement/addPurchaseOrder',
        query: {
          timeId: Date.now(),
          pendingOrderProductIds: this.selectList.map((x) => x.pendingOrderProductId).join('|'),
          purchaseRequisiteDetailIds: this.selectList
            .map((x) => x.purchaseRequisiteDetailId)
            .join(','),
          // dropShipping: this.activeName === '1' ? '0' : '1',
          fromSrcPath: encodeURIComponent('/purchaseManagement/requestForQuotation'),
          createdType: '2'
        }
      })
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
.form {
  // padding-top: 5px;
  // padding-bottom: 5px;
  ::v-deep .el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
