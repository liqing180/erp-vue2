<template>
  <div>
    <el-form
      ref="logisticForm"
      :model="logisticForm"
      @submit.native.prevent
      :rules="rules"
      label-width="180px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="`${$t('PURCHASE.payToAddress')}`"
            prop="addressId"
            :class="[isModified('addressId')]"
          >
            <el-popover
              ref="paytoSddressPopover"
              trigger="hover"
              placement="top"
              :open-delay="500"
              :disabled="JSON.stringify(payToAddressObj) === '{}'"
            >
              <el-scrollbar
                class="scroll-bar-box"
                wrap-style="max-height: inherit;overscroll-behavior: none;"
              >
                <div class="addr-list-new">
                  <div class="itemTitle">{{ $t('ui.label') }} : &nbsp;</div>
                  <div class="itemContent">{{ payToAddressObj.label }}</div>
                </div>
                <div class="addr-list-new">
                  <div class="itemTitle">{{ $t('ui.addressLine1') }} : &nbsp;</div>
                  <div class="itemContent">{{ payToAddressObj.address1 }}</div>
                </div>
                <div class="addr-list-new">
                  <div class="itemTitle">{{ $t('ui.addressLine2') }} : &nbsp;</div>
                  <div class="itemContent">{{ payToAddressObj.address2 }}</div>
                </div>
                <div class="addr-list-new">
                  <div class="itemTitle">{{ $t('ui.locationPrecinct') }} : &nbsp;</div>
                  <div class="itemContent">{{ payToAddressObj.location }}</div>
                </div>
                <div class="addr-list-new">
                  <div class="itemTitle">{{ $t('ui.cityTown') }} : &nbsp;</div>
                  <div class="itemContent">{{ payToAddressObj.city }}</div>
                </div>
                <div class="addr-list-new">
                  <div class="itemTitle">{{ $t('ui.provinceState') }} : &nbsp;</div>
                  <div class="itemContent">{{ payToAddressObj.province }}</div>
                </div>
                <div class="addr-list-new">
                  <div class="itemTitle">{{ $t('ui.postalCode') }} : &nbsp;</div>
                  <div class="itemContent">{{ payToAddressObj.postalCode }}</div>
                </div>
                <div class="addr-list-new">
                  <div class="itemTitle">{{ $t('ui.country') }} : &nbsp;</div>
                  <div class="itemContent">{{ payToAddressObj.country }}</div>
                </div>
              </el-scrollbar>
              <div slot="reference" class="name-wrapper">
                <SelectInput
                  clearable
                  :value="payToAddressObj.label"
                  @click="openPayToAddressTable"
                  @clear="payToAddressClear"
                  :disabled="!logisticForm.businessPartnerMainId || comDisFrom"
                />
              </div>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="`${$t('PURCHASE.shipToAddress')}`"
            prop="receiveAddressId"
            :class="[isModified('receiveAddressId')]"
            :rules="{
              required: logisticForm.incotermAddressType !== '0',
              // eslint-disable-next-line
              pattern: new RegExp(/^(?!(\s+$))/g),
              message: this.$t('ui.reqMsg'),
              trigger: ['change', 'blur']
            }"
          >
            <SelectInput
              :value="logisticForm.receiveAddressName"
              :title="logisticForm.receiveAddressName"
              @clear="receiveAddressClear"
              clearable
              @click="openReceiveAddressTable"
              :disabled="
                !logisticForm.incotermId || comDisFrom || logisticForm.incotermAddressType === '0'
              "
              class="form-wd"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 付款地址弹窗 -->
    <payToAddressDlg
      ref="payToAddressDlg"
      :supplierId="logisticForm.businessPartnerMainId"
      @onSuccess="payToAddressUpdate"
    />

    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
  </div>
</template>

<script>
import selectPortTable from '@/views/purchaseManagement/requestForQuotation/components/selectPortTable.vue'
import selectWarehouseTable from '@/views/purchaseManagement/requestForQuotation/components/selectWarehouseTable.vue'
import payToAddressDlg from '@/views/purchaseManagement/purchaseContract/components/payToAddressDlg.vue'

