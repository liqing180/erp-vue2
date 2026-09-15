<template>
  <div class="flexCCen" style="height: 100vh; justify-content: center">
    <template v-if="!type">
      <img src="@/assets/images/approval_success.png" mode="" class="approval_icon" />
      <div class="text">{{ $t('PURCHASE.submitSuccess') }}</div>
    </template>
    <template v-if="type === 'expired'">
      <img src="@/assets/images/approval_reject.png" mode="" class="approval_icon" />
      <div class="text">{{ $t('PURCHASE.linkExpired') }}</div>
    </template>
  </div>
</template>

<script>
import locale from '@/views/purchaseManagement/lang/index'
export default {
  data() {
    return {
      type: undefined
    }
  },
  created() {
    this.type = this.$route.query.type
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  }
}
</script>
<style lang="scss" scoped>
.approval_icon {
  width: 120px;
  height: 120px;
  margin: 0 auto;
}
.text {
  font-size: 36px;
  margin-top: 30px;
}
.uni-popup-dialog {
  width: 50vw !important;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.approval_icon {
  animation: fadeScale 2s ease forwards;
}
</style>
