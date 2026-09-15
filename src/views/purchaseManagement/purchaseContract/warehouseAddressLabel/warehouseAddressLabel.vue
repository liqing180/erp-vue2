<template>
  <el-popover
    trigger="hover"
    :open-delay="500"
    placement="top"
    :disabled="propverDisable"
  >
    <el-scrollbar class="scroll-bar-box" style="height:210px;">
      <div class="addr-list-new">
        <div class="itemTitle">{{ $t('warehouseSelect.label') }} : &nbsp;</div>
        <div class="itemContent">{{ warehouseAddressInRow && warehouseAddressInRow.label }}</div>
      </div>
      <div class="addr-list-new">
        <div class="itemTitle">{{ $t('warehouseSelect.address1') }} : &nbsp;</div>
        <div class="itemContent">{{ warehouseAddressInRow && warehouseAddressInRow.address1 }}</div>
      </div>
      <div class="addr-list-new">
        <div class="itemTitle">{{ $t('warehouseSelect.address2') }} : &nbsp;</div>
        <div class="itemContent">{{ warehouseAddressInRow && warehouseAddressInRow.address2 }}</div>
      </div>
      <div class="addr-list-new">
        <div class="itemTitle">{{ $t('warehouseSelect.location') }} : &nbsp;</div>
        <div class="itemContent">{{ warehouseAddressInRow && warehouseAddressInRow.location }}</div>
      </div>
      <div class="addr-list-new">
        <div class="itemTitle">{{ $t('warehouseSelect.city') }} : &nbsp;</div>
        <div class="itemContent">{{ warehouseAddressInRow && warehouseAddressInRow.city }}</div>
      </div>
      <div class="addr-list-new">
        <div class="itemTitle">{{ $t('warehouseSelect.province') }} : &nbsp;</div>
        <div class="itemContent">{{ warehouseAddressInRow && warehouseAddressInRow.province }}</div>
      </div>
      <div class="addr-list-new">
        <div class="itemTitle">{{ $t('warehouseSelect.postalCode') }} : &nbsp;</div>
        <div class="itemContent">{{ warehouseAddressInRow && warehouseAddressInRow.postalCode }}</div>
      </div>
      <div class="addr-list-new">
        <div class="itemTitle">{{ $t('warehouseSelect.country') }} : &nbsp;</div>
        <div class="itemContent">{{ warehouseAddressInRow && warehouseAddressInRow.country }}</div>
      </div>
    </el-scrollbar>
    <div slot="reference" class="name-wrapper">
      <span
        style="display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 100%;"
      >{{ warehouseAddressInRow && warehouseAddressInRow.label }}</span>
    </div>
  </el-popover>
</template>

<script>
import locale from './locale'

export default {
  name: 'WarehouseAddressLabel',

  props: {
    warehouseAddressInRow: {
      type: Object,
      default: function() {
        return {
          label: '',
          address1: '',
          address2: '',
          location: '',
          city: '',
          province: '',
          postalCode: '',
          country: ''
        }
      }
    }
  },

  computed: {
    propverDisable() {
      return this.warehouseAddressInRow &&
          Object.keys(this.warehouseAddressInRow).length === 0
    }
  },

  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  }
}
</script>

<style lang="scss" scoped>
.addr-list {
  display: flex;
  flex-direction: row;
  line-height: 25px;
  flex-flow: nowrap;

  .itemTitle {
    min-width: 180px;
    text-align: right;
    font-weight: bold;
  }

  .itemContent {
    width: 250px;
    word-break: break-all;
    text-indent: 5px;
  }
}
</style>
