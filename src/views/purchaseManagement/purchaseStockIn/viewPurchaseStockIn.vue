<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <!-- 基本信息 -->
        <div class="form-card">
          <el-collapse-item name="1">
            <FormCollapseItemTitle slot="title" :title="$t('ui.basicInfo')">
            </FormCollapseItemTitle>

            <el-form ref="form" :model="form" @submit.native.prevent label-width="180px" disabled>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PURCHASE.stockInNo')}`" prop="stockInNoteNo">
                    <el-input v-model="form.stockInNoteNo" :title="form.stockInNoteNo" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PURCHASE.purchaseOrderNo')}`" prop="purchaseOrderNo">
                    <el-input v-model="form.purchaseOrderNo" :title="form.purchaseOrderNo" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('PURCHASE.certificateNo')}`"
                    prop="stockCertificateNo"
                  >
                    <el-input v-model="form.stockCertificateNo" :title="form.stockCertificateNo" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('PURCHASE.purchaseDepartment')}`"
                    prop="departmentName"
                  >
                    <el-input v-model="form.departmentName" :title="form.departmentName" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PURCHASE.purchasePerson')}`" prop="purchasePersonBy">
                    <el-input v-model="form.purchasePersonBy" :title="form.purchasePersonBy" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PURCHASE.purchaseDate')}`" prop="purchaseTime">
                    <el-date-picker
                      v-model="form.purchaseTime"
                      :format="fmtForYmdhms"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('PURCHASE.supplierName')}`"
                    prop="businessPartnerName"
                  >
                    <el-input
                      v-model="form.businessPartnerName"
                      :title="form.businessPartnerName"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PURCHASE.incoterm')}`" prop="incotermName">
                    <el-input :value="form.incotermName" :title="form.incotermName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PURCHASE.committedDate1')}`" prop="committedDate">
                    <el-date-picker
                      v-model="form.committedDate"
                      :format="fmtForYmd"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('PURCHASE.deliveryAddress')}`"
                    prop="shipToAddressName"
                  >
                    <el-input
                      v-model="form.shipToAddressName"
                      maxlength="200"
                      :title="form.shipToAddressName"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PURCHASE.stockInWarehouse')}`" prop="warehouseName">
                    <el-input v-model="form.warehouseName" :title="form.warehouseName" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.operTime')}`" prop="createdTime">
                    <el-date-picker
                      v-model="form.createdTime"
                      :format="fmtForYmdhms"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <!-- 产品信息 -->
        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle slot="title" :title="$t('PURCHASE.productInfo')">
            </FormCollapseItemTitle>
            <div class="pb20">
              <productInfo ref="productInfo" />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import { queryPurchaseStockInById } from '@/api/purchaseManagement/purchaseStockIn'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import locale1 from '@/views/productManagement/lang/index'

import productInfo from './productInfo.vue'
export default {
  dicts: [],
  mixins: [pageMixin],
  components: { productInfo },
  data() {
    return {
      activeNames: ['1', '2'],
      rowId: '',
      timeId: '',
      form: {}
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.rowId = this.$route.query.id
    this.timeId = this.$route.query.timeId
    this.handleUpdate()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      this.handleUpdate()
    }
  },

  methods: {
    handleUpdate() {
      this.reset()
      queryPurchaseStockInById({ purchaseStockInId: this.rowId }).then((res) => {
        console.log(res)
        const { stockInDetailList, ...params } = res.data
        this.form = params
        this.$refs.productInfo.init({
          stockInDetailList,
          purchaseAmount: params.purchaseAmount,
          depositAmount: params.depositAmount
        })
      })
    },
    // 取消按钮
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchaseStockIn' })
    },
    /* 表单部分 */
    // 表单重置
    reset() {
      this.form = {
        stockInNo: '',
        purchaseOrderNo: '',
        certificateNo: '',
        purchaseDepartment: '',
        purchasePerson: '',
        purchaseDate: ''
      }
      this.activeNames = ['1', '2']
    }
  }
}
</script>
<style lang="scss" scoped></style>
