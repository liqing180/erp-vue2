<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configCurColumn"
        :columnsInit="columns"
      ></right-toolbar>
      <div class="footer-content">
        <div>{{ $t('PURCHASE.purchaseAmount') }} / {{ $t('PURCHASE.depositAmount') }}</div>
        ：
        <div>{{ $numberStr(purchaseAmount, 2) }} / {{ $numberStr(depositAmount, 2) }}</div>
      </div>
    </el-row>

    <el-table border ref="tables" max-height="600px" :data="tableList">
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
        class-name="allowDrag"
      >
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in visibleCurColumns"
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
          <template v-if="['internalPartNo', 'businessPartnerName', 'rfqNo'].includes(item.prop)">
            <span class="primary-link" @click="nav(scope.row, item.prop)">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            {{ $numberStr(scope.row.unitPrice, 2) }}
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'stockInQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'specialOrderQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'

export default {
  components: {},
  mixins: [pageMixin],
  props: {},
  watch: {},
  data() {
    const vm = this
    return {
      saveKey: '33',
      savePath: 'purchaseMTable',
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 160,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 160,
        //   tooltip: true
        // },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 160,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purchaseUOM1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PRODUCT.purchaseQty'),
          visible: true,
          padding: 60,
          minWidth: 160
        },
        {
          prop: 'purchaseAmount',
          label: vm.$t('PURCHASE.purchaseAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'basicUom',
          label: vm.$t('PRODUCT.uom'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'stockInQty',
          label: vm.$t('PURCHASE.incomingQty'),
          visible: true,
          minWidth: 160,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'depositAmount',
          label: vm.$t('PURCHASE.depositAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'specialOrderQty',
          label: vm.$t('PURCHASE.specialQty'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          padding: 60
        },
        {
          prop: 'receiptTime',
          label: vm.$t('PURCHASE.deliveryTime'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      rowIdKey: 'productId',
      purchaseAmount: '',
      costOfGoods: '',
      depositAmount: ''
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    configCurColumn() {
      let arr = [...this.columns]
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      let arr = this.columns.filter((column) => column.visible === true)
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init(data) {
      const { stockInDetailList, purchaseAmount, depositAmount } = data
      stockInDetailList.forEach((item) => {
        item.receiptTime = this.parseTime(item.receiptTime, this.fmtForYmdhms)
        item.depositAmount = this.$numberStr(item.depositAmount, 2)
        item.purchaseAmount = this.$numberStr(item.purchaseAmount, 2)
      })
      this.tableList = stockInDetailList

      this.purchaseAmount = purchaseAmount
      this.depositAmount = depositAmount
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    nav(row, type) {
      if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      } else if (type === 'internalPartNo') {
        this.$router.push({
          path: '/productManagement/viewExtendedProductInfo',
          query: {
            id: row.productId,
            timeId: Date.now()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-content {
  float: right;
  display: flex;
  justify-content: center;
  margin-right: 20px;
  // height: 40px;
  line-height: 28px;
  font-weight: 600;
  color: #606266;
  font-size: 12px;
}
</style>
