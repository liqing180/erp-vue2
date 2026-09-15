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
            <template v-if="item.prop === 'purchaseRequisiteNo'">
              <span v-if="scope.row.purchaseRequisiteNo">{{ scope.row.purchaseRequisiteNo }}</span>
              <span v-else>{{ $t('PURCHASE.excessStock') }}</span>
            </template>
            <template v-else-if="item.prop === 'documentNo'">
              <template v-if="formData.createType === '2'">{{ 'ASL' }}</template>
              <el-select
                v-else-if="!comDisFrom"
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
                v-if="!comDisFrom && formData.isEmergencyGoodsReceipt !== '1'"
                v-model="scope.row.purchaseQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999999"
                :disabled="poPurchaseQty !== '1'"
                @change="purchaseQtyChange(scope.row)"
              />
              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>

              <div
                style="color: #ff4949; font-size: 12px; text-align: left"
                v-if="scope.row.salesDropShippingPrFlag === '1'"
              >
                {{
                  $t('PURCHASE.overDelivery').replace(
                    '$1',
                    $numberStr(scope.row.overDeliveryQty, scope.row.decimalNum)
                  )
                }}
              </div>
            </template>

            <template v-else-if="item.prop === 'unitPrice'">
              <template>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'rejectedQty'">
              <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            </template>
            <template v-else-if="item.prop === 'qcFailedQty'">
              <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            </template>
            <template v-else-if="item.prop === 'stockInQty'">
              <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
            </template>
            <template v-else-if="item.prop === 'lineTotal'">
              <template>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'prUom'">
              <template v-if="scope.row.purchaseRequisiteNo">{{ scope.row[item.prop] }}</template>
            </template>
            <template v-else-if="item.prop === 'prBalanceQty'">
              <template v-if="scope.row.purchaseRequisiteNo">{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>
            <template v-else-if="item.prop === 'prBalancePurchaseQty'">
              <el-tooltip
                :content="`${$numberStr(scope.row.prBalanceBasicQty)} ${scope.row.basicUom} ÷ ${
                  scope.row.purchaseUomCoefficient
                } = ${$numberStr(scope.row[item.prop], 6, false)} ${scope.row.purchaseUom}`"
                :disabled="!scope.row.purchaseQty"
                placement="top"
                effect="light"
              >
                <div class="ellipsis-text" v-if="scope.row.purchaseRequisiteNo">
                  <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
                </div>
              </el-tooltip>
            </template>
            <template v-else-if="item.prop === 'purchaseUom'">
              <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'pqQty'">
              <el-tooltip
                :content="`1 ${scope.row.purchaseUom} = ${scope.row.purchaseUomCoefficient} ${scope.row.basicUom}`"
                placement="top"
                effect="light"
              >
                <div class="ellipsis-text">
                  <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
                </div>
              </el-tooltip>
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
import { calculateOneDetail } from '@/api/purchaseManagement/purchaseOrder'
import { getSystemSetup } from '@/api/system/systemSetting'
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
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '11',
      savePath: 'purchaseMTable',
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
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'prUom',
          label: vm.$t('PURCHASE.uomPR'),
          visible: true,
          minWidth: 200,
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
          prop: 'prBalancePurchaseQty',
          label: vm.$t('PURCHASE.convertedQtyPQ'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'documentNo',
        //   label: vm.$t('PURCHASE.PQorPCNo'),
        //   visible: true,
        //   minWidth: 200,
        //   fixedWidth: 180,
        //   tooltip: true
        // },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uomPQ'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'pqQty',
          label: vm.$t('PURCHASE.qtyPQ'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: false
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 200,
          fixedWidth: 160,
          padding: 60
          // tooltip: true
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
          prop: 'stockInQty',
          label: vm.$t('PURCHASE.receivedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qcFailedQty',
          label: vm.$t('PURCHASE.qcFailedQty'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        /* {
          prop: 'rejectedQty',
          label: vm.$t('PURCHASE.rejectedQty1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }, */
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      // 请求的时间戳
      queryTime: undefined,
      poPurchaseQty: undefined
    }
  },
  computed: {
    configCurColumn() {
      let arr = [...this.columns]
      const { assignList } = this.curRow
      if (!assignList || assignList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = (assignList || []).some((x) => x.costProjectCode)
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
    documentNoIsHide() {
      return !(this.curRow.assignList || []).find((x) => {
        return this.$resultOfBoolean(x.aslUnitPrice) || x.documentNo
      })
    },
    qcFailedQtyIsHide() {
      return !(this.curRow.assignList || []).find((x) => x.qcFailedQty)
    },
    rejectedQtyIsHide() {
      return !(this.curRow.assignList || []).find((x) => x.rejectedQty)
    },
    costProjectCodeIsHide() {
      return !(this.curRow.assignList || []).find((x) => x.costProjectCode)
    },
    visibleCurColumns() {
      let arr = this.columns.filter((column) => column.visible === true)

      const filterProps1 = []
      if (this.documentNoIsHide) {
        filterProps1.push('documentNo')
      }
      if (this.qcFailedQtyIsHide) {
        filterProps1.push('qcFailedQty')
      }
      if (this.rejectedQtyIsHide) {
        filterProps1.push('rejectedQty')
      }
      if (this.costProjectCodeIsHide) {
        filterProps1.push('costProjectCode')
      }
      arr = arr.filter((x) => !filterProps1.includes(x.prop))
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
      this.getSystemSetup()
    },
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const { poPurchaseQty } = res.data
        this.poPurchaseQty = poPurchaseQty
      })
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
      this.calculateOneDetail(row)
    },

    calculateOneDetail(row) {
      if (this.btnLoading) return
      this.btnLoading = true
      this.curRow.dropShipping = this.formData.dropShipping
      calculateOneDetail(this.curRow)
        .then((res) => {
          this.btnLoading = false
          const data = res.data || {}
          if (data.salesDropShippingPrFlag === '1') {
            this.$set(row, 'salesDropShippingPrFlag', '1')
            this.$set(row, 'salesOrderAvailableDeliveryQty', data.salesOrderAvailableDeliveryQty)
            this.$set(row, 'overDeliveryQty', data.overDeliveryQty)
            this.$modal.msgError(
              this.$t('PURCHASE.purchaseQuantityExceeds').replace(
                '$1',
                this.$numberStr(data.overDeliveryQty, data.decimalNum)
              )
            )
          } else {
            this.$set(row, 'salesDropShippingPrFlag', undefined)
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
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
      this.curRow.currencyId = this.currencyId
      this.curRow.dropShipping = this.formData.dropShipping
      calculateOneDetail(this.curRow)
        .then((res) => {
          this.btnLoading = false
          console.log(res)
          if (!res.data) {
            this.$emit('deleteRow', this.curRow)
          } else {
            if (!res.data.rowTimeId) {
              res.data.rowTimeId = this.curRow.rowTimeId
            }
            const oldServiceSurchargeList = this.curRow.serviceSurchargeList || []
            const serviceSurchargeList = res.data.serviceSurchargeList || []
            serviceSurchargeList.forEach((It, index) => {
              if (!It.rowTimeId) {
                It.rowTimeId = (oldServiceSurchargeList[index] || {}).rowTimeId
              }
            })

            this.$emit('onSuccess', res.data)
          }

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
