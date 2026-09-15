<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <span v-if="selectedNum">{{ `${$t('ui.selected')} : ${selectedNum}` }}</span>
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      :small="true"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import pageMixin from '@/mixins/tableMinx'
import { save } from '@/api/system/behaviour.js'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Pagination',
  mixins: [pageMixin],
  props: {
    selectedNum: {
      required: false,
      type: Number,
      default: 0
    },
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 25, 50, 100]
      }
    },
    // 移动端页码按钮的数量端默认值5
    pagerCount: {
      type: Number,
      default: document.body.clientWidth < 992 ? 5 : 7
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    saveKey: {
      type: String,
      default: ''
    },
    savePath: {
      type: String,
      default: ''
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: false
    },
    scrollTableRef: {
      type: [String, Array],
      default: ''
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      if (this.saveKey) {
        this.$$pageSizeSave(this.saveKey, val)
      }
      this.$emit('pagination', { page: this.currentPage, limit: val })
      this.resetRelatedTableScrollTop()
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      this.resetRelatedTableScrollTop()
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    resetRelatedTableScrollTop() {
      this.setRelatedTableScrollTop()
      this.$nextTick(() => {
        this.setRelatedTableScrollTop()
      })
    },
    setRelatedTableScrollTop() {
      const tableEls = this.getRelatedTableEls()

      tableEls.forEach((tableEl) => {
        const bodyWrappers = tableEl.querySelectorAll(
          '.el-table__body-wrapper, .el-table__fixed-body-wrapper'
        )

        bodyWrappers.forEach((wrapper) => {
          wrapper.scrollTop = 0
        })

        if (tableEl.__vue__ && tableEl.__vue__.bodyWrapper) {
          tableEl.__vue__.bodyWrapper.scrollTop = 0
        }
      })
    },
    getRelatedTableEls() {
      const refTableEls = this.getTableElsByRef()

      if (refTableEls.length) {
        return refTableEls
      }

      const scope = (this.$parent && this.$parent.$el) || document

      if (!scope.querySelectorAll) {
        return []
      }

      const tableEls = Array.from(scope.querySelectorAll('.el-table')).filter(this.isTableVisible)
      const documentPositionFollowing = 4
      const beforePaginationTableEls = tableEls.filter((tableEl) => {
        return Boolean(tableEl.compareDocumentPosition(this.$el) & documentPositionFollowing)
      })

      if (beforePaginationTableEls.length) {
        return [beforePaginationTableEls[beforePaginationTableEls.length - 1]]
      }

      return tableEls.length ? [tableEls[0]] : []
    },
    getTableElsByRef() {
      if (!this.scrollTableRef || !this.$parent) {
        return []
      }

      const refNames = Array.isArray(this.scrollTableRef)
        ? this.scrollTableRef
        : [this.scrollTableRef]

      return refNames.reduce((tableEls, refName) => {
        const ref = this.$parent.$refs[refName]
        const refs = Array.isArray(ref) ? ref : [ref]

        refs.forEach((item) => {
          if (item && item.$el && this.isTableVisible(item.$el)) {
            tableEls.push(item.$el)
          }
        })

        return tableEls
      }, [])
    },
    isTableVisible(tableEl) {
      return tableEl.getClientRects().length > 0
    },
    $$pageSizeSave(saveKey, pageSize) {
      const vm = this
      // console.log(ActivityPool[moduleName][index])

      const param = {
        activity: saveKey,
        data: JSON.stringify({
          pageSize: pageSize || 10
        }),
        path: this.savePath || this.$route.name // vm.$route.meta.srcPath
      }
      const pageSizeList = vm.$cache.local.getJSON('pageSizeList') || {}
      pageSizeList[`${param.path}${param.activity}`] = pageSize || 10
      vm.$cache.local.setJSON('pageSizeList', pageSizeList)

      // vm.table_loading = true
      return save(param)
        .then((res) => {
          if (res.code === 200) {
            // let results = data.msg
          } else {
            vm.$modal.msgError(res.msg)
          }
        })
        .catch((err) => {
          window.console.error(err)
        })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
}
.pagination-container.hidden {
  display: none;
}
</style>
