import { getDicts } from '@/api/system/dict/data'
import { normalizeRevisionOptions } from './schema'

// 旧接口部分字段已经返回文字；仅转换能明确匹配的编码，保留原有金额、日期及未知值。
export function createRevisionDisplayMixin({ switches = [], dictionaries = {} }) {
  return {
    created() {
      this.revisionDisplayDestroyed = false
    },
    beforeDestroy() {
      this.revisionDisplayDestroyed = true
    },
    data() {
      return {
        revisionDictionaryOptions: {},
        revisionDictionaryLoading: false,
        revisionDictionaryLocale: null
      }
    },
    methods: {
      async loadRevisionDictionaries() {
        if (this.revisionDictionaryLoading) return false
        const locale = this.$i18n.locale
        if (this.revisionDictionaryLocale === locale) return true
        this.revisionDictionaryLoading = true
        try {
          const entries = await Promise.all(Array.from(new Set(Object.values(dictionaries))).map(async type => {
            const res = await getDicts(type)
            return [type, normalizeRevisionOptions(res.data)]
          }))
          if (this.revisionDisplayDestroyed) return false
          this.revisionDictionaryOptions = Object.fromEntries(entries)
          this.revisionDictionaryLocale = locale
          return true
        } catch (error) {
          // 请求层负责错误提示；再次点击对比时重新加载。
          return false
        } finally {
          this.revisionDictionaryLoading = false
        }
      },
      formatRevisionValue(value, field) {
        if (value === undefined || value === null || value === '') return value
        if (switches.includes(field)) {
          if (String(value) === '1' || value === true) return this.$t('uiBtn.yes')
          if (String(value) === '0' || value === false) return this.$t('uiBtn.no')
        }
        const options = this.revisionDictionaryOptions[dictionaries[field]] || []
        const option = options.find(item => String(item.value) === String(value))
        return option ? option.label : value
      },
      formatRevisionColumn(row, column, value) {
        return this.formatRevisionValue(value, row.prop || row.name)
      }
    }
  }
}
