<template>
  <div class="mb8">
    <el-form :inline="true" ref="ruleForm" @submit.native.prevent>
      <div class="search-warp top-row">
        <div class="search-content-warp">
          <div class="search-content">
            <div class="w100 top-row-content">
              <el-form-item v-if="showMenu">
                <span style="font-weight: bold; font-size: 16px">{{
                  getMenuTitle(menuTitle)
                }}</span>
              </el-form-item>
              <div class="search-content" style="flex-direction: row-reverse">
                <el-form-item
                  v-for="(item, index) in searchData.slice(0, topShowCount)"
                  :key="index"
                  :label="item.label"
                >
                  <component
                    :is="item.type"
                    :value="formData[item.name]"
                    v-bind="item"
                    @updateForm="updateForm(item.name, $event, index)"
                    @search="search"
                    :ref="item.type"
                  >
                  </component>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="search-btn" v-if="isBtn || dividerShow">
          <el-form-item>
            <el-button
              size="mini"
              v-if="isBtn"
              type="primary"
              icon="el-icon-search"
              @click="search"
            ></el-button>
            <el-button
              v-if="dividerShow"
              size="mini"
              type="text"
              :icon="isAll ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
              @click="isAll = !isAll"
              >{{ isAll ? $t('ui.minimise') : $t('ui.expand') }}
            </el-button>
          </el-form-item>
        </div>
      </div>
      <div class="search-warp" v-show="isAll && dividerShow">
        <div class="search-content-warp">
          <div class="search-content">
            <el-form-item
              v-for="(item, index) in searchData.slice(topShowCount)"
              :key="index"
              :label="item.label"
            >
              <component
                :is="item.type"
                :value="formData[item.name]"
                v-bind="item"
                @updateForm="updateForm(item.name, $event, index + topShowCount)"
                @search="search"
                :ref="item.type"
              >
              </component>
            </el-form-item>
          </div>
        </div>
        <div class="search-btn">
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              v-if="isBtn"
              icon="el-icon-refresh"
              @click="resetForm"
              >{{ $t('uiBtn.reset') }}</el-button
            >

            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="showCustomSearch"
              v-if="showCustom && isBtn"
              >{{ $t('uiBtn.customQuery') }}</el-button
            >
          </el-form-item>
        </div>
      </div>
    </el-form>
    <CustomSearchDlg
      :customSelectData="customSelectData"
      @customSearch="customSearch"
      ref="customSearchDlg"
    />
  </div>
</template>

<script>
/**
 * @desc                  搜索组件
 * @InputEle              文本框
 * @SelectEle             下拉单选(对象数组)
 * @DatePickerEle         日期范围选择
 * @MultipleSelectEle     下拉多选(复杂数据类型)
 * @SimpleArraySelectEle  下拉单选(简单类型数组)
 * @SimpleArrayMultipleSelectEle 下拉多选(简单类型数据)
 * @ComplexArrayMultipleSelectEle  下拉多选(复杂数据类型)
 * @searchMixin           请求数据字典数据
 * @ElcascaderEle         级联选择器
 */
import InputEle from './InputEle.vue'
import SelectEle from './SelectEle.vue'
import DatePickerEle from './DatePickerEle.vue'
import DatePickerEleShortcuts from './DatePickerEleShortcuts.vue'

import MultipleSelectEle from './MultipleSelectEle.vue'
import SimpleArraySelectEle from './SimpleArraySelectEle.vue'
import SimpleArrayMultipleSelectEle from './SimpleArrayMultipleSelectEle.vue'
import ComplexArrayMultipleSelectEle from './complexArrayMultipleSelectEle.vue'
import SelectAnPickerEle from './SelectAnPickerEle.vue'
import ElcascaderEle from './ElcascaderEle.vue'
import CustomSearchDlg from './CustomSearchDlg.vue'
import searchMixin from './searchMixin.js'

import resize from '@/directive/resize'

