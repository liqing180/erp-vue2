<template>
  <div class="flex">
    <el-select
      size="small"
      :style="{ width: maxTextWidth ? maxTextWidth + 'px' : '120px' }"
      :value="selectVal"
      :placeholder="placeholder || ''"
      @change="$emit('updateForm', { value: $event, type, childType: 'select' })"
    >
      <el-option
        v-for="child in selectData"
        :key="child[selectValue]"
        :label="child[selectLabel]"
        :value="child[selectValue]"
      >
      </el-option>
    </el-select>
    <el-date-picker
      class="flex-1"
      :value="dataValue"
      @input="$emit('updateForm', { value: $event, type, childType: 'date' })"
      size="small"
      :value-format="format || 'yyyy-MM-dd'"
      type="daterange"
      range-separator="-"
      :start-placeholder="`${$t('ui.startDate')}`"
      :end-placeholder="`${$t('ui.endDate')}`"
      clearable
      :format="fmtForYmd"
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'SelectAnPickerEle',
  props: [
    'date',
    'selectId',
    'placeholder',
    'selectData',
    'value',
    'selectValue',
    'selectLabel',
    'format',
    'type',
    'width',
    'startDate',
    'endDate'
  ],
  data() {
    return {
      selectVal: this.selectId || undefined,
      dataValue: this.date || []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  watch: {
    selectId(newVal, oldVal) {
      this.selectVal = newVal || undefined
    },
    date(newVal, oldVal) {
      this.dataValue = newVal || []
    }
  }
}
</script>

<style lang="scss" scoped></style>
