<template>
  <el-dialog
    v-dialogDrag
    :title="$t('createPO.dialogTitle')"
    :visible.sync="visible"
    width="800px"
    :close-on-click-modal="false"
  >
    <!-- 供应商单选区域 -->
    <div
      class="supplier-card"
      :class="{ active: selectedPQId === item.purchaseQuotationId, mt10: idx !== 0 }"
      v-for="(item, idx) in purchaseQuotationList"
      :key="idx"
      @click="selectedPQId = item.purchaseQuotationId"
    >
      <div>
        <el-radio v-model="selectedPQId" :label="item.purchaseQuotationId"
          ><span style="opacity: 0">i</span></el-radio
        >
      </div>
      <!-- 供应商信息 -->
      <div class="card-info">
        <div class="info-name">{{ item.businessPartnerName }}</div>
        <div class="info-meta">
          <span
            ><i class="el-icon-box"></i> {{ item.productTypeCount }}
            {{ $t('createPO.productTypes') }}</span
          >
          <span
            ><i class="el-icon-s-data"></i> {{ item.productCount }} {{ $t('createPO.units') }}</span
          >
        </div>
      </div>

      <div class="card-amount">
        {{ item.currencySymbol }} {{ $numberStr(item.productAmount, 2) }}
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        :loading="fullscreenLoading"
        :disabled="!selectedPQId"
        @click="submitForm"
        >{{ $t('createPO.confirmContinue') }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      fullscreenLoading: false,
      selectedPQId: null, // 选中的供应商
      purchaseQuotationList: [
        /* {
          purchaseQuotationId: '1',
          businessPartnerName: 'IMG Logics (ShenZhen) Company Limted',
          productTypeCount: 6,
          productCount: 450,
          currencyCode: '$',
          productAmount: 19234.87
        },
        {
          purchaseQuotationId: '2',
          businessPartnerName: 'Maanshan Hairuixin Import and Export Co., Ltd',
          productTypeCount: 3,
          productCount: 50,
          currencyCode: '$',
          productAmount: 125483.1
        } */
      ]
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', {
      createPO: {
        dialogTitle: '创建采购订单',
        productTypes: '产品',
        units: '数量',
        confirmContinue: '确认并继续',
        cancelSubmit: '流程 [$1] 取消成功。'
      }
    })
    this.$i18n.mergeLocaleMessage('en', {
      createPO: {
        dialogTitle: 'Create Purchase Order',
        productTypes: 'product types',
        units: 'units',
        confirmContinue: 'Confirm & Continue',
        cancelSubmit: 'Process [$1] was cancelled successfully.'
      }
    })
  },
  methods: {
    handleOpen(purchaseQuotationList) {
      this.reset()
      this.purchaseQuotationList = purchaseQuotationList || []
      this.visible = true
    },
    reset() {
      this.selectedPQId = undefined
    },
    back() {
      this.visible = false
    },
    submitForm() {
      const vm = this
      if (this.fullscreenLoading) {
        return
      }
      vm.fullscreenLoading = true
      this.back()
      vm.$emit('onSuccess', this.selectedPQId)
      vm.fullscreenLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
/* 供应商单选区域布局 */
.supplier-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 单选项容器 */
.supplier-item {
  width: 100%;
}

/* 供应商卡片样式 */
.supplier-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
}
/* 选中卡片的蓝色边框 */
.supplier-card.active {
  border: 1px solid #409eff;
}

/* 单选按钮位置调整 */
.card-radio {
  margin-right: 16px;
}

/* 供应商信息区域 */
.card-info {
  flex: 1;
}
.info-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}
.info-meta {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #999;
}

/* 金额样式（Element成功色） */
.card-amount {
  font-size: 14px;
  color: #67c23a;
  font-weight: 500;
}
</style>
