<template>
  <el-date-picker
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
  ></el-date-picker>
</template>
<script>
export default {
  name: 'DatePickerEle',
  props: {
    value: undefined,
    format: undefined,
    width: undefined,
    startDate: undefined,
    endDate: undefined
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  }
}
</script>
