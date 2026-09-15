<template>
  <el-dialog
    v-dialogDrag
    :title="$t('uiBtn.print')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" label-width="120px" class="mr20" :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.emergencyGoodsReceiptNo')}`">
            <el-input
              :value="tableList.length > 0 ? tableList[0].emergencyGoodsReceiptNo : ''"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.supplier')}`">
            <el-input
              :value="tableList.length > 0 ? tableList[0].businessPartnerName : ''"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('uiBtn.print')}`"
            prop="printerCode"
            class="printer"
            :rules="[
              {
                required: true,
                message: $t('ui.reqMsg'),
                trigger: ['change']
              }
            ]"
          >
            <el-select
              v-model="form.printerCode"
              placeholder
              style="width: 100%"
              class="input"
              clearable
            >
              <el-option
                v-for="item in printerDeviceList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10">
      <right-toolbar
        ref="rightToolbar"
        :saveKey="saveKey"
        :savePath="savePath"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        :showRefreshBtn="false"
        @queryTable="queryTable"
        :columns="configCurColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table border ref="tables" :data="tableList" max-height="600" class="mt10" v-table-tab>
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in visibleCurColumns"
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
          <span
            v-if="
              ['packagingQty', 'inventoryControlMode', 'printMethod', 'qcResult'].includes(
                item.prop
              )
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'packagingQty'">
            <template>
              <el-input-number
                style="width: 96%"
                v-model="scope.row.packagingQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="
                  scope.row.logisticsDocumentNo ? 0 : scope.row.includeDecimal === '1' ? 0.001 : 1
                "
                :max="scope.row.balanceReceivedQty"
                :disabled="
                  !scope.row.balanceReceivedQty ||
                  scope.row.balanceReceivedQty <= 0 ||
                  !['1', '2'].includes(scope.row.goodsReceivedNoteStatus)
                "
                @change="inputNumberChange(scope.row)"
              />
            </template>
          </template>
          <template v-else-if="item.prop === 'inventoryControlMode'">
            <el-select
              v-model="scope.row.inventoryControlMode"
              placeholder=""
              style="width: 96%"
              @change="inventoryControlModeChange(scope.row)"
              v-if="scope.row.labelType === '0'"
            >
              <el-option
                v-for="item in dict.type.inventory_control_mode"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.prop === 'printMethod'">
            <el-select
              v-model="scope.row.printMethod"
              placeholder=""
              style="width: 96%"
              v-if="scope.row.labelType === '0'"
            >
              <el-option
                v-for="item in dict.type.ivt_print_method"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.prop === 'qcResult'">
            <!-- rmaType: 1返修 2退款 3退换 4只换不退 8补货(已拒收) 6退款不退货 9拒收 -->
            <el-select
              v-model="scope.row.qcResult"
              placeholder=""
              style="width: 96%"
              :disabled="
                ['1'].indexOf(scope.row.rmaType) !== -1 ||
                !scope.row.balanceReceivedQty ||
                scope.row.balanceReceivedQty <= 0
              "
              v-if="
                scope.row.rmaType && ['9', '5', '2', '3', '1'].indexOf(scope.row.rmaType) !== -1
              "
            >
              <el-option
                v-for="item in [
                  { label: $t('STOCKIN.qualified'), value: '1' },
                  { label: $t('STOCKIN.failed'), value: '2' }
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.prop === 'qty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'balanceReceivedQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'receivedQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'qtyToReject'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'replacedQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <!-- <template v-else-if="item.prop === 'productName'">
            <div class="flexStart">
              <span class="flow1" :title="scope.row[item.prop]">{{ scope.row[item.prop] }}</span>
              <svg-icon
                icon-class="noLabel"
                class="no-label"
                v-if="scope.row.labelType === '1' && scope.row.nonInventoryItem !== '1'"
              />
            </div>
          </template> -->
          <template v-else-if="item.prop === 'productName'">
            <el-popover
              trigger="hover"
              placement="top"
              :disabled="!(scope.row.description || '').trim()"
              :open-delay="400"
            >
              <div class="desc-tooltip">
                <div
                  v-if="scope.row.description"
                  style="line-height: 20px; white-space: pre-wrap; word-break: break-word"
                >
                  <div>{{ scope.row.description }}</div>
                </div>
              </div>
              <slot slot="reference">
                <div :class="{ 'tooltip-row': true }">
                  <div class="flexStart">
                    <span class="flow1">{{ scope.row[item.prop] }}</span>
                    <svg-icon
                      icon-class="noLabel"
                      class="no-label"
                      v-if="scope.row.labelType === '1' && scope.row.nonInventoryItem !== '1'"
                    />
                  </div>
                </div>
              </slot>
            </el-popover>
          </template>
          <!-- <template v-else-if="item.prop === 'remarks'">
            <el-input
              style="width: 96%"
              :title="scope.row.remarks"
              v-model="scope.row.remarks"
              :maxlength="300"
            />
          </template> -->

          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        :loading="btnLoading"
        :disabled="tableList.length <= 0"
        @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  batchPrint,
  queryPrintProductList,
  calculateLabelPrintQty
} from '@/api/inventoryManagement/emergencyGoodsReceipt'

export default {
  dicts: ['ivt_print_method', 'inventory_control_mode', 'sales_rma_type'],
  mixins: [pageMixin],
  components: {},
  data() {
    const vm = this
    return {
      saveKey: '12',
      savePath: 'DeliveryDlg',
      searchFormKey: Date.now(),
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'productId',
      tableList: [],
      visible: false,
      columns: [
        // {
        //   prop: 'emergencyGoodsReceiptNo',
        //   label: vm.$t('PURCHASE.emergencyGoodsReceiptNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true,
        //   fixed: true
        // },
        // {
        //   prop: 'businessPartnerName',
        //   label: vm.$t('PURCHASE.supplier'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'receivedQty',
          label: vm.$t('PURCHASE.receiveQty'),
          visible: true,
          minWidth: 200,
          fixedWidth: 160,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'inventoryControlMode',
          label: vm.$t('PRODUCT.inventoryControlMode'),
          visible: true,
          minWidth: 200,
          fixedWidth: 180,
          tooltip: true
        },
        {
          prop: 'printMethod',
          label: vm.$t('PRODUCT.printMethod'),
          visible: true,
          minWidth: 200,
          fixedWidth: 160,
          tooltip: true
        },
        {
          prop: 'printLabelQty',
          label: vm.$t('PURCHASE.labelsQTY'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'qcResult',
        //   label: vm.$t('STOCKIN.result2'),
        //   visible: true,
        //   minWidth: 200,
        //   fixedWidth: 160,
        //   tooltip: true
        // },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          fixedWidth: 180,
          tooltip: true
        }
      ],
      rules: {
        parentId: [
          {
            required: true,
            type: 'array',
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      form: {
        deliveryOrderNo: undefined,
        parentId: undefined,
        printerCode: undefined
      },
      isDeliveryOrderNo: false,
      selectData: [],
      zoneList: [],
      printerDeviceList: [],
      stockInQc: undefined,
      row: undefined,
      emergencyGoodsReceiptId: undefined,
      formData: undefined
    }
  },
  computed: {
    isSystemDocking() {
      return this.$store.state.user.warehouseInfo.isSystemDocking
    },
    configCurColumn() {
      let arr = [...this.columns]
      if (this.stockInQc === '1') {
        arr = arr.filter((x) => x.prop !== 'qcResult')
      }
      if (this.tableList <= 0) {
        arr = arr.filter((x) => x.prop !== 'qcResult')
      } else if (!this.tableList.find((x) => x.rmaType)) {
        arr = arr.filter((x) => x.prop !== 'qcResult')
      }

      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      let arr = this.columns.filter((column) => column.visible === true)
      if (this.stockInQc === '1') {
        arr = arr.filter((x) => x.prop !== 'qcResult')
      }
      if (this.tableList <= 0) {
        arr = arr.filter((x) => x.prop !== 'qcResult')
      } else if (!this.tableList.find((x) => x.rmaType)) {
        arr = arr.filter((x) => x.prop !== 'qcResult')
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    }
  },
  watch: {},
  beforeCreate() {
    // this.$i18n.mergeLocaleMessage('zh', locale.zh)
    // this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    handleAdd(row) {
      this.row = row || {}
      this.reset()
      this.getSystemConfig()
      this.queryPrintProductList()
      this.visible = true
    },
    rowRmaTypeChange(row) {},
    queryPrintProductList() {
      queryPrintProductList({
        emergencyGoodsReceiptId: this.row.emergencyGoodsReceiptId
      }).then((res) => {
        this.formData = res.data || {}
        const { emergencyGoodsReceiptDetailList } = res.data || {}
        this.tableList = (emergencyGoodsReceiptDetailList || []).map((x) => {
          return {
            ...x,
            emergencyGoodsReceiptNo: this.row.emergencyGoodsReceiptNo,
            businessPartnerName: this.row.businessPartnerName
          }
        })
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    // 库存管理模式
    inventoryControlModeChange(row) {
      this.calculateLabelPrintQty(row)
    },
    calculateLabelPrintQty(row) {
      this.loading = true
      calculateLabelPrintQty({
        ...row
      })
        .then((res) => {
          const { printLabelQty } = res.data || {}
          this.$set(row, 'printLabelQty', printLabelQty)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getSystemConfig() {
      this.getDicts('sys_printer_device').then((response) => {
        this.printerDeviceList = response.data || []
        if (this.printerDeviceList.length > 0 && !this.form.printerCode) {
          this.$set(this.form, 'printerCode', this.printerDeviceList[0].dictValue)
        }
      })
    },

    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x, index) => {
          /* 最终位置为开，上一级可以编辑，上一级不能是他自己 */
          if (x.warehouseStructureId === this.id) {
            data.splice(index, 1)
          } else if (x.child && x.child.length > 0) {
            this.handle(x.child)
            if (x.child.length <= 0) {
              x.child = undefined
            }
          } else {
            x.child = undefined
          }
        })
      }
    },
    inputNumberChange(row) {
      const { packagingQty, logisticsDocumentNo, balanceReceivedQty } = row
      if (logisticsDocumentNo && this.$resultOfBoolean(packagingQty) && packagingQty !== 0) {
        this.$nextTick(() => {
          // this.$set(row, 'packagingQty', 0)
          this.$set(row, 'packagingQty', balanceReceivedQty)
        })
      }
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    reset() {
      this.tableList = []
      this.form = {
        deliveryOrderNo: undefined,
        parentId: undefined,
        printerCode: undefined
      }
      this.formData = {}
      this.resetForm('form')
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const list = this.tableList
          // const qty = list.find((x) => this.$resultOfBoolean(x.packagingQty))
          // if (!qty) {
          //   this.$modal.msgError(
          //     this.$t('ui.commonReqMsg').replace('$1', this.$t('STOCKIN.receiveQty'))
          //   )
          //   return false
          // }
          const inventoryControlMode = list.find(
            (x) => x.labelType === '0' && !x.inventoryControlMode
          )
          if (inventoryControlMode) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.inventoryControlMode'))
            )
            return false
          }
          const printMethod = list.find((x) => x.labelType === '0' && !x.printMethod)
          if (printMethod) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.printMethod'))
            )
            return false
          }
          if (this.btnLoading) return
          this.btnLoading = true
          this.$modal
            .confirm(this.$t('ui.submitPageConfirm'))
            .then(() => {
              const params = JSON.parse(JSON.stringify(this.formData))
              params.emergencyGoodsReceiptDetailList = list
              params.printerCode = this.form.printerCode
              return batchPrint(params)
            })
            .then((response) => {
              this.btnLoading = false
              this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
              this.handleBack()
              this.$emit('onSuccess')
              if (response.data) {
                window.open(response.data, 'print')
              }
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
