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
    <el-collapse
      class="mt20"
      v-model="activeNames"
      v-if="showAccountSupplierUpdateMsg || showCommonFileList || showCommonFileListForImage"
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
      </div>
    </el-collapse>
    <div style="text-align: center; width: 100%">
      <el-empty
        v-if="
          !(
            showBasicUpdateMsg ||
            showAccountSupplierUpdateMsg ||
            showCommonFileList ||
            showCommonFileListForImage
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
  mixins: [createRevisionDisplayMixin({ switches: ['includeDecimal', 'isActive', 'isPhantom'], dictionaries: {} })],
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
      activeNames: ['1', '2', '3', '4', '5'],
      basicUpdateMsgList: [],
      ivtSpecificationsUpdateMsgList: [],
      beforeCommonFileListForImage: [],
      afterCommonFileListForImage: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      updatePropList: [
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
          prop: 'chineseName',
          label: vm.$t('PRODUCT.chineseName')
        },
        {
          prop: 'description',
          label: vm.$t('ui.description')
        },
        {
          prop: 'purpose',
          label: vm.$t('PRODUCT.purpose')
        },
        {
          prop: 'basicUom',
          label: vm.$t('PRODUCT.inventoryUOM1')
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive')
        },
        {
          prop: 'includeDecimal',
          label: vm.$t('ui.includeDecimal')
        },
        {
          prop: 'isPhantom',
          label: vm.$t('PRODUCT.isPhantom')
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
          prop: 'uom',
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
        /* {
          prop: 'purchaseUom',
          label: vm.$t('PRODUCT.purchaseUOM')
        },
        {
          prop: 'salesUom',
          label: vm.$t('PRODUCT.salesUOM')
        }, */
        {
          prop: 'inventoryUom',
          label: vm.$t('PRODUCT.inventoryUOM')
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks')
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
    }
  },

  methods: {
    closed() {
      this.basicUpdateMsgList = []
      this.ivtSpecificationsUpdateMsgList = []
      this.beforeCommonFileList = []
      this.afterCommonFileList = []
      this.beforeCommonFileListForImage = []
      this.afterCommonFileListForImage = []
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
      this.activeNames = ['1', '2', '3', '4', '5']
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
