<template>
  <div>
    <div class="el-select w100" @click="handleClick">
      <div class="el-input el-input--suffix el-input--medium" :class="{ 'is-disabled': disabled }">
        <input
          v-model="inputVal"
          type="text"
          readonly="readonly"
          autocomplete="off"
          placeholder
          class="el-input__inner"
          :disabled="disabled"
        />
        <span class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
          </span>
        </span>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      :title="$t('countrySelect.title')"
      :visible.sync="visible"
      width="1140px"
      :modal="true"
      :close-on-click-modal="false"
    >
      <el-tooltip
        :disabled="tipVisible"
        :content="
          $t('ui.searchWords').replace(
            '$1',
            `${$t('countrySelect.currencyDesc')} / ${$t('countrySelect.name')}`
          )
        "
        placement="bottom-start"
        effect="light"
      >
        <el-input
          v-model="condition"
          prefix-icon="el-icon-search"
          clearable
          class="dailog-search"
          size="small"
          :placeholder="$t('ui.search')"
          @input="handleSearch"
          @focus="tipVisible = true"
          @blur="tipVisible = false"
        ></el-input>
      </el-tooltip>
      <div class="clearfix">
        <el-table
          ref="purchaseTable"
          v-loading="table_loading"
          :data="tableData"
          stripe
          border
          class="w100"
          header-row-class-name="th-primary"
          show-overflow-tooltip
          highlight-current-row
          :max-height="tableMaxHeight"
          @row-click="handleRowClick"
          :row-class-name="'pointer'"
        >
          <el-table-column type="index" :label="$t('ui.sn')" :width="fitWidth" fixed="left">
            <template slot-scope="scope"
              ><span>{{ scope.$index + (curPage - 1) * pageSize + 1 }} </span></template
            >
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('countrySelect.name')"
            fixed="left"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="currencyCode"
            :label="$t('countrySelect.currencyCode')"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="currencySymbol"
            :label="$t('countrySelect.currencySymbol')"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="currencyDesc"
            :label="$t('countrySelect.currencyDesc')"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
        <el-pagination
          class="fr mt10"
          :current-page.sync="curPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="ghost" @click="visible = false">{{ $t('ui.back') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryCountryList } from '@/api/inventory/common'
// tableMinxs 改为 tableMinx
import pageMixin from '@/mixins/tableMinx'
import snWidthMinx from '@/mixins/snWidthMinx'
import emitter from 'element-ui/src/mixins/emitter'

export default {
  mixins: [pageMixin, emitter, snWidthMinx],
  props: {
    value: {
      required: true,
      type: [String, Number],
      default: ''
    },
    disabled: Boolean,
    currencyDesc: String,
    props: {
      type: String,
      default: 'currencyCode'
    },
    propsSelectedRow: Object
  },
  data() {
    return {
      tableMaxHeightResize: true,
      condition: '',
      visible: false,
      selected: '',
      selectedRow: {},
      inputVal: '',
      isClickRow: false
    }
  },
  watch: {
    value: {
      handler: function (selected) {
        this.selected = selected
      }
    },
    // eslint-disable-next-line no-unused-vars
    selected(newVal, oldVal) {
      this.$emit('input', newVal)
      this.$emit('change', newVal)
      if (!newVal) {
        this.selectedRow = {}
        this.inputVal = ''
      } else {
        this.selectedRow =
          this.propsSelectedRow && !this.isClickRow
            ? this.propsSelectedRow
            : this.tableData.find((item) => item[this.props] === newVal)
      }
      if (this.selectedRow) {
        const { currencyDesc, currencyCode } = this.selectedRow
        this.inputVal = currencyCode ? `${currencyCode} (${currencyDesc})` : ''
      }
      this.isClickRow = false
      if (newVal === undefined) return
      this.dispatch('ElFormItem', 'el.form.change', [newVal])
    },
    propsSelectedRow: {
      handler: function (newVal) {
        this.selectedRow = newVal
        const { currencyDesc, currencyCode } = this.selectedRow
        this.inputVal = currencyCode ? `${currencyCode} (${currencyDesc})` : ''
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
          name: '国家',
          currencySymbol: '货币符号',
          currencyDesc: '货币描述'
        }
      },
      en: {
        countrySelect: {
          title: 'Currency',
          currencyCode: 'Currency Code',
          name: 'Country',
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
    this.queryTableList()
    this.selected = this.value
    if (!this.currencyDesc || !this.value) {
      this.inputVal = ''
    } else {
      this.inputVal = `${this.currencyDesc} (${this.value})`
    }
  },
  updated() {
    this.selected = this.value
    if (!this.currencyDesc || !this.value) {
      this.inputVal = ''
    } else {
      this.inputVal = `${this.currencyDesc} (${this.value})`
    }
  },
  methods: {
    handleClick() {
      this.condition = ''
      if (this.disabled) return
      this.visible = true
      this.curPage = 1
      this.pageSize = 10
      this.queryTableList()
    },
    handleRowClick(row) {
      this.selected = row[this.props]
      this.inputVal = `${row.currencyCode} (${row.currencyDesc})`
      this.visible = false
      this.$emit('select', row)
      this.selectedRow = row
      this.isClickRow = true
    },
    queryTableList() {
      const vm = this

      const param = {
        condition: vm.condition,
        pageNow: vm.curPage,
        pageSize: vm.pageSize
      }
      vm.table_loading = true
      queryCountryList(param)
        .then((res) => {
          const { data } = res
          vm.table_loading = false
          vm.pageSizeChange = false
          if (data.status === 200) {
            const results = data.msg

            const { pageNum, pageSize, total, list } = results
            vm.curPage = pageNum
            vm.totalPage = total
            vm.pageSize = pageSize
            vm.tableData = list
            if (vm.value) {
              vm.selected = vm.value
            }
          } else {
            vm.$modal.msgError(data.message)
          }
        })
        .catch((err) => {
          vm.table_loading = false
          window.console.error(err)
        })
    }
  }
}
</script>
