## 系统全局弹窗

## 使用方法 1 已在 main.js 挂载

this.$sysNotifyClass.testMsgShow(params)

## 使用方法 2

import SysNotifyClass from '@/utils/sysNotify/sysNotify.js'
SysNotifyClass.testMsgShow(params)

## params

<!--
  {
  }
 -->

## 页面跳转携带参数编码 解码

```
  const a = encodeURIComponent('需要编码内容') 编码
  const b = decodeURIComponent(a) 解码
```

<!--
  watch: {
    $route(route) {
      this.resetSearchForm(false)
      const params = route.params || {}
      this.$set(this.queryParams, 'condition', route.params.condition)
      this.$nextTick(() => {
        this.searchFormKey = Date.now()
        if (params.isGetList) {
          this.getList()
        }
      })
      // console.log(route.params)
    }
  },
  methods: {
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()

      if (isGetList) {
        this.getList()
      }
    },
  }

 -->
