// eslint-disable-next-line
import DatePicker from '@/components/Common/MyDatePicker/src/picker/date-picker.js'

/* istanbul ignore next */
DatePicker.install = function install(Vue) {
  Vue.component(DatePicker.name, DatePicker)
}

export default DatePicker
