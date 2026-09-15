<template>
  <el-dialog
    v-dialogDrag
    :title="$t('POAck.confirm')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form ref="form" :model="form" :disabled="comDisFrom" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('POAck.operator')}`" prop="operatorBy">
            <el-input :value="form.operatorBy" :title="form.operatorBy" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="`${$t('POAck.time')}`">
            <el-date-picker
              v-model="form.operatorTime"
              type="datetime"
              :format="fmtForYmdhms"
              :style="{ width: '100%' }"
              placeholder
              disabled
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('POAck.acknowledgedBy')}`" prop="acknowledgedBy">
            <SelectInput
              :value="form.acknowledgedBy"
              :title="form.acknowledgedBy"
              @clear="acknowledgedByClear"
              clearable
              @click="openRequiredByTable"
              :disabled="comDisFrom"
              class="form-wd"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="`${$t('POAck.dateAcknowledged')}`" prop="acknowledgedTime">
            <el-date-picker
              v-model="form.acknowledgedTime"
              :picker-options="PickerOptions"
              :editable="false"
              type="date"
              :format="fmtForYmd"
              :style="{ width: '100%' }"
              placeholder
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
            <MyInput
              type="textarea"
              v-model="form.remarks"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`" required>
            <myUpload ref="uploadRef" :limit="9" :disabled="comDisFrom" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      border
      ref="tables"
      :data="tableList"
      :row-key="rowIdKey"
      default-expand-all
      :tree-props="{ children: 'serviceSurchargeList', hasChildren: 'hasChildren' }"
      v-if="editRow.productType === '2'"
      v-table-tab
    >
      <el-table-column
        v-if="false"
        type="selection"
        key="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
        class-name="allowDrag"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.snNum }}</span>
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
          <span v-if="['receiptQty'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <div v-else-if="['legalEntityLineTotal'].includes(item.prop)">
            <span>{{ column.label }}</span>
            <span v-if="legalEntityInfo.currencySymbol"
              >({{ legalEntityInfo.currencySymbol }})</span
            >
          </div>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'receiptQty'">
            <el-input-number
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              style="width: 98%"
              v-model="scope.row.receiptQty"
              controls-position="right"
              :precision="scope.row.decimalNum"
              :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
              :max="scope.row.productId ? scope.row.purchaseQty : scope.row.qtyLimit"
              :disabled="comDisFrom"
            />
          </template>
          <!-- <template v-else-if="item.prop === 'purchaseUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template> -->
          <template v-else-if="item.prop === 'productName'">
            <span v-if="scope.row.productId">{{ scope.row[item.prop] }}</span>
            <span v-if="!scope.row.productId">{{ scope.row.expenseItemName }}</span>
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <span v-if="scope.row.productId" :title="showUomLabel(scope.row[item.prop])">{{
              scope.row[item.prop]
            }}</span>
            <span v-if="!scope.row.productId" :title="showUomLabel(scope.row.unit)">{{
              scope.row.unit
            }}</span>
          </template>
          <template v-else-if="item.prop === 'legalEntityLineTotal'">
            {{ $numberStr(scope.row[item.prop], 6, false, 2) }}
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        v-if="!comDisFrom"
        :loading="fullscreenLoading"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}</el-button
      >
    </div>

    <selectRequiredByTable ref="selectRequiredByTable" @update="updateRequiredBy" />
  </el-dialog>
</template>

<script>
import {
  acknowledgedServiceProduct,
  queryServiceProductAcknowledgedMsg
} from '@/api/purchaseManagement/purchaseOrder'
import locale from './locale'
import selectRequiredByTable from './selectRequiredByTable.vue'
import pageMixin from '@/mixins/tableMinx'

