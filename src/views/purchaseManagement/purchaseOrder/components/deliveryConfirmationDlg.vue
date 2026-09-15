<template>
  <el-dialog
    v-dialogDrag
    :title="$t('PURCHASE.deliveryConfirmation')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form ref="form" :model="form" :disabled="comDisFrom" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('PURCHASE.deliveryOrderNo1')}`" prop="deliveryOrderNo">
            <el-input
              v-model="form.deliveryOrderNo"
              :title="form.deliveryOrderNo"
              maxlength="100"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="`${$t('PURCHASE.receivedDate')}`" prop="receivedTime">
            <el-date-picker
              v-model="form.receivedTime"
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
          <el-form-item :label="`${$t('ui.attachment')}`">
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
          <span v-if="['receiptQtyThisTime'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>

          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'receiptQtyThisTime'">
            <template v-if="!comDisFrom">
              <el-input-number
                style="width: 96%"
                v-model="scope.row.receiptQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.qtyLimit"
                v-if="scope.row.isExpenseItem === '1'"
              />
              <el-input-number
                v-else
                style="width: 98%"
                v-thousandSplit="{ precision: scope.row.decimalNum || 0 }"
                v-model="scope.row.receiptQtyThisTime"
                controls-position="right"
                :precision="scope.row.decimalNum || 0"
                :min="0"
                :max="scope.row.maxQty"
              />
            </template>

            <span v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
          </template>
          <template v-else-if="item.prop === 'pendingReceiptQty'">
            <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
          </template>
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
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
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
  </el-dialog>
</template>

<script>
import {
  confirmDeliverySubmit,
  queryCanConfirmDeliveryMsg
} from '@/api/purchaseManagement/purchaseOrder'
import pageMixin from '@/mixins/tableMinx'

export default {
  mixins: [pageMixin],
  components: {},
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        deliveryOrderNo: [
          {
            required: false,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        receivedTime: [
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
          prop: 'purchaseRequisiteNo',
          label: vm.$t('PURCHASE.purchaseRequisiteNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
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
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          minWidth: 180,
          visible: true,
          tooltip: false
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'pendingReceiptQty',
          label: vm.$t('PURCHASE.unreceivedQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'receiptQtyThisTime',
          label: vm.$t('PURCHASE.receiveQty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          fixedWidth: 200,
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
      return false
    }
  },
  beforeCreate() {},
  methods: {
    handleOpen() {
      this.reset()
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.queryCanConfirmDeliveryMsg()
      this.visible = true
    },
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
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
          case 'receiptQtyThisTime':
            item.fixedWidth = vm.comDisFrom ? undefined : 250
            break
        }
      })
    },
    queryCanConfirmDeliveryMsg() {
      queryCanConfirmDeliveryMsg({
        purchaseOrderId: this.formData.purchaseOrderId
      }).then((res) => {
        const data = res.data || {}
        this.form = data
        const tableList = data.confirmDeliveryDetailList || []
        let timer = Date.now()
        tableList.forEach((item) => {
          timer++
          item.rowTimeId = timer
          item.receiptQtyThisTime = item.pendingReceiptQty
          if (item.serviceSurchargeList) {
            item.serviceSurchargeList.forEach((child) => {
              child.isExpenseItem = '1'
              child.parentRowTimeId = item.rowTimeId
              child.productName = child.expenseItemName
              timer++
              child.rowTimeId = timer
            })
          }
        })

        // tableList.forEach((x) => {
        //   x.receiptQtyThisTime = x.pendingReceiptQty
        // })
        this.tableList = tableList
        if (!this.form.receivedTime) {
          this.$set(this.form, 'receivedTime', Date.now())
        }

        this.resetSnNum(this.tableList)
        const allList = []
        this.tableList.forEach((item) => {
          allList.push(item)
          if (item.serviceSurchargeList) {
            item.serviceSurchargeList.forEach((child) => {
              allList.push({
                ...child,
                productName: child.expenseItemName,
                receivedQty: child.qty
              })
            })
            allList.push(...item.serviceSurchargeList)
          }
        })
        this.$$getColumnContentMaxWidth(this.columns, allList)
        if (this.comDisFrom) {
          setTimeout(() => {
            this.$refs.uploadRef && this.$refs.uploadRef.initFileList(data.commonFileList)
          }, 300)
        }
      })
    },
    reset() {
      this.form = {
        receivedTime: Date.now()
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
        receivedTime: undefined,
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
    openRequiredByTable() {},
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
            ...vm.form
          }
          const fileIds = vm.$refs.uploadRef.getFileIds()
          if (fileIds === false) {
            return
          }
          param.commonFileList = fileIds

          // 检查树形结构中 receiptQtyThisTime 不为空
          if (!this.checkReceiptQtyNotEmpty(this.tableList)) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.receiveQty'))
            )
            return
          }
          // 检查至少有一个 receiptQtyThisTime > 0
          if (!this.checkReceiptQtyNotAllZero(this.tableList)) {
            this.$modal.msgError(this.$t('PURCHASE.cannotAllBeZero'))
            return
          }
          param.confirmDeliveryDetailList = this.tableList
          vm.fullscreenLoading = true
          confirmDeliverySubmit(param)
            .then((res) => {
              if (res.code === 200) {
                vm.$modal.msgSuccess(vm.$t('PURCHASE.submitSuccess'))
                vm.$emit('onSuccess')
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
    // 递归检查树形结构中 receiptQtyThisTime 不为空
    checkReceiptQtyNotEmpty(list) {
      for (const item of list) {
        console.log(item.receiptQtyThisTime, '===============406')
        if (!this.$resultOfBoolean(item.receiptQtyThisTime)) {
          return false
        }
        // if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
        //   if (!this.checkReceiptQtyNotEmpty(item.serviceSurchargeList)) {
        //     return false
        //   }
        // }
      }
      return true
    },
    // 递归检查树形结构中至少有一个 receiptQtyThisTime > 0
    checkReceiptQtyNotAllZero(list) {
      for (const item of list) {
        if (item.receiptQtyThisTime > 0) {
          return true
        }
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          if (this.checkReceiptQtyNotAllZero(item.serviceSurchargeList)) {
            return true
          }
        }
      }
      return false
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
