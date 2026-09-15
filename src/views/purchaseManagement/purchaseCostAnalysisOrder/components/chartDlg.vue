<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('uiBtn.details')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-form ref="form" :model="form" @submit.native.prevent label-width="auto">
      <el-form-item :label="$t('PURCHASE.timeLimit')">
        <el-date-picker
          v-model="form.dateRange"
          @input="input"
          :picker-options="pickerOptions"
          :default-value="defaultValue"
          size="small"
          style="width: 240px"
          type="daterange"
          value-format="timestamp"
          align="right"
          unlink-panels
          range-separator="-"
          :start-placeholder="`${$t('ui.startDate')}`"
          :end-placeholder="`${$t('ui.endDate')}`"
          :clearable="true"
          :default-time="['00:00:00', '00:00:00']"
          :format="fmtForYmd"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <PieChart ref="PieChart" :typeDicts="typeDicts" />
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PieChart from './PieChart'
import { queryImageForInventoryCostDocument } from '@/api/purchaseManagement/purchaseCostAnalysisOrder'

export default {
  components: { PieChart },
  name: 'chartDlg',
  data() {
    const vm = this
    return {
      visible: false,
      form: {
        dateRange: []
      },
      defaultValue: Date.now() - 30 * 24 * 3600 * 1000,
      pickerOptions: {
        shortcuts: [
          {
            text: vm.$t('ui.today'),
            onClick(picker) {
              const end = new Date(vm.appointTime(Date.now(), '00:00:00'))
              picker.$emit('pick', [end, end])
            }
          },
          {
            text: vm.$t('ui.weekly'),
            onClick(picker) {
              const end = new Date(vm.appointTime(Date.now(), '00:00:00'))
              const startTimer = vm.appointTime(Date.now(), '00:00:00')
              // const start = new Date(startTimer - 3600 * 1000 * 24 * 6)
              // picker.$emit('pick', [start, end])
              if (vm.moreCurTime) {
                const start = new Date(startTimer + 3600 * 1000 * 24 * 6)
                picker.$emit('pick', [end, start])
              } else {
                const start = new Date(startTimer - 3600 * 1000 * 24 * 6)
                picker.$emit('pick', [start, end])
              }
            }
          },
          {
            text: vm.$t('ui.fortnightly'),
            onClick(picker) {
              const end = new Date(vm.appointTime(Date.now(), '00:00:00'))
              const startTimer = vm.appointTime(Date.now(), '00:00:00')
              // const start = new Date(startTimer - 3600 * 1000 * 24 * 13)
              // picker.$emit('pick', [start, end])
              if (vm.moreCurTime) {
                const start = new Date(startTimer + 3600 * 1000 * 24 * 13)
                picker.$emit('pick', [end, start])
              } else {
                const start = new Date(startTimer - 3600 * 1000 * 24 * 13)
                picker.$emit('pick', [start, end])
              }
            }
          },
          {
            text: vm.$t('ui.monthly'),
            onClick(picker) {
              const end = new Date(vm.appointTime(Date.now(), '00:00:00'))
              const startTimer = vm.appointTime(Date.now(), '00:00:00')
              // const start = new Date(startTimer - 3600 * 1000 * 24 * 29)
              // picker.$emit('pick', [start, end])
              if (vm.moreCurTime) {
                const start = new Date(startTimer + 3600 * 1000 * 24 * 29)
                picker.$emit('pick', [end, start])
              } else {
                const start = new Date(startTimer - 3600 * 1000 * 24 * 29)
                picker.$emit('pick', [start, end])
              }
            }
          },
          {
            text: vm.$t('ui.quarterly'),
            onClick(picker) {
              const end = new Date(vm.appointTime(Date.now(), '00:00:00'))
              const startTimer = vm.appointTime(Date.now(), '00:00:00')
              // const start = new Date(startTimer - 3600 * 1000 * 24 * 89)
              // picker.$emit('pick', [start, end])
              if (vm.moreCurTime) {
                const start = new Date(startTimer + 3600 * 1000 * 24 * 89)
                picker.$emit('pick', [end, start])
              } else {
                const start = new Date(startTimer - 3600 * 1000 * 24 * 89)
                picker.$emit('pick', [start, end])
              }
            }
          },
          {
            text: vm.$t('ui.sixMonthly'),
            onClick(picker) {
              const end = new Date(vm.appointTime(Date.now(), '00:00:00'))
              const startTimer = vm.appointTime(Date.now(), '00:00:00')
              // const start = new Date(startTimer - 3600 * 1000 * 24 * 179)
              // picker.$emit('pick', [start, end])
              if (vm.moreCurTime) {
                const start = new Date(startTimer + 3600 * 1000 * 24 * 179)
                picker.$emit('pick', [end, start])
              } else {
                const start = new Date(startTimer - 3600 * 1000 * 24 * 179)
                picker.$emit('pick', [start, end])
              }
            }
          },
          {
            text: vm.$t('ui.annually'),
            onClick(picker) {
              const end = new Date(vm.appointTime(Date.now(), '00:00:00'))
              const startTimer = vm.appointTime(Date.now(), '00:00:00')
              // const start = new Date(startTimer - 3600 * 1000 * 24 * 364)
              // picker.$emit('pick', [start, end])
              if (vm.moreCurTime) {
                const start = new Date(startTimer + 3600 * 1000 * 24 * 364)
                picker.$emit('pick', [end, start])
              } else {
                const start = new Date(startTimer - 3600 * 1000 * 24 * 364)
                picker.$emit('pick', [start, end])
              }
            }
          }
        ],
        disabledDate(time) {
          return false
          // if (!vm.moreCurTime) return false
          // return time.getTime() < +new Date() - 8.64e7
        }
      }
    }
  },
  props: {
    typeDicts: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
    openChart(row) {
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.form, 'dateRange', [startTimer, end])

      this.$set(this.form, 'productId', row.productId)
      this.$set(this.form, 'documentId', row.documentId)
      this.visible = true
      this.queryImageForInventoryCostDocument()
    },
    queryImageForInventoryCostDocument() {
      const { dateRange, productId, documentId } = this.form
      const params = {
        productId,
        documentId
      }
      if (dateRange && dateRange.length === 2) {
        params.startDate = dateRange[0]
        params.endDate = dateRange[1] + 24 * 60 * 60 * 1000 - 1
      }

      queryImageForInventoryCostDocument(params).then((response) => {
        this.$nextTick(() => {
          this.$refs.PieChart && this.$refs.PieChart.initChart(response.data)
        })
      })
    },

    input() {
      this.queryImageForInventoryCostDocument()
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.$set(this.form, 'dateRange', [])
    }
  }
}
</script>

<style lang="scss" scoped>
.right-title {
  flex: 1;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  span {
    display: inline-block;
    max-width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
