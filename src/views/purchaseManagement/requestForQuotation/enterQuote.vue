<template>
  <div class="mask flexCen" v-if="visible">
    <div class="content">
      <i class="el-icon-close close" @click="close"></i>
      <div>
        <div class="dlg-title">{{ $t('PURCHASE.enterQuote') }}</div>
      </div>
      <el-divider></el-divider>

      <ul class="card">
        <li v-for="(item, index) in list" :key="index" @click="supplierChange(item)">
          <div class="flexSb item pointer" @click="enterQuote(item)">
            <div class="flexStart">
              <div>
                <div style="font-weight: 700; font-size: 14px">{{ item.businessPartnerName }}</div>
                <div class="flexStart mt5" style="font-size: 14px; color: #666">
                  {{ item.businessPartnerNo }}
                </div>
              </div>
            </div>

            <div class="quote-btn flexStart">
              <div class="mr10">{{ $t('PURCHASE.pendQuote') }}</div>
              <svg-icon class-name="search-icon" icon-class="enterQuote" />
            </div>
          </div>
        </li>
      </ul>

      <div class="flexEnd" style="padding: 30px">
        <el-button type="ghost" @click="close">{{ $t('uiBtn.back') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PriceControlNoticeDlg',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      form: {},
      list: [],
      supplierId: undefined
    }
  },
  computed: {},
  methods: {
    open(row) {
      this.list = row.purchaseQuotationList
      console.log(this.list, '==============61')
      this.visible = true
    },
    enterQuote(row) {
      this.$router.push({
        path: '/purchaseManagement/editPurchaseQuotation',
        query: {
          id: row.purchaseQuotationId,
          timeId: Date.now(),
          backType: '2'
        }
      })
      this.visible = false
    },
    supplierChange(item) {
      this.supplierId = item.id
    },
    close() {
      this.supplierId = undefined
      this.visible = false
    },
    submit() {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999999999;
  .content {
    position: relative;
    font-size: 14px;
    width: 600px;
    border-radius: 10px;
    background-color: #fff;
    color: #666;
    .dlg-title {
      font-size: 16px;
      font-weight: 700;
      padding: 20px 30px 0;
    }
  }
  .card {
    padding: 0 30px;
    max-height: 500px;
    overflow: hidden;
    overflow-y: auto;
    .item {
      padding: 15px 20px;
      border: 2px solid #f5f5f5;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 10px;
    }
    .item-active {
      box-shadow: 0px 0px 5px #97ccff;
      border-color: #97ccff;
      background-color: #f4faff;
    }
    .select-tag {
      font-size: 20px;
      font-weight: 700;
    }
    .select-tag-active {
      color: #65b4ff;
    }
  }
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
  }
  .tag {
    height: 30px;
    line-height: 30px;
    min-width: 50px;
    text-align: center;
    padding: 0 10px;
    border-radius: 30px;
    background-color: rgba(253, 127, 127, 0.3);
  }
  .quote-btn {
    color: #fff;
    font-weight: 700;
    padding: 10px 20px;
    border-radius: 10px;
    background-color: #f59a23;
    overflow: hidden;
  }
}
</style>
