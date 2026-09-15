<template>
  <el-form inline ref="ruleForm" @submit.native.prevent>
    <el-form-item v-for="(item, index) in searchData" :key="index" :label="item.label">
      <component
        :is="item.type"
        :value="formData[item.name]"
        v-bind="item"
        @updateForm="updateForm(item.name, $event)"
        @search="search"
        :ref="item.type"
      >
      </component>
    </el-form-item>
    <el-form-item v-if="isBtn">
      <el-button size="mini" type="primary" icon="el-icon-search" @click="search">{{
        $t('uiBtn.search')
      }}</el-button>
      <el-button size="mini" icon="el-icon-refresh" @click="resetForm">{{
        $t('uiBtn.reset')
      }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
/**
 * @desc                搜索组件
 * @InputEle            文本框
 * @SelectEle           下拉单选
 * @DatePickerEle       日期范围选择
 * @MultipleSelectEle   下拉多选
 * @searchMixin         请求数据字典数据
 */
import InputEle from './InputEle.vue'
import SelectEle from './SelectEle.vue'
import DatePickerEle from './DatePickerEle.vue'
import DatePickerEleShortcuts from './DatePickerEleShortcuts.vue'

import MultipleSelectEle from './MultipleSelectEle.vue'
import searchMixin from './searchMixin.js'
export default {
  name: 'searchEle',
  components: {
    InputEle,
    SelectEle,
    DatePickerEle,
    DatePickerEleShortcuts,
    MultipleSelectEle
  },
  mixins: [searchMixin],
  /**
   * @value           搜索条件字段
   * @searchData      搜索组件配置项
   * @handleQuery     搜索(函数)
   * @resetQuery      重置(函数)
   */
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    searchData: {
      type: Array,
      default: () => []
    },
    handleQuery: {
      type: Function
    },
    resetQuery: {
      type: Function
    },
    // 是否显示按钮
    isBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: this.value || {}
    }
  },
  watch: {
    'value.pageSize': function (newVal, oldVal) {
      this.$set(this.formData, 'pageSize', newVal)
    },
    'value.pageNum': function (newVal, oldVal) {
      this.$set(this.formData, 'pageNum', newVal)
    },
    'value.condition': function (newVal, oldVal) {
      this.$set(this.formData, 'condition', newVal)
    }
  },
  created() {},
  methods: {
    // 搜索
    search() {
      this.handleQuery(this.formData)
    },
    // 重置
    resetForm() {
      const { pageNum, pageSize } = this.formData
      this.formData = { pageNum, pageSize }
      this.resetQuery()
    },
    // 组件值变化时触发
    updateForm(name, e) {
      const { type, format, value, startDate, endDate } = e
      // 判断日期类型
      if (
        type &&
        (type === 'DatePickerEle' || type === 'DatePickerEleShortcuts') &&
        format === 'timestamp'
      ) {
        this.$set(this.formData, name, value || undefined)
        if (value && value.length > 0) {
          // 开始结束字段，有传入开始结束日期字段就使用传入的，没有就默认 startDate, endDate
          this.$set(this.formData, startDate || 'startDate', value[0])
          this.$set(this.formData, endDate || 'endDate', value[1] + 86399000)
        } else {
          this.$set(this.formData, startDate || 'startDate', undefined)
          this.$set(this.formData, endDate || 'endDate', undefined)
        }
        this.search()
      } else {
        this.$set(this.formData, name, value || undefined)
        if (type === 'MultipleSelectEle' || type === 'SelectEle' || type === 'ElcascaderEle') {
          this.search()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
