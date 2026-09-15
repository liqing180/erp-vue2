<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('SALES.return')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-table
      border
      ref="tables"
      :data="tableList"
      :max-height="tableMaxHeight"
      @sort-change="handleSortChange"
      v-loading="btnLoading"
      v-table-tab
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in visibleColumn"
        :key="item.prop + item.colSortIndex"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="getMinWidth(item)"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot="header" slot-scope="{ column }">
          <span v-if="['returnQty'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'returnQty'">
            <el-input-number
              style="width: 98%"
              v-model="scope.row.returnQty"
              controls-position="right"
              :precision="scope.row.decimalNum"
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              :min="0"
              :max="scope.row.balanceQty"
            />
          </template>
          <template v-else-if="item.prop === 'qty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'returnedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'balanceQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              maxlength="200"
            />
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        :disabled="tableList.length <= 0"
        :loading="btnLoading"
        @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import locale from '@/views/productManagement/lang/index'
import pageMixin from '@/mixins/tableMinx'
import {
  queryStoreIssueChitById,
  returnStoreIssueChit
} from '@/api/projectManagement/storeIssueChit'
export default {
  name: 'returnDlg',
  mixins: [pageMixin],
  props: {
    warehouseId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '17',
      savePath: 'projectMDlg',
      loading: false,
      rowIdKey: 'productId',
      tableList: [],
      visible: false,
      columns: [
        {
          prop: 'warehouseName',
          label: vm.$t('SALES.warehouse'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.sicQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('SALES.returnedQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'balanceQty',
          label: vm.$t('SALES.balanceQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnQty',
          label: vm.$t('SALES.qty'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixedWidth: 150
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          fixedWidth: 150
        }
      ],
      form: {},
      btnLoading: false
    }
  },

  computed: {},
  watch: {},
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleAdd(row) {
      this.visible = true
      const { storeIssueChitId, storeIssueChitNo } = row
      this.$set(this.form, 'storeIssueChitId', storeIssueChitId)
      this.$set(this.form, 'storeIssueChitNo', storeIssueChitNo)
      this.getList()
    },
    getList() {
      const vm = this
      this.loading = true
      queryStoreIssueChitById({ storeIssueChitId: this.form.storeIssueChitId })
        .then((response) => {
          this.loading = false
          const { storeIssueChitProductList } = response.data
          this.tableList = storeIssueChitProductList.filter((x) => x.balanceQty && x.balanceQty > 0)
          this.tableList.forEach((x) => this.$set(x, 'remarks', ''))
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.form = {
        storeIssueChitId: undefined,
        storeIssueChitNo: undefined
      }
      this.tableList = []
    },
    submit() {
      const qty = this.tableList.find((x) => !this.$resultOfBoolean(x.returnQty))
      if (qty) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('PRODUCT.qty')))
        return false
      }
      const qtyZero = this.tableList.find((x) => x.returnQty > 0)
      if (!qtyZero) {
        this.$modal.msgError(this.$t('PRODUCT.returnZero'))
        return false
      }
      if (this.btnLoading) return
      this.btnLoading = true
      this.$modal
        .confirm(this.$t('SALES.returnConfirm'))
        .then(() => {
          const params = {
            storeIssueChitProductList: this.tableList,
            storeIssueChitId: this.form.storeIssueChitId
          }
          return returnStoreIssueChit(params)
        })
        .then((response) => {
          this.btnLoading = false
          this.handleBack()
          this.$emit('onSuccess')
          if (response.data === '0') {
            this.$modal.msgSuccess(this.$t('SALES.returnSuccess'))
            setTimeout(() => {
              this.$modal.msgError(this.$t('SALES.printingFailed'))
            }, 100)
          } else if (response.data) {
            this.$modal.msgSuccess(this.$t('SALES.returnSuccess'))
            window.open(response.data, 'print')
          } else {
            this.$modal.msgSuccess(this.$t('SALES.returnSuccess'))
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
