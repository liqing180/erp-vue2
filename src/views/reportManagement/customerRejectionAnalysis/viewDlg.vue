<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('uiBtn.details')"
    :visible.sync="visible"
    width="800px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-table
      border
      ref="tables"
      class="mt10"
      :data="tableList"
      @sort-change="handleSortChange"
      :max-height="tableMaxHeight"
    >
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
          <template v-if="item.prop === 'rejectedQty'">
            {{ $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum)) }}
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/inventoryManagement/lang/index'
import { queryListForReturnedReason } from '@/api/reportManagement/customerRejectionAnalysis'
export default {
  dicts: [],
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '2',
      savePath: 'reportMTable',
      loading: false,
      // 总条数
      total: 0,
      tableList: [],
      rowIdKey: 'businessPartnerMainId',
      visible: false,
      columns: [
        {
          prop: 'returnedReasonShowStr',
          label: vm.$t('PURCHASE.returnReason1'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'rejectedQty',
          label: vm.$t('PURCHASE.rejectedQty'),
          visible: true,
          minWidth: 180,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectionRateShowStr',
          label: vm.$t('PURCHASE.rejectionRate'),
          visible: true,
          minWidth: 180,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      btnLoading: false
    }
  },
  computed: {},
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    async handleOpen(row) {
      this.visible = true
      const {
        businessPartnerId,
        productId,
        startDateCreatedTime,
        endDateCreatedTime,
        startDateAcknowledgedTime,
        endDateAcknowledgedTime
      } = row
      const params = { businessPartnerId }
      if (productId) {
        params.productId = productId
      }
      if (startDateCreatedTime && endDateCreatedTime) {
        params.startDateCreatedTime = startDateCreatedTime
        params.endDateCreatedTime = endDateCreatedTime
      }
      if (startDateAcknowledgedTime && endDateAcknowledgedTime) {
        params.startDateAcknowledgedTime = startDateAcknowledgedTime
        params.endDateAcknowledgedTime = endDateAcknowledgedTime
      }
      this.queryListForReturnedReason(params)
    },
    queryListForReturnedReason(params) {
      queryListForReturnedReason(params).then((res) => {
        this.tableList = res.data || []
      })
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.tableList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.right-title {
  flex: 1;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  span {
    display: inline-block;
    max-width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
