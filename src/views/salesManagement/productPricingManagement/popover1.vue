<template>
  <popover-svc
    ref="pop1"
    trigger="hover"
    placement="top"
    :close-delay="0"
    :visible-arrow="true"
    popper-class="pop-warp"
    :offset="-30"
  >
    <div @mouseenter="mouseenterCur($event)" class="pop-box">
      <el-table :data="popoverData.purchaseRequisiteList || []" border>
        <el-table-column
          :label="$t('SALES.salesPartNo')"
          width="160"
          align="center"
          prop="salesPartNo"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.salesPartNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('SALES.listPriceMSRP')"
          width="160"
          align="center"
          prop="salesRetailPrice"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="mr5" v-if="$resultOfBoolean(scope.row.salesRetailPrice)">{{
              scope.row.currencyCode
            }}</span>
            <span>{{ $numberStr(scope.row.salesRetailPrice, 2) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('SALES.minRate')"
          width="160"
          align="center"
          prop="minRate"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ $resultOfBoolean(scope.row.minRate) ? `${$numberStr(scope.row.minRate, 2)}%` : '' }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('SALES.minimumPriceFloor')"
          width="160"
          align="center"
          prop="minPrice"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="mr5" v-if="$resultOfBoolean(scope.row.minPrice)">{{
              scope.row.currencyCode
            }}</span>
            <span>{{ $numberStr(scope.row.minPrice, 2) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('SALES.maxRate')"
          width="160"
          align="center"
          prop="maxRate"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ $resultOfBoolean(scope.row.maxRate) ? `${$numberStr(scope.row.maxRate, 2)}%` : '' }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('SALES.maximumPriceCeiling')"
          width="160"
          align="center"
          prop="maxPrice"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="mr5" v-if="$resultOfBoolean(scope.row.maxPrice)">{{
              scope.row.currencyCode
            }}</span>
            <span>{{ $numberStr(scope.row.maxPrice, 2) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </popover-svc>
</template>

<script>
import { Popover } from 'element-ui'
const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}
export default {
  components: { popoverSvc },
  data() {
    return {
      popoverData: {}
    }
  },
  methods: {
    showPop(e, obj) {
      this.$set(this.popoverData, 'purchaseRequisiteList', obj.salesPriceProductList || [])

      this.$set(this.popoverData, 'hide', false)
      this.$refs.pop1.popBy(e.target)
    },
    hidePop(e, obj) {
      if (this.popoverData) {
        this.popoverData.hide = true
      }
      setTimeout(() => {
        this.popoverData.hide && this.$refs.pop1.close()
      }, 300)
    },
    mouseenterCur() {
      if (this.popoverData) {
        this.popoverData.hide = false
      }
    }
  }
}
</script>

<style></style>
