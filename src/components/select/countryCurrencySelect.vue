<template>
  <div>
    <div class="el-select w100" @click="handleClick" v-if="showInput">
      <div
        class="el-input el-input--suffix"
        :class="[{ 'is-disabled': disabled }, `el-input--${size}`]"
        :title="inputVal"
      >
        <input
          v-model="inputVal"
          type="text"
          readonly="readonly"
          autocomplete="off"
          placeholder
          class="el-input__inner"
          :disabled="disabled"
          :size="size"
        />
        <span class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i class="el-select__caret el-input__icon el-icon-arrow-up" />
          </span>
        </span>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      :title="$t('ui.currency')"
      :visible.sync="visible"
      width="1140px"
      :modal="true"
      :close-on-click-modal="false"
      @opened="dlgOpened"
    >
      <div class="clearErrColor">
        <search-form
          ref="searchForm"
          v-model="queryParams"
          :searchData="searchData"
          :handleQuery="handleSearchForm"
          :resetQuery="resetSearchForm"
          :showCustom="false"
          :showMenu="false"
        />
        <!-- <el-tooltip
        :disabled="tipVisible"
        :content="
          $t('ui.searchWords').replace(
            '$1',
            `${$t('countrySelect.currencyCode')} / ${$t('countrySelect.currencyDesc')}`
          )
        "
        placement="bottom-start"
        effect="light"
      >
        <el-input
          v-model="queryParams.condition"
          prefix-icon="el-icon-search"
          clearable
          class="dailog-search"
          size="small"
          :placeholder="$t('ui.search')"
          @input="getList"
          @focus="tipVisible = true"
          @blur="tipVisible = false"
        />
      </el-tooltip> -->
        <el-table
          border
          ref="tables"
          class="mt10"
          v-loading="loading"
          :data="tableList"
          @sort-change="handleSortChange"
          @row-click="handleRowDbclick"
          :row-class-name="'pointer'"
          :max-height="tableMaxHeight"
        >
          <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in visibleColumn"
            :key="item.prop + item.colSortIndex"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :show-overflow-tooltip="item.tooltip"
            :fixed="item.fixed"
            :sortable="item.sortable"
            :align="item.align || 'left'"
            header-align="center"
          >
            <template slot-scope="scope">
              <template>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :saveKey="saveKey"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="ghost" @click="visible = false">{{ $t('ui.back') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { queryCountryListBySelect } from '@/api/basic/basic'
import { queryCurrencyList } from '@/api/organization/corporate'
import pageMixin from '@/mixins/tableMinx'
import emitter from 'element-ui/src/mixins/emitter'

export default {
  mixins: [pageMixin, emitter],
  props: {
    value: {
      required: true,
      type: [String, Number],
      default: ''
    },
    disabled: [Boolean, String],
    // eslint-disable-next-line vue/require-default-prop
    currencyDesc: String,
    props: {
      type: String,
      default: 'currencyCode'
    },
    // eslint-disable-next-line vue/require-default-prop
    propsSelectedRow: Object,

    isCurrency: {
      // 是否当自作货币选择使用
      type: Boolean,
      default: true
    },
    currencyCodes: {
      required: false,
      type: Array,
      default: () => []
    },
    curPath: {
      type: [String],
      default: ''
    },
    showInput: {
      type: [Boolean],
      default: true
    }
  },
  data() {
    return {
      searchFormKey: Date.now(),
      loading: false,
      // 总条数
      total: 0,
      tableList: [],
      visible: false,
      selected: '',
      selectedRow: {},
      inputVal: '',
      isClickRow: false,
      saveKey: 'countryCurrencySelect',
      columns: [
        {
          prop: 'currencyCode',
          label: this.$t('countrySelect.currencyCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'currencySymbol',
          label: this.$t('countrySelect.currencySymbol'),
          visible: true,
          minWidth: 170,
          tooltip: true
        },
        {
          prop: 'currencyDesc',
          label: this.$t('countrySelect.currencyDesc'),
          visible: true,
          minWidth: 170,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('countrySelect.currencyCode')} / ${this.$t(
            'countrySelect.currencyDesc'
          )}`,
          type: 'InputEle'
        }
      ]
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  watch: {
    value: {
      handler: function (selected) {
        this.selected = selected
      }
    },
    selected(newVal, oldVal) {
      this.$emit('input', newVal)
      this.$emit('change', newVal)
      if (!newVal) {
        this.selectedRow = {}
        this.inputVal = ''
      } else {
        if (this.propsSelectedRow && !this.isClickRow) {
          this.selectedRow = this.propsSelectedRow
        } else {
          this.selectedRow = this.tableList.find((item) => {
            if (newVal.indexOf('(') > 0 && newVal.indexOf(')') > 0) {
              const tStr = (newVal + '').substring(newVal.indexOf('(') + 1, newVal.indexOf(')'))

              return item[this.props] === tStr.trim()
            } else {
              return item[this.props] === newVal.trim()
            }
          })
        }
      }
      if (this.selectedRow) {
        const { currencyDesc, currencyCode } = this.selectedRow
        if (this.isCurrency) {
          this.inputVal = currencyCode ? `${currencyCode} (${currencyDesc})` : ''
        } else {
          this.inputVal = this.selectedRow[this.props]
        }
      } else {
        if (newVal !== oldVal) {
          this.inputVal = newVal
        }
      }
      this.isClickRow = false
      if (newVal === undefined) return
      this.dispatch('ElFormItem', 'el.form.change', [newVal])
    },
    propsSelectedRow: {
      handler: function (newVal) {
        this.selectedRow = newVal
        const { currencyDesc, currencyCode } = this.selectedRow
        if (this.isCurrency) {
          this.inputVal = currencyCode ? `${currencyCode} (${currencyDesc})` : ''
        } else {
          this.inputVal = this.selectedRow[this.props]
        }
        if (newVal === undefined) return
        this.dispatch('ElFormItem', 'el.form.change', [newVal])
      },
      deep: true
    }
  },
  beforeCreate() {
    const locale = {
      zh: {
        countrySelect: {
          title: '货币选择',
          currencyCode: '货币代码',
          name: '国家/地区',
          currencySymbol: '货币符号',
          currencyDesc: '货币描述'
        }
      },
      en: {
        countrySelect: {
          title: 'Currency',
          currencyCode: 'Currency Code',
          name: 'Country',
          code: 'Countries and Regions Code',
          currencySymbol: 'Currency Symbol',
          currencyDesc: 'Currency Description'
        }
      }
    }
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)

    if (!this.isCurrency) {
      this.selected = this.value
      if (!this.value) {
        this.inputVal = ''
      } else {
        this.inputVal = `${this.props}`
      }
    } else {
      this.selected = this.value
      if (!this.selected) {
        this.inputVal = ''
      } else {
        // this.inputVal = `${this.currencyDesc} (${this.value})`;
        this.inputVal = this.selected
      }
    }
  },
  updated() {
    if (!this.isCurrency) {
      this.selected = this.value
      if (!this.value) {
        this.inputVal = ''
      } else {
        this.inputVal = `${this.value}`
      }
    } else {
      this.selected = this.value
      if (!this.selected) {
        this.inputVal = ''
      } else {
        // this.inputVal = `${this.currencyDesc} (${this.value})`;
        this.inputVal = this.selected
      }
    }
  },
  methods: {
    dlgOpened() {},

    handlePageSizeChangeAndSave(pageSize) {
      const vm = this
      vm.handlePageSizeChange(pageSize)
      vm.$$pageSizeSave('bpmCommonModule', 2, vm.curPath)
    },

    handleClick() {
      if (this.disabled) return
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.tableList = []
      this.getList()
    },

    handleRowDbclick(row) {
      this.selected = row[this.props]
      if (!this.isCurrency) {
        this.inputVal = `${row[this.props]}`
      } else {
        this.inputVal = `${row.currencyCode} (${row.currencyDesc})`
      }
      this.visible = false
      this.$emit('select', row)
      this.selectedRow = row
      this.isClickRow = true
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    },
    getList() {
      const vm = this
      const param = this.queryParams
      param.currencyCodes = vm.currencyCodes
      this.$trimOfObj(param)
      vm.loading = true
      queryCurrencyList(param)
        .then((response) => {
          console.log(response, '===')
          this.tableList = response.rows
          this.total = response.total
          this.loading = false
          if (vm.value) {
            vm.selected = vm.value
          }
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.clearErrColor ::v-deep .el-input__inner {
  border-color: #dcdfe6 !important;
}
</style>
