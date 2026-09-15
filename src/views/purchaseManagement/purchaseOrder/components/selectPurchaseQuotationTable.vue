<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.purchaseQuotation')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div style="position: relative">
      <search-form
        ref="searchForm"
        v-model="queryParams"
        :searchData="searchData"
        :handleQuery="handleSearchForm"
        :resetQuery="resetSearchForm"
        :showCustom="false"
        :showMenu="false"
        @updateSearchData="updateSearchData"
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
      <!-- <div style="position: absolute; left: 40px; top: 12px" v-if="showAllAuth">
        <el-checkbox @change="getList" v-model="showAll">{{ $t('PURCHASE.showAll') }}</el-checkbox>
      </div> -->
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
          <template v-else-if="item.prop === 'productNames'">
            <div @mouseenter="showPop($event, scope.row)" @mouseleave="hidePop($event, scope.row)">
              <div class="ellipsis-text">
                {{ scope.row.productNames }}
              </div>
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
    </div>
    <ToolTipShowListForFN ref="ToolTipShowList" />
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import {
  queryCanSelectPurchaseQuotationList,
  querySearchListFromCanSelectPurchaseQuotationList
} from '@/api/purchaseManagement/purchaseOrder'
import locale from '@/views/organization/lang/index'
export default {
  mixins: [pageMixin],
  components: { ToolTipShowListForFN },
  props: {
    businessPartnerId: String,
    purchaseOrderId: String
  },
  data() {
    const vm = this
    return {
      isOnlyDefaultDept: false,
      showAll: false,
      saveKey: '14',
      savePath: 'PROTable',
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
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'supplierQuoteNo',
          label: vm.$t('PURCHASE.supplierQuoteNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseQuotationNo',
          label: vm.$t('PURCHASE.purchaseQuotationNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'productNames',
          label: vm.$t('PURCHASE.product'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'dateQuoted',
          propBy: 'dateQuotedStr',
          label: vm.$t('PURCHASE.dateQuoted'),
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
        condition: '',
        selectId: 'conditionForPurchaseQuotationNo'
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        },
        {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.PQNo'), value: 'conditionForPurchaseQuotationNo' },
            { label: this.$t('PURCHASE.supplierQuoteNo'), value: 'conditionForSupplierQuoteNo' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: '',
          inputVal: '',
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
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    // showAllAuth() {
    //   return this.checkPermi(['purchaseManagement:purchaseOrder:showAll'])
    // },
    showAllAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:departmentData'])
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
      const list = row.pplList || []
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
    handleOpen() {
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.searchData[1].selectId = 'conditionForPurchaseQuotationNo'
      this.queryParams.selectId = 'conditionForPurchaseQuotationNo'
      this.searchData[1].inputVal = ''
      this.getList()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = { ...this.queryParams }
      param.businessPartnerId = this.businessPartnerId
      param.purchaseOrderId = this.purchaseOrderId
      if (param.inputVal && param.selectId) {
        param[param.selectId] = param.inputVal
      }
      // if (this.showAll && this.showAllAuth) {
      //   param.showAll = '1'
      // }
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.PO
      this.querySearchListFromCanSelectPurchaseQuotationList()
      queryCanSelectPurchaseQuotationList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.dateQuotedStr = this.parseTime(item.dateQuoted, this.fmtForYmd)
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
    querySearchListFromCanSelectPurchaseQuotationList() {
      const param = {}
      param.businessPartnerId = this.businessPartnerId
      param.purchaseOrderId = this.purchaseOrderId
      // if (this.showAll && this.showAllAuth) {
      //   param.showAll = '1'
      // }
      if (this.isOnlyDefaultDept && this.showAllAuth) {
        param.isOnlyDefaultDept = '1'
      } else {
        delete param.isOnlyDefaultDept
      }
      querySearchListFromCanSelectPurchaseQuotationList(param).then((res) => {
        const data = res.data || {}
        this.conditionForPurchaseQuotationNoList = (
          data.conditionForPurchaseQuotationNoList || []
        ).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForSupplierQuoteNoList = (data.conditionForSupplierQuoteNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )

        this.setFuzzyData()
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
      this.queryParams = {
        pageNum: 1,
        pageSize,
        condition: '',
        selectId: 'conditionForPurchaseQuotationNo'
      }
      this.$refs.tables.clearSort()

      if (isGetList) {
        this.getList()
      }
    },
    updateSearchData(e) {
      const item = this.searchData[e.index]
      if (item.name === 'selectAnInputName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = ''
          this.setFuzzyData()
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = ''
          this.setFuzzyData()
        } else {
          item.inputVal = e.value || ''
        }
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForPurchaseQuotationNo') {
            this.$set(item, 'fuzzyData', this.conditionForPurchaseQuotationNoList)
          } else if (item.selectId === 'conditionForSupplierQuoteNo') {
            this.$set(item, 'fuzzyData', this.conditionForSupplierQuoteNoList)
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },

    closed() {
      this.resetSearchForm(false)
    },
    handleRowClick(row) {
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
