import { getDicts } from '@/api/system/dict/data'
import store from '@/store'
class MyDictDataClass {
  constructor() {
    /*
      使用方法
      调用MyDictDataClass.getDictFn 返回一个promise, promise.then返回字典值数组
    */
    // 最大缓存时间 30分钟
    this.maxCacheTime = 30 * 60 * 1000
    // 存储数据
    this.dictData = {}
    /** @type [getDictFn: 返回字典值数组] */
    this.getDictFn = (dict) => {
      if (!this.dictData[dict]) {
        this.dictData[dict] = {
          zh: {
            dictList: [],
            timer: Date.now(),
            promiseList: [],
            requestinProgress: false
          },
          en: {
            dictList: [],
            timer: Date.now(),
            promiseList: [],
            requestinProgress: false
          }
        }
      }
      const language = store.getters.language
      const ItemData = this.dictData[dict][language]
      let resolve1
      const premise1 = new Promise((resolve, reject) => {
        resolve1 = resolve
      })
      ItemData.promiseList.push(resolve1)

      if (ItemData.dictList.length > 0 && Date.now() - ItemData.timer < this.maxCacheTime) {
        const listAll = [...ItemData.promiseList]
        listAll.forEach((resolveFn) => {
          setTimeout(() => {
            resolveFn(JSON.parse(JSON.stringify(ItemData.dictList)))
          }, 0)
        })
        ItemData.promiseList.splice(0)
        return premise1
      }
      if (ItemData.requestinProgress) {
        // 请求中，无需处理
        return premise1
      }
      ItemData.requestinProgress = true
      getDicts(dict)
        .then((res) => {
          ItemData.dictList = res.data || []
          const listAll = [...ItemData.promiseList]
          listAll.forEach((resolveFn) => {
            setTimeout(() => {
              resolveFn(JSON.parse(JSON.stringify(ItemData.dictList)))
            }, 0)
          })
          ItemData.promiseList.splice(0)
          ItemData.timer = Date.now()
          ItemData.requestinProgress = false
        })
        .catch(() => {
          const listAll = [...ItemData.promiseList]
          listAll.forEach((resolveFn) => {
            setTimeout(() => {
              resolveFn([])
            }, 0)
          })
          ItemData.promiseList.splice(0)
          ItemData.requestinProgress = false
        })
      return premise1
    }
  }
}
export default new MyDictDataClass()
