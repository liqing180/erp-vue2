<template>
  <el-collapse v-model="activeNames">
    <div class="form-card">
      <el-collapse-item name="1">
        <FormCollapseItemTitle slot="title" :title="$t('SALES.stockOutDetails')">
        </FormCollapseItemTitle>
        <el-form label-width="150px" disabled v-if="false">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('SALES.warehouse')}`" prop="warehouse">
                <el-input
                  :value="deliveryNotice.warehouseName"
                  :title="deliveryNotice.warehouseName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('SALES.deliveryNoticeNo')">
                <el-input
                  :value="deliveryNotice.deliveryNoticeNo"
                  :title="deliveryNotice.deliveryNoticeNo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('PURCHASE.certificateNo')">
                <el-input
                  :value="deliveryNotice.stockCertificateNo"
                  :title="deliveryNotice.stockCertificateNo"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.operTime')}`">
                <el-date-picker
                  :value="deliveryNotice.modifiedTime"
                  type="date"
                  :format="fmtForYmdhms"
                  :style="{ width: '100%' }"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('ui.handler')">
                <el-input
                  :value="deliveryNotice.modifiedBy"
                  :title="deliveryNotice.modifiedBy"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <ProductTable
          ref="ProductTable"
          :pqProductList="deliveryNotice.deliveryNoticeProductList || []"
        />
      </el-collapse-item>
    </div>
    <div class="form-card mt10">
      <el-collapse-item name="2">
        <FormCollapseItemTitle slot="title" :title="$t('SALES.stockInDetails')">
        </FormCollapseItemTitle>
        <el-form label-width="150px" disabled v-if="false">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('SALES.warehouse')}`" prop="warehouse">
                <el-input
                  :value="goodsReceiptNote.warehouseName"
                  :title="goodsReceiptNote.warehouseName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('SALES.goodsReceiptNoteNo')">
                <el-input
                  :value="goodsReceiptNote.goodsReceiptNoteNo"
                  :title="goodsReceiptNote.goodsReceiptNoteNo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('PURCHASE.certificateNo')">
                <el-input
                  :value="goodsReceiptNote.stockCertificateNo"
                  :title="goodsReceiptNote.stockCertificateNo"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.operTime')}`">
                <el-date-picker
                  :value="goodsReceiptNote.modifiedTime"
                  type="date"
                  :format="fmtForYmdhms"
                  :style="{ width: '100%' }"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('ui.handler')">
                <el-input
                  :value="goodsReceiptNote.modifiedBy"
                  :title="goodsReceiptNote.modifiedBy"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <ProductTable
          ref="ProductTable"
          :pqProductList="goodsReceiptNote.goodsReceiptNoteDetails || []"
          type="stockInDetails"
        />
      </el-collapse-item>
    </div>
  </el-collapse>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import ProductTable from './productTable.vue'

export default {
  mixins: [pageMixin],
  dicts: ['service_order_status', 'service_order_type'],
  components: {
    ProductTable
  },
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.form = newValue || {}
        this.deliveryNotice = this.form.deliveryNotice || {}
        this.goodsReceiptNote = this.form.goodsReceiptNote || {}
      }
    }
  },
  data() {
    return {
      saveKey: '22',
      activeNames: ['1', '2'],
      form: {},
      deliveryNotice: {},
      goodsReceiptNote: {},
      initProductList: []
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {}
}
</script>
<style lang="scss"></style>
