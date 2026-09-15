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
    <el-collapse v-model="activeNames" v-show="showDetailList || showCommonFileList" class="mt20">
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
        <el-collapse-item name="3" v-if="beforeProductList.length > 0">
          <template slot="title">
            <strong>{{ $t('menu.materialList') }} ({{ $t('uiBtn.beforeModification') }})</strong>
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
                v-for="item in addressColumns"
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
                  <template v-if="item.prop === 'committedDate'">{{
                    parseTime(scope.row.committedDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'taxAmount'">{{
                    $numberStr(scope.row.taxAmount, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'attachment'">
                    <span v-if="scope.row.commonFileList && scope.row.commonFileList.length > 0">
                      {{ scope.row.commonFileList.length }}
                    </span>
                  </template>
                  <template v-else-if="item.prop === 'requiredQty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'totalQty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'materialUom'">
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
        <el-collapse-item name="4" v-if="afterProductList.length > 0">
          <template slot="title">
            <strong>{{ $t('menu.materialList') }} ({{ $t('uiBtn.afterModification') }})</strong>
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
                v-for="item in addressColumns"
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
                  <template v-if="item.prop === 'committedDate'">{{
                    parseTime(scope.row.committedDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'taxAmount'">{{
                    $numberStr(scope.row.taxAmount, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'requiredQty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'totalQty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'materialUom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else-if="item.prop === 'categoryNameShowStr'">
                    <ToolTipShowCategory :list="scope.row.categoryNameList || []">
                      <div class="flow1">{{ scope.row[item.prop] }}</div>
                    </ToolTipShowCategory>
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
import { queryUpdateMsgMaterialList } from '@/api/projectManagement/materialList'

export default {
  dicts: ['service_type', 's_task_type'],
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

      beforeProductList: [],
      afterProductList: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      updatePropList: [
        {
          prop: 'contactPersonName',
          label: vm.$t('PURCHASE.contactPerson')
        },
        {
          prop: 'email',
          label: vm.$t('PURCHASE.contactPersonEmail')
        },
        {
          prop: 'mobilePhone',
          label: vm.$t('PURCHASE.contactNo')
        },
        {
          prop: 'supplierQuoteNo',
          label: vm.$t('PURCHASE.supplierQuoteNo')
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
          prop: 'dateQuoted',
          label: vm.$t('PURCHASE.dateQuoted')
        },
        {
          prop: 'validity',
          label: vm.$t('PURCHASE.validityDays')
        },
        {
          prop: 'committedDate',
          label: vm.$t('PURCHASE.committedDate')
        },

        {
          prop: 'paymentTermName',
          label: vm.$t('ui.paymentTerm')
        },
        {
          prop: 'paymentMethodNameList',
          label: vm.$t('ui.paymentMethod')
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency')
        },
        {
          prop: 'incotermName',
          label: vm.$t('PURCHASE.incoterm')
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.deliveryAddress')
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks')
        }
      ],
      /* 表格部分 */
      addressColumns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
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
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PURCHASE.inventoryCategory'),
          visible: true,
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PURCHASE.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'materialUom',
          label: vm.$t('PRODUCT.materialUom'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'requiredQty',
          label: vm.$t('PRODUCT.requiredQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'estimatedLoss',
          label: vm.$t('PRODUCT.estimatedLoss'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'totalQty',
          label: vm.$t('PRODUCT.totalQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'positionNo',
          label: vm.$t('PRODUCT.positionNo'),
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
    showDetailList() {
      return this.beforeProductList.length > 0 || this.afterProductList.length > 0
    },

    showBasicUpdateMsg() {
      return this.basicUpdateMsgList.length > 0
    },

    showCommonFileList() {
      return this.beforeCommonFileList.length > 0 || this.afterCommonFileList.length > 0
    }
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
    handleOpen(id) {
      this.activeNames = ['1', '2', '3', '4']
      queryUpdateMsgMaterialList({ materialListId: id }).then((res) => {
        const results = res.data || {}
        this.visible = true
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])
        this.beforeProductList = results.beforeProductList || []
        this.beforeProductList.forEach((item) => {
          item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
          item.taskTypeStr = this.selectDictLabel(this.dict.type.s_task_type, item.taskType)
        })
        this.afterProductList = results.afterProductList || []
        this.afterProductList.forEach((item) => {
          item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
          item.taskTypeStr = this.selectDictLabel(this.dict.type.s_task_type, item.taskType)
        })
        this.beforeCommonFileList = results.beforeCommonFileList || []
        this.afterCommonFileList = results.afterCommonFileList || []

        setTimeout(() => {
          this.$refs.uploadRef1.initFileList(results.beforeCommonFileList)
          this.$refs.uploadRef2.initFileList(results.afterCommonFileList)
        }, 100)
      })
    },
    onDictReady() {
      this.beforeProductList.forEach((item) => {
        item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
        item.taskTypeStr = this.selectDictLabel(this.dict.type.s_task_type, item.taskType)
      })
      this.afterProductList.forEach((item) => {
        item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
        item.taskTypeStr = this.selectDictLabel(this.dict.type.s_task_type, item.taskType)
      })
    },
    getBasicUpdateMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        if (['validity', 'dateQuoted', 'committedDate'].includes(item.name)) {
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

<style lang="scss"></style>
