import MyDictDataClass from '@/utils/dict/myDictDataClass.js'
export default {
  created() {
    if (this.searchData && Object.prototype.toString.call(this.searchData) === '[object Array]') {
      this.searchData.forEach(async (x) => {
        if (x.dict) {
          const data = await MyDictDataClass.getDictFn(x.dict)
          x.selectData = data
        }
      })
    }
  }
}
