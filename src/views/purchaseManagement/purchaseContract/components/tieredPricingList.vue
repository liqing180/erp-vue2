<template>
  <el-dialog
    v-dialogDrag
    :title="$t('PURCHASE.tieredPricingList')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <div>
      <el-form ref="rowList" :model="rowList" label-width="160px" disabled>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
              <el-input v-model="rowList.productName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`" prop="internalPartNo">
              <el-input v-model="rowList.internalPartNo" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.partNo')}`" prop="partNo">
              <el-input v-model="rowList.partNo" />
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PURCHASE.unitPrice')}`" prop="unitPrice">
              <el-input :value="$numberStr(rowList.unitPrice, 2)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.uom1')}`" prop="purchaseUom">
              <el-input :title="showUomLabel(rowList.purchaseUom)" v-model="rowList.purchaseUom" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.contractPrice')}`" prop="contractPrice">
              <el-input :value="$numberStr(rowList.contractPrice, 2)" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="clearfix">
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        border
        class="w100"
        :max-height="tableMaxHeight"
        header-row-class-name="th-primary"
        show-overflow-tooltip
        highlight-current-row
        v-table-tab
      >
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qty" min-width="180" show-overflow-tooltip align="center">
          <template slot="header">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ $t('PURCHASE.qty') }}
          </template>
          <template slot-scope="scope">
            <template v-if="isEditStatus">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qty"
                :precision="scope.row.decimalNum"
                :min="0"
                :max="999999999"
                :controls="false"
                class="tableLeft"
              />
            </template>
            <template v-else>
              {{ scope.row.qty }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="priceAfterDiscount"
          min-width="180"
          show-overflow-tooltip
          align="center"
        >
          <template slot="header">
            <span style="color: #ff4949; margin-right: 4px">*</span
            >{{ $t('PURCHASE.priceAfterDiscount') }}
          </template>
          <template slot-scope="scope">
            <template v-if="isEditStatus">
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                style="width: 98%"
                v-model="scope.row.priceAfterDiscount"
                :precision="2"
                :min="0"
                :max="999999999999.99"
                class="tableLeft"
                :controls="false"
                @input="priceAfterDiscountInput(scope.row, scope.$index)"
              />
            </template>
            <template v-else>
              {{ scope.row.priceAfterDiscount }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="lineDiscount" min-width="180" show-overflow-tooltip align="center">
          <template slot="header">
            <span style="color: #ff4949; margin-right: 4px">*</span
            >{{ $t('PURCHASE.lineDiscount') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          :label="$t('ui.remarks')"
          min-width="180"
          :show-overflow-tooltip="false"
          align="center"
        >
          <template slot-scope="scope">
            <template>
              <descriptionEditDlg
                v-model="scope.row.remarks"
                maxlength="200"
                :disabled="!(isEditStatus)"
              />
            </template>
          </template>
        </el-table-column>

        <el-table-column
          v-if="isEditStatus"
          :label="$t('ui.action')"
          width="100"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <div class="icon-box">
              <i
                class="el-icon-circle-plus"
                style="font-size: 24px; border: none; margin-right: 5px"
                @click.stop="addRow(scope.row, scope.$index)"
              ></i>
              <i
                v-if="tableData.length > 1"
                class="el-icon-remove"
                style="font-size: 24px; border: none; color: #f56c6c"
                @click.stop="delRow(scope.$index)"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="visible = false">{{ $t('ui.back') }}</el-button>
      <el-button v-if="isEditStatus" type="primary" @click="handleSave">{{
        $t('uiBtn.save')
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { countBy } from 'lodash'
import pageMixin from '@/mixins/tableMinx'
export default {
  directives: {},
  mixins: [pageMixin],
  props: {
    isEditStatus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      rowList: {},
      tableData: [],
      rowObj: {},
      index: undefined
    }
  },
  computed: {},
  beforeCreate() {},
  methods: {
    handleOpen(row, index) {
      this.visible = true
      const vm = this

      const tmpObj = JSON.parse(JSON.stringify(row))
      vm.rowObj = JSON.parse(JSON.stringify(row))
      vm.index = index
      vm.$set(vm.rowList, 'productName', tmpObj.productName)
      vm.$set(vm.rowList, 'internalPartNo', tmpObj.internalPartNo)
      vm.$set(vm.rowList, 'partNo', tmpObj.partNo)
      vm.$set(vm.rowList, 'unitPrice', tmpObj.inventoryUnitPrice)
      vm.$set(vm.rowList, 'purchaseUom', tmpObj.purchaseUom)
      vm.$set(vm.rowList, 'contractPrice', tmpObj.contractPrice)

      tmpObj.lineDiscount = undefined
      tmpObj.priceAfterDiscount = undefined
      tmpObj.qty = undefined
      tmpObj.remarks = ''

      if (Array.isArray(tmpObj.contractDetailTiereds)) {
        const len = vm.rowObj.contractDetailTiereds.length
        vm.tableData = []
        if (len <= 0) {
          vm.tableData.push(tmpObj)
        } else {
          vm.tableData = JSON.parse(JSON.stringify(vm.rowObj.contractDetailTiereds))
        }
      } else {
        vm.tableData.push(tmpObj)
      }
    },

    handleSave() {
      const vm = this
      const qtyObj = vm.tableData.find((item) => {
        return !item.qty
      })
      if (qtyObj) {
        vm.$modal.msgError(vm.$t('ui.commonReqMsg').replace('$1', vm.$t('PURCHASE.qty')))
        return
      }
      const qtyZeroObj = vm.tableData.find((item) => {
        return vm.$resultOfBoolean(item.qty) && Number(item.qty) <= 0
      })
      if (qtyZeroObj) {
        vm.$modal.msgError(vm.$t('PURCHASE.qtyMoreThanZero'))
        return
      }
      const priceAfterDiscountObj = vm.tableData.find((item) => {
        return item.priceAfterDiscount === '' || item.priceAfterDiscount === 0
      })
      if (priceAfterDiscountObj) {
        vm.$modal.msgError(
          vm.$t('ui.commonReqMsg').replace('$1', vm.$t('PURCHASE.priceAfterDiscount'))
        )
        return
      }
      const lineDiscountObj = vm.tableData.find((item) => {
        return item.lineDiscount === '' || (!item.lineDiscount && item.lineDiscount !== 0)
      })
      if (lineDiscountObj) {
        vm.$modal.msgError(vm.$t('ui.commonReqMsg').replace('$1', vm.$t('PURCHASE.lineDiscount')))
        return
      }
      // 相同的QTY不能有>1条的数据
      const countByObj = countBy(vm.tableData, 'qty')
      const countByObjVal = Object.values(countByObj)
      const obj = countByObjVal.find((val) => {
        return val > 1
      })
      if (obj) {
        vm.$modal.msgError(
          vm.$t('PURCHASE.errorQtyNoRepeat').replace('$1', `[${vm.rowObj.internalPartNo}]`)
        )
        return
      }
      // vm.rowObj.contractDetailTiereds = vm.tableData
      this.$emit('onSuccess', vm.tableData, this.index)
      vm.visible = false
    },
    handleDialogClose() {
      this.rowList = {}
      this.tableData = []
    },
    priceAfterDiscountInput(row, index) {
      const vm = this
      vm.cpuLineDiscount(row, index)
    },
    cpuLineDiscount(row, index) {
      const vm = this
      if (
        row.contractPrice !== '' &&
        Number(row.contractPrice) > 0 &&
        row.priceAfterDiscount !== '' &&
        Number(row.priceAfterDiscount) >= 0
      ) {
        let lineDiscount = ''
        const contractPrice = Number(row.contractPrice)
        const priceAfterDiscount = Number(row.priceAfterDiscount)
        const BigObj = vm.$bigUtils().getBig()
        lineDiscount = new BigObj(1)
          .minus(new BigObj(priceAfterDiscount).div(contractPrice))
          .times(100)
          .toFixed(2)
          .toString()

        vm.$set(vm.tableData[index], 'lineDiscount', lineDiscount)
      } else {
        vm.$set(vm.tableData[index], 'lineDiscount', '')
      }
    },

    addRow(row, index) {
      const vm = this
      const tObj = JSON.parse(JSON.stringify(row))
      delete tObj.id
      tObj.lineDiscount = undefined
      tObj.priceAfterDiscount = undefined
      tObj.qty = undefined
      tObj.remarks = ''
      vm.tableData.splice(index + 1, 0, tObj)
    },

    delRow(index) {
      const vm = this

      vm.tableData.splice(index, 1)
    }
  }
}
</script>
<style scoped lang="scss">
.btn-share-dialog-box {
  display: inline-block;
  height: 24px;
}
</style>
