<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.product')"
    :visible.sync="visible"
    width="1100px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <!--  {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, -->
    <div>
      <!-- <el-form disabled label-width="130px" @submit.native.prevent>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PURCHASE.productName')}`">
              <el-input :value="curRow.productName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PURCHASE.internalPartNo')}`">
              <el-input :value="curRow.internalPartNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PURCHASE.alias')}`">
              <el-input :value="curRow.alias"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form> -->
      <span class="info-item mr20" :title="curRow.productName">
        {{ $t('PURCHASE.productName') }}：{{ curRow.productName }}
      </span>
      <span class="info-item mr20" :title="curRow.internalPartNo">
        {{ $t('PURCHASE.internalPartNo') }}：{{ curRow.internalPartNo }}
      </span>
      <span class="info-item" v-show="curRow.alias" :title="curRow.alias">
        {{ $t('PURCHASE.alias') }}：{{ curRow.alias }}
      </span>
    </div>
    <div class="mt10">
      <el-table border ref="tables" :data="curRow.assignList || []" :max-height="tableMaxHeight">
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
            <template v-if="item.prop === 'purchaseRequisiteNo'">
              <span v-if="scope.row.purchaseRequisiteNo">{{ scope.row.purchaseRequisiteNo }}</span>
              <span v-else>{{ $t('PURCHASE.excessStock') }}</span>
            </template>
            <template v-else-if="item.prop === 'documentNo'">
              <el-select
                v-if="!comDisFrom"
                style="width: 98%"
                v-model="scope.row.documentNo"
                placeholder=""
                size="mini"
                @change="documentNoChange(scope.row)"
              >
                <el-option
                  v-for="item in scope.row.pplList || []"
                  :key="item.documentNo"
                  :label="item.documentNo"
                  :value="item.documentNo"
                >
                </el-option>
              </el-select>
              <template v-else>{{ scope.row.documentNo }}</template>
            </template>
            <template v-else-if="item.prop === 'purchaseQty'">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                size="mini"
                v-if="!comDisFrom"
                v-model="scope.row.purchaseQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999999"
                @change="purchaseQtyChange(scope.row)"
              />
              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>
            <template v-else-if="item.prop === 'unitPrice'">
              <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'lineTotal'">
              <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'prBalanceQty'">
              <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            </template>
            <template v-else-if="item.prop === 'purchaseUom'">
              <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!comDisFrom"
          :label="$t('ui.action')"
          key="action"
          align="center"
          width="120"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="flexCen">
              <i
                class="el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelRow(scope.$index, scope.row)"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" v-if="!comDisFrom" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { calculateOneDetail } from '@/api/purchaseManagement/consignmentOrder'
export default {
  mixins: [pageMixin],
  props: {
    businessPartnerId: {
      type: String,
      default: ''
    },
    currencyId: {
      type: String,
      default: ''
    },
    comDisFrom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '13',
      savePath: 'consignmentOrderTable',
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
          prop: 'purchaseRequisiteNo',
          label: vm.$t('PURCHASE.PRNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.PQorPCNo'),
          visible: true,
          minWidth: 200,
          fixedWidth: 180,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'prBalanceQty',
          label: vm.$t('PURCHASE.qtyPR'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          fixedWidth: 160,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {},
  watch: {
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'documentNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'purchaseQty':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
        }
      })
    },
    handleOpen(row) {
      this.curRow = JSON.parse(JSON.stringify(row))
      this.visible = true
      this.changeTableList()
    },
    getList() {},
    documentNoChange(row) {
      const selectRow = (row.pplList || []).find((item) => item.documentNo === row.documentNo)
      this.$set(this.curRow, 'documentNo', selectRow.documentNo)
      this.$set(this.curRow, 'documentId', selectRow.documentId)
      this.$set(this.curRow, 'moq', selectRow.moq)
      this.$set(this.curRow, 'purchasePriceId', selectRow.purchasePriceId)
      this.$set(this.curRow, 'priceType', selectRow.priceType)
      this.$set(this.curRow, 'unitPrice', selectRow.unitPrice)
      this.documentNoChangeUpdateAllSelect(selectRow)
      this.changeTableList()
    },
    documentNoChangeUpdateAllSelect(selectRow) {
      const assignList = this.curRow.assignList || []
      assignList.forEach((item) => {
        this.$set(item, 'documentNo', selectRow.documentNo)
        this.$set(item, 'documentId', selectRow.documentId)
        this.$set(item, 'moq', selectRow.moq)
        this.$set(item, 'purchasePriceId', selectRow.purchasePriceId)
        this.$set(item, 'priceType', selectRow.priceType)
        this.$set(item, 'unitPrice', selectRow.unitPrice)
        this.getLineTotal(item)
      })
    },
    purchaseQtyChange(row) {
      this.getLineTotal(row)
      this.changeTableList()
    },
    getLineTotal(row) {
      if (row.unitPrice && row.purchaseQty) {
        const lineTotal = row.unitPrice * row.purchaseQty
        this.$set(row, 'lineTotal', lineTotal)
      } else {
        this.$set(row, 'lineTotal', undefined)
      }
    },
    // 行删除
    handleDelRow(index, row) {
      ;(this.curRow.assignList || []).splice(index, 1)
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.curRow = {}
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.curRow.assignList || [])
    },
    submit() {
      if (this.btnLoading) return
      this.btnLoading = true
      const assignList = this.curRow.assignList || []
      if (assignList.length <= 0) {
        this.$emit('deleteRow', this.curRow)
        this.btnLoading = false
        this.visible = false
        return
      }
      calculateOneDetail(this.curRow)
        .then((res) => {
          this.btnLoading = false
          console.log(res)
          this.$emit('onSuccess', res.data)
          this.visible = false
        })
        .catch(() => {
          this.btnLoading = false
        })
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
