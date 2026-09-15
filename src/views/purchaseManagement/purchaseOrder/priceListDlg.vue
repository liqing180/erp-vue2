<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.priceList')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
  >
    <!--  <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
      v-show="showSearch"
      :topShowCount="2"
    >
      <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form> -->
    <el-form label-width="120px">
      <el-col :span="6">
        <el-form-item :label="`${$t('PURCHASE.productName')}`">
          <el-input :value="form.productName" :title="form.productName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item :label="`${$t('PURCHASE.internalPartNo')}`">
          <el-input :value="form.internalPartNo" :title="form.internalPartNo" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item :label="`${$t('PURCHASE.externalPartNo')}`">
          <el-input :value="form.externalPartNo" :title="form.externalPartNo" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item :label="`${$t('PURCHASE.purchaseQTY')}`">
          <div style="display: flex">
            <el-input :value="$numberStr(form.purchaseQty, form.decimalNum)" disabled></el-input>
            <div class="unit">{{ form.basicUom || '' }}</div>
          </div>
        </el-form-item>
      </el-col>
    </el-form>
    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
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
          <template v-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            {{ $numberStr(scope.row[item.prop], 6, false, 2) }} {{ scope.row.currencySymbol }}
          </template>

          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleView(scope.row)">
            {{ $t('uiBtn.view') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      :saveKey="saveKey"
      :savePath="savePath"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryProductEffectivePriceList } from '@/api/purchaseManagement/purchaseOrder'

export default {
  directives: {},
  mixins: [pageMixin],
  props: {
    currencyId: {
      type: String,
      default: ''
    },
    currencyCode: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      btnLoading: false,
      saveKey: '1',
      savePath: 'registerR',
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
          label: vm.$t('PRODUCT.supplierName'),
          visible: true,
          minWidth: 200,
          // sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PRODUCT.supplierCode'),
          visible: true,
          minWidth: 200,
          // sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
          // sortable: 'custom'
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true
          // sortable: 'custom'
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'moq',
          label: vm.$t('PURCHASE.MOQ'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'incotermAbbreviation',
          label: vm.$t('PURCHASE.incoterm'),
          minWidth: 160,
          visible: true,
          tooltip: true
          // sortable: 'custom'
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('PURCHASE.paymentTerm'),
          minWidth: 160,
          visible: true,
          tooltip: true
          // sortable: 'custom'
        }
        // {
        //   prop: 'deliveryDateForDay',
        //   label: vm.$t('PURCHASE.deliveryDateForDay'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true
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
      productRow: {},
      form: {}
    }
  },
  computed: {},
  beforeCreate() {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleView(row) {
      console.log(row)
      if (row.approvedSupplierMainId) {
        this.$router.push({
          path: '/purchaseManagement/viewAsl',
          query: {
            id: row.approvedSupplierMainId,
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/purchaseManagement/viewPurchasePriceList',
          query: {
            id: row.productId,
            timeId: Date.now()
          }
        })
      }

      this.visible = false
    },
    handleOpen(row) {
      this.form = { ...row }
      this.tableList = []
      this.productRow = row
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      param.productId = this.productRow.productId
      param.currencyId = this.currencyId
      param.currencyCode = this.currencyCode
      this.$trimOfObj(param)
      queryProductEffectivePriceList(param)
        .then((response) => {
          // const rows = response.data || []
          const { priceDetailList } = response.data
          /* rows.forEach((item) => {
          }) */
          this.tableList = priceDetailList
          this.loading = false
          // this.total = response.total
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
    }
  }
}
</script>
<style lang="scss" scoped>
.unit {
  flex-shrink: 0;
  min-width: 20px;
  padding: 0 10px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
</style>
