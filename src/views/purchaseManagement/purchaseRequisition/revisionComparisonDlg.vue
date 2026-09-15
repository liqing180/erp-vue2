<template>
  <el-dialog
    v-dialogDrag
    :title="$t('uiBtn.revisionComparison')"
    :visible.sync="visible"
    width="1300px"
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
    <el-collapse v-model="activeNames" v-show="showAddressList || showCommonFileList" class="mt20">
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
        <el-collapse-item name="3" v-if="beforeDetailList.length > 0">
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
              ref="productBeforeRef"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
                :resizable="false"
              >
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
                :resizable="false"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'deliveryDate'">{{
                    parseTime(scope.row.deliveryDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'uom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
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
        <el-collapse-item name="4" v-if="afterDetailList.length > 0">
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
              ref="productAfterRef"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
                :resizable="false"
              >
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
                :resizable="false"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'deliveryDate'">{{
                    parseTime(scope.row.deliveryDate, fmtForYmd)
                  }}</template>

                  <template v-else-if="item.prop === 'uom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
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
        v-if="!(showBasicUpdateMsg || showAddressList || showCommonFileList)"
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
import { queryUpdateMsgPR } from '@/api/purchaseManagement/purchaseRequisition'
import TableSyncScrollClass from '@/mixins/tableSyncScrollClass'
import pageMixin from '@/mixins/tableMinx'
export default {
  mixins: [createRevisionDisplayMixin({ switches: ['dropShipping'], dictionaries: { productType: 'product_type' } }), pageMixin],
  props: {
    businessPartnerId: {
      default: ''
    }
  },
  dicts: ['product_type'],
  data() {
    const vm = this
    return {
      visible: false,
      activeNames: ['1', '2', '3', '4'],
      basicUpdateMsgList: [],

      beforeDetailList: [],
      afterDetailList: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      updatePropList: [
        {
          prop: 'departmentName',
          label: vm.$t('ui.dept')
        },
        {
          prop: 'requiredBy',
          label: vm.$t('PURCHASE.requiredBy')
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode')
        },
        {
          prop: 'dropShipping',
          label: vm.$t('PURCHASE.dropShipping')
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.deliveryAddress')
        },
        {
          prop: 'contactPersonNameShowStr',
          label: vm.$t('PURCHASE.consignee')
        },
        {
          prop: 'email',
          label: vm.$t('PURCHASE.requestedEmail')
        },
        {
          prop: 'mobilePhone',
          label: vm.$t('PURCHASE.requestedMobilePhone')
        },
        /* {
          prop: 'reasonTypeShowStr',
          label: vm.$t('ui.reason')
        }, */
        {
          prop: 'reason',
          label: vm.$t('ui.reason')
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks')
        }
      ],
      /* 表格部分 */
      addressColumns: [
        /* {
          prop: 'productType',
          label: vm.$t('PURCHASE.productClass'),
          visible: true,
          width: 150,
          tooltip: true,
          fixed: true
        }, */
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          fixedWidth: 180,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          minWidth: 200,
          fixedWidth: 180,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          fixedWidth: 200,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PURCHASE.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   fixedWidth: 180,
        //   tooltip: true
        // },
        {
          prop: 'uom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 140,
          fixedWidth: 140,
          tooltip: true
        },
        /* {
          prop: 'qtyOnHand',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }, */
        {
          prop: 'qty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 140,
          fixedWidth: 140,
          tooltip: true
        },
        /* {
          prop: 'uomCoefficient',
          label: vm.$t('PURCHASE.ratio'),
          visible: true,
          minWidth: 180,
          tooltip: true
        }, */
        /* {
          prop: 'poUseQtyShowStr',
          label: vm.$t('PURCHASE.poQty'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'stockInQtyShowStr',
          label: vm.$t('PURCHASE.stockInQty'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        {
          prop: 'receiptQtyForBasic',
          label: vm.$t('PURCHASE.receivedQty'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'deliveryDate',
          label: vm.$t('PURCHASE.requestedReceiptDate'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          fixedWidth: 200,
          tooltip: true
        }
      ]
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    showAddressList() {
      return this.beforeDetailList.length > 0 || this.afterDetailList.length > 0
    },

    showBasicUpdateMsg() {
      return this.basicUpdateMsgList.length > 0
    },

    showCommonFileList() {
      return this.beforeCommonFileList.length > 0 || this.afterCommonFileList.length > 0
    },
    aliasIsHide() {
      return (
        !this.beforeDetailList.find((x) => x.alias) && !this.afterDetailList.find((x) => x.alias)
      )
    },
    visibleCurColumns() {
      let arr = this.addressColumns
      const filterProps1 = []
      if (this.aliasIsHide) {
        filterProps1.push('alias')
      }
      arr = arr.filter((x) => !filterProps1.includes(x.prop))
      return arr
    }
  },
  created() {
    this.$$initColumnVisible('null', this.addressColumns)
  },
  methods: {
    closed() {
      this.basicUpdateMsgList = []
      this.beforeDetailList = []
      this.afterDetailList = []
      this.beforeCommonFileList = []
      this.afterCommonFileList = []
      this.destroyTableSync()
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
      queryUpdateMsgPR({ purchaseRequisiteId: id }).then((res) => {
        const results = res.data || {}
        this.visible = true
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])

        this.beforeDetailList = this.handleList(results.beforeDetailList || [])
        this.afterDetailList = this.handleList(results.afterDetailList || [])
        this.beforeCommonFileList = results.beforeCommonFileList || []
        this.afterCommonFileList = results.afterCommonFileList || []

        this.$$getColumnContentMaxWidth(this.addressColumns, [
          ...this.beforeDetailList,
          ...this.afterDetailList
        ])
        setTimeout(() => {
          this.$refs.uploadRef1.initFileList(results.beforeCommonFileList)
          this.$refs.uploadRef2.initFileList(results.afterCommonFileList)
          this.initTableSync()
        }, 100)
      })
    },
    getBasicUpdateMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
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
        item.productType = this.selectDictLabel(this.dict.type.product_type, item.productType)
        // item.productType === '2' ? this.$t('menu.service') : this.$t('PURCHASE.product')
        item.taxAmount = vm.$numberStr(item.taxAmount, 2)
        item.qtyOnHand = this.$numberStr(item.qtyOnHand, item.decimalNum)
        item.qty = this.$numberStr(item.qty, item.decimalNum, item.isAdhocEntry !== '1')
        item.receiptQtyForBasic = this.$numberStr(item.receiptQtyForBasic, item.decimalNum)
        item.uomCoefficient =
          this.$numberStr(item.uomCoefficient, item.includeDecimal === '1' ? 2 : 0) +
          ` ${item.basicUom || ''}`
        return item
      })
    },
    initTableSync() {
      if (TableSyncScrollClass) {
        this.TableSyncScrollClass = new TableSyncScrollClass()
        if (this.afterDetailList.length <= 0) return
        this.TableSyncScrollClass.initAsyncScroll({
          beforeTableRef: this.$refs.productBeforeRef,
          afterTableRef: this.$refs.productAfterRef,
          columns: this.visibleCurColumns,
          afterDetailList: this.afterDetailList,
          getMinWidth: this.getMinWidth
        })
      }
    },
    destroyTableSync() {
      if (this.TableSyncScrollClass) {
        this.TableSyncScrollClass.destroy()
      }
    }
  }
}
</script>
<style lang="scss"></style>
