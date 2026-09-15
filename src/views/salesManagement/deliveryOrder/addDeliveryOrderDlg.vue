<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('menu.addDeliveryOrder')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('menu.preDeliveryNotice')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('SALES.transferOrder')" name="2"></el-tab-pane>
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
    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      :max-height="tableMaxHeight"
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
          <template v-else-if="item.prop === 'productNames'">
            <!-- <div>{{ scope.row[item.prop] }}</div> -->
            <div @mouseenter="showPop($event, scope.row)" @mouseleave="hidePop($event, scope.row)">
              <div class="ellipsis-text">{{ scope.row.productNames }}</div>
            </div>
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
      <el-button
        type="primary"
        :loading="btnLoading"
        :disabled="selectList.length <= 0"
        @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>

    <ToolTipShowListForFN ref="ToolTipShowList" />
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryCanAddDeliveryOrderPreDeliveryNoticeList,
  queryCanAddDeliveryOrderTransferOrderList,
  createDeliveryOrder
} from '@/api/salesManagement/deliveryOrder'
import locale from '@/views/productManagement/lang/index'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  dicts: ['sales_quotation_type', 'pre_delivery_notice_status'],
  mixins: [pageMixin],
  components: { ToolTipShowListForFN },
  props: {
    warehouseId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      isOnlyDefaultDept: false,
      saveKey: '3',
      savePath: 'salesMTable',
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
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      columns: [],
      columns1: [
        {
          prop: 'salesOrderNo',
          label: vm.$t('SALES.salesOrderNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesQuotationType',
          propBy: 'salesQuotationTypeShowStr',
          label: vm.$t('SALES.salesOrderType'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('SALES.customerName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'productNames',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'preDeliveryNoticeNo',
          label: vm.$t('menu.preDeliveryNotice'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'preDeliveryNoticeStatus',
          propBy: 'preDeliveryNoticeStatusShowStr',
          label: vm.$t('ui.status'),
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
        },
        {
          prop: 'createdTime',
          propBy: 'createdTimeStr',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      columns2: [
        {
          prop: 'salesOrderNo',
          label: vm.$t('SALES.salesOrderNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesQuotationType',
          propBy: 'salesQuotationTypeShowStr',
          label: vm.$t('SALES.salesOrderType'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('SALES.customerName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'productNames',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'transferOrderNo',
          label: vm.$t('menu.transferOrder'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'transferOrderStatus',
          propBy: 'transferOrderStatusShowStr',
          label: vm.$t('ui.status'),
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
        },
        {
          prop: 'createdTime',
          propBy: 'createdTimeStr',
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
      searchData: [],
      searchData1: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.customerSearch')}`,
          type: 'InputEle'
        },
        {
          name: 'conditionForPreDeliveryNoticeNo',
          label: this.$t('menu.preDeliveryNotice'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }
      ],
      searchData2: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.customerSearch')}`,
          type: 'InputEle'
        },
        {
          name: 'conditionForSalesOrderNo',
          label: this.$t('SALES.salesOrderNo'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }
      ],
      activeName: '1',
      btnLoading: false
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    showAllAuth() {
      return this.checkPermi(['salesManagement:deliveryOrder:departmentData'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    showPop(e, row) {
      const list = row.deliveryOrderDocumentProductList || []
      list.forEach(
        (x) => (x.customTitle = x.productName + '：' + this.$numberStr(x.qty, x.decimalNum))
      )
      const params = {
        popoverTitle: '',
        labelKey: 'customTitle',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    handleTabClick() {
      this.selectList = []
      this.tableList = []
      this.resetSearchForm(false)
      if (this.activeName === '1') {
        this.columns = this.columns1
        this.searchData = this.searchData1
      } else {
        this.columns = this.columns2
        this.searchData = this.searchData2
      }
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.searchFormKey = Date.now()
      this.getList()
    },
    handleOpen() {
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.activeName = '1'
      this.handleTabClick()
      this.visible = true
      // this.getList()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      this.$trimOfObj(param)
      let api = queryCanAddDeliveryOrderPreDeliveryNoticeList
      if (this.activeName === '2') {
        api = queryCanAddDeliveryOrderTransferOrderList
      }
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      api(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            /* item.salesQuotationTypeStr = this.selectDictLabel(
              this.dict.type.sales_quotation_type,
              item.salesQuotationType
            ) */
            item.createdTimeStr = this.parseTime(item.createdTime, this.fmtForYmdhms)
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.table_loading = false
          window.console.error(err)
        })
    },
    handleSelectAll(selection) {
      const vm = this
      let rowIdKey = 'salesOrderId'
      if (this.activeName === '2') {
        rowIdKey = 'transferOrderId'
      }
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selectList.map((d) => d[rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[rowIdKey])) {
            vm.selectList.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[rowIdKey])
        vm.selectList = vm.selectList.filter((item) => !delArr.includes(item[rowIdKey]))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      let rowIdKey = 'salesOrderId'
      if (this.activeName === '2') {
        rowIdKey = 'transferOrderId'
      }
      for (let i = 0; i < vm.selectList.length; i++) {
        if (vm.selectList[i][rowIdKey] === row[rowIdKey]) {
          return vm.selectList.splice(i, 1)
        }
      }
      vm.selectList.push(row)
    },
    handleRowClick(row, column) {
      if (column && column.property === 'picture') {
        return
      }
      let rowIdKey = 'salesOrderId'
      if (this.activeName === '2') {
        rowIdKey = 'transferOrderId'
      }
      const index = this.selectList.findIndex((item) => item[rowIdKey] === row[rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
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
      this.$refs.tables && this.$refs.tables.clearSort()

      if (isGetList) {
        this.getList()
      }
    },
    closed() {
      this.resetSearchForm(false)
    },
    submit() {
      this.btnLoading = true
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          return createDeliveryOrder({ deliveryOrderDocumentList: this.selectList })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
          this.$emit('onSuccess')
          this.handleBack()
          this.btnLoading = false
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
</style>
