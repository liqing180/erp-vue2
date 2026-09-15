<template>
  <div class="app-container">
    <el-tabs type="card" v-model="activeName" @tab-click="tabClickHandler">
      <el-tab-pane name="salesCost" :label="$t('SALES.overheadsAmount')">
        <salesCost ref="salesCost" />
      </el-tab-pane>
      <el-tab-pane name="recommendedRetailPrice" :label="$t('SALES.recommendedRetailPrice')">
        <recommendedRetailPrice ref="recommendedRetailPrice" />
      </el-tab-pane>
      <el-tab-pane name="costSettings" :label="$t('PURCHASE.costSettings')">
        <costSettings ref="costSettings" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import locale2 from '@/views/salesManagement/lang/index'
import salesCost from './salesCost.vue'
import recommendedRetailPrice from './recommendedRetailPrice.vue'
import costSettings from './costSettings.vue'
export default {
  name: 'SalesCost',
  components: { recommendedRetailPrice, salesCost, costSettings },
  data() {
    return {
      activeName: 'salesCost'
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.tabClickHandler()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.tabClickHandler()
  },
  methods: {
    tabClickHandler() {
      this.$refs[this.activeName] && this.$refs[this.activeName].init()
    }
  }
}
</script>

<style scoped></style>
