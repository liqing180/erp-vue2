<template>
  <el-dialog
    v-dialogDrag
    :title="$t('uiBtn.details')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <!-- <el-form ref="form" :model="form" @submit.native.prevent label-width="auto">
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
    </el-form> -->
    <div style="position: relative; width: 100%; height: 30px">
      <div class="radio-card">
        <el-radio-group v-model="dayType" size="mini" @input="dateChange">
          <el-radio-button label="1">{{ $t('SALES.day1') }}</el-radio-button>
          <el-radio-button label="2">{{ $t('SALES.week1') }}</el-radio-button>
          <el-radio-button label="3">{{ $t('SALES.month1') }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <PieChart ref="PieChart" :typeDicts="typeDicts" />
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PieChart from './PieChart'
import {
  queryImageForSalesCost,
  queryImageForRecommendedPrice
} from '@/api/salesManagement/salesCost'

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
      dayType: '1',
      chartData: {},
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
    },
    path: {
      type: String,
      default: ''
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
    openChart(row) {
      this.$set(this.form, 'productId', row.productId)
      this.$set(this.form, 'startDate', row.startDate)
      this.$set(this.form, 'endDate', row.endDate)
      this.visible = true
      this.queryImageForSalesCost()
    },
    queryImageForSalesCost() {
      const params = {
        ...this.form
      }
      let api = queryImageForSalesCost
      if (this.path === 'recommendedRetailPrice') {
        api = queryImageForRecommendedPrice
      }
      api(params).then((response) => {
        this.chartData = response.data || {}
        this.setOptions()
      })
    },
    dateChange() {
      this.setOptions()
    },
    setOptions() {
      const data = this.chartData || {}
      const params = {
        currencySymbol: data.currencySymbol
      }
      let tabData
      if (this.dayType === '1') {
        tabData = data.dayData || {}
      }
      if (this.dayType === '2') {
        tabData = data.weekData || {}
      }
      if (this.dayType === '3') {
        tabData = data.monthData || {}
      }
      const imageXList = tabData.imageXList || []
      const imageLineList = tabData.imageLineList || []
      const lineData = (imageLineList[0] || {}).lineDropList || []

      const xAxisData = imageXList.map((x) => x.subShow)
      const yAxisData = lineData.map((item) => {
        if (this.path === 'recommendedRetailPrice') {
          return (item || {}).recommendedRetailPrice || null
        } else {
          return (item || {}).salesCost || null
        }
      })
      params.xAxisData = xAxisData
      params.yAxisData = yAxisData
      this.$nextTick(() => {
        if (!this.$refs.PieChart) {
          setTimeout(() => {
            this.$refs.PieChart && this.$refs.PieChart.initChart(params)
          }, 1000)
        } else {
          this.$refs.PieChart && this.$refs.PieChart.initChart(params)
        }
      })
    },

    input() {
      this.queryImageForSalesCost()
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.chartData = {}
      this.dayType = '1'
      this.$set(this.form, 'dateRange', [])
      this.$refs.PieChart && this.$refs.PieChart.initChart({})
    }
  }
}
</script>
<style lang="scss" scoped>
.radio-card {
  position: absolute;
  right: 40px;
  top: 0;
}
</style>
