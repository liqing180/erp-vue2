<template>
  <div class="mb8" ref="searchBox" v-resize="divResizeFn">
    <el-form :inline="false" ref="ruleForm" @submit.native.prevent>
      <div :class="['search-warp', !isProductCustomSearch ? 'top-row' : '']" v-if="isShowTopRow">
        <div class="flex">
          <slot name="left"></slot>
        </div>
        <div class="search-content-warp">
          <div class="search-content">
            <div class="w100 top-row-content">
              <div
                class="flexStart"
                :style="{ width: selectWidth + 'px' }"
                ref="leftBox"
                :key="timeStamp"
              >
                <!-- {{ selectTagList }} -->
                <div class="flex-1" style="word-break: break-all">
                  <ul
                    class="flexStart"
                    ref="selectTag"
                    v-loading="loading"
                    v-show="!isAll && dividerShow"
                  >
                    <template>
                      <li
                        v-for="(item, index) in selectTagList"
                        :key="item.name"
                        :ref="'li_' + index"
                        v-show="index < tagIndex"
                      >
                        <el-tag
                          class="tag flexStart"
                          type="info"
                          effect="plain"
                          :closable="
                            notClosableNameList.length <= 0 ||
                            notClosableNameList.indexOf(item.name) === -1
                          "
                          disable-transitions
                          @close="closeTag(item)"
                          @click="clickTag"
                          v-if="item.title"
                        >
                          <span
                            class="tag-title flow1"
                            :title="item.label + ': ' + item.title"
                            v-if="item.label"
                            >{{ item.label }}: {{ item.title }}</span
                          >
                          <span class="tag-title flow1" :title="item.title" v-else>{{
                            item.title
                          }}</span>
                        </el-tag>
                      </li>
                      <li v-if="selectTagList.slice(tagIndex).filter((x) => x.title).length > 0">
                        <el-popover placement="bottom" width="250" trigger="click">
                          <ul>
                            <li v-for="item in selectTagList.slice(tagIndex)" :key="item.name">
                              <el-tag
                                class="tag flexStart"
                                type="info"
                                effect="plain"
                                closable
                                disable-transitions
                                @close="closeTag(item)"
                                @click="clickTag"
                                v-if="item.title"
                              >
                                <span
                                  class="tag-title flow1"
                                  :title="item.label + ': ' + item.title"
                                  v-if="item.label"
                                  >{{ item.label }}: {{ item.title }}</span
                                >
                                <span class="tag-title flow1" :title="item.title" v-else>{{
                                  item.title
                                }}</span>
                              </el-tag>
                            </li>
                          </ul>
                          <el-tag effect="plain" slot="reference">
                            <i class="el-icon-plus"></i>
                            {{ selectTagList.slice(tagIndex).filter((x) => x.title).length }}
                          </el-tag>
                        </el-popover>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
              <el-form :inline="true" @submit.native.prevent>
                <div class="search-content" style="flex-direction: row-reverse; margin-left: 40px">
                  <el-form-item
                    v-for="(item, index) in searchData.slice(0, topShowCount)"
                    :key="index"
                    :label="item.label"
                    style="flex-shrink: 0"
                  >
                    <component
                      :is="item.type"
                      :value="formData[item.name]"
                      v-bind="item"
                      @updateForm="updateForm(item.name, $event, index, item.label)"
                      @search="search"
                      :ref="item.type"
                      :interval="interval"
                    >
                    </component>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <div class="search-btn" style="flex-shrink: 0" v-if="isBtn || dividerShow">
          <el-form-item>
            <el-button
              v-if="dividerShow && isShowAllBtn"
              size="mini"
              type="text"
              :icon="isAll ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
              @click="isAllChange"
            >
            </el-button>
            <el-button
              size="mini"
              v-if="dividerShow && isShowRefreshBtn"
              icon="el-icon-refresh"
              type="text"
              @click="resetForm"
            ></el-button>
          </el-form-item>
        </div>
        <div class="flexEnd">
          <slot></slot>
        </div>
      </div>
      <div
        class="search-warp bottom-row"
        :class="{ 'hide-border-top': isShowTopRow }"
        v-show="isAll && dividerShow"
      >
        <el-row :gutter="10" type="flex" style="flex-wrap: wrap; width: 100%">
          <el-col
            :span="getColumnSpan(searchBoxWidth)"
            v-for="(item, index) in searchData.slice(topShowCount)"
            :key="index"
          >
            <el-form-item
              :label="item.label"
              :label-width="
                ['SelectAnInput', 'SelectAnMultipleSelect'].includes(item.type)
                  ? '0px'
                  : maxTextWidth + 'px'
              "
              :ref="'item_' + index"
            >
              <component
                :maxTextWidth="maxTextWidth"
                :is="item.type"
                :value="formData[item.name]"
                v-bind="item"
                @updateForm="updateForm(item.name, $event, index + topShowCount, item.label)"
                @search="search"
                :ref="item.type"
              >
              </component>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="search-btn">
          <el-form-item>
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
import { mapGetters } from 'vuex'

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
 * @SelectAnInput         下拉输入联动
 * @AutocompleteEle       文本框--自动检索
 * @SelectAnMultipleSelect         下拉与下拉多选联动
 * @SelectInput           点击弹窗
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
import SelectAnInput from './SelectAnInput.vue'
import AutocompleteEle from './AutocompleteEle.vue'
import SelectAnMultipleSelect from './SelectAnMultipleSelect.vue'
import SelectInput from './SelectInput'
import ATreeSelectCustom from './ATreeSelectCustom.vue'

