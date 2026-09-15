<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.address')"
    :visible.sync="visible"
    width="800px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
  >
    <template #title>
      <div>
        <svg-icon icon-class="warning" class="mr10" style="height: 20px; width: 20px" />
        <span style="font-size: 16px; font-weight: bold">{{
          $t('SALES.productsWithInsufficientStock')
        }}</span>
        <!-- 可添加按钮 -->
      </div>
    </template>
    <el-table border ref="tables" class="mt10" :data="tableList" :max-height="tableMaxHeight">
      <!-- <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column> -->
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
        <template slot-scope="scope">
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row.isActive"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'qty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'shortageQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <!-- <el-button
        type="ghost"
        v-if="isRevise !== '1'"
        :loading="submitLoading"
        @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}</el-button
      > -->
      <el-button type="primary" :loading="submitLoading" @click="submitForm">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  saveSalesQuotation,
  saveDraftSalesQuotation,
  reviseSalesQuotation
} from '@/api/salesManagement/salesQuotation'
export default {
  mixins: [pageMixin],
  props: {
    isRevise: {
      type: String
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '66',
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tableList: [],
      tableMaxHeightResize: true,
      selected: '',
      visible: false,
      // 列信息
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          fixedWidth: 180,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.quotedQty1'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'shortageQty',
          label: vm.$t('PRODUCT.shortageQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }
      ],
      submitLoading: false
    }
  },
  computed: {},
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleOpen(list, formParam) {
      this.formParam = formParam
      this.tableList = list
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      this.visible = true
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    submitForm(submitType) {
      let successMsg
      let submitFn
      if (submitType === 'save') {
        successMsg = this.$t('SALES.SQSaveSuccess')
        submitFn = saveDraftSalesQuotation
      } else {
        successMsg = this.$t('SALES.SQSubmitSuccess')
        submitFn = saveSalesQuotation
        if (this.isRevise === '1') {
          submitFn = reviseSalesQuotation
        }
      }
      this.submitLoading = true
      this.$emit('onSuccess', 'submitLoading')
      submitFn(this.formParam)
        .then((response) => {
          this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
          this.submitLoading = false
          this.handleBack()
          this.$emit('onSuccess', 'closePage')
        })
        .catch(() => {
          this.$emit('onSuccess', 'closeLoading')
          this.submitLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
</style>
