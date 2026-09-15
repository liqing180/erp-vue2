<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('menu.registerReplacement')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
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
    </search-form>

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
          <template v-else-if="item.prop === 'addReplacedQty'">
            <el-input-number
              v-if="scope.row.maxQty > 0"
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              style="width: 96%"
              v-model="scope.row.addReplacedQty"
              controls-position="right"
              :precision="scope.row.decimalNum"
              :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
              :max="scope.row.maxQty"
              @change="qtyChange(scope.row)"
            />
            <span v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'rejectedQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'replacedQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'pendReplacementQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
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
      <el-button
        type="primary"
        :loading="btnLoading"
        :disabled="inputQtyList.length <= 0"
        @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  replacementProduct,
  queryPendReplacementList
} from '@/api/purchaseManagement/purchaseOrder'

export default {
  directives: {},
  mixins: [pageMixin],
  props: {},
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
      /* 输入数量保存行数据 */
      storeQtyData: {},
      tableMaxHeightResize: true,
      selected: '',
      visible: false,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'logisticsDocumentNo',
          label: vm.$t('PURCHASE.logisticsCostNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: false,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedQty',
          label: vm.$t('PURCHASE.rejectedQty1'),
          visible: false,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'replacedQty',
          label: vm.$t('PURCHASE.replacedQty'),
          visible: false,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'pendReplacementQty',
          label: vm.$t('PURCHASE.pendReplacementQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'addReplacedQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          fixedWidth: 180,
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
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        }
      ]
    }
  },
  computed: {
    inputQtyList() {
      const list = []
      for (const key in this.storeQtyData) {
        const row = this.storeQtyData[key]
        if (row.addReplacedQty) {
          list.push(row)
        }
      }
      return list
    }
  },
  beforeCreate() {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleOpen(purchaseOrderId) {
      this.tableList = []
      this.storeQtyData = {}
      this.purchaseOrderId = purchaseOrderId
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      param.purchaseOrderId = this.purchaseOrderId
      this.$trimOfObj(param)
      queryPendReplacementList(param)
        .then((response) => {
          const rows = response.data || []
          rows.forEach((item) => {
            const stockRow =
              this.storeQtyData[item.purchaseOrderDetailId + item.logisticsDocumentId] || {}
            if (stockRow.addReplacedQty) {
              const setQty = Math.min(stockRow.addReplacedQty, item.maxQty)
              item.addReplacedQty = setQty
            }
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    qtyChange(row) {
      this.$set(this.storeQtyData, row.purchaseOrderDetailId + row.logisticsDocumentId, row)
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
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      // this.visible = false
      replacementProduct({
        purchaseOrderId: this.purchaseOrderId,
        purchaseOrderDetailList: this.inputQtyList
      })
        .then((res) => {
          this.$emit('onSuccess')
          this.visible = false
          setTimeout(() => {
            this.btnLoading = false
          }, 500)
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>
