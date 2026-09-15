<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="dlgTitle"
    :visible.sync="visible"
    width="1000px"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-form ref="form" :model="form" label-width="160px">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PRODUCT.productName')}`">
            <el-input v-model="form.productName" :title="form.productName" type="text" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('ui.status')}`">
            <el-input
              v-model="form.deliveryScheduleDetailStatusShowStr"
              :title="form.deliveryScheduleDetailStatusShowStr"
              type="text"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PRODUCT.salesPartNo')}`">
            <el-input v-model="form.salesPartNo" :title="form.salesPartNo" type="text" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('SALES.sourceType')}`">
            <el-input
              :value="selectDictLabel(dict.type.delivery_schedule_source_type, form.sourceType)"
              type="text"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('SALES.plannedQTY')}`">
            <el-input
              :value="$numberStr(form.plannedQtyForBasic, form.decimalNum)"
              type="text"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('SALES.docNo')}`">
            <el-input v-model="form.documentNo" :title="form.documentNo" type="text" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('SALES.shipFrom')}`">
            <el-input
              v-if="form.sourceType === 'Supplier'"
              v-model="form.shipFrom"
              :title="form.shipFrom"
              disabled
            />
            <el-input v-else v-model="form.warehouseName" :title="form.warehouseName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('SALES.arrivalDate')}`">
            <el-input :value="parseTime(form.arrivalDate, fmtForYmd)" type="text" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('SALES.deliveryOrderNo')}`">
            <el-input
              v-model="form.deliveryOrderNo"
              :title="form.deliveryOrderNo"
              type="text"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryDeliveryScheduleDetailMsg } from '@/api/salesManagement/salesOrder'
import pageMixin from '@/mixins/tableMinx'

export default {
  mixins: [pageMixin],
  dicts: ['delivery_schedule_source_type'],
  components: {},
  props: {},
  data() {
    return {
      dlgTitle: undefined,
      loading: false,
      visible: false,
      form: {}
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
  created() {},
  methods: {
    handleEdit(row) {
      this.dlgTitle = this.$t('SALES.viewSchedule')
      this.visible = true
      queryDeliveryScheduleDetailMsg({
        deliveryScheduleDetailId: row.deliveryScheduleDetailId
      }).then((res) => {
        const data = res.data || {}

        if (data.sourceType === 'Warehouse') {
          data.transitTimeForSecondForWarehouse = data.transitTimeForSecond
          data.transitTimeForDayForWarehouse = data.transitTimeForDay
        } else {
          data.transitTimeForSecondForWarehouse = data.transitTimeForSecondForDropShip
          data.transitTimeForDayForWarehouse = data.transitTimeForDayForDropShip
        }
        this.form = data
      })
    },
    reset() {
      this.form = {}
    },
    back() {
      this.visible = false
      this.closed()
    },
    closed() {}
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  margin-bottom: 20px;
}
</style>
