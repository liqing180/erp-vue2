<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearchBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table border ref="tables" max-height="600px" :data="tableList" v-loading="loading">
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
          <template v-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryStockCertificateDetailById } from '@/api/inventoryManagement/stockCertificate'
export default {
  components: {},
  dicts: ['i_inventory_type'],
  mixins: [pageMixin],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  watch: {},
  data() {
    const vm = this
    return {
      saveKey: '10',
      loading: false,
      savePath: 'IMTable',
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
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
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'qtyShowStr',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'unqualifiedQtyShowStr',
          label: vm.$t('PURCHASE.unqualifiedQTY'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'consignorName',
          label: vm.$t('INVENTORY.consignor'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'customerName',
          label: vm.$t('INVENTORY.customer'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'batchNo',
          label: vm.$t('INVENTORY.batchNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'inventoryType',
          propBy: 'inventoryTypeStr',
          label: vm.$t('INVENTORY.inventoryType'),
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
      rowIdKey: 'productId'
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.loading = true
      const params = JSON.parse(JSON.stringify(this.queryParams))
      this.$trimOfObj(params)
      params.stockCertificateId = this.id
      queryStockCertificateDetailById(params)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.inventoryTypeStr = this.selectDictLabel(
              this.dict.type.i_inventory_type,
              item.inventoryType
            )
          })
          this.tableList = rows
          this.total = response.total
          this.loading = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.inventoryTypeStr = this.selectDictLabel(
          this.dict.type.i_inventory_type,
          item.inventoryType
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    nav(row, type) {
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
</script>

<style lang="scss" scoped></style>
