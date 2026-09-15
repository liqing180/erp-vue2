<template>
  <popover-svc
    ref="pop1"
    trigger="hover"
    placement="top"
    :close-delay="0"
    :visible-arrow="true"
    popper-class="pop-warp"
    :offset="0"
  >
    <div
      @mouseenter="mouseenterCur($event)"
      class="pop-box"
      :style="`width: ${comPopWidth}px`"
      v-loading="popoverData.loading"
    >
      <el-table :show-header="false" :data="popoverData.topShowData || []">
        <!-- getMinWidth：如果只有一列，就不设置宽度了 -->
        <el-table-column
          v-for="item in comColumns1"
          :key="item.prop + params.businessId"
          :prop="item.prop"
          :width="item.width"
          :min-width="comColumns1.length > 1 ? getMinWidth(item) : ''"
          :show-overflow-tooltip="item.tooltip"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'column1'">
              <span class="item-label" v-if="scope.row.column1ContentType === '1'">{{
                scope.row.column1Label
              }}</span>
              <span class="item-content" v-else-if="scope.row.column1ContentType === '2'">{{
                scope.row.column1Content
              }}</span>
              <template v-if="scope.row.column1ContentType === '3'">
                <span class="item-label">{{ scope.row.column1Label }}</span>
                <span class="item-label" style="margin: 0 6px">:</span>
                <span class="item-content">{{ scope.row.column1Content }}</span>
              </template>
            </template>
            <template v-else-if="item.prop === 'column2'">
              <span class="item-label" v-if="scope.row.column2ContentType === '1'">{{
                scope.row.column2Label
              }}</span>
              <span class="item-content" v-else-if="scope.row.column2ContentType === '2'">{{
                scope.row.column2Content
              }}</span>
              <template v-if="scope.row.column2ContentType === '3'">
                <span class="item-label">{{ scope.row.column2Label }}</span>
                <span class="item-label" style="margin: 0 6px">:</span>
                <span class="item-content">{{ scope.row.column2Content }}</span>
              </template>
            </template>
            <template v-else-if="item.prop === 'column3'">
              <span class="item-label" v-if="scope.row.column3ContentType === '1'">{{
                scope.row.column3Label
              }}</span>
              <span class="item-content" v-else-if="scope.row.column3ContentType === '2'">{{
                scope.row.column3Content
              }}</span>
              <template v-if="scope.row.column3ContentType === '3'">
                <span class="item-label">{{ scope.row.column3Label }}</span>
                <span class="item-label" style="margin: 0 6px">:</span>
                <span class="item-content">{{ scope.row.column3Content }}</span>
              </template>
            </template>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="column1" show-overflow-tooltip></el-table-column> -->
        <!-- <el-table-column prop="column2" show-overflow-tooltip></el-table-column> -->
      </el-table>
      <div
        style="height: 10px"
        v-show="comShowBottom && (popoverData.bottomShowData || []).length > 0"
      ></div>
      <div class="flex" v-show="comShowBottom && (popoverData.bottomShowData || []).length > 0">
        <el-table class="flex-1" max-height="300" :data="popoverData.bottomShowData || []">
          <el-table-column
            v-for="item in comColumns2"
            :key="item.prop + params.businessId"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="getMinWidth(item)"
            :show-overflow-tooltip="true"
            :align="'left'"
          >
            <!-- :align="item.align || 'left'" -->
            <template slot="header" slot-scope="{ column }">
              <span v-if="['isPriceUp'].includes(item.propType)">
                <span class="item-label">{{ column.label }}</span>
                <span class="ml5" v-if="popoverData.currencyCode">{{
                  `(${popoverData.currencyCode})`
                }}</span>
                <svg-icon icon-class="up1" />
              </span>
              <span v-else-if="['isPriceDown'].includes(item.propType)">
                <span class="item-label">{{ column.label }}</span>
                <span class="ml5" v-if="popoverData.currencyCode">{{
                  `(${popoverData.currencyCode})`
                }}</span>
                <svg-icon icon-class="down1" />
              </span>
              <span v-else-if="['isPrice'].includes(item.propType)">
                <span class="item-label">{{ column.label }}</span>
                <span class="ml5" v-if="popoverData.currencyCode">{{
                  `(${popoverData.currencyCode})`
                }}</span>
              </span>
              <span v-else class="item-label">{{ column.label }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </popover-svc>
</template>
<script>
import { Popover } from 'element-ui'
import pageMixin from '@/mixins/tableMinx'
import { queryBusinessOtherMsg } from '@/api/bpm/bpm'
const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}
export default {
  components: { popoverSvc },
  mixins: [pageMixin],
  props: {},

  data() {
    return {
      colTextMaxWidth: 200,
      cacheTime: 30000, // 数据接口前端缓存时长(毫秒)
      popoverData: {
        topShowData: [
          {
            column1Label: '客户名称',
            column1Content: '方大大厦客户名称',
            column1ShowStr: '客户名称 : 方大大厦客户名称',
            column1ContentType: '3',

            column2Label: '仓库名称',
            column2Content: '方大大厦',
            column2ShowStr: '仓库名称 : 方大大厦',
            column2ContentType: '3'
          }
          /* {
            column1: '仓库名称',
            column2: '方大大厦仓库'
          } */
        ],
        bottomShowData: [
          {
            column1: '单卧式搅拌机A',
            column2: '20 ASM',
            column3: '',
            column4: ''
          },
          {
            column1: '单卧式搅拌机b',
            column2: '10 ASM',
            column3: '',
            column4: ''
          }
        ]
      },
      params: {
        popoverTitle: '',
        labelKey: '',
        itemClass: ''
      },
      columns1: [
        {
          prop: 'column1',
          propBy: 'column1ShowStr',
          maxWidth: 200,
          padding: 70,
          tooltip: true
        },
        {
          prop: 'column2',
          propBy: 'column2ShowStr',
          maxWidth: 200,
          padding: 50,
          tooltip: true
        },
        {
          prop: 'column3',
          propBy: 'column3ShowStr',
          maxWidth: 200,
          padding: 50,
          tooltip: true
        }
      ],
      columns2: [],
      columns2Default: [
        {
          label: this.$t('PRODUCT.productName'),
          prop: 'column1',
          minWidth: 200
        },
        {
          label: this.$t('bpm.qty'),
          prop: 'column2',
          minWidth: 200
        }
      ],
      cacheData: {}
    }
  },
  computed: {
    comColumns1() {
      if (
        ['storeIssueChitKey', 'salesInquiryKey', 'salesQuotationKey', 'salesOrderKey'].includes(
          this.params.moduleKey
        )
      ) {
        return this.columns1
      }
      if (['emergencyReceiveKey', 'requestForQuotationKey'].includes(this.params.moduleKey)) {
        return [this.columns1[0]]
      }
      return [this.columns1[0], this.columns1[1]]
    },
    comColumns2() {
      return this.columns2.map((item) => {
        return {
          ...item,
          maxWidth: 200
        }
      })
    },
    comShowBottom() {
      if (this.params.moduleKey) {
        const moduleKeyData = {
          purchaseRequisiteKey: true,
          requestForQuotationKey: true,
          purchaseOrderKey: true,
          logisticsExpenseKey: true,
          purchaseReturnKey: true,
          consignmentOrderKey: true,
          transferOrderKey: true,
          storeIssueChitKey: true,
          salesInquiryKey: true,
          salesQuotationKey: true,
          salesOrderKey: true,
          salesGoodsReturnKey: true,
          projectProductionKey: true,
          sysBomKey: true,
          emergencyReceiveKey: true
        }
        return moduleKeyData[this.params.moduleKey] || false
      } else {
        return false
      }
    },
    comPopWidth() {
      /* if (
        [
          'salesGoodsReturnKey'
        ].includes(this.params.moduleKey)
      ) {
        return 320
      } */
      if (
        [
          'requestForQuotationKey',
          'storeIssueChitKey',
          'salesInquiryKey',
          'salesQuotationKey',
          'salesOrderKey',
          'projectProductionKey',
          'purchaseOrderKey',
          'consignmentOrderKey',
          'transferOrderKey',
          'purchaseReturnKey',
          'sysBomKey',
          'emergencyReceiveKey'
          // 'salesGoodsReturnKey'
        ].includes(this.params.moduleKey)
      ) {
        return 620
      }
      return 520
    }
  },
  deactivated() {
    // 页面被缓存时调用
    this.hidePop()
  },
  created() {},
  methods: {
    showPop(e, params) {
      this.params = params || {}
      if (
        params.moduleKey === 'purchaseContractKey' ||
        params.moduleKey === 'requestTrialKey' ||
        params.moduleKey === 'approvedSupplierKey' ||
        params.moduleKey === 'inventoryInitializationKey' ||
        params.moduleKey === 'scrapKey' ||
        params.moduleKey === 'piKey'
      ) {
        return
      }
      this.$set(this.popoverData, 'hide', false)
      this.$set(this.popoverData, 'loading', true)
      this.$set(this.popoverData, 'topShowData', [])
      this.$set(this.popoverData, 'bottomShowData', [])
      this.$refs.pop1.popBy(e.target)
      if (params.moduleKey === 'purchaseRequisiteKey') {
        this.columns2 = [...this.columns2Default]
      } else if (params.moduleKey === 'requestForQuotationKey') {
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            width: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            width: 120
          },
          {
            label: this.$t('bpm.unitPriceLow'),
            prop: 'column3',
            align: 'right',
            propType: 'isPriceDown',
            width: 160
          },
          {
            label: this.$t('bpm.unitPriceHigh'),
            prop: 'column4',
            align: 'right',
            propType: 'isPriceUp',
            width: 160
          }
        ]
      } else if (params.moduleKey === 'purchaseOrderKey') {
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.referenceAmount'),
            prop: 'column3',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      } else if (params.moduleKey === 'logisticsExpenseKey') {
        this.columns2 = [
          {
            label: this.$t('bpm.expenseItem'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.amount'),
            prop: 'column2',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      } else if (params.moduleKey === 'purchaseReturnKey') {
        // 采购退货单模块:
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.returnedAmount'),
            prop: 'column3',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      } else if (params.moduleKey === 'consignmentOrderKey') {
        // 寄售订单模块:
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.lineTotal'),
            prop: 'column3',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      } else if (params.moduleKey === 'transferOrderKey') {
        // 调拨模块:
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.lineTotal'),
            prop: 'column3',
            minWidth: 200
          }
        ]
      } else if (params.moduleKey === 'storeIssueChitKey') {
        // 借货单:
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.lineTotal'),
            prop: 'column3',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      } else if (params.moduleKey === 'salesInquiryKey') {
        // 借货单:
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.lineTotal'),
            prop: 'column3',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      } else if (params.moduleKey === 'salesQuotationKey') {
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.lineTotal'),
            prop: 'column3',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      } else if (params.moduleKey === 'salesOrderKey') {
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.lineTotal'),
            prop: 'column3',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      } else if (params.moduleKey === 'salesGoodsReturnKey') {
        // 采购退货单模块:
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.returnedAmount'),
            prop: 'column3',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      } else if (params.moduleKey === 'projectProductionKey') {
        // 采购退货单模块:
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.plannedProductionQTY'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.productionQTY'),
            prop: 'column3',
            minWidth: 200
          }
        ]
      } else if (params.moduleKey === 'sysBomKey') {
        // 采购退货单模块:
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('PRODUCT.productClass'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('PRODUCT.qty1'),
            prop: 'column3',
            minWidth: 200
          }
        ]
      } else if (params.moduleKey === 'emergencyReceiveKey') {
        this.columns2 = [
          {
            label: this.$t('PRODUCT.productName'),
            prop: 'column1',
            minWidth: 200
          },
          {
            label: this.$t('bpm.qty'),
            prop: 'column2',
            minWidth: 200
          },
          {
            label: this.$t('bpm.lineTotal'),
            prop: 'column3',
            align: 'right',
            propType: 'isPrice',
            width: 180
          }
        ]
      }
      if (
        ['requestForQuotationKey', 'projectProductionKey', 'sysBomKey'].includes(params.moduleKey)
      ) {
        this.$$initColumnHeaderWidth(this.columns2)
      }
      const isCacheData = this.cacheData[`${params.moduleKey}-${params.businessId}`]
      if (isCacheData && Date.now() - isCacheData.timer < this.cacheTime) {
        this.popoverData = { ...isCacheData.data }
        this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData || [])
        this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData || [])
      } else {
        this.getData(e, params)
      }
    },
    getData(e, params) {
      const queryTime = Date.now()
      this.queryTime = queryTime
      queryBusinessOtherMsg({
        businessId: params.businessId,
        moduleKey: params.moduleKey
      })
        .then((res) => {
          if (queryTime !== this.queryTime) return
          this.$set(this.popoverData, 'loading', false)
          const data = res.data || {}

          let showData = {}
          /*
          column1ContentType
          1 == 表格列展示 label
          2 == 表格列展示 内容
          3 == 列展示 label ：内容
          column1ShowStr 用来动态计算列的宽度的
        */
          if (params.moduleKey === 'bpBusinessPartnerKey') {
            const topShowData = [
              {
                column1Label: this.$t('ui.category'),
                column1Content: '',
                column1ShowStr: this.$t('ui.category'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.businessPartnerTypeShowStr,
                column2ShowStr: data.businessPartnerTypeShowStr,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('ui.businessPartnerName'),
                column1Content: '',
                column1ShowStr: this.$t('ui.businessPartnerName'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.businessPartnerName,
                column2ShowStr: data.businessPartnerName,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('ui.country'),
                column1Content: '',
                column1ShowStr: this.$t('ui.country'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.country,
                column2ShowStr: data.country,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('ui.operationType'),
                column1Content: '',
                column1ShowStr: this.$t('ui.operationType'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.handleTypeShowStr,
                column2ShowStr: data.handleTypeShowStr,
                column2ContentType: '2'
              }
            ]
            showData = {
              topShowData: topShowData,
              bottomShowData: []
            }
            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
          } else if (params.moduleKey === 'ivtProductKey') {
            const topShowData = [
              {
                column1Label: this.$t('PRODUCT.productCategory'),
                column1Content: '',
                column1ShowStr: this.$t('PRODUCT.productCategory'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.productCategoryName,
                column2ShowStr: data.productCategoryName,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('PRODUCT.productName'),
                column1Content: '',
                column1ShowStr: this.$t('PRODUCT.productName'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.productName,
                column2ShowStr: data.productName,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('PRODUCT.purpose'),
                column1Content: '',
                column1ShowStr: this.$t('PRODUCT.purpose'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.purposeShowStr,
                column2ShowStr: data.purposeShowStr,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('ui.operationType'),
                column1Content: '',
                column1ShowStr: this.$t('ui.operationType'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.handleTypeShowStr,
                column2ShowStr: data.handleTypeShowStr,
                column2ContentType: '2'
              }
            ]
            showData = {
              topShowData: topShowData,
              bottomShowData: []
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
          } else if (params.moduleKey === 'purchaseRequisiteKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.requiredDepartment'),
                column1Content: data.branchCompanyDeptName,
                column1ShowStr: `${this.$t('bpm.requiredDepartment')} : ${
                  data.branchCompanyDeptName
                }`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.requiredBy'),
                column2Content: data.requiredBy,
                column2ShowStr: `${this.$t('bpm.requiredBy')} : ${data.requiredBy}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr
              }
            })
            showData = {
              topShowData: topShowData,
              bottomShowData: bottomShowData
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'requestForQuotationKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.supplier'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('bpm.supplier')} : ${data.businessPartnerName}`,
                column1ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: this.$numberStr(item.minUnitPrice, 2),
                column4: this.$numberStr(item.maxUnitPrice, 2)
              }
            })
            showData = {
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'purchaseOrderKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.supplier'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('bpm.supplier')} : ${data.businessPartnerName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.totalAmount'),
                column2Content: data.legalEntityTotalAmountShowStr,
                column2ShowStr: `${this.$t('bpm.totalAmount')} : ${
                  data.legalEntityTotalAmountShowStr
                }`,
                column2ContentType: '3'
              },
              {
                column1Label: this.$t('bpm.incoterm'),
                column1Content: data.incotermName,
                column1ShowStr: `${this.$t('bpm.incoterm')} : ${data.incotermName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.paymentTerm'),
                column2Content: data.paymentTermName,
                column2ShowStr: `${this.$t('bpm.paymentTerm')} : ${data.paymentTermName}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.legalEntityLineTotalShowStr
              }
            })
            showData = {
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.legalEntityCurrencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'logisticsExpenseKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.supplier'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('bpm.supplier')} : ${data.businessPartnerName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.totalAmount'),
                column2Content: data.totalAmountShowStr,
                column2ShowStr: `${this.$t('bpm.totalAmount')} : ${data.totalAmountShowStr}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.expenseItemName,
                column2: item.amountShowStr
              }
            })
            showData = {
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'purchaseReturnKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.supplier'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('bpm.supplier')} : ${data.businessPartnerName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.returnedAmount'),
                column2Content: data.totalReturnedAmountShowStr,
                column2ShowStr: `${this.$t('bpm.returnedAmount')} : ${
                  data.totalReturnedAmountShowStr
                }`,
                column2ContentType: '3'
              },
              {
                column1Label: this.$t('bpm.incoterm'),
                column1Content: data.incotermName,
                column1ShowStr: `${this.$t('bpm.incoterm')} : ${data.incotermName}`,
                column1ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.returnedAmountShowStr
              }
            })
            showData = {
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'consignmentOrderKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.supplier'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('bpm.supplier')} : ${data.businessPartnerName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.totalAmount'),
                column2Content: data.totalAmountShowStr,
                column2ShowStr: `${this.$t('bpm.totalAmount')} : ${data.totalAmountShowStr}`,
                column2ContentType: '3'
              },
              {
                column1Label: this.$t('bpm.incoterm'),
                column1Content: data.incotermName,
                column1ShowStr: `${this.$t('bpm.incoterm')} : ${data.incotermName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.paymentTerm'),
                column2Content: data.paymentTermName,
                column2ShowStr: `${this.$t('bpm.paymentTerm')} : ${data.paymentTermName}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.lineTotalShowStr
              }
            })
            showData = {
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'transferOrderKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.transferFrom'),
                column1Content: data.fromWarehouseName,
                column1ShowStr: `${this.$t('bpm.transferFrom')} : ${data.fromWarehouseName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.transferTo'),
                column2Content: data.toWarehouseName,
                column2ShowStr: `${this.$t('bpm.transferTo')} : ${data.toWarehouseName}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.amountShowStr
              }
            })
            showData = {
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'inventoryAuditKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.auditWarehouseName'),
                column1ShowStr: this.$t('bpm.auditWarehouseName'),
                column1ContentType: '1',

                column2Content: data.warehouseName,
                column2ShowStr: data.warehouseName,
                column2ContentType: '2'
              }
            ]
            if (data.inventoryAuditMethodShowStr) {
              topShowData.push({
                column1Label: this.$t('bpm.method'),
                column1ShowStr: this.$t('bpm.method'),
                column1ContentType: '1',

                column2Content: data.inventoryAuditMethodShowStr,
                column2ShowStr: data.inventoryAuditMethodShowStr,
                column2ContentType: '2'
              })
            }
            if (data.startEndTimeShowStr) {
              topShowData.push({
                column1Label: this.$t('bpm.startEndDate'),
                column1ShowStr: this.$t('bpm.startEndDate'),
                column1ContentType: '1',

                column2Content: data.startEndTimeShowStr,
                column2ShowStr: data.startEndTimeShowStr,
                column2ContentType: '2'
              })
            }
            if (data.userListShowStr) {
              topShowData.push({
                column1Label: this.$t('bpm.auditUser'),
                column1ShowStr: this.$t('bpm.auditUser'),
                column1ContentType: '1',

                column2Content: data.userListShowStr,
                column2ShowStr: data.userListShowStr,
                column2ContentType: '2'
              })
            }
            topShowData.push({
              column1Label: this.$t('bpm.amountTolerance'),
              column1ShowStr: this.$t('bpm.amountTolerance'),
              column1ContentType: '1',

              column2Content: data.amountToleranceShowStr,
              column2ShowStr: data.amountToleranceShowStr,
              column2ContentType: '2'
            })
            showData = {
              topShowData: topShowData,
              bottomShowData: []
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
          } else if (params.moduleKey === 'specialOrderKey') {
            const topShowData = [
              {
                column1Label: this.$t('PRODUCT.productName'),
                column1Content: '',
                column1ShowStr: this.$t('PRODUCT.productName'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.productName,
                column2ShowStr: data.productName,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('bpm.unqualifiedChecklist'),
                column1Content: '',
                column1ShowStr: this.$t('bpm.unqualifiedChecklist'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.failedItemCount,
                column2ShowStr: data.failedItemCount,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('bpm.requiredBy'),
                column1Content: '',
                column1ShowStr: this.$t('bpm.requiredBy'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.requiredBy,
                column2ShowStr: data.requiredBy,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('bpm.requiredDateCreated'),
                column1Content: '',
                column1ShowStr: this.$t('bpm.requiredDateCreated'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.requiredTimeShowStr,
                column2ShowStr: data.requiredTimeShowStr,
                column2ContentType: '2'
              }
            ]
            showData = {
              topShowData: topShowData,
              bottomShowData: []
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
          } else if (params.moduleKey === 'salesPriceKey') {
            const topShowData = [
              {
                column1Label: this.$t('ui.createdBy'),
                column1Content: '',
                column1ShowStr: this.$t('ui.createdBy'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.createdBy,
                column2ShowStr: data.createdBy,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('ui.createdTime'),
                column1Content: '',
                column1ShowStr: this.$t('ui.createdTime'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.createdTimeShowStr,
                column2ShowStr: data.createdTimeShowStr,
                column2ContentType: '2'
              },
              {
                column1Label: this.$t('bpm.productQty'),
                column1Content: '',
                column1ShowStr: this.$t('bpm.productQty'),
                column1ContentType: '1',

                column2Label: '',
                column2Content: data.productCount,
                column2ShowStr: data.productCount,
                column2ContentType: '2'
              }
            ]
            showData = {
              topShowData: topShowData,
              bottomShowData: []
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
          } else if (params.moduleKey === 'storeIssueChitKey') {
            const topShowData = [
              {
                column1Label: this.$t('ui.type'),
                column1Content: data.storeIssueChitTypeShowStr,
                column1ShowStr: `${this.$t('ui.type')} : ${data.storeIssueChitTypeShowStr}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.requiredDepartment'),
                column2Content: data.departmentName,
                column2ShowStr: `${this.$t('bpm.requiredDepartment')} : ${data.departmentName}`,
                column2ContentType: '3',

                column3Label: this.$t('bpm.requiredBy'),
                column3Content: data.requiredBy,
                column3ShowStr: `${this.$t('bpm.requiredBy')} : ${data.requiredBy}`,
                column3ContentType: '3'
              },
              {
                column1Label: this.$t('bpm.warehouse'),
                column1Content: data.warehouseName,
                column1ShowStr: `${this.$t('bpm.warehouse')} : ${data.warehouseName}`,
                column1ContentType: '3',

                column2Label: this.$t('ui.reason'),
                column2Content: data.reason,
                column2ShowStr: `${this.$t('ui.reason')} : ${data.reason}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.lineTotalShowStr
              }
            })
            showData = {
              width: 620,
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'salesInquiryKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.customer'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('bpm.customer')} : ${data.businessPartnerName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.inquiryType'),
                column2Content: data.salesInquiryTypeShowStr,
                column2ShowStr: `${this.$t('bpm.inquiryType')} : ${data.salesInquiryTypeShowStr}`,
                column2ContentType: '3',

                column3Label: this.$t('bpm.quotedAmount'),
                column3Content: data.totalAmountShowStr,
                column3ShowStr: `${this.$t('bpm.quotedAmount')} : ${data.totalAmountShowStr}`,
                column3ContentType: '3'
              },
              {
                column1Label: this.$t('bpm.incoterm'),
                column1Content: data.incotermName,
                column1ShowStr: `${this.$t('bpm.incoterm')} : ${data.incotermName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.paymentTerm'),
                column2Content: data.paymentTermName,
                column2ShowStr: `${this.$t('bpm.paymentTerm')} : ${data.paymentTermName}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.lineTotalShowStr
              }
            })
            showData = {
              width: 620,
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'salesQuotationKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.customer'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('bpm.customer')} : ${data.businessPartnerName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.quotationType'),
                column2Content: data.salesQuotationTypeShowStr,
                column2ShowStr: `${this.$t('bpm.quotationType')} : ${
                  data.salesQuotationTypeShowStr
                }`,
                column2ContentType: '3',

                column3Label: this.$t('bpm.quotedAmount'),
                column3Content: data.totalAmountShowStr,
                column3ShowStr: `${this.$t('bpm.quotedAmount')} : ${data.totalAmountShowStr}`,
                column3ContentType: '3'
              },
              {
                column1Label: this.$t('bpm.incoterm'),
                column1Content: data.incotermName,
                column1ShowStr: `${this.$t('bpm.incoterm')} : ${data.incotermName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.paymentTerm'),
                column2Content: data.paymentTermName,
                column2ShowStr: `${this.$t('bpm.paymentTerm')} : ${data.paymentTermName}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.lineTotalShowStr
              }
            })
            showData = {
              width: 620,
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'salesOrderKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.customer'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('bpm.customer')} : ${data.businessPartnerName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.quotationType'),
                column2Content: data.salesQuotationTypeShowStr,
                column2ShowStr: `${this.$t('bpm.quotationType')} : ${
                  data.salesQuotationTypeShowStr
                }`,
                column2ContentType: '3',

                column3Label: this.$t('bpm.amount'),
                column3Content: data.totalAmountShowStr,
                column3ShowStr: `${this.$t('bpm.amount')} : ${data.totalAmountShowStr}`,
                column3ContentType: '3'
              },
              {
                column1Label: this.$t('bpm.incoterm'),
                column1Content: data.incotermName,
                column1ShowStr: `${this.$t('bpm.incoterm')} : ${data.incotermName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.paymentTerm'),
                column2Content: data.paymentTermName,
                column2ShowStr: `${this.$t('bpm.paymentTerm')} : ${data.paymentTermName}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.lineTotalShowStr
              }
            })
            showData = {
              width: 620,
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'salesGoodsReturnKey') {
            const topShowData = [
              {
                column1Label: this.$t('ui.customer'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('ui.customer')} : ${data.businessPartnerName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.returnedAmount'),
                column2Content: data.totalReturnedAmountShowStr,
                column2ShowStr: `${this.$t('bpm.returnedAmount')} : ${
                  data.totalReturnedAmountShowStr
                }`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.returnedAmountShowStr
              }
            })
            showData = {
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'projectProductionKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.salesOrderNo'),
                column1Content: data.salesOrderNo,
                column1ShowStr: `${this.$t('bpm.salesOrderNo')} : ${data.salesOrderNo}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.associatedProjectName'),
                column2Content: data.projectName,
                column2ShowStr: `${this.$t('bpm.associatedProjectName')} : ${data.projectName}`,
                column2ContentType: '3'
              },
              {
                column1Label: this.$t('bpm.outboundWarehouse'),
                column1Content: data.outWarehouseName,
                column1ShowStr: `${this.$t('bpm.outboundWarehouse')} : ${data.outWarehouseName}`,
                column1ContentType: '3',

                column2Label: this.$t('bpm.inboundWarehouse'),
                column2Content: data.inWarehouseName,
                column2ShowStr: `${this.$t('bpm.inboundWarehouse')} : ${data.inWarehouseName}`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.plannedProductionQtyShowStr,
                column3: item.productionQtyShowStr
              }
            })
            showData = {
              width: 620,
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'sysBomKey') {
            const topShowData = [
              {
                column1Label: this.$t('PRODUCT.combinationProductName'),
                column1Content: data.combinationProductName,
                column1ShowStr: `${this.$t('PRODUCT.combinationProductName')} : ${
                  data.combinationProductName
                }`,
                column1ContentType: '3',

                column2Label: this.$t('PRODUCT.combinationProductNo'),
                column2Content: data.combinationProductNo,
                column2ShowStr: `${this.$t('PRODUCT.combinationProductNo')} : ${
                  data.combinationProductNo
                }`,
                column2ContentType: '3'
              }
            ]
            const bottomShowData = (data.bomAccessoriesList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.productTypeShowStr,
                column3: item.qtyShowStr
              }
            })
            showData = {
              width: 620,
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          } else if (params.moduleKey === 'emergencyReceiveKey') {
            const topShowData = [
              {
                column1Label: this.$t('bpm.supplier'),
                column1Content: data.businessPartnerName,
                column1ShowStr: `${this.$t('bpm.supplier')} : ${data.businessPartnerName}`,
                column1ContentType: '3'
              }
            ]
            const bottomShowData = (data.productList || []).map((item) => {
              return {
                column1: item.productName,
                column2: item.qtyShowStr,
                column3: item.lineTotalShowStr
              }
            })
            showData = {
              width: 620,
              topShowData: topShowData,
              bottomShowData: bottomShowData,
              currencyCode: data.currencyCode
            }

            this.popoverData = { ...showData }
            this.$$getColumnContentMaxWidth(this.columns1, this.popoverData.topShowData)
            this.$$getColumnContentMaxWidth(this.columns2, this.popoverData.bottomShowData)
          }

          this.$nextTick(() => {
            this.$refs.pop1.updatePopper()
          })
          setTimeout(() => {
            this.$refs.pop1.updatePopper()
            // this.$refs.pop1.popBy(e.target)
          }, 20)

          this.cacheData[`${params.moduleKey}-${params.businessId}`] = {
            timer: Date.now(),
            data: showData
          }
        })
        .catch((err) => {
          if (queryTime !== this.queryTime) return
          this.$set(this.popoverData, 'loading', false)
          console.log(err)
        })
    },
    hidePop(e) {
      if (this.popoverData) {
        this.popoverData.hide = true
      }
      setTimeout(() => {
        this.popoverData.hide && this.$refs.pop1.close()
      }, 300)
    },
    mouseenterCur() {
      if (this.popoverData) {
        this.popoverData.hide = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pop-box {
  border: 1px solid #efefef;
  border-bottom: 0px solid #efefef;
  border-radius: 4px;
  width: 400px;
}
.item-label {
  // font-size: 13px;
  font-weight: bold;
  color: #606266;
}
.item-content {
  // font-size: 13px;
  color: #606266;
}
</style>
