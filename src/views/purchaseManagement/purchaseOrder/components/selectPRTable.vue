<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    title=""
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          :label="$t('menu.purchaseRequisition')"
          name="1"
          :disabled="activeName === '2' ? selectList1.length > 0 : false"
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('PURCHASE.emergencyGoodsReceipt')"
          name="2"
          :disabled="activeName === '1' ? selectList1.length > 0 : false"
        ></el-tab-pane>
      </el-tabs>
    </el-row>
    <div style="position: relative">
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
          :saveKey="activeName"
          :savePath="savePath"
          :showSearch.sync="showSearch"
          :showSearchBtn="false"
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
        v-loading="loading"
        :max-height="tableMaxHeight"
        @sort-change="handleSortChange"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        @row-click="handleRowClick"
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
            <template v-if="item.prop === 'assignQty'">
              <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            </template>
            <template v-else-if="item.prop === 'productNames'">
              <div
                @mouseenter="showPop($event, scope.row)"
                @mouseleave="hidePop($event, scope.row)"
              >
                <div class="ellipsis-text">
                  {{ scope.row.productNames }}
                </div>
              </div>
            </template>
            <template v-else-if="item.prop === 'description'">
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :selectedNum="selectList1.length"
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
        :loading="btnLoading"
        :disabled="selectIds1.length <= 0"
        @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
    <ToolTipShowListForFN ref="ToolTipShowList" />
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import {
  queryASLPurchaseOrderCanSelectPurchaseRequisiteList,
  querySearchListFromASLPRList,
  buildASLPurchaseOrderFromBPAndPR,
  queryASLPurchaseOrderCanSelectPurchaseRequisiteListForEGR,
  buildASLPurchaseOrderFromBPAndPRForEGR
} from '@/api/purchaseManagement/purchaseOrder'
export default {
  directives: {
    // transferDom
  },
  mixins: [pageMixin],
  components: { ToolTipShowListForFN },
  props: {
    businessPartnerId: {
      type: String,
      default: ''
    },
    currencyId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      isOnlyDefaultDept: false,
      saveKey: '1',
      savePath: 'PRTable',
      activeName: '1',
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'purchaseRequisiteId',
      tableList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList1: [],
      visible: false,
      columns: [
        {
          prop: 'purchaseRequisiteNo',
          label: vm.$t('PURCHASE.purchaseRequisitionNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
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
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.deliveryAddress'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'branchCompanyDeptName',
          label: vm.$t('PURCHASE.department'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productNames',
          label: vm.$t('PURCHASE.product'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        // {
        //   prop: 'description',
        //   label: vm.$t('ui.description'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: false
        // },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
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
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        }
        // {
        //   name: 'conditionForPurchaseRequisiteNo',
        //   label: this.$t('PURCHASE.purchaseRequisitionNo'),
        //   type: 'AutocompleteEle',
        //   fuzzyData: [],
        //   defaultProps: {
        //     value: 'value',
        //     label: 'label'
        //   }
        // }
        /* {
          name: 'conditionForBusinessPartnerName',
          label: this.$t('PURCHASE.supplierName'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        } */
      ],
      // 请求的时间戳
      queryTime: undefined,
      isEmergencyGoodsReceipt: undefined
    }
  },
  computed: {
    selectIds() {
      return this.selectIds1
    },
    selectIds1() {
      return this.selectList1.map((item) => item[this.rowIdKey])
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    showAllAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:departmentData'])
    }
  },
  watch: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible('1', this.columns)
  },
  updated() {},
  methods: {
    handleTabClick() {
      this.resetSearchForm(false)
      this.getList()
    },
    showPop(e, row) {
      const list = row.purchaseRequisiteDetailList || []
      const params = {
        // popoverTitle: this.$t('PURCHASE.DocNo'),
        labelKey: 'productName',
        // itemClass: 'primary-pointer',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    handleOpen(alreadySelectIdList, isEmergencyGoodsReceipt = '') {
      this.selectList1 = alreadySelectIdList || []

      this.visible = true
      if (isEmergencyGoodsReceipt === '1') {
        this.activeName = '2'
      } else {
        this.activeName = '1'
      }
      this.isEmergencyGoodsReceipt = isEmergencyGoodsReceipt
      this.resetSearchForm()
    },
    querySearchListFromASLPRList() {
      const param = {}
      param.businessPartnerId = this.businessPartnerId
      param.currencyId = this.currencyId
      param.menuPerms = this.menuKey.PO
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      querySearchListFromASLPRList(param).then((res) => {
        const data = res.data || {}
        const conditionForPurchaseRequisiteNoList = (
          data.conditionForPurchaseRequisiteNoList || []
        ).map((item) => {
          return {
            value: item,
            label: item
          }
        })

        this.searchData[1].fuzzyData = conditionForPurchaseRequisiteNoList
      })
    },
    getList() {
      // this.querySearchListFromASLPRList()
      const timer = Date.now()
      this.queryTime = timer
      const vm = this
      let param = this.queryParams
      param = this.$trimOfObj(param)
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      param.businessPartnerId = this.businessPartnerId
      param.currencyId = this.currencyId
      this.loading = true
      param.menuPerms = this.menuKey.PO
      let api = queryASLPurchaseOrderCanSelectPurchaseRequisiteList
      if (this.activeName === '2') {
        api = queryASLPurchaseOrderCanSelectPurchaseRequisiteListForEGR
      }
      api(param)
        .then((response) => {
          if (timer !== this.queryTime) return
          this.loading = false
          this.total = response.total
          const rows = response.rows || []
          rows.forEach((item) => {
            item.qty = item.receivedQty
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.productNames = (item.purchaseRequisiteDetailList || [])
              .map((i) => i.productName)
              .join(', ')
          })
          this.tableList = response.rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          this.$nextTick(() => {
            this.selectList1.forEach((row) => {
              this.tableList.forEach((item, index) => {
                if (row[this.rowIdKey] === item[this.rowIdKey]) {
                  this.$refs.tables.toggleRowSelection(this.tableList[index], true)
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
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selectList1.length; i++) {
        if (vm.selectList1[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selectList1.splice(i, 1)
        }
      }
      vm.selectList1.push(row)
    },
    handleRowClick(row, col) {
      const index = this.selectList1.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selectList1.splice(index, 1)
      } else {
        this.selectList1.push(row)
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
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    closed() {
      this.selectList1 = []
      this.tableList = []
      this.$refs.tables.clearSelection()
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      let api = buildASLPurchaseOrderFromBPAndPR
      if (this.activeName === '2') {
        api = buildASLPurchaseOrderFromBPAndPRForEGR
      }
      api({
        businessPartnerId: this.businessPartnerId,
        purchaseRequisiteIdList: this.selectIds1
      })
        .then((res) => {
          const data = res.data || {}
          const errList = data.errorMsgList || []

          if (data.isError === '1' && errList.length > 0) {
            let htmlStr = '<div>'
            htmlStr += `<div>${this.$t('PURCHASE.aslPOSelectPRTip1')}</div>`
            // htmlStr += `<div>${this.$t('PURCHASE.aslPOSelectPRTip2')}</div>`
            htmlStr += '<ul class="mt5" style="margin-bottom: 0;">'
            // const icon =
            //   '<i style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;background-color: #0094ff;margin-right: 4px"></i>'
            const icon =
              '<svg t="1760167833446" class="icon" style="width: 20px;height:20px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1747" xmlns:xlink="http://www.w3.org/1999/xlink" width="128" height="128"><path d="M1001.661867 796.544c48.896 84.906667 7.68 157.013333-87.552 157.013333H110.781867c-97.834667 0-139.050667-69.504-90.112-157.013333l401.664-666.88c48.896-87.552 128.725333-87.552 177.664 0l401.664 666.88zM479.165867 296.533333v341.333334a32 32 0 1 0 64 0v-341.333334a32 32 0 1 0-64 0z m0 469.333334v42.666666a32 32 0 1 0 64 0v-42.666666a32 32 0 1 0-64 0z" fill="#FAAD14" p-id="1748"></path></svg>'
            errList.forEach((item) => {
              htmlStr += `<li class="mt5 flex" style="line-height: 1.4"><div class="mr5">${icon}</div> <div>${item.purchaseRequisiteNo}: ${item.tipsMsg}</div></li>`
            })
            htmlStr += '</ul></div>'
            /* this.$modal.msgWarning({
              message: htmlStr,
              dangerouslyUseHTMLString: true // 关键：允许渲染HTML
            }) */
            this.$confirm(htmlStr, '', {
              dangerouslyUseHTMLString: true,
              // confirmButtonText: this.$t('uiBtn.confirm'),
              showConfirmButton: false,
              cancelButtonText: this.$t('uiBtn.back')
            })
          }

          this.$emit('onSuccess', res.data || {})
          this.visible = false
          setTimeout(() => {
            this.btnLoading = false
          }, 2000)
        })
        .catch(() => {
          this.btnLoading = false
        })
      // this.$emit('onSuccess', this.selectList1, {})
    }
  }
}
</script>

<style lang="scss" scoped></style>
