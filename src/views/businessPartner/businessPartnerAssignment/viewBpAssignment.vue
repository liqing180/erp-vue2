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

            <el-form ref="form" :model="form" label-width="160px" disabled>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.businessPartnerName')}`">
                    <el-input
                      v-model="form.businessPartnerName"
                      :title="form.businessPartnerName"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.abbreviation')}`">
                    <el-input v-model="form.abbreviation" :title="form.abbreviation" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.businessPartnerCode')}`">
                    <el-input v-model="form.businessPartnerNo" :title="form.businessPartnerNo" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="el-row-flex">
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.category')}`">
                    <el-input
                      :value="
                        selectDictLabels(
                          dict.type.business_partner_type,
                          form.businessPartnerType || ''
                        )
                      "
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="(form.businessPartnerType || '').indexOf('1') !== -1">
                  <el-form-item :label="`${$t('ui.supplierType')}`">
                    <el-input
                      :value="selectDictLabel(dict.type.bp_supplier_type, form.supplierType)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="(form.businessPartnerType || '').indexOf('1') !== -1">
                  <el-form-item :label="`${$t('ui.supplierGroup')}`">
                    <el-input
                      :value="selectDictLabel(dict.type.bp_supplier_group, form.supplierGroup)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('ui.customerType')}`"
                    v-if="(form.businessPartnerType || '').indexOf('0') !== -1"
                  >
                    <el-input
                      :value="selectDictLabel(dict.type.bp_customer_type, form.customerType)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('ui.customerGroup')}`"
                    v-if="(form.businessPartnerType || '').indexOf('0') !== -1"
                  >
                    <el-input
                      :value="selectDictLabel(dict.type.bp_customer_group, form.customerGroup)"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="(form.businessPartnerType || '').indexOf('1') !== -1">
          <el-collapse-item name="2">
            <FormCollapseItemTitle slot="title" :title="$t('ui.supplierAssign')">
            </FormCollapseItemTitle>
            <branchCompanyTable :list="form.supplierAssignedCommonShow || []" />
          </el-collapse-item>
        </div>
        <div class="form-card mt10" v-if="(form.businessPartnerType || '').indexOf('0') !== -1">
          <el-collapse-item name="3">
            <FormCollapseItemTitle slot="title" :title="$t('ui.customerAssign')">
            </FormCollapseItemTitle>
            <branchCompanyTable :list="form.customerAssignedCommonShow || []" />
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="4">
            <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
              <template v-if="form.operationLogForLast">
                <span
                  v-if="form.operationLogForLast.operatorBy"
                  class="info-item mr20"
                  :title="form.operationLogForLast.operatorBy"
                >
                  {{ $t('ui.operName') }} : {{ form.operationLogForLast.operatorBy }}
                </span>
                <span v-if="form.operationLogForLast.operatorTime" class="info-item">
                  {{ $t('ui.operTime') }} : {{ parseTime(form.operationLogForLast.operatorTime) }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <div class="pb20">
              <SystemOperationLogTable :tableList="form.operationLogList || []" />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import { queryAssignmentById } from '@/api/businessPartner/bpAssignment'
import branchCompanyTable from './branchCompanyTable.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
export default {
  name: 'ViewBpAssignment',
  dicts: [
    'bp_supplier_type',
    'bp_supplier_group',
    'bp_customer_type',
    'bp_customer_group',
    'business_partner_type'
  ],
  components: { branchCompanyTable, SystemOperationLogTable },
  data() {
    return {
      activeNames: ['1', '2', '3'],
      rowId: '',
      timeId: '',
      form: {}
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
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
      queryAssignmentById(this.rowId)
        .then((res) => {
          const data = res.data || {}
          const bpBusinessPartner = data.bpBusinessPartner || {}
          const supplierAssignedCommonShow = data.supplierAssignedCommonShow || []
          const customerAssignedCommonShow = data.customerAssignedCommonShow || []
          const operationLogForLast = data.operationLogForLast || {}
          const operationLogList = data.operationLogList || []

          this.form = { ...bpBusinessPartner }
          this.form.supplierAssignedCommonShow = supplierAssignedCommonShow
          this.form.customerAssignedCommonShow = customerAssignedCommonShow
          this.form.operationLogForLast = operationLogForLast
          this.form.operationLogList = operationLogList
        })
        .catch(() => {})
    },
    // 取消按钮
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/businessPartnerManagement/businessPartnerAssignment' })
    },
    // 表单重置
    reset() {
      this.form = {
        specialOrderId: undefined,
        specialOrderNo: undefined,
        documentNo: undefined
      }
      this.activeNames = ['1', '2', '3', '4']
    }
  }
}
</script>
<style lang="scss" scoped>
.count {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #515a6e;
  font-size: 15px;
  font-weight: 700;
  height: 40px;
  padding: 0 30px;
  line-height: 40px;
  border-bottom: 1px solid #e6ebf5;
}
</style>
