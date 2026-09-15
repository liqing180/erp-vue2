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
            <span v-if="showType === '1'">
              <span class="mr5" v-if="$resultOfBoolean(scope.row.colValue1)">{{
                scope.row.currencyCode
              }}</span>
              <span>{{ $numberStr(scope.row.colValue1, 2) }}</span>
            </span>
            <span v-else>
              <span v-if="$resultOfBoolean(scope.row.colValue1)"
                >{{ $numberStr(scope.row.colValue1, 2) }}%</span
              >
            </span>
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
            <span v-if="showType === '1'">
              <span class="mr5" v-if="$resultOfBoolean(scope.row.colValue2)">{{
                scope.row.currencyCode
              }}</span>
              <span>{{ $numberStr(scope.row.colValue2, 2) }}</span>
            </span>
            <span v-else>
              <span v-if="$resultOfBoolean(scope.row.colValue2)"
                >{{ $numberStr(scope.row.colValue2, 2) }}%</span
              >
            </span>
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
            <span v-if="showType === '1'">
              <span class="mr5" v-if="$resultOfBoolean(scope.row.colValue3)">{{
                scope.row.currencyCode
              }}</span>
              <span>{{ $numberStr(scope.row.colValue3, 2) }}</span>
            </span>
            <span v-else>
              <span v-if="$resultOfBoolean(scope.row.colValue3)"
                >{{ $numberStr(scope.row.colValue3, 2) }}%</span
              >
            </span>
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
      popoverData: {},
      showType: '1'
    }
  },
  methods: {
    showPop(e, obj, showType) {
      this.showType = showType
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
