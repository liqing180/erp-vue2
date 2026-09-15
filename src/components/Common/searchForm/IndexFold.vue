<template>
  <div class="mb8" ref="searchBox" v-resize="divResizeFn">
    <el-form :inline="true" ref="ruleForm" @submit.native.prevent>
      <div class="search-warp top-row">
        <div class="search-content-warp">
          <div class="search-content">
            <div class="w100 top-row-content">
              <div
                class="flexStart"
                :style="{ width: selectWidth + 'px' }"
                ref="leftBox"
                :key="timeStamp"
              >
                <el-form-item style="flex-shrink: 0" v-if="showMenu">
                  <span style="font-weight: bold; font-size: 16px">{{
                    getMenuTitle(menuTitle)
                  }}</span>
                </el-form-item>
                <div class="flex-1" style="word-break: break-all">
                  <ul class="flexCen" ref="selectTag" v-loading="loading">
                    <template v-if="!isAll && dividerShow">
                      <li
                        v-for="(item, index) in selectTagList.slice(0, tagIndex)"
                        :key="item.name"
                        :ref="'li_' + index"
                      >
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
                  >
                  </component>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="search-btn" style="flex-shrink: 0" v-if="isBtn || dividerShow">
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
              @click="isAllChange"
              >{{ isAll ? $t('ui.minimise') : $t('ui.expand') }}
            </el-button>
          </el-form-item>
        </div>
        <div class="flexEnd">
          <slot></slot>
        </div>
      </div>
      <div class="search-warp" v-show="isAll && dividerShow">
        <div class="search-content-warp">
          <div class="search-content">
            <el-form-item
              v-for="(item, index) in searchData.slice(topShowCount)"
              :key="index"
              :label="item.label"
              :label-width="maxTextWidth + 'px'"
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
    SelectAnMultipleSelect
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
    },
    width: {
      type: [Number, String]
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
        huge: 16,
        large: 16,
        default: 14,
        medium: 14,
        small: 14,
        mini: 14
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
    'value.pageSize': function (newVal, oldVal) {
      this.$set(this.formData, 'pageSize', newVal)
    },
    'value.pageNum': function (newVal, oldVal) {
      this.$set(this.formData, 'pageNum', newVal)
    },
    searchData: {
      immediate: true,
      handler: function () {
        this.initFormLabelWidth()
      }
    }
  },
  created() {},
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
        // this.calcRate()
        this.divResizeFn()
      }, 100)
    }
  },
  mounted() {
    // 处理搜索条件有默认值时的折叠数据
    setTimeout(() => {
      const { pageNum, pageSize, ...params } = this.value
      for (const key in params) {
        if (params[key]) {
          this.searchData.forEach((x, i) => {
            if (x.name === key) {
              x.value = params[key]
              this.allSelectTag(x.name, x, i, x.label)
            }
          })
        }
      }
    }, 1000)
  },
  methods: {
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
          weight: 'bold'
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
          // this.calcRate()
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
      const { pageNum, pageSize } = this.formData
      this.formData = { pageNum, pageSize }
      this.resetQuery()
      this.selectTagList = []
      this.tagIndex = 0
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
            this.$set(this.formData, name, this.formData.selectId + ':' + value)
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
      if (this.topShowCount === 0 || index !== 0) {
        this.allSelectTag(name, e, index, label)
      }
    },
    // 所有折叠选项中已选中的值
    allSelectTag(name, e, index, label) {
      // debugger
      // console.log(name, e, index, label)
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
      const { type, value, selectName, inputName } = e
      if (!value || value.length <= 0) {
        this.selectTagList.forEach((x, i) => {
          if (x.name === name) {
            x.title = undefined
            x.value = undefined
          }
        })
        return
      }
      const { selectData, selectLabel, selectValue, mapValue, mapLabel, multiple, checkStrictly } =
        this.searchData[index]
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
        if (this.formData[name]) {
          selectData.forEach((x) => {
            if (this.formData[selectName] === x[selectValue]) {
              title = x[selectLabel] + ':' + this.formData[inputName]
            }
          })
          obj = { name, title, value: title, type, label: '', selectName, inputName }
          this.selectTagList.forEach((x, i) => {
            if (x.name === name) {
              this.selectTagList.splice(i, 1, obj)
            }
          })
        }
      }
      if (type === 'SelectAnMultipleSelect') {
        const row = this.searchData[index]
        if (this.formData[name] && this.formData[name].length > 0) {
          let leftTitle
          selectData.forEach((x) => {
            if (row.selectId === x[selectValue]) {
              leftTitle = x[selectLabel]
            }
          })
          const children = row.selectData2.filter((x) => value.indexOf(x[row.selectValue2]) !== -1)
          title = leftTitle + ':' + children.map((x) => x[row.selectLabel2]).join('、')
          obj = { name, title, value: title, type, label: '', selectName, inputName }
          this.selectTagList.forEach((x, i) => {
            if (x.name === name) {
              this.selectTagList.splice(i, 1, obj)
            }
          })
        }
      }

      if (type === 'InputEle') {
        title = value
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
      const { name, type, inputName, selectName } = e
      this.selectTagList.forEach((x) => {
        if (x.name === name) {
          x.title = undefined
          x.value = undefined
        }
      })
      this.$set(this.formData, name, undefined)
      if (type === 'SelectAnInput') {
        this.$set(this.formData, selectName, '')
        this.$set(this.formData, inputName, '')
        const index = this.searchData.findIndex((x) => x.name === name)
        this.$emit('updateSearchData', { index, childType: 'all', value: '' })
      }
      if (type === 'SelectAnMultipleSelect') {
        this.$set(this.formData, selectName, '')
        this.$set(this.formData, inputName, '')
        const index = this.searchData.findIndex((x) => x.name === name)
        this.$emit('updateSearchData', { index, childType: 'all', value: '' })
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
      this.selectWidth = searchBoxWidth - 650
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
