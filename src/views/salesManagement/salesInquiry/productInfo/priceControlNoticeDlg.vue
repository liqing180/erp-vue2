<template>
  <div class="mask flexCen" v-if="visible">
    <div class="content">
      <i class="el-icon-close close" @click="close"></i>
      <div>
        <!-- isNeedTips 1:最大  2:最小 -->
        <div class="flexStart" style="font-size: 18px; font-weight: 700">
          <i class="el-icon-info mr10" style="font-size: 25px; color: #fbb750"></i>
          <div>
            {{
              form.isNeedTips === '1'
                ? $t('SALES.PriceAboveControlRange')
                : $t('SALES.PriceBelowControlRange')
            }}
          </div>
        </div>
        <div style="margin-left: 35px">{{ $t('SALES.Actionrequiredtoproceed') }}</div>
        <div class="mt10" style="padding: 20px; background-color: #f8f8f8; border-radius: 10px">
          <div class="flexSb" style="border-bottom: 2px solid #ddd">
            <div>{{ $t('SALES.YourNetUnitPrice') }}</div>
            <div style="color: #f56c6c; font-size: 20px">
              {{ formData.currencySymbol }}
              {{ $numberStr(form.discountUnitPrice, 2) }}
            </div>
          </div>
          <div class="flexSb mt10" style="border-bottom: 2px solid #ddd">
            <div>
              {{
                form.isNeedTips === '1' ? $t('SALES.MaximumAllowed') : $t('SALES.MinimumAllowed')
              }}
            </div>
            <div style="color: #67c23a; font-size: 20px">
              {{ formData.currencySymbol }}
              {{
                form.isNeedTips === '1'
                  ? $numberStr(form.maxPrice, 2)
                  : $numberStr(form.minPrice, 2)
              }}
            </div>
          </div>
          <div class="flexSb mt10" style="border-top: 4px solid #ccc">
            <div class="mt20">{{ $t('SALES.PriceGap') }}</div>
            <div class="flexStart mt20" style="color: #f56c6c; font-size: 20px">
              <div class="mr20">
                {{ formData.currencySymbol }}
                {{
                  form.isNeedTips === '1'
                    ? $numberStr(form.maxPrice - form.discountUnitPrice, 2)
                    : $numberStr(form.discountUnitPrice - form.minPrice, 2)
                }}
              </div>
              <div class="tag">
                <span v-if="form.isNeedTips === '1'">
                  {{ $t('SALES.Above').replace('$1', $numberStr(form.maxLimitNow, 2)) }}
                </span>
                <span v-if="form.isNeedTips === '2'">
                  {{ $t('SALES.Below').replace('$1', $numberStr(form.minLimitNow, 2)) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt20">
          <span v-if="form.isNeedTips === '1'">
            {{ $t('SALES.requiresMaxApproval').replace('$1', $numberStr(form.maxLimitCan, 2)) }}
          </span>
          <span v-if="form.isNeedTips === '2'">
            {{ $t('SALES.requiresApproval').replace('$1', $numberStr(form.minLimitCan, 2)) }}
          </span>
        </div>
      </div>

      <div class="flexEnd" style="margin-top: 30px">
        <el-button type="ghost" @click="close" v-if="false">{{
          $t('SALES.AdjustPrice')
        }}</el-button>
        <!--  v-if="AllowSellingBelowCostAuth" -->
        <el-button type="primary" @click="submit">{{ $t('SALES.ConfirmContinue') }} </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PriceControlNoticeDlg',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      form: {},
      row: {},
      totalForm: {}
    }
  },
  computed: {
    AllowSellingBelowCostAuth() {
      return this.checkPermi([`salesManagement:${this.pageType}:AllowSellingBelowCost`])
    }
  },
  methods: {
    open(data, row, totalForm) {
      this.form = { ...data }
      this.row = row
      this.totalForm = totalForm || {}
      this.visible = true
    },
    close() {
      this.form = {}
      this.visible = false
      this.$emit('closePriceControlNotice', this.row)
    },
    submit() {
      this.$emit('updatePriceControlNotice', this.form, this.row, this.totalForm)
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999999999;
  .content {
    position: relative;
    color: #333;
    font-size: 14px;
    width: 800px;
    padding: 20px 50px;
    border-radius: 10px;
    background-color: #fff;
  }
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
  }
  .tag {
    height: 30px;
    line-height: 30px;
    min-width: 50px;
    text-align: center;
    padding: 0 10px;
    border-radius: 30px;
    background-color: rgba(253, 127, 127, 0.3);
  }
}
</style>