export default {
  components: { payToAddressDlg, selectPortTable, selectWarehouseTable },
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateProps: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(newValue) {
        this.logisticForm = newValue || {}
        if (this.oldType !== this.logisticForm.incotermAddressType) {
          this.receiveAddressClear()
        }
        if (this.businessPartnerMainId !== this.logisticForm.businessPartnerMainId) {
          this.payToAddressClear()
        }
        this.businessPartnerMainId = this.logisticForm.businessPartnerMainId
        this.oldType = this.logisticForm.incotermAddressType
      }
    }
  },
  data() {
    return {
      logisticForm: {},
      rules: {
        addressId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        receiveAddressId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      shipAgentObj: {},
      payToAddressObj: {},
      seaPortObj: {},
      addressObj: {},
      seaPortShow: false,
      addressShow: false,
      shipAgentShow: true,
      oldType: ''
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    init(data) {
      data.forEach((x) => {
        if (x.addressType === '0') {
          this.payToAddressObj = x
          this.$set(this.logisticForm, 'payToAddressObj', x)
          this.$set(this.logisticForm, 'addressId', x.id)
        } else if (x.addressType === '1') {
          if (this.logisticForm.incotermAddressType === '1') {
            this.$set(this.logisticForm, 'addressForPort', x)
            this.$set(this.logisticForm, 'receiveAddressName', x.portName)
            this.$set(this.logisticForm, 'receiveAddressId', x.portId)
          } else {
            this.$set(this.logisticForm, 'addressForWarehouse', x)
            this.$set(this.logisticForm, 'receiveAddressName', x.warehouseName)
            this.$set(this.logisticForm, 'receiveAddressId', x.warehouseId)
          }
        }
      })
    },
    isModified(prop, type = 1) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (type === 1) {
        if (this.basicUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      } else if (type === 2) {
        if (this.ivtSpecificationsUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      }
    },
    openPayToAddressTable() {
      this.$refs.payToAddressDlg.handleOpen()
    },
    payToAddressUpdate(row) {
      const vm = this
      row.addressType = '0'
      vm.payToAddressObj = row
      vm.$set(vm.logisticForm, 'payToAddressObj', vm.payToAddressObj)
      vm.$set(vm.logisticForm, 'addressId', row.businessAddressId)
    },
    payToAddressClear() {
      const vm = this
      vm.payToAddressObj = {}
      vm.$set(vm.logisticForm, 'addressId', undefined)
      vm.$set(vm.logisticForm, 'payToAddressObj', undefined)
    },
    receiveAddressClear() {
      this.$set(this.logisticForm, 'receiveAddressName', undefined)
      this.$set(this.logisticForm, 'receiveAddressId', undefined)
      this.$set(this.logisticForm, 'addressForPort', undefined)
      this.$set(this.logisticForm, 'addressForWarehouse', undefined)
    },
    openReceiveAddressTable() {
      if (this.logisticForm.incotermAddressType === '1') {
        this.$refs.selectPortTable.handleOpen()
      }
      if (this.logisticForm.incotermAddressType === '2') {
        this.$refs.selectWarehouseTable.handleOpen()
      }
    },
    updatePort(row) {
      this.receiveAddressClear()
      const { portName, portId } = row
      row.addressType = '1'
      this.$set(this.logisticForm, 'addressForPort', row)
      this.$set(this.logisticForm, 'receiveAddressName', portName)
      this.$set(this.logisticForm, 'receiveAddressId', portId)
    },
    updateWarehouse(row) {
      this.receiveAddressClear()
      const { warehouseName, warehouseId } = row
      row.addressType = '1'
      this.$set(this.logisticForm, 'addressForWarehouse', row)
      this.$set(this.logisticForm, 'receiveAddressName', warehouseName)
      this.$set(this.logisticForm, 'receiveAddressId', warehouseId)
    },
    async logisticSubmit() {
      try {
        await this.$refs.logisticForm.validate()
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.logisticForm)))
        return param
      } catch (err) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.logistic'))
        )
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-bar-box {
  overflow-x: hidden;
}
.addr-list-new {
  max-width: 800px;
  display: flex;
  flex-direction: row;
  line-height: 25px;
  flex-flow: nowrap;
  border-bottom: 1px solid #efefef;
  &:last-child {
    border-bottom: 1px solid #fff;
  }
  .itemTitle {
    font-weight: bold;
    white-space: nowrap;
  }
}
</style>