import lodash from 'lodash'
import resize from '@/directive/resize'
import getTextWidth from 'text-width'
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
    CustomSearchDlg,
    SelectAnInput,
    AutocompleteEle,
    SelectAnMultipleSelect,
    SelectInput,
    ATreeSelectCustom
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
    isShowTopRow: {
      type: Boolean,
      default: true
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
    },
    width: {
      type: [Number, String]
    },
    // 产品自定义搜索
    isProductCustomSearch: {
      type: Boolean,
      default: false
    },
    isShowAllBtn: {
      type: Boolean,
      default: true
    },
    isShowRefreshBtn: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    },
    notClosableNameList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      formData: {},
      isAll: true,
      height: {
        default: 50,
        medium: 44,
        small: 40,
        mini: 38
      },
      // 所有折叠选项中已选中的值
      selectTagList: [],
      // 定时函数
      drawTiming: null,
      // 最多显示宽度
      tagIndex: 0,
      timeStamp: +new Date(),
      loading: false,
      searchBoxWidth: undefined,
      selectWidth: undefined,
      runTime: undefined,
      maxTextWidth: undefined
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    size() {
      return this.$store.getters.size
    },
    fontSize() {
      const fontSizes = {
        medium: 14,
        small: 13,
        mini: 12
      }
      return fontSizes[this.size] || fontSizes.default
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
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler: function () {
        this.formData = this.value
        // console.log('搜素条件更新')
        setTimeout(() => {
          this.initAllSelectTagMethod()
        }, 100)
      }
    },
    searchData: {
      immediate: true,
      handler: function () {
        this.initFormLabelWidth()
        this.selectTagList = []
        setTimeout(() => {
          this.initAllSelectTagMethod()
        }, 100)
      }
    }
  },
  created() {
    this.initAllSelectTagMethod = lodash.debounce(this.initAllSelectTag, 1000)
  },
  activated() {
    if (!this.isAll) {
      const selectTagList = JSON.parse(JSON.stringify(this.selectTagList)) || []
      this.tagIndex = selectTagList.length
      this.selectTagList = []
      this.timeStamp += 1
      this.loading = true
      setTimeout(() => {
        this.selectTagList = selectTagList
        this.loading = false
        // this.divResizeFn()
      }, 100)
    }
  },
  mounted() {
    // 处理搜索条件有默认值时的折叠数据
    this.initAllSelectTagMethod()
  },
  methods: {
    initAllSelectTag() {
      // console.log('调用 allSelectTag')

      this.searchData.forEach((x, i) => {
        if (i >= this.topShowCount) {
          this.allSelectTag(x.name, x, i, x.label)
        }
      })
    },
    getColumnSpan(screenWidth) {
      if (screenWidth >= 1920) {
        return 6 // 在超大屏幕设备上设置span为6
      } else if (screenWidth >= 1500) {
        return 6 // 在大屏幕设备上设置span为4
      } else if (screenWidth >= 1100) {
        return 8 // 在中等屏幕设备上设置span为3
      } else {
        return 12 // 在小屏幕设备及以下设置span为2
      }
    },
    initFormLabelWidth() {
      let maxTextWidth = 0
      let minSelectWidth = 0
      this.searchData.forEach((item) => {
        if (item.minSelectWidth) {
          minSelectWidth = Math.max(minSelectWidth, item.minSelectWidth)
        }
        const width1 = getTextWidth(item.label, {
          family:
            'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
          size: this.fontSize,
          weight: 'normal'
        })
        if (width1 > maxTextWidth) {
          maxTextWidth = width1
        }
      })
      maxTextWidth = maxTextWidth + 12
      this.maxTextWidth = Math.max(maxTextWidth, minSelectWidth)
    },
    isAllChange() {
      this.isAll = !this.isAll
      if (!this.isAll) {
        this.delayed()
      }
    },
    delayed() {
      if (!this.isAll) {
        setTimeout(() => {
          this.divResizeFn()
        }, 100)
      }
    },
    calcRate() {
      const selectTag = this.$refs.selectTag
      const leftBox = this.$refs.leftBox
      if (!selectTag || selectTag.length <= 0) return
      this.$nextTick(() => {
        if (selectTag) {
          const ulWidth =
            selectTag.clientWidth > leftBox.clientWidth
              ? leftBox.clientWidth
              : selectTag.clientWidth
          if (!ulWidth) return
          let tagWidth = 0
          let tagIndex = this.tagIndex
          for (let i = 0; i < this.selectTagList.length; i++) {
            if (this.$refs['li_' + i] && this.$refs['li_' + i].length > 0) {
              tagWidth += this.$refs['li_' + i][0].clientWidth
              if (tagWidth + 50 >= ulWidth) {
                tagIndex = i
                this.tagIndex = tagIndex
                return
              }
            }
            if (i === this.selectTagList.length - 1) {
              if (tagIndex < this.selectTagList.length && ulWidth > tagWidth + 200) {
                const num = parseInt((ulWidth - tagWidth) / 200)
                tagIndex += num
                this.tagIndex = tagIndex
              }
            }
          }
        }
      })
    },
    // 搜索
    search() {
      this.$refs.customSearchDlg.resetForm()
      this.handleQuery(this.formData)
    },
    // 重置
    resetForm() {
      // const { pageNum, pageSize } = this.formData
      // this.formData = { pageNum, pageSize }
      this.resetQuery()
      this.selectTagList = []
      this.tagIndex = 0
    },
    getElcascaderEleCheckedNodes() {
      const i = this.searchData
        .slice(this.topShowCount)
        .findIndex((x) => x.name === 'productCategoryIds')
      let getCheckedNodes = []
      if (
        this.$refs['item_' + i] &&
        this.$refs['item_' + i][0] &&
        this.$refs['item_' + i][0].$children[1]
      ) {
        getCheckedNodes = this.$refs['item_' + i][0].$children[1].getCheckedNodes()
      }
      return getCheckedNodes
    },
    // 组件值变化时触发
    updateForm(name, e, index, label) {
      // console.log(name, e, index)
      const { type, format, value, startDate, endDate, selectName, inputName } = e
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
      } else if (type && type === 'SelectAnInput') {
        if (e.childType === 'select') {
          this.$set(this.formData, selectName, value)
          this.$set(this.formData, inputName, '')
          this.$set(this.formData, name, '')
        } else {
          this.$set(this.formData, inputName, value || '')
          if (!value) {
            this.$set(this.formData, name, '')
          } else {
            this.$set(this.formData, name, value)
          }
        }
        this.$emit('updateSearchData', { index, childType: e.childType, value: value || '' })
      } else if (type && type === 'SelectAnMultipleSelect') {
        if (e.childType === 'select') {
          this.$set(this.formData, selectName, value)
          this.$set(this.formData, inputName, [])
          this.$set(this.formData, name, '')
        } else {
          this.$set(this.formData, inputName, value || [])
          this.$set(this.formData, name, value || [])
        }
        this.$emit('updateSearchData', { index, childType: e.childType, value: value || [] })
        if (e.childType === 'input') {
          this.search()
        }
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
        if (
          type === 'MultipleSelectEle' ||
          type === 'SelectEle' ||
          type === 'ElcascaderEle' ||
          type === 'ATreeSelectCustom'
        ) {
          this.search()
        }
      }
      // if (index >= this.topShowCount) {
      //   this.allSelectTag(name, e, index, label)
      // }
    },
    // 所有折叠选项中已选中的值
    allSelectTag(name, e, index, label) {
      if (this.selectTagList.length <= 0) {
        this.searchData.forEach((x) => {
          this.selectTagList.push({
            name: x.name,
            type: x.type,
            label: x.label,
            title: undefined,
            value: undefined
          })
        })
        this.tagIndex = this.searchData.length
      }
      const { type, selectName, inputName } = e
      let value = this.formData[name]
      if (type === 'SelectAnInput' || type === 'SelectAnMultipleSelect') {
        value = this.formData[inputName]
      }
      if (!value || value.length <= 0) {
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            x.title = undefined
            x.value = undefined
          }
        })
        return
      }
      const {
        selectData,
        selectLabel,
        selectValue,
        mapValue,
        mapLabel,
        multiple,
        checkStrictly,
        selectList
      } = this.searchData[index]
      let title
      let obj = {}
      if (type === 'SelectEle') {
        selectData.forEach((x) => {
          if (value === x[selectValue]) {
            title = x[selectLabel]
          }
        })
        obj = { name, title, value, type, label }
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            this.selectTagList.splice(i, 1, obj)
          }
        })
      }
      if (type === 'MultipleSelectEle') {
        const children = selectData.filter((x) => value.indexOf(x[selectValue]) !== -1)
        title = children.map((x) => x[selectLabel]).join('、')
        obj = { name, title, label, value, type }
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            this.selectTagList.splice(i, 1, obj)
          }
        })
      }
      if (type === 'ATreeSelectCustom') {
        title = value.map((x) => x.label).join('、')
        obj = { name, title, label, value, type }
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            this.selectTagList.splice(i, 1, obj)
          }
        })
      }
      if (type === 'DatePickerEleShortcuts') {
        title =
          this.parseTime(value[0], this.fmtForYmd) + '-' + this.parseTime(value[1], this.fmtForYmd)
        obj = { name, title, value, type, label }
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            this.selectTagList.splice(i, 1, obj)
          }
        })
      }
      if (type === 'ElcascaderEle') {
        // console.log(this.searchData[index], '===')
        let ids = []
        if (checkStrictly && multiple === false) {
          ids = [value[value.length - 1]]
        } else {
          ids = value.map((item) => {
            return item[item.length - 1]
          })
        }

        const titleArr = []
        const findLabel = (data) =>
          data.forEach((x) => {
            if (ids.indexOf(x[mapValue]) !== -1) {
              titleArr.push(x[mapLabel])
            }
            if (x.children && x.children.length > 0) {
              findLabel(x.children)
            }
          })
        findLabel(selectData)
        title = titleArr.join('、')
        obj = { name, title, label, value, type }
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            this.selectTagList.splice(i, 1, obj)
          }
        })
      }
      if (type === 'SelectAnInput') {
        if (this.formData[selectName] && this.formData[inputName]) {
          selectData.forEach((x) => {
            if (this.formData[selectName] === x[selectValue]) {
              title = x[selectLabel] + ':' + this.formData[inputName]
            }
          })
        }

        obj = { name, title, value: title, type, label: '', selectName, inputName }
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            this.selectTagList.splice(i, 1, obj)
          }
        })
      }
      if (type === 'SelectAnMultipleSelect') {
        const row = this.searchData[index]
        if (
          this.formData[selectName] &&
          this.formData[inputName] &&
          this.formData[inputName].length > 0
        ) {
          let leftTitle
          selectData.forEach((x) => {
            if (row.selectId === x[selectValue]) {
              leftTitle = x[selectLabel]
            }
          })
          const children = row.selectData2.filter((x) => value.indexOf(x[row.selectValue2]) !== -1)
          title = leftTitle + ':' + children.map((x) => x[row.selectLabel2]).join('、')
        }
        obj = { name, title, value: title, type, label: '', selectName, inputName }
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            this.selectTagList.splice(i, 1, obj)
          }
        })
      }

      if (type === 'InputEle' || type === 'AutocompleteEle') {
        title = value
        obj = { name, title, value, type, label }
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            this.selectTagList.splice(i, 1, obj)
          }
        })
      }

      if (type === 'SelectInput') {
        title = selectList.map((x) => x[selectLabel]).join(',')
        obj = { name, title, value, type, label }
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            this.selectTagList.splice(i, 1, obj)
          }
        })
      }
      setTimeout(() => {
        this.calcRate()
      }, 500)
    },
    closeTag(e) {
      const { name, type, inputName } = e
      this.selectTagList.forEach((x) => {
        if (x.name === name) {
          x.title = undefined
          x.value = undefined
        }
      })
      this.$set(this.formData, name, undefined)
      if (type === 'SelectAnInput') {
        this.$set(this.formData, inputName, '')
        const index = this.searchData.findIndex((x) => x.name === name)
        this.$emit('updateSearchData', { index, childType: 'input', value: '' })
      }
      if (type === 'SelectAnMultipleSelect') {
        this.$set(this.formData, inputName, '')
        const index = this.searchData.findIndex((x) => x.name === name)
        this.$emit('updateSearchData', { index, childType: 'input', value: '' })
      }
      if (type === 'SelectInput') {
        const index = this.searchData.findIndex((x) => x.name === name)
        this.searchData[index].callback('clear')
      }
      this.search()
      setTimeout(() => {
        this.calcRate()
      }, 500)
    },
    clickTag() {},
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
    },
    divResizeFn() {
      if (!this.dividerShow) return
      const searchBox = this.$refs.searchBox
      const searchBoxWidth = searchBox.clientWidth
      this.searchBoxWidth = searchBoxWidth
      this.selectWidth = searchBoxWidth - 500
      clearTimeout(this.drawTiming)
      if (this.runTime) {
        const nowTime = +new Date()
        if (nowTime - this.runTime > 500) {
          this.runTime = +new Date()
          this.calcRate()
        }
      }
      this.drawTiming = setTimeout(() => {
        this.runTime = +new Date()
        this.calcRate()
      }, 500)
    }
  }
}
</script>

<style lang="scss">
.top-row-content .search-content {
  .el-form-item:nth-child(1) {
    margin-right: 4px;
    .custom-input {
      .el-input__inner {
        // border-bottom-right-radius: 0;
        // border-top-right-radius: 0;
        // border-right: 0;
      }
    }
  }
}
</style>

<style scoped lang="scss">
.search-warp {
  // background-color: #61616110;
  // background-color: #99999910;
  padding-left: 8px;
  padding-right: 8px;
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
  border: 1px solid #99999940;
  // background-color: #fff;
  // border: 1px solid #99999940;

  .top-row-content {
    display: flex;
    justify-content: space-between;
    min-height: 30px;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}

.bottom-row {
  padding-top: 10px;
  border: 1px solid #99999940;
  padding-right: 0px;
}

.hide-border-top {
  border-top: 0;
}

.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tag {
  flex-shrink: 0;
}
.tag .tag-title {
  max-width: 200px;
  word-break: break-all;
}
</style>
