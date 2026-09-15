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
    <el-collapse class="mt20" v-model="activeNames" v-show="showDetailList || showCommonFileList">
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
        <el-collapse-item name="3" v-show="beforeDetailList.length > 0">
          <template slot="title">
            <strong>{{ $t('PURCHASE.productInfo') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeDetailList"
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
                v-for="item in columns"
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
                  <template v-if="item.prop === 'deliveryDate'">{{
                    parseTime(scope.row.deliveryDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'contractPrice'">
                    {{ $numberStr(scope.row.contractPrice, 2) }}
                  </template>
                  <template v-else-if="item.prop === 'unitPriceInventory'">
                    {{ $numberStr(scope.row.unitPriceInventory, 2) }}
                  </template>
                  <template v-else-if="item.prop === 'qty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'categoryNameShowStr'">
                    <ToolTipShowCategory :list="scope.row.categoryNameList || []">
                      <div class="flow1">{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</div>
                    </ToolTipShowCategory>
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4" v-show="afterDetailList.length > 0">
          <template slot="title">
            <strong>{{ $t('PURCHASE.productInfo') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterDetailList"
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
                v-for="item in columns"
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
                  <template v-if="item.prop === 'deliveryDate'">{{
                    parseTime(scope.row.deliveryDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'contractPrice'">
                    {{ $numberStr(scope.row.contractPrice, 2) }}
                  </template>
                  <template v-else-if="item.prop === 'unitPriceInventory'">
                    {{ $numberStr(scope.row.unitPriceInventory, 2) }}
                  </template>
                  <template v-else-if="item.prop === 'qty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'description'">
                    <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
    <div style="text-align: center; width: 100%">
      <el-empty
        v-if="!(showBasicUpdateMsg || showDetailList || showCommonFileList)"
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
import { queryUpdateMsgPC } from '@/api/purchaseManagement/purchaseContract'
export default {
  mixins: [createRevisionDisplayMixin({ switches: ['consignment', 'cumulativePricing', 'isActive'], dictionaries: { contractType: 'p_purchase_contract_type', tieredPricingType: 'tiered_pricing_type' } })],
  props: {
    businessPartnerId: {
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      activeNames: ['1', '2', '3', '4'],
      basicUpdateMsgList: [],
      ivtSpecificationsUpdateMsgList: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      updatePropList: [
        {
          prop: 'contractType',
          label: vm.$t('ui.type')
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('ui.supplier')
        },
        {
          prop: 'contactPersonName',
          label: vm.$t('PURCHASE.contactPerson')
        },
        {
          prop: 'contactPersonEmail',
          label: vm.$t('ui.email')
        },
        {
          prop: 'country',
          label: vm.$t('ui.country')
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
          prop: 'currency',
          label: vm.$t('menu.currency')
        },
        {
          prop: 'exchangeVolatility',
          label: vm.$t('PURCHASE.exchangeVolatility')
        },
        {
          prop: 'incotermName',
          label: vm.$t('PURCHASE.incoterm')
        },
        {
          prop: 'consignment',
          label: vm.$t('PURCHASE.isConsignment')
        },
        {
          prop: 'warehouseName',
          label: vm.$t('PURCHASE.warehouseName')
        },
        {
          prop: 'cumulativePricing',
          label: vm.$t('PURCHASE.cumulativePricing')
        },
        {
          prop: 'tieredPricingType',
          label: vm.$t('PURCHASE.tieredPricingType')
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive')
        },
        {
          prop: 'documentContractNo',
          label: vm.$t('PURCHASE.documentContractNo')
        },
        {
          prop: 'signedBy',
          label: vm.$t('PURCHASE.signedBy')
        },
        {
          prop: 'rebate',
          label: vm.$t('PURCHASE.rebate')
        },
        {
          prop: 'startDate',
          label: vm.$t('ui.startDate')
        },
        {
          prop: 'endDate',
          label: vm.$t('ui.endDate')
        },
        {
          prop: 'contractDate',
          label: vm.$t('PURCHASE.contractDate')
        },
        {
          prop: 'minContractValue',
          label: vm.$t('PURCHASE.minContractValue')
        },
        {
          prop: 'maxContractValue',
          label: vm.$t('PURCHASE.maxContractValue')
        },
        {
          prop: 'period',
          label: vm.$t('PURCHASE.period')
        },
        {
          prop: 'amount',
          label: vm.$t('PURCHASE.amount')
        },
        {
          prop: 'termsAndConditions',
          label: vm.$t('PURCHASE.termsAndConditions')
        },
        {
          prop: 'label',
          label: vm.$t('PURCHASE.payToAddress')
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.shipToAddress')
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('ui.paymentTerm')
        },
        {
          prop: 'paymentMethod',
          label: vm.$t('ui.paymentMethod')
        }
      ],
      ivtSpecificationsUpdatePropList: [
        {
          prop: 'volumeShowStr',
          label: vm.$t('PRODUCT.volume')
        },
        {
          prop: 'color',
          label: vm.$t('PRODUCT.color')
        },
        {
          prop: 'netWeightShowStr',
          label: vm.$t('PRODUCT.netWeight')
        },
        {
          prop: 'grossWeightShowStr',
          label: vm.$t('PRODUCT.grossWeight')
        },
        {
          prop: 'lengthShowStr',
          label: vm.$t('PRODUCT.l')
        },
        {
          prop: 'widthShowStr',
          label: vm.$t('PRODUCT.w')
        },
        {
          prop: 'heightShowStr',
          label: vm.$t('PRODUCT.h')
        },
        {
          prop: 'UOM',
          label: vm.$t('PRODUCT.uom')
        },
        {
          prop: 'minimumPackagingUnit',
          label: vm.$t('PRODUCT.minimumPackagingUnit')
        },
        {
          prop: 'minimumPackagingUnitCoefficient',
          label: `${vm.$t('PRODUCT.minimumPackagingUnit')} (${vm.$t('PRODUCT.ratio')})`
        },
        {
          prop: 'supplementaryPackagingUnit',
          label: vm.$t('PRODUCT.supplementaryPackagingUnit')
        },
        {
          prop: 'supplementaryPackagingUnitCoefficient',
          label: `${vm.$t('PRODUCT.supplementaryPackagingUnit')} (${vm.$t('PRODUCT.ratio')})`
        },

        {
          prop: 'packagingUnit',
          label: vm.$t('PRODUCT.packagingUnit')
        },
        {
          prop: 'packagingUnitCoefficient',
          label: `${vm.$t('PRODUCT.packagingUnit')} (${vm.$t('PRODUCT.ratio')})`
        },
        {
          prop: 'defaultUom',
          label: vm.$t('PRODUCT.defaultUOM')
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purchaseUOM')
        },
        /* {
          prop: 'salesUom',
          label: vm.$t('PRODUCT.salesUOM')
        },
        {
          prop: 'inventoryUom',
          label: vm.$t('PRODUCT.inventoryUOM')
        }, */
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks')
        }
      ],
      beforeDetailList: [],
      afterDetailList: [],
      /* 表格部分 */
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 160,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 160,
        //   tooltip: true
        // },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 160
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory1'),
          visible: true,
          minWidth: 160
          // tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.purchaseQty'),
          visible: true,
          padding: 60,
          minWidth: 160
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purchaseUOM1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'contractPrice',
          label: vm.$t('PRODUCT.contractPrice'),
          visible: true,
          minWidth: 220,
          tooltip: true
        },
        {
          prop: 'moq',
          label: vm.$t('PRODUCT.moq'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'taxNo',
          label: vm.$t('PRODUCT.taxNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'inventoryUom',
          label: vm.$t('PRODUCT.inventoryUOM1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'unitPriceInventory',
          label: vm.$t('PRODUCT.inventoryPrice'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'leadTime',
          label: vm.$t('PRODUCT.leadTimeDays'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'warranty',
          label: vm.$t('PRODUCT.warrantyDays'),
          visible: true,
          minWidth: 160,
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
    showBasicUpdateMsg() {
      return this.basicUpdateMsgList.length > 0
    },
    showDetailList() {
      return this.beforeDetailList.length > 0 || this.afterDetailList.length > 0
    },
    showCommonFileList() {
      return this.beforeCommonFileList.length > 0 || this.afterCommonFileList.length > 0
    }
  },

  methods: {
    closed() {
      this.basicUpdateMsgList = []
      this.ivtSpecificationsUpdateMsgList = []
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
      this.activeNames = ['1', '2', '3', '4']
      queryUpdateMsgPC({ purchaseContractMainId: id }).then((res) => {
        const results = res.data || {}
        this.visible = true
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])
        this.ivtSpecificationsUpdateMsgList = this.getAccountSupplierMsgList(
          results.ivtSpecificationsUpdateMsgList || []
        )

        this.beforeDetailList = results.beforeDetailList || []
        this.afterDetailList = results.afterDetailList || []
        this.beforeCommonFileList = results.beforeCommonFileList || []
        this.afterCommonFileList = results.afterCommonFileList || []

        setTimeout(() => {
          this.$refs.uploadRef1.initFileList(results.beforeCommonFileList)
          this.$refs.uploadRef2.initFileList(results.afterCommonFileList)
        }, 300)
      })
    },
    getBasicUpdateMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        /* if (['quoteDate', 'purchaseQuotationShipDetailList.committedDate'].includes(item.name)) {
            item.beforeValue = this.$dateFmt(Number(item.beforeValue), this.fmtForYmd())
            item.afterValue = this.$dateFmt(Number(item.afterValue), this.fmtForYmd())
          } */
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
    getAccountSupplierMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        /* if (['quoteDate', 'purchaseQuotationShipDetailList.committedDate'].includes(item.name)) {
            item.beforeValue = this.$dateFmt(Number(item.beforeValue), this.fmtForYmd())
            item.afterValue = this.$dateFmt(Number(item.afterValue), this.fmtForYmd())
          } */
        MsgObj[item.name] = item
      })
      this.ivtSpecificationsUpdatePropList.forEach((item) => {
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
        item.taxAmount = vm.$numberStr(item.taxAmount, 2)
        return item
      })
    }
  }
}
</script>
<style lang="scss"></style>
