import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './en'
import enDateTimePicker from './enDateTimePicker'
import zhLocale from './zh'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import Cookies from 'js-cookie'
Vue.use(VueI18n)

// 修改了datepicker的英文语言
elementEnLocale.el.datepicker = enDateTimePicker.datepicker
elementEnLocale.el.pagination = enDateTimePicker.pagination

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  // set locale
  // 设置语言 选项 en | zh
  locale: Cookies.get('language') || 'en',
  // set locale messages
  messages,
  silentTranslationWarn: true
})

export default i18n
