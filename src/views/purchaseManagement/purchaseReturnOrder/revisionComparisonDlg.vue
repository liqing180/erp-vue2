<template>
  <el-dialog
    v-dialogDrag
    :title="$t('uiBtn.revisionComparison')"
    :visible.sync="visible"
    width="1140px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div v-show="showBasicUpdateMsg">
      <el-table
        :data="basicUpdateMsgList"
        :stripe="false"
        border
        class="w100"
        :max-height="390"
        tooltip-effect="light"
      >
        <el-table-column
          prop="label"
          :label="$t('uiBtn.fieldName')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="beforeValue"
          :formatter="formatRevisionColumn"
          :label="$t('uiBtn.beforeModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="afterValue"
          :formatter="formatRevisionColumn"
          :label="$t('uiBtn.afterModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
      </el-table>
    </div>
    <el-collapse v-model="activeNames" v-show="showProductList || showCommonFileList" class="mt20">
      <div class="form-card">
        <el-collapse-item name="1" v-show="beforeCommonFileList.length > 0">
          <template slot="title">
            <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
            <strong>{{ $t('ui.attachment') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <el-row class="mb20">
            <el-col :span="24">
              <myUpload ref="uploadRef1" :disabled="true" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2" v-show="afterCommonFileList.length > 0">
          <template slot="title">
            <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
            <strong>{{ $t('ui.attachment') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <el-row class="mb20">
            <el-col :span="24">
              <myUpload ref="uploadRef2" :disabled="true" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="5" v-if="beforeProductList.length > 0">
          <template slot="title">
            <strong>{{ $t('PURCHASE.productInfo') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeProductList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in productColumns"
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
                  <template v-if="item.prop === 'purchaseUom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="6" v-if="afterProductList.length > 0">
          <template slot="title">
            <strong>{{ $t('PURCHASE.productInfo') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterProductList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in productColumns"
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
                  <template v-if="item.prop === 'purchaseUom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
    <div style="text-align: center; width: 100%">
      <el-empty
        v-if="!(showBasicUpdateMsg || showProductList || showCommonFileList)"
        :image-size="200"
        :description="$t('ui.noData')"
      ></el-empty>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="visible = false">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createRevisionDisplayMixin } from '@/components/RevisionComparison/legacyDisplay'
import pageMixin from '@/mixins/tableMinx'
import { queryUpdateMsgPurchaseReturn } from '@/api/purchaseManagement/purchaseReturnOrder'
export default {
  mixins: [createRevisionDisplayMixin({ switches: ['automatedEmail'], dictionaries: {} }), pageMixin],
  props: {
    businessPartnerId: {
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8'],
      basicUpdateMsgList: [],

      beforeProductList: [],
      afterProductList: [],

      beforeCommonFileList: [],
      afterCommonFileList: [],
      updatePropList: [
        // {
        //   prop: 'picUserBy',
        //   label: vm.$t('ui.pic')
        // },
        {
          prop: 'returnDate',
          label: vm.$t('PURCHASE.returnDate')
        },
        {
          prop: 'dueDate',
          label: vm.$t('PURCHASE.dueDate')
        },
        {
          prop: 'ourRef',
          label: vm.$t('PURCHASE.ourRef')
        },
        {
          prop: 'yourRef',
          label: vm.$t('PURCHASE.yourRef')
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks')
        },
        {
          prop: 'automatedEmail',
          label: vm.$t('PURCHASE.automatedEmail')
        },
        {
          prop: 'district',
          label: vm.$t('PURCHASE.zone')
        },
        {
          prop: 'incotermName',
          label: vm.$t('PURCHASE.incoterm')
        },
        {
          prop: 'receivePortName',
          label: vm.$t('PURCHASE.port')
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('ui.address')
        },
        {
          prop: 'receiveAddress',
          label: vm.$t('PURCHASE.deliveryAddress')
        },
        {
          prop: 'bpContactPersonName',
          label: vm.$t('PURCHASE.contactPerson')
        },
        {
          prop: 'bpEmail',
          label: vm.$t('ui.email')
        },
        {
          prop: 'bpMobilePhone',
          label: vm.$t('ui.mobilePhone')
        }
      ],
      purchaseReturnType: '1',

      columns1: [
        {
          prop: 'purchaseReturnProductTypeShowStr',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 200,
          fixed: true,
          tooltip: true
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
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
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
          prop: 'orderStockInQty',
          label: vm.$t('PURCHASE.receivedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PURCHASE.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('PURCHASE.returnedQTY1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'balanceQty',
          label: vm.$t('PURCHASE.balanceQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyToReturn',
          label: vm.$t('PURCHASE.qtyToReturn'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedAmount',
          label: vm.$t('PURCHASE.returnedAmount'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'returnedReason',
          propBy: 'returnedReasonShowStr',
          label: vm.$t('PURCHASE.returnReason'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'returnedType',
          propBy: 'returnedTypeShowStr',
          label: vm.$t('PURCHASE.RMAType'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'returnedResult',
          propBy: 'returnedResultShowStr',
          label: vm.$t('PURCHASE.result'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'scheduledReceivedDate',
          label: vm.$t('PURCHASE.estimatedReceiptDate'),
          visible: true,
          fixedWidth: 180,
          tooltip: true
        }
      ],

      columns2: [
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
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
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
          prop: 'orderStockInQty',
          label: vm.$t('PURCHASE.receivedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PURCHASE.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('PURCHASE.returnedQTY1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'balanceQty',
          label: vm.$t('PURCHASE.balanceQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyToReturn',
          label: vm.$t('PURCHASE.qtyToReturn'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedAmount',
          label: vm.$t('PURCHASE.returnedAmount'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'returnedReason',
          propBy: 'returnedReasonShowStr',
          label: vm.$t('PURCHASE.returnReason'),
          visible: true,
          minWidth: 140,
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

      columns3: [
        {
          prop: 'deliveryOrderNo',
          label: vm.$t('PURCHASE.deliveryOrderNo1'),
          visible: true,
          minWidth: 200,
          tooltip: true
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
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
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
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'dropShippingReceivedQty',
          label: vm.$t('PURCHASE.qtyAck1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'dropShippingReturnedQty',
          label: vm.$t('PURCHASE.returnedQTY1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedQty',
          label: vm.$t('PURCHASE.rejectedQty1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedQtyForWarehouse',
          label: vm.$t('PURCHASE.returnedQtyWarehouse'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedQtyForVendor',
          label: vm.$t('PURCHASE.returnedQtySupplier'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedType',
          propBy: 'returnedTypeShowStr',
          label: vm.$t('PURCHASE.RMAType'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'qtyToReturn',
          label: vm.$t('PURCHASE.qtyToReturn'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedAmount',
          label: vm.$t('PURCHASE.returnedAmount'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'returnedReason',
          propBy: 'returnedReasonShowStr',
          label: vm.$t('PURCHASE.returnReason'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },

        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ]
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    showProductList() {
      return this.beforeProductList.length > 0 || this.afterProductList.length > 0
    },
    showBasicUpdateMsg() {
      return this.basicUpdateMsgList.length > 0
    },

    showCommonFileList() {
      return this.beforeCommonFileList.length > 0 || this.afterCommonFileList.length > 0
    },
    productColumns() {
      if (this.purchaseReturnType === '2') {
        return this.columns2
      } else if (this.purchaseReturnType === '3') {
        return this.columns3
      }
      return this.columns1
    }
  },
  created() {
    this.$$initColumnVisible('null', this.columns1)
    this.$$initColumnVisible('null', this.columns2)
    this.$$initColumnVisible('null', this.columns3)
  },
  methods: {
    closed() {
      this.basicUpdateMsgList = []

      this.beforeProductList = []
      this.afterProductList = []

      this.beforeCommonFileList = []
      this.afterCommonFileList = []
    },
    rowClassName({ row }) {
      if (row.updateType === '2') {
        return 'new-add-row'
      } else if (row.updateType === '3') {
        return 'cancel-row'
      }
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (row.updateType === '1') {
        if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
          cellClass = 'edit-table-cell'
        }
      }
      return cellClass
    },
    async handleOpen(id) {
      if (!await this.loadRevisionDictionaries()) return
      this.activeNames = ['1', '2', '3', '4', '5', '6', '7', '8']
      queryUpdateMsgPurchaseReturn({ purchaseReturnId: id }).then((res) => {
        const results = res.data || {}
        this.purchaseReturnType = results.purchaseReturnType
        this.visible = true
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])

        this.beforeProductList = this.handleList(results.beforeProductList || [])
        this.afterProductList = this.handleList(results.afterProductList || [])

        this.beforeCommonFileList = results.beforeCommonFileList || []
        this.afterCommonFileList = results.afterCommonFileList || []

        setTimeout(() => {
          this.$refs.uploadRef1.initFileList(results.beforeCommonFileList)
          this.$refs.uploadRef2.initFileList(results.afterCommonFileList)
        }, 100)

        this.$$getColumnContentMaxWidth(this.productColumns, [
          ...this.beforeProductList,
          ...this.afterProductList
        ])
      })
    },
    getBasicUpdateMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        if (['returnDate', 'dueDate'].includes(item.name)) {
          item.beforeValue = this.parseTime(item.beforeValue, this.fmtForYmd)
          item.afterValue = this.parseTime(item.afterValue, this.fmtForYmd)
        }
        MsgObj[item.name] = item
      })
      this.updatePropList.forEach((item) => {
        const editItem = MsgObj[item.prop]
        if (editItem) {
          const row = {
            ...item,
            beforeValue: editItem.beforeValue,
            afterValue: editItem.afterValue
          }
          MsgShowList.push(row)
        }
      })
      return MsgShowList
    },
    handleList(list) {
      const vm = this
      return list.map((item) => {
        item.scheduledReceivedDate = this.parseTime(item.scheduledReceivedDate, this.fmtForYmd)
        item.returnedAmount = vm.$numberStr(item.returnedAmount, 2)

        item.purchaseQty = vm.$numberStr(item.purchaseQty, item.decimalNum)
        item.poStockInQty = vm.$numberStr(item.poStockInQty, item.decimalNum)
        item.returnedQty = vm.$numberStr(item.returnedQty, item.decimalNum)
        item.balanceQty = vm.$numberStr(item.balanceQty, item.decimalNum)
        item.qtyToReturn = vm.$numberStr(item.qtyToReturn, item.decimalNum)
        item.orderStockInQty = vm.$numberStr(item.orderStockInQty, item.decimalNum)
        item.qtyOnHand = vm.$numberStr(item.qtyOnHand, item.decimalNum)
        item.availableQty = vm.$numberStr(item.availableQty, item.decimalNum)

        item.dropShippingReceivedQty = vm.$numberStr(item.dropShippingReceivedQty, item.decimalNum)
        item.dropShippingReturnedQty = vm.$numberStr(item.dropShippingReturnedQty, item.decimalNum)
        item.rejectedQty = vm.$numberStr(item.rejectedQty, item.decimalNum)
        item.rejectedQtyForWarehouse = vm.$numberStr(item.rejectedQtyForWarehouse, item.decimalNum)
        item.rejectedQtyForVendor = vm.$numberStr(item.rejectedQtyForVendor, item.decimalNum)
        return item
      })
    }
  }
}
</script>
<style lang="scss"></style>
