<template>
  <div class="app-container">
    <el-tabs type="card" v-model="activeName" @tab-click="tabClickHandler">
      <el-tab-pane name="purchaseCostAnalysis" :label="$t('PURCHASE.summaryByProduct')">
        <purchaseCostAnalysis ref="purchaseCostAnalysis" />
      </el-tab-pane>
      <el-tab-pane name="distributionByWarehouse" :label="$t('PURCHASE.distributionByWarehouse')">
        <distributionByWarehouse ref="distributionByWarehouse" />
      </el-tab-pane>
      <!-- <el-tab-pane name="inventoryCostAnalysis" :label="$t('PURCHASE.inventoryCostAnalysis')">
        <inventoryCostAnalysis ref="inventoryCostAnalysis" />
      </el-tab-pane>
      <el-tab-pane name="costSettings" :label="$t('PURCHASE.costSettings')">
        <costSettings ref="costSettings" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import purchaseCostAnalysis from './purchaseCostAnalysis.vue'
// import inventoryCostAnalysis from './inventoryCostAnalysis.vue'
import distributionByWarehouse from './distributionByWarehouse.vue'
// import costSettings from './costSettings.vue'
export default {
  name: 'InventoryCostAnalysis',
  components: {
    purchaseCostAnalysis,
    distributionByWarehouse
    // inventoryCostAnalysis,
    //  costSettings
  },
  data() {
    return {
      activeName: 'purchaseCostAnalysis'
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
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
