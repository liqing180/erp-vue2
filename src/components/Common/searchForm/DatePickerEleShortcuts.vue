<template>
  <el-date-picker
    :value="value"
    @input="input"
    :picker-options="pickerOptions"
    :default-value="defaultValue"
    size="small"
    :style="{ width: width ? width : '240px' }"
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

  <!--   <el-date-picker
    :value="value"
    @input="$emit('updateForm', { value: $event, format, type, startDate, endDate })"
    size="small"
    :style="{ width: width ? width : '240px' }"
    :value-format="format || 'timestamp'"
    type="daterange"
    range-separator="-"
    :start-placeholder="`${$t('ui.startDate')}`"
    :end-placeholder="`${$t('ui.endDate')}`"
    clearable
    :format="fmtForYmd"
  ></el-date-picker> -->
</template>
<script>
export default {
  name: 'DatePickerEle',
  props: {
    value: {
      default: null
    },
    format: {
      default: null
    },
    width: {
      default: null
    },
    startDate: {
      default: null
    },
    endDate: {
      default: null
    },
    type: {
      default: null
    },
    moreCurTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      defaultValue: Date.now() - 30 * 24 * 3600 * 1000,
      pickerOptions: {
        shortcuts: [
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
      },
      disabled: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
    input($event) {
      if (this.disabled) return
      this.disabled = true
      setTimeout(() => {
        this.disabled = false
      }, 200)
      this.$emit('updateForm', {
        value: $event,
        format: this.format,
        type: this.type,
        startDate: this.startDate,
        endDate: this.endDate
      })
    }
  }
}
</script>
