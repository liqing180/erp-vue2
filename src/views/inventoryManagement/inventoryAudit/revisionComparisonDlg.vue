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
          :label="$t('uiBtn.beforeModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="afterValue"
          :label="$t('uiBtn.afterModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
      </el-table>
    </div>
    <el-collapse v-model="activeNames" v-show="showAddressList" class="mt20">
      <div class="form-card">
        <el-collapse-item name="3" v-if="beforeDetailList.length > 0">
          <template slot="title">
            <strong
              >{{ $t('INVENTORY.productInfo') }} ({{ $t('uiBtn.beforeModification') }})</strong
            >
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
                v-for="item in addressColumns"
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
                  <template v-if="item.prop === 'qtyTolerance'">
                    <span v-if="scope.row.auditResult === '1'" class="text-green">{{
                      scope.row[item.prop]
                    }}</span>
                    <span v-else-if="scope.row.auditResult === '2'" class="text-red">{{
                      scope.row[item.prop]
                    }}</span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'inventoryControlMode'">
                    {{
                      selectDictLabel(
                        dict.type.inventory_control_mode,
                        scope.row.inventoryControlMode
                      )
                    }}
                  </template>
                  <template v-else-if="item.prop === 'qtyOnHand'">
                    <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

                    <template v-else>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'auditQty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'costOfGoods'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'amountTolerance'">
                    <span v-if="scope.row.auditResult === '1'" class="text-green">{{
                      $numberStr(scope.row[item.prop], 2)
                    }}</span>
                    <span v-else-if="scope.row.auditResult === '2'" class="text-red">{{
                      $numberStr(scope.row[item.prop], 2)
                    }}</span>
                    <span v-else>{{ $numberStr(scope.row[item.prop], 2) }}</span>
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4" v-if="afterDetailList.length > 0">
          <template slot="title">
            <strong>{{ $t('INVENTORY.productInfo') }} ({{ $t('uiBtn.afterModification') }})</strong>
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
                v-for="item in addressColumns"
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
                  <template v-if="item.prop === 'qtyTolerance'">
                    <span v-if="scope.row.auditResult === '1'" class="text-green">{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</span>
                    <span v-else-if="scope.row.auditResult === '2'" class="text-red">{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                  <template v-else-if="item.prop === 'inventoryControlMode'">
                    {{
                      selectDictLabel(
                        dict.type.inventory_control_mode,
                        scope.row.inventoryControlMode
                      )
                    }}
                  </template>
                  <template v-else-if="item.prop === 'costOfGoods'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'qtyOnHand'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'auditQty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'amountTolerance'">
                    <span v-if="scope.row.auditResult === '1'" class="text-green">{{
                      $numberStr(scope.row[item.prop], 2)
                    }}</span>
                    <span v-else-if="scope.row.auditResult === '2'" class="text-red">{{
                      $numberStr(scope.row[item.prop], 2)
                    }}</span>
                    <span v-else>{{ $numberStr(scope.row[item.prop], 2) }}</span>
                  </template>
                  <template v-else-if="item.prop === 'uom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
    <div style="text-align: center; width: 100%">
      <el-empty
        v-if="!(showBasicUpdateMsg || showAddressList)"
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
import pageMixin from '@/mixins/tableMinx'
import { queryUpdateMsgInventoryAuditForERP } from '@/api/inventoryManagement/inventoryAudit'
export default {
  mixins: [pageMixin],
  dicts: ['inventory_control_mode'],
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

      beforeDetailList: [],
      afterDetailList: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      updatePropList: [
        {
          prop: 'requiredBy',
          label: vm.$t('INVENTORY.requiredBy')
        },
        {
          prop: 'scheduledTransferDate',
          label: vm.$t('INVENTORY.scheduledTransferDate')
        },
        {
          prop: 'ourRef',
          label: vm.$t('INVENTORY.ourRef')
        },
        {
          prop: 'reason',
          label: vm.$t('ui.reason')
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks')
        }
      ],
      addressColumns: [
        {
          prop: 'productName',
          label: vm.$t('INVENTORY.productName'),
          visible: true,
          minWidth: 200,
          fixed: true,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('INVENTORY.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'inventoryControlMode',
          label: vm.$t('INVENTORY.inventoryControlMode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('INVENTORY.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('INVENTORY.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'consignorName',
          label: vm.$t('INVENTORY.consignor'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'leadTime',
          label: vm.$t('INVENTORY.batchNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('INVENTORY.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'costOfGoods',
          label: vm.$t('INVENTORY.inventoryCost'),
          visible: true,
          minWidth: 140,
          padding: 50,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('INVENTORY.qtyOnHand'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'auditQty',
          label: vm.$t('INVENTORY.auditQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyTolerance',
          label: vm.$t('INVENTORY.qtyTolerance'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'amountTolerance',
          label: vm.$t('INVENTORY.amountTolerance'),
          visible: true,
          minWidth: 140,
          padding: 50,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'auditResultShowStr',
          label: vm.$t('INVENTORY.result'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 140,
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
    handleOpen(id) {
      this.activeNames = ['1', '2', '3', '4']
      queryUpdateMsgInventoryAuditForERP({ inventoryAuditId: id }).then((res) => {
        const results = res.data || {}
        this.visible = true
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])

        if (results.inventoryAuditType === '2') {
          this.beforeDetailList = results.beforeProductList || []
          this.afterDetailList = results.afterProductList || []
        } else {
          this.beforeDetailList = results.beforeDetailList || []
          this.afterDetailList = results.afterDetailList || []
        }

        this.$$getColumnContentMaxWidth(this.addressColumns, [
          ...this.beforeDetailList,
          ...this.afterDetailList
        ])
      })
    },
    getBasicUpdateMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        if (['scheduledTransferDate'].includes(item.name)) {
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
        item.taxAmount = vm.$numberStr(item.taxAmount, 2)
        return item
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.text-red {
  color: #ff0000;
}
.text-green {
  color: #00cc00;
}
</style>
