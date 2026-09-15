<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>

    <template v-slot:content>
      <div>
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForBasicInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="ivtProduct"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('PRODUCT.productCategory1')}`" required>
                      <ToolTipShowCategory :list="ivtProduct.categoryNameList || []">
                        <el-input :value="ivtProduct.categoryNameShowStr" disabled></el-input>
                      </ToolTipShowCategory>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`">
                      <el-input
                        v-model="ivtProduct.internalPartNoShowStr"
                        :title="ivtProduct.internalPartNoShowStr"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="16">
                    <el-form-item
                      :label="`${$t('PRODUCT.productName')}`"
                      prop="productName"
                      required
                    >
                      <el-input
                        v-model="ivtProduct.productName"
                        :title="ivtProduct.productName"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.brand')}`">
                      <el-input
                        v-model="ivtProduct.brand"
                        :title="ivtProduct.brand"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.description')">
                      <el-tooltip
                        ref="tooltip"
                        :enterable="true"
                        class="item"
                        effect="light"
                        placement="top"
                        :manual="false"
                        :disabled="!ivtProduct.description"
                      >
                        <div slot="content" class="desc-tooltip">
                          <div
                            v-if="ivtProduct.description"
                            style="line-height: 20px; white-space: pre-wrap"
                          >
                            {{ ivtProduct.description }}
                          </div>
                        </div>
                        <slot>
                          <div :class="{ 'tooltip-row': true }">
                            <MyInput
                              type="textarea"
                              v-model="ivtProduct.description"
                              :autosize="{ minRows: 2, maxRows: 8 }"
                              resize="none"
                              show-word-limit
                              :maxlength="7000"
                            ></MyInput>
                          </div>
                        </slot>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="4">
              <FormCollapseItemTitle slot="title" :title="$t('PURCHASE.surchargeDetails')">
              </FormCollapseItemTitle>
              <div>
                <el-table
                  ref="serviceSurcharge"
                  border=""
                  class="mb20"
                  :data="form.serviceSurchargeList || []"
                >
                  <el-table-column
                    type="index"
                    :label="$t('ui.sn')"
                    width="60"
                    align="center"
                    class-name="allowDrag"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="expenseItemName"
                    :label="$t('PURCHASE.expenseItem')"
                    header-align="center"
                    align="left"
                    min-width="400"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="unit"
                    :label="$t('ui.uom')"
                    header-align="center"
                    align="left"
                    min-width="300"
                    :show-overflow-tooltip="true"
                    class-name="allowDrag"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="unitPrice"
                    :label="$t('PURCHASE.unitPrice')"
                    header-align="center"
                    align="left"
                    min-width="300"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      {{ $numberStr(scope.row.unitPrice, 2) }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle slot="title" :title="$t('PURCHASE.supplierDetail')">
              </FormCollapseItemTitle>
              <div class="flexCen" style="padding: 20px 0">
                <div style="width: 50%">
                  <PieChart ref="PieChart" :title="$t('PURCHASE.amountProportionAnalysis')" />
                </div>
                <div style="width: 50%; position: relative">
                  <div class="flexEnd">
                    <el-select
                      v-model="lineType"
                      placeholder=""
                      @change="lineTypeChange"
                      style="width: 300px"
                    >
                      <!-- position: absolute; top: 0; right: 0;  -->
                      <el-option
                        v-for="item in lineTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <lineChart ref="lineChart" :title="$t('PURCHASE.purchaseUnitPriceAnalysis')" />
                </div>
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="3">
              <FormCollapseItemTitle slot="title" :title="$t('PURCHASE.supplierDetail')">
              </FormCollapseItemTitle>
              <div>
                <SupplierTable ref="SupplierTable" :rfqVendorList="purchasePriceList" />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
  </FormPageLayout>
</template>

<script>
import {
  getById,
  queryImageForSupplier,
  queryUnitPriceAnalysisForSupplier
} from '@/api/purchaseManagement/purchasePriceList'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import locale1 from '@/views/productManagement/lang/index'
import SupplierTable from '@/views/purchaseManagement/purchasePriceList/supplierTable.vue'
import PieChart from './PieChart'
import lineChart from './lineChart'
export default {
  dicts: ['p_price_type', 'p_pq_quote_from'],
  mixins: [pageMixin],
  components: {
    SupplierTable,
    PieChart,
    lineChart
  },
  data() {
    return {
      saveKey: '2',
      activeNames: [],
      rowId: '',
      timeId: '',
      form: {},
      initialForm: {},
      collapseWarningForBasicInfo: false,
      rules: {
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      ivtProduct: {},
      purchasePriceList: [],
      lineType: '1',
      lineTypeList: [
        { value: '1', label: this.$t('PURCHASE.theLast10Times') },
        { value: '2', label: this.$t('PURCHASE.thePast6Months') },
        { value: '3', label: this.$t('PURCHASE.thePastYear') }
      ]
    }
  },
  props: {
    isView: {
      type: Boolean,
      default: false
    },
    propTimeId: {
      type: String,
      default: ''
    },
    propRowId: {
      type: String,
      default: ''
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        if (this.rowId) {
          this.handleUpdate()
        }
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comDisFrom() {
      return true
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      getById(rowId).then((res) => {
        const data = res.data || {}
        const { ivtProduct, purchasePriceList } = data
        this.ivtProduct = ivtProduct || {}
        if (purchasePriceList && purchasePriceList.length > 0) {
          purchasePriceList.forEach((item) => {
            item.validity = this.parseTime(item.validity, this.fmtForYmd)
            item.priceTypeStr = this.selectDictLabel(this.dict.type.p_price_type, item.priceType)
            item.quoteFromStr = this.selectDictLabel(this.dict.type.p_pq_quote_from, item.quoteFrom)
          })
        }
        this.purchasePriceList = purchasePriceList
        this.form = data
      })
      this.queryImageForSupplier()
      this.queryUnitPriceAnalysisForSupplier()
    },
    queryImageForSupplier() {
      queryImageForSupplier({ productId: this.rowId }).then((res) => {
        let { supplierAmountImageList, totalAmountForSupplier, totalQtyForSupplier } = res.data
        supplierAmountImageList = (supplierAmountImageList || []).map((x) => {
          return {
            value: x.reallyPurchaseAmountForBasic,
            qty: x.reallyPurchaseQtyForBasic,
            name:
              (x.reportName || x.businessPartnerName) +
              ' ' +
              (this.$numberStr(x.reallyPurchaseAmountForBasic, 2) || ''),
            topLabel: this.$t('PURCHASE.supplierName'),
            showName: x.reportName || x.businessPartnerName,
            totalAmount: totalAmountForSupplier,
            totalQty: totalQtyForSupplier
          }
        })
        this.$nextTick(() => {
          this.$refs.PieChart && this.$refs.PieChart.initChart(supplierAmountImageList)
        })
      })
    },
    queryUnitPriceAnalysisForSupplier() {
      queryUnitPriceAnalysisForSupplier({ productId: this.rowId, type: this.lineType }).then(
        (res) => {
          this.$nextTick(() => {
            this.$refs.lineChart && this.$refs.lineChart.initChart(res.data, this.lineType)
          })
        }
      )
    },
    lineTypeChange() {
      this.queryUnitPriceAnalysisForSupplier()
    },
    // 取消按钮
    back(type) {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchasePriceList' })
    },
    reset() {
      this.form = {
        businessPartnerName: undefined,
        purchaseQuotationStatus: undefined
      }
      this.ivtProduct = {}
      this.purchasePriceList = []
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
    }
  }
}
</script>
<style lang="scss"></style>
