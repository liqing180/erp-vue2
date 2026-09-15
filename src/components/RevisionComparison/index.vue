<template>
  <PurchaseOrderRevisionComparisonV2 ref="comparison" :adapter="adapter" />
</template>

<script>
import PurchaseOrderRevisionComparisonV2 from '@/views/purchaseManagement/purchaseOrder/revisionComparisonDlgV2.vue'
import { revisionModules } from './modules'
import { createRevisionDefinition, translateLabel, getRevisionDictTypes, normalizeRevisionOptions } from './schema'
import { getDicts } from '@/api/system/dict/data'
import locale from '@/views/purchaseManagement/lang'

export default {
  name: 'DocumentRevisionComparison',
  components: { PurchaseOrderRevisionComparisonV2 },
  props: {
    dictionaries: {
      type: Object,
      default: () => ({})
    },
    moduleKey: {
      type: String,
      required: true,
      validator: value => Object.prototype.hasOwnProperty.call(revisionModules, value)
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  computed: {
    adapter() {
      const module = revisionModules[this.moduleKey]
      let dictionaries = this.dictionaries
      return {
        loadVersions: async businessId => {
          dictionaries = await this.loadDictionaries(module.schema)
          return module.loadVersions(businessId)
        },
        compare: module.compare,
        comparisonHint: this.$t('PURCHASE.versionComparisonV2.documentCompareHint'),
        businessNoLabel: translateLabel(this.$t.bind(this), module.schema.businessNoI18nKey, module.schema.businessNoLabel),
        createDefinition: ({ t }) => createRevisionDefinition(module.schema, t, dictionaries)
      }
    }
  },
  watch: {
    moduleKey() {
      this.$refs.comparison.visible = false
      this.$refs.comparison.resetState()
    }
  },
  methods: {
    async loadDictionaries(schema) {
      const entries = await Promise.all(getRevisionDictTypes(schema).map(async type => {
        const existing = this.dictionaries[type]
        if (Array.isArray(existing) && existing.length) return [type, existing]
        const res = await getDicts(type)
        const values = normalizeRevisionOptions(res.data)
        return [type, values]
      }))
      return Object.fromEntries(entries)
    },
    handleOpen(businessId) {
      if (businessId === undefined || businessId === null || businessId === '') return
      this.$refs.comparison.handleOpen(businessId)
    }
  }
}
</script>
