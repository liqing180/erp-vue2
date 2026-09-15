<template>
  <div>
    <div class="el-select w100" @click="handleClick">
      <div class="el-input el-input--suffix el-input--medium" :class="{ 'is-disabled': disabled }">
        <input
          v-model="nativeVal"
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
      v-transfer-dom
      :title="$t('businessPartnerSelect.title')"
      :visible.sync="visible"
      width="1100px"
      :modal="true"
      :close-on-click-modal="false"
    >
      <el-tooltip
        :disabled="tipVisible"
        :content="
          $t('ui.searchWords').replace(
            '$1',
            `${$t('businessPartnerSelect.companyName')} / ${$t('businessPartnerSelect.country')}`
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
          :max-height="tableMaxHeight"
          header-row-class-name="th-primary"
          highlight-current-row
          @row-click="handleRowClick"
          :row-class-name="'pointer'"
        >
          <el-table-column type="index" :label="$t('ui.sn')" :width="fitWidth">
            <template slot-scope="scope"
              ><span>{{ scope.$index + (curPage - 1) * pageSize + 1 }} </span></template
            >
          </el-table-column>
          <el-table-column
            prop="businessPartnerName"
            :label="$t('businessPartnerSelect.companyName')"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="businessPartnerNo"
            :label="$t('businessPartnerSelect.companyCode')"
          ></el-table-column>
          <el-table-column
            prop="country"
            :label="$t('businessPartnerSelect.country')"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="currency"
            :label="$t('businessPartnerSelect.currency')"
            show-overflow-tooltip
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
import { queryBusinessPartnerList } from '@/api/inventory/common'
import pageMixin from '@/mixins/tableMinx'

import snWidthMinx from '@/mixins/snWidthMinx'

import transferDom from '@/directives/transferDom'
import emitter from 'element-ui/src/mixins/emitter'

export default {
  directives: {
    transferDom
  },
  mixins: [pageMixin, emitter, snWidthMinx],
  props: {
    businessPartnerType: {
      // 客户类型, Customer,1 Vendor 供应商，2 Lead 潜在客户
      required: true,
      type: [String, Number]
    },
    own: {
      // 是否本公司, 1 是 0 否
      type: [String, Number]
    },
    value: {
      required: true
    },
    disabled: Boolean
  },
  data() {
    return {
      tableMaxHeightResize: true,
      condition: '',
      visible: false,
      selected: {
        id: '',
        name: ''
      }
    }
  },
  computed: {
    nativeVal() {
      return this.selected ? this.selected.name : ''
    }
  },
  watch: {
    value(selected) {
      this.selected = selected
    },
    selected: {
      // eslint-disable-next-line no-unused-vars
      handler: function (selected, oldVal) {
        this.$emit('input', selected)
        this.$emit('change', selected)
        if (selected === undefined) return
        this.dispatch('ElFormItem', 'el.form.blur', [this.selected])
      },
      deep: true
    }
  },
  beforeCreate() {
    const locale = {
      zh: {
        businessPartnerSelect: {
          title: '供应商',
          companyCode: '公司编号',
          companyName: '公司名称',
          country: '所在城市',
          currency: '货币'
        }
      },
      en: {
        businessPartnerSelect: {
          title: 'Business Partner Name',
          companyName: 'Business Partner Name',
          // companyCode: 'Company Code',
          companyCode: 'Business Partner No',
          country: 'Country',
          currency: 'Currency'
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
      const { id, businessPartnerName } = row
      this.selected = {
        name: businessPartnerName,
        id: id
      }
      this.visible = false
    },
    queryTableList() {
      const vm = this
      const param = {
        condition: vm.condition,
        pageNow: vm.curPage,
        pageSize: vm.pageSize,
        businessPartnerType: vm.businessPartnerType,
        own: vm.own
      }
      vm.table_loading = true
      queryBusinessPartnerList(param)
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