export default {
  mixins: [pageMixin],
  components: { selectRequiredByTable },
  props: {},
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        acknowledgedBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        acknowledgedTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      PickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      editRow: {},
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'receiptQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          fixedWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      tableList: [],
      rowIdKey: 'rowTimeId'
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comDisFrom() {
      return this.editRow.serviceStockInStatus !== '1'
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    handleOpen(row) {
      this.editRow = row
      if (this.editRow.serviceStockInStatus === '2') {
        this.byIdReset()
        this.queryServiceProductAcknowledgedMsg()
      } else {
        this.reset()
      }
      if (this.editRow.productType === '2') {
        this.tableList = [JSON.parse(JSON.stringify(this.editRow))]
        this.resetSnNum(this.tableList)

        // this.initColumnWidth()
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      }
      console.log(this.tableList, '==============287')
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.visible = true
    },
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
        if (!item.receiptQty) {
          this.$set(item, 'receiptQty', item.productId ? item.purchaseQty : item.qty)
        }
        item.snNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          this.resetSnNum(item.serviceSurchargeList, item.snNum)
        }
      })
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'receiptQty':
            item.fixedWidth = vm.comDisFrom ? undefined : 250
            break
        }
      })
    },
    queryServiceProductAcknowledgedMsg() {
      queryServiceProductAcknowledgedMsg({
        purchaseOrderDetailId: this.editRow.purchaseOrderDetailId
      }).then((res) => {
        const data = res.data || {}
        this.form = data
        if (this.editRow.productType === '2') {
          this.tableList = data.purchaseOrderDetail ? [data.purchaseOrderDetail || {}] : []

          let timer = Date.now()
          this.tableList.forEach((item) => {
            item[this.rowIdKey] = item.productId
            if (item.serviceSurchargeList) {
              item.serviceSurchargeList.forEach((child) => {
                if (!child[this.rowIdKey]) {
                  child.lineTotal = undefined
                  child.qty = undefined
                  timer++
                  child[this.rowIdKey] = timer
                }
              })
            }
          })
          this.resetSnNum(this.tableList)
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          this.$$initColumnVisible(this.saveKey, this.columns)
        }
        setTimeout(() => {
          this.$refs.uploadRef && this.$refs.uploadRef.initFileList(data.commonFileList)
        }, 300)
      })
    },
    reset() {
      this.form = {
        operatorBy: this.$store.state.user.nickName,
        operatorTime: Date.now(),
        acknowledgedBy: this.$store.state.user.nickName,
        acknowledgedId: this.$store.state.user.userId,
        acknowledgedTime: Date.now(),
        remarks: undefined
      }
      this.tableList = []
      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      }, 300)
      this.resetForm('form')
    },
    byIdReset() {
      this.form = {
        operatorBy: undefined,
        operatorTime: undefined,
        acknowledgedBy: undefined,
        acknowledgedId: undefined,
        acknowledgedTime: undefined,
        remarks: undefined
      }
      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      }, 300)
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    close() {
      this.reset()
    },
    openRequiredByTable() {
      this.$refs.selectRequiredByTable.handleOpen()
    },
    acknowledgedByClear() {
      this.$set(this.form, 'acknowledgedBy', undefined)
      this.$set(this.form, 'acknowledgedId', undefined)
    },
    updateRequiredBy(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'acknowledgedBy', nickName)
      this.$set(this.form, 'acknowledgedId', userId)
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          const param = {
            ...vm.editRow,
            ...vm.form
          }
          const fileIds = vm.$refs.uploadRef.getFileIds({ required: true })
          if (fileIds === false) {
            return
          }
          param.commonFileList = fileIds

          if (this.editRow.productType === '2') {
            // 检查树形结构中 receiptQty 不为空
            if (!this.checkReceiptQtyNotEmpty(this.tableList)) {
              this.$modal.msgError(
                this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty'))
              )
              return
            }
            param.purchaseOrderDetail = this.tableList[0]
          }
          vm.fullscreenLoading = true
          acknowledgedServiceProduct(param)
            .then((res) => {
              if (res.code === 200) {
                vm.$modal.msgSuccess(vm.$t('POAck.submitSuccess').replace('$1', param.productName))
                vm.$emit('submitSuccess')
                vm.back()
              }
              setTimeout(() => {
                vm.fullscreenLoading = false
              }, 2000)
            })
            .catch(() => {
              vm.fullscreenLoading = false
            })
        }
      })
    },
    // 递归检查树形结构中 receiptQty 不为空
    checkReceiptQtyNotEmpty(list) {
      for (const item of list) {
        if (!item.receiptQty || item.receiptQty === '') {
          return false
        }
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          if (!this.checkReceiptQtyNotEmpty(item.serviceSurchargeList)) {
            return false
          }
        }
      }
      return true
    }
  }
}
</script>

<style lang="scss">
.el-select-group__title .option-title-box {
  display: flex;
  flex-direction: row;
  // background-color: #aaaaaa;
  font-weight: bold;
  // color: #000000;
  color: #606266;
  font-size: 14px;
  margin-left: -20px;
  text-align: left;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .option-title-a {
    width: 85px;
  }
  .option-title-b {
    padding-left: 3px;
    padding-right: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 120px;
  }
  .option-title-c {
    width: 85px;
  }
}
</style>
<style scoped lang="scss">
.return-gp-box .el-select-dropdown__item {
  height: auto;
  white-space: wrap;
  overflow: auto;
  text-overflow: none;
}

.op-list {
  display: flex;
  flex-direction: row;
  text-align: left;
  margin-left: -20px;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .op-list-a {
    width: 85px;
  }
  .op-list-b {
    padding-left: 3px;
    padding-right: 3px;
    word-break: break-all;
    white-space: normal;
  }
  .op-list-c {
    width: 85px;
  }
}
</style>
