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
          :show-overflow-tooltip="false"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.prop === 'categoryNameShowStr'">
              <ToolTipShowCategory :list="beforeCategoryNameList || []">
                <div class="flow1">{{ scope.row.beforeValue }}</div>
              </ToolTipShowCategory>
            </template>
            <template v-else-if="scope.row.prop === 'description'">
              <DescriptionToolTipShow :showStr="scope.row.beforeValue" />
            </template>
            <template v-else-if="scope.row.prop === 'remarks'">
              <DescriptionToolTipShow :showStr="scope.row.beforeValue" />
            </template>
            <template v-else>
              <div :title="scope.row.beforeValue">{{ scope.row.beforeValue }}</div>
            </template>
          </template>
        </el-table-column>

        <el-table-column
          prop="afterValue"
          :formatter="formatRevisionColumn"
          :label="$t('uiBtn.afterModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="false"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.prop === 'categoryNameShowStr'">
              <ToolTipShowCategory :list="afterCategoryNameList || []">
                <div class="flow1">
                  {{ scope.row.afterValue }}
                </div>
              </ToolTipShowCategory>
            </template>
            <template v-else-if="scope.row.prop === 'description'">
              <DescriptionToolTipShow :showStr="scope.row.afterValue" />
            </template>
            <template v-else-if="scope.row.prop === 'remarks'">
              <DescriptionToolTipShow :showStr="scope.row.afterValue" />
            </template>
            <template v-else>
              <div :title="scope.row.afterValue">{{ scope.row.afterValue }}</div>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-collapse
      class="mt20"
      v-model="activeNames"
      v-if="
        showAccountSupplierUpdateMsg ||
        showCommonFileList ||
        showCommonFileListForImage ||
        showSetCombinationListList
      "
    >
      <div class="form-card">
        <el-collapse-item name="1" v-show="beforeCommonFileListForImage.length > 0">
          <template slot="title">
            <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
            <strong>{{ $t('PRODUCT.productImage') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <el-row class="mb20">
            <el-col :span="24">
              <myUploadTable ref="uploadPictureRef1" :disabled="true" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2" v-show="afterCommonFileListForImage.length > 0">
          <template slot="title">
            <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
            <strong>{{ $t('PRODUCT.productImage') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <el-row class="mb20">
            <el-col :span="24">
              <myUploadTable ref="uploadPictureRef2" :disabled="true" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="3" v-show="beforeCommonFileList.length > 0">
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
        <el-collapse-item name="4" v-show="afterCommonFileList.length > 0">
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
        <el-collapse-item name="5" v-if="showAccountSupplierUpdateMsg">
          <template slot="title">
            <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
            <strong>{{ $t('PRODUCT.specifications') }}</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="ivtSpecificationsUpdateMsgList"
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
        </el-collapse-item>

        <el-collapse-item name="6" v-if="beforeSetCombinationListList.length > 0">
          <template slot="title">
            <strong
              >{{ $t('PRODUCT.setCombination') }} ({{ $t('uiBtn.beforeModification') }})</strong
            >
          </template>
          <div class="mb20">
            <el-table
              :data="beforeSetCombinationListList"
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
                v-for="item in SetCombinationColumns"
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
                  <template v-if="item.prop === 'qty'">
                    {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="7" v-if="afterSetCombinationListList.length > 0">
          <template slot="title">
            <strong
              >{{ $t('PRODUCT.setCombination') }} ({{ $t('uiBtn.afterModification') }})</strong
            >
          </template>
          <div class="mb20">
            <el-table
              :data="afterSetCombinationListList"
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
                v-for="item in SetCombinationColumns"
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
                  <template v-if="item.prop === 'qty'">
                    {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
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
        v-if="
          !(
            showBasicUpdateMsg ||
            showAccountSupplierUpdateMsg ||
            showCommonFileList ||
            showCommonFileListForImage ||
            showSetCombinationListList
          )
        "
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
import { queryUpdateMsgProduct } from '@/api/productManagement/productInfo'
import myUploadTable from '@/components/Common/htz-image-upload/my-upload-table.vue'
export default {
  mixins: [createRevisionDisplayMixin({ switches: ['includeDecimal', 'isActive', 'isPhantom', 'isSequenceCode', 'isSystemDocking'], dictionaries: { productType: 'product_type', printMethod: 'ivt_print_method' } })],
  props: {
    businessPartnerId: {
      default: ''
    }
  },
  components: {
    myUploadTable
  },
  data() {
    const vm = this
    return {
      visible: false,
      activeNames: ['1', '2', '3', '4', '5', '6', '7'],
      basicUpdateMsgList: [],
      ivtSpecificationsUpdateMsgList: [],
      beforeCommonFileListForImage: [],
      afterCommonFileListForImage: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      beforeCategoryNameList: [],
      afterCategoryNameList: [],
      updatePropList: [
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory1')
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName')
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias')
        },
        {
          prop: 'alternateSku',
          label: vm.$t('PRODUCT.alternateSKU')
        },
        {
          prop: 'partNo',
          label: vm.$t('PRODUCT.partNo')
        },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand')
        },
        {
          prop: 'basicUom',
          label: vm.$t('PRODUCT.inventoryUOM1')
        },
        {
          prop: 'chineseName',
          label: vm.$t('PRODUCT.chineseName')
        },
        {
          prop: 'description',
          label: vm.$t('ui.description')
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks')
        },
        {
          prop: 'purpose',
          label: vm.$t('PRODUCT.purpose')
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive')
        },
        {
          prop: 'includeDecimal',
          label: vm.$t('PRODUCT.includeDecimal')
        },
        {
          prop: 'assembledProduct',
          label: vm.$t('PRODUCT.assembledProduct')
        },
        {
          prop: 'isSequenceCode',
          label: vm.$t('PRODUCT.sequenceCode')
        },
        {
          prop: 'packingNotice',
          label: vm.$t('PRODUCT.packingNotice')
        },
        {
          prop: 'setCombination',
          label: vm.$t('PRODUCT.setCombination')
        },
        {
          prop: 'isSystemDocking',
          label: vm.$t('ui.systemDocking')
        },
        {
          prop: 'nonInventoryItem',
          label: vm.$t('PRODUCT.nonInventoryItem')
        },
        {
          prop: 'isPhantom',
          label: vm.$t('PRODUCT.isPhantom')
        },
        {
          prop: 'labelManagement',
          label: vm.$t('PRODUCT.labelManagement')
        },
        {
          prop: 'inventoryControlMode',
          label: vm.$t('PRODUCT.inventoryControlMode')
        },
        {
          prop: 'printMethod',
          label: vm.$t('PRODUCT.printMethod')
        },
        {
          prop: 'productType',
          label: vm.$t('PRODUCT.productClass')
        }
      ],
      ivtSpecificationsUpdatePropList: [
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
          prop: 'color',
          label: vm.$t('PRODUCT.color')
        },
        {
          prop: 'volumeShowStr',
          label: vm.$t('PRODUCT.volume')
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.inventoryUOM1')
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
          prop: 'remarks',
          label: vm.$t('ui.remarks')
        }
      ],
      beforeSetCombinationListList: [],
      afterSetCombinationListList: [],
      SetCombinationColumns: [
        {
          prop: 'productName',
          label: this.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: this.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: this.$t('PRODUCT.inventoryUOM1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qty',
          label: this.$t('PRODUCT.qty'),
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
    showAccountSupplierUpdateMsg() {
      return this.ivtSpecificationsUpdateMsgList.length > 0
    },
    showCommonFileList() {
      return this.beforeCommonFileList.length > 0 || this.afterCommonFileList.length > 0
    },
    showCommonFileListForImage() {
      return (
        this.beforeCommonFileListForImage.length > 0 || this.afterCommonFileListForImage.length > 0
      )
    },
    showSetCombinationListList() {
      return (
        this.beforeSetCombinationListList.length > 0 || this.afterSetCombinationListList.length > 0
      )
    }
  },

  methods: {
    showOverflowTooltip(row) {
      console.log(row, '===476')
    },
    closed() {
      this.basicUpdateMsgList = []
      this.ivtSpecificationsUpdateMsgList = []
      this.beforeCommonFileList = []
      this.afterCommonFileList = []
      this.beforeCommonFileListForImage = []
      this.afterCommonFileListForImage = []

      this.beforeSetCombinationListList = []
      this.afterSetCombinationListList = []

      this.beforeCategoryNameList = []
      this.afterCategoryNameList = []
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
      this.activeNames = ['1', '2', '3', '4', '5', '6', '7']
      queryUpdateMsgProduct({ productMainId: id }).then((res) => {
        const results = res.data || {}
        this.visible = true
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])
        this.ivtSpecificationsUpdateMsgList = this.getAccountSupplierMsgList(
          results.ivtSpecificationsUpdateMsgList || []
        )

        this.beforeCommonFileListForImage = results.beforeCommonFileListForImage || []
        this.afterCommonFileListForImage = results.afterCommonFileListForImage || []

        this.beforeCommonFileList = results.beforeCommonFileList || []
        this.afterCommonFileList = results.afterCommonFileList || []

        this.beforeSetCombinationListList = results.beforeSetCombinationListList || []
        this.afterSetCombinationListList = results.afterSetCombinationListList || []

        this.beforeCategoryNameList = results.beforeCategoryNameList || []
        this.afterCategoryNameList = results.afterCategoryNameList || []

        setTimeout(() => {
          this.$refs.uploadPictureRef1.initFileList(results.beforeCommonFileListForImage)
          this.$refs.uploadPictureRef2.initFileList(results.afterCommonFileListForImage)
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
