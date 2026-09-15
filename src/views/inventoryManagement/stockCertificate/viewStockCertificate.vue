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
                  <el-form-item
                    :label="`${$t('PURCHASE.certificateNo')}`"
                    prop="stockCertificateNo"
                  >
                    <el-input v-model="form.stockCertificateNo" :title="form.stockCertificateNo" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('INVENTORY.stockOutStockInNote')}`"
                    prop="stockOutInNoteNo"
                  >
                    <el-input v-model="form.stockOutInNoteNo" :title="form.stockOutInNoteNo" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.associatedDocNo')}`" prop="documentNo">
                    <el-input v-model="form.documentNo" :title="form.documentNo" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PURCHASE.warehouseName')}`" prop="warehouseName">
                    <el-input v-model="form.warehouseName" :title="form.warehouseName" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.time')}`" prop="createdTime">
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
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.operator')}`" prop="createdBy">
                    <el-input v-model="form.createdBy" />
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
            <productInfo ref="productInfo" :id="id" />
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import locale1 from '@/views/inventoryManagement/lang/index'
import locale2 from '@/views/productManagement/lang/index'
import { queryStockCertificateById } from '@/api/inventoryManagement/stockCertificate'
import productInfo from './productInfo.vue'
export default {
  dicts: [],
  mixins: [pageMixin],
  components: { productInfo },
  data() {
    return {
      activeNames: ['1', '2'],
      id: '',
      timeId: '',
      form: {}
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.id = this.$route.query.id
    this.handleUpdate()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.id = this.$route.query.id
      this.handleUpdate()
    }
  },
  methods: {
    handleUpdate() {
      this.reset()
      queryStockCertificateById({ stockCertificateId: this.id }).then((res) => {
        this.form = res.data
        this.$refs.productInfo.init()
      })
    },
    // 取消按钮
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.back()
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
