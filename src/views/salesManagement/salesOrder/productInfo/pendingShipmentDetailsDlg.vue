<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('SALES.pendingShipmentDetails')"
    :visible.sync="visible"
    width="800px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div>
      <el-row>
        <el-col :span="12">
          <span class="info-item mr20" :title="curRow.productName">
            {{ $t('PRODUCT.productName') }}：{{ curRow.productName }}
          </span>
        </el-col>
        <el-col :span="12">
          <span class="info-item mr20" :title="curRow.internalPartNo">
            {{ $t('PRODUCT.internalPartNo') }}：{{ curRow.internalPartNo }}
          </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="info-item mr20" :title="showUomLabel(curRow.basicUom)">
            {{ $t('SALES.basicUom') }}：{{ curRow.basicUom }}
          </span>
        </el-col>
        <el-col :span="12">
          <span class="info-item mr20" :title="showUomLabel(curRow.uom)">
            {{ $t('SALES.orderUOM') }}：{{ curRow.uom }}
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="mt10">
      <el-table border ref="tables" :data="tableList" :max-height="tableMaxHeight">
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
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
            <template v-if="item.prop === 'qtyOnHand'">
              <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

              <template v-else
                >{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
                {{ curRow.basicUom || '' }}</template
              >
            </template>
            <template v-else-if="item.prop === 'availableQty'">
              <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

              <template v-else
                >{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
                {{ curRow.basicUom || '' }}</template
              >
            </template>
            <template v-else-if="item.prop === 'orderQty'">
              <template
                >{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
                {{ curRow.uom || '' }}</template
              >
            </template>
            <template v-else-if="item.prop === 'documentReservedQty'">
              <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

              <template v-else
                >{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
                {{ curRow.basicUom || '' }}</template
              >
            </template>
            <template v-else-if="['pendPurchaseQty'].includes(item.prop)">
              <DocumentNoLink
                v-if="scope.row[item.prop] > 0"
                :showStr="`${$numberStr(scope.row[item.prop], scope.row.decimalNum)} ${
                  curRow.basicUom || ''
                }`"
                moduleKey="purchaseRequisition"
                @click="nav(scope.row, item.prop)"
              />
              <span v-else
                >{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
                {{ curRow.basicUom || '' }}</span
              >
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { querySalesOrderProductOtherMsg } from '@/api/salesManagement/salesOrder'

export default {
  mixins: [pageMixin],
  props: {},
  data() {
    const vm = this
    return {
      saveKey: '34',
      savePath: 'salesMTable',
      loading: false,
      btnLoading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'productId',
      curRow: {},
      visible: false,
      columns: [
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
          prop: 'orderQty',
          label: vm.$t('SALES.orderQTY'),
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
          prop: 'pendPurchaseQty',
          label: vm.$t('SALES.pendPurchaseQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }
      ],
      tableList: [],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {},
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    nav(row, type) {
      this.handleBack()
      this.$router.push({
        name: 'PurchaseRequisition',
        params: {
          isGetList: '1',
          salesOrderNo: row.salesOrderNo
        }
      })
    },
    handleOpen(row) {
      this.curRow = JSON.parse(JSON.stringify(row))
      this.visible = true

      querySalesOrderProductOtherMsg({ salesOrderProductId: row.salesOrderProductId }).then(
        (res) => {
          this.visible = true
          const data = res.data || {}
          this.tableList = [data]
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        }
      )
    },
    getList() {},
    getLineTotal(row) {
      if (row.unitPrice && row.purchaseQty) {
        const lineTotal = row.unitPrice * row.purchaseQty
        this.$set(row, 'lineTotal', lineTotal)
      } else {
        this.$set(row, 'lineTotal', undefined)
      }
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.curRow = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.info-item {
  display: inline-block;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
