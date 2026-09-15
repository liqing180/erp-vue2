<template>
  <div class="pb20">
    <el-table border ref="tables mt20" :data="tableList">
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
          <template v-if="item.prop === 'stockOutQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'stockInQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'modifiedTime'">
            {{ parseTime(scope.row.modifiedTime, fmtForYmdhms) }}
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
export default {
  mixins: [pageMixin],
  components: {},
  props: {
    pqProductList: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  watch: {
    pqProductList: {
      immediate: true,
      handler: function (selected) {
        this.tableList = JSON.parse(JSON.stringify(this.pqProductList))
        if (this.type === 'stockInDetails') {
          this.columns = this.columns2
        } else {
          this.columns = this.columns1
        }
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '16',
      savePath: 'projectMDlg',
      columns: [],
      columns1: [
        {
          prop: 'warehouseName',
          label: vm.$t('SALES.warehouse'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'deliveryNoticeNo',
          label: vm.$t('SALES.deliveryNoticeNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'stockCertificateNo',
          label: vm.$t('PURCHASE.certificateNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
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
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'stockOutQty',
          label: vm.$t('PURCHASE.outBoundedQty'),
          minWidth: 160,
          visible: true,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.handler'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.operTime'),
          visible: true,
          width: 160,
          tooltip: true
        }
      ],
      columns2: [
        {
          prop: 'warehouseName',
          label: vm.$t('SALES.warehouse'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'goodsReceivedNoteNo',
          label: vm.$t('SALES.goodsReceivedNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'stockCertificateNo',
          label: vm.$t('PURCHASE.certificateNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
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
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'stockInQty',
          label: vm.$t('PURCHASE.stockInQty'),
          minWidth: 160,
          visible: true,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.handler'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.operTime'),
          visible: true,
          width: 160,
          tooltip: true
        }
      ],
      tableList: [],
      rowIdKey: 'productId'
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns1)
    this.$$initColumnVisible(this.saveKey, this.columns2)
  },
  methods: {}
}
</script>

<style></style>