export default {
  name: 'searchEle',
  directives: {
    resize
  },
  components: {
    InputEle,
    SelectEle,
    DatePickerEle,
    DatePickerEleShortcuts,
    MultipleSelectEle,
    SimpleArraySelectEle,
    SimpleArrayMultipleSelectEle,
    ComplexArrayMultipleSelectEle,
    SelectAnPickerEle,
    ElcascaderEle,
    CustomSearchDlg
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
    handleCustomSearch: {
      type: Function
    },
    showCustom: {
      type: Boolean,
      default: false
    },
    customSelectData: {
      type: Array,
      default: () => []
    },
    // 是否显示按钮
    isBtn: {
      type: Boolean,
      default: true
    },
    // 是否菜单名
    showMenu: {
      type: Boolean,
      default: true
    },
    topShowCount: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      formData: this.value || {},
      isAll: true,
      height: {
        default: 50,
        medium: 44,
        small: 40,
        mini: 38
      }
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    },
    heightPx() {
      return this.height[this.size] || this.height.default
    },
    noResetList() {
      const noReset = ['pageNum', 'pageSize']
      this.searchData.forEach((item) => {
        if (item.noReset) {
          noReset.push(item.name)
        }
      })
      return noReset
    },
    menuTitle() {
      return this.$route.meta.title
    },
    dividerShow() {
      return this.searchData.length > this.topShowCount
    }
  },
  watch: {
    'value.pageSize': function (newVal, oldVal) {
      this.$set(this.formData, 'pageSize', newVal)
    },
    'value.pageNum': function (newVal, oldVal) {
      this.$set(this.formData, 'pageNum', newVal)
    }
  },
  created() {},
  methods: {
    // 搜索
    search() {
      this.$refs.customSearchDlg.resetForm()
      this.handleQuery(this.formData)
    },
    // 重置
    resetForm() {
      const { pageNum, pageSize } = this.formData
      this.formData = { pageNum, pageSize }
      this.resetQuery()
    },
    // 组件值变化时触发
    updateForm(name, e, index) {
      // console.log(name, e, index)
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
      } else if (type && type === 'SelectAnPickerEle') {
        if (e.childType === 'select') {
          this.$set(this.formData, name, value)
          this.$set(this.formData, startDate || 'startDate', undefined)
          this.$set(this.formData, endDate || 'endDate', undefined)
        } else {
          if (value && value.length > 0) {
            // 开始结束字段，有传入开始结束日期字段就使用传入的，没有就默认 startDate, endDate
            this.$set(this.formData, startDate || 'startDate', value[0])
            this.$set(this.formData, endDate || 'endDate', value[1] + 86399000)
          } else {
            this.$set(this.formData, startDate || 'startDate', undefined)
            this.$set(this.formData, endDate || 'endDate', undefined)
          }
        }
        this.$emit('updateSearchData', { index, childType: e.childType, value: value })
      } else {
        this.$set(this.formData, name, value || undefined)
        if (type === 'MultipleSelectEle' || type === 'SelectEle' || type === 'ElcascaderEle') {
          this.search()
        }
      }
    },
    showCustomSearch() {
      this.$refs.customSearchDlg.show()
    },
    clearEmptyPro(obj) {
      const curVal = {}
      const toString = Object.prototype.toString
      for (const key in obj) {
        const value = obj[key]
        const type = toString.call(value)
        if (value || type === '[object Number]' || type === '[object Boolean]') {
          switch (type) {
            case '[object Object]':
              if (Object.keys(value).length > 0) {
                curVal[key] = value
              }
              break
            case '[object Array]':
              if (value.length > 0) {
                curVal[key] = value
              }
              break
            default:
              curVal[key] = value
              break
          }
        }
      }
      return curVal
    },
    customSearch() {
      const { pageNum, pageSize } = this.formData
      this.formData = { pageNum, pageSize }
      const params = this.clearEmptyPro(this.$refs.customSearchDlg.formData)
      for (const key in params) {
        this.customSelectData.forEach((x) => {
          if (key === x.value && x.type === 'DatePickerEle' && params[key].length > 0) {
            params[x.startDate] = params[key][0]
            params[x.endDate] = params[key][1] + 86399000
          }
        })
      }
      this.handleQuery(Object.assign(params, { pageNum, pageSize }))
      this.$refs.customSearchDlg.close()
    }
  }
}
</script>

<style scoped lang="scss">
.search-warp {
  background-color: #61616110;
  padding-left: 8px;
  display: flex;
  /deep/ .el-form-item {
    margin-bottom: 8px;
  }
  .search-content-warp {
    flex: 1;
  }
  .search-content-warp.hide-search {
    overflow: hidden;
  }
  .search-content {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
}
.top-row {
  padding-top: 5px;
  padding-bottom: 5px;
  .top-row-content {
    display: flex;
    justify-content: space-between;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
</style>
