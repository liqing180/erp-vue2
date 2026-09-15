<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('SALES.order')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('SALES.salesOrder')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('SALES.salesReturnOrder')" name="2"></el-tab-pane>
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
      @row-click="handleRowClick"
      :row-class-name="'pointer'"
      :max-height="tableMaxHeight"
      :key="'table' + activeName"
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
  queryCanSelectSalesOrderList,
  queryCanSelectSalesGoodsReturnList,
  queryCanSelectSalesOrderSearchList,
  queryCanSelectSalesGoodsReturnSearchList
} from '@/api/salesManagement/preDeliveryNotice'

import locale from '@/views/organization/lang/index'
export default {
  dicts: ['sales_quotation_type', 'sales_inquiry_type'],
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
      isOnlyDefaultDept: false,
      saveKey: '10',
      savePath: 'salesMTable',
      activeName: '1',
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
          prop: 'businessPartnerNo',
          label: vm.$t('SALES.customerCode'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
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
          prop: 'salesPersonBy',
          label: vm.$t('SALES.salesPerson'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 180,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      columns2: [
        {
          prop: 'salesGoodsReturnNo',
          label: vm.$t('SALES.salesGoodsReturnNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
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
          prop: 'businessPartnerNo',
          label: vm.$t('SALES.customerCode'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
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
          prop: 'salesPersonBy',
          label: vm.$t('SALES.salesPerson'),
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
          name: 'conditionForSO',
          label: this.$t('SALES.salesOrderNo'),
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
          name: 'conditionForSalesGoodsReturnNo',
          label: this.$t('SALES.salesGoodsReturnNo'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }
      ]
    }
  },
  computed: {
    showAllAuth() {
      return this.checkPermi(['salesManagement:preDeliveryNotice:departmentData'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.$$initColumnVisible('1', this.columns1)
    this.$$initColumnVisible('2', this.columns2)
  },
  methods: {
    handleTabClick() {
      this.resetSearchForm(false)
      if (this.activeName === '1') {
        this.columns = this.columns1
        this.searchData = this.searchData1
      } else {
        this.columns = this.columns2
        this.searchData = this.searchData2
      }
      this.tableList = []
      this.getList()
    },
    handleOpen() {
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.activeName = '1'
      this.columns = this.columns1
      this.searchData = this.searchData1
      this.getList()
    },
    getList() {
      const vm = this
      this.loading = true
      this.querySearchList()
      const param = this.queryParams
      let queryFN = queryCanSelectSalesOrderList
      if (this.activeName === '2') {
        queryFN = queryCanSelectSalesGoodsReturnList
      }
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.preDeliveryNotice
      const timer2 = Date.now()
      this.queryTimer2 = timer2
      queryFN(param)
        .then((response) => {
          if (this.queryTimer2 !== timer2) return
          const rows = response.rows || []
          rows.forEach((item) => {
            // item.salesQuotationTypeStr = this.selectDictLabel(
            //   this.dict.type.sales_inquiry_type,
            //   item.salesQuotationType
            // )
            item.createdTime = this.parseTime(item.createdTime)
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
    querySearchList() {
      const param = {}
      let queryFN = queryCanSelectSalesOrderSearchList
      if (this.activeName === '2') {
        queryFN = queryCanSelectSalesGoodsReturnSearchList
      }
      const queryTimer = Date.now()
      this.queryTimer = queryTimer
      param.menuPerms = this.menuKey.preDeliveryNotice
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      queryFN(param).then((res) => {
        if (this.queryTimer !== queryTimer) return
        const data = res.data || {}
        if (this.activeName === '1') {
          const conditionForSOList = (data.conditionForSalesOrderNoList || []).map((item) => {
            return {
              value: item,
              label: item
            }
          })
          this.searchData[1].fuzzyData = conditionForSOList
        } else {
          const conditionForSGRList = (data.conditionForSalesGoodsReturnNoList || []).map(
            (item) => {
              return {
                value: item,
                label: item
              }
            }
          )
          this.searchData[1].fuzzyData = conditionForSGRList
        }
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
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize, condition: '' }
      this.$refs.tables.clearSort()

      if (isGetList) {
        this.getList()
      }
    },
    closed() {
      this.activeName = '1'
      this.columns = this.columns1
      this.searchData = this.searchData1
      this.resetSearchForm(false)
    },
    handleRowClick(row) {
      if (this.activeName === '1') {
        row.documentType = '13'
        row.documentId = row.salesOrderId
        row.documentNo = row.salesOrderNo
      } else {
        row.documentType = '15'
        row.documentId = row.salesGoodsReturnId
        row.documentNo = row.salesGoodsReturnNo
      }
      this.$emit('update', row)
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
