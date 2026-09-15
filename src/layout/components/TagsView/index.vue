<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ initGetMenuTitle(tag) }}
        <el-badge
          v-if="tag.name === 'ToDoTask' && bpmTaskCountData.myTodoTaskCount"
          :max="99"
          :value="bpmTaskCountData.myTodoTaskCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'ProcessPendingAction' && bpmTaskCountData.systemTodoTaskCount"
          :max="99"
          :value="bpmTaskCountData.systemTodoTaskCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'InventoryAudit' && inventoryCountData.auditPendingCount"
          :max="99"
          :value="inventoryCountData.auditPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'StoreIssueChit' && inventoryCountData.storeIssueChitPendingCount"
          :max="99"
          :value="inventoryCountData.storeIssueChitPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'EmergencyGoodsReceipt' && inventoryCountData.egrPendingCount"
          :max="99"
          :value="inventoryCountData.egrPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <!-- 销售模块 -->
        <el-badge
          v-if="tag.name === 'SalesInquiry' && salesCountData.siPendingCount"
          :max="99"
          :value="salesCountData.siPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'SalesQuotation' && salesCountData.sqPendingCount"
          :max="99"
          :value="salesCountData.sqPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'SalesOrder' && salesCountData.soPendingCount"
          :max="99"
          :value="salesCountData.soPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'PreDeliveryNotice' && salesCountData.pdnPendingCount"
          :max="99"
          :value="salesCountData.pdnPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'SalesGoodsReturn' && salesCountData.sgrPendingCount"
          :max="99"
          :value="salesCountData.sgrPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <!-- 采购模块 -->
        <el-badge
          v-if="tag.name === 'PurchaseRequisition' && purchaseCountData.prPendingCount"
          :max="99"
          :value="purchaseCountData.prPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'RequestForQuotation' && purchaseCountData.rfqPendingCount"
          :max="99"
          :value="purchaseCountData.rfqPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'PurchaseQuotation' && purchaseCountData.pqPendingCount"
          :max="99"
          :value="purchaseCountData.pqPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'PurchaseOrder' && purchaseCountData.poPendingCount"
          :max="99"
          :value="purchaseCountData.poPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'PurchaseReturnOrder' && purchaseCountData.purchaseReturnPendingCount"
          :max="99"
          :value="purchaseCountData.purchaseReturnPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'ConsignmentOrder' && purchaseCountData.consignmentOrderPendingCount"
          :max="99"
          :value="purchaseCountData.consignmentOrderPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <el-badge
          v-if="tag.name === 'ProformaInvoice' && salesCountData.piPendingCount"
          :max="99"
          :value="salesCountData.piPendingCount"
          is-dot
          class="mark-badge"
        ></el-badge>
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <i class="el-icon-refresh-right"></i> {{ $t('tagsView.refresh') }}
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <i class="el-icon-close"></i> {{ $t('tagsView.closeCurrent') }}
      </li>
      <li @click="closeOthersTags">
        <i class="el-icon-circle-close"></i> {{ $t('tagsView.closeOthers') }}
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <i class="el-icon-back"></i> {{ $t('tagsView.closeLeft') }}
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <i class="el-icon-right"></i> {{ $t('tagsView.closeRight') }}
      </li>
      <li @click="closeAllTags(selectedTag)">
        <i class="el-icon-circle-close"></i> {{ $t('tagsView.closeAll') }}
      </li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import Sortable from 'sortablejs'
import path from 'path'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      sortableDom: undefined
    }
  },
  computed: {
    bpmTaskCountData() {
      return this.$store.getters.bpmTaskCountData || {}
    },
    inventoryCountData() {
      return this.$store.getters.inventoryCountData || {}
    },
    salesCountData() {
      return this.$store.getters.salesCountData || {}
    },
    purchaseCountData() {
      return this.$store.getters.purchaseCountData || {}
    },
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    },
    theme() {
      return this.$store.state.settings.theme
    },
    language() {
      return this.$store.getters.language
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
      setTimeout(() => {
        this.initDraggable()
      }, 200)
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    getModuleKeyName(moduleKey) {
      const nameData = {
        projectProductionKey: 'projectProduction',
        bpBusinessPartnerKey: 'businessPartner',
        ivtProductKey1: 'productInfo',
        ivtProductKey2: 'productInfo',
        sysBomKey: 'BOMManagement',
        specialOrderKey: 'specialOrder',
        transferOrderKey: 'transferOrder',
        storeIssueChitKey: 'storeIssueChit',
        inventoryAuditKey1: 'inventoryAudit',
        inventoryAuditKey2: 'inventoryAudit',
        inventoryInitializationKey: 'inventoryInitialization',
        purchaseRequisiteKey: 'purchaseRequisition',
        purchaseContractKey: 'purchaseContract',
        purchaseQuotationKey: 'purchaseQuotation',
        purchaseOrderKey: 'purchaseOrder',
        logisticsExpenseKey: 'logisticsExpense',
        purchaseReturnKey: 'purchaseReturnOrder',
        consignmentOrderKey: 'consignmentOrder',
        consignmentPickUpKey: 'consignmentPickUp',
        requestForQuotationKey: 'requestForQuotation1',
        salesInquiryKey: 'salesInquiry',
        salesQuotationKey: 'salesQuotation',
        salesOrderKey: 'salesOrder',
        salesGoodsReturnKey: 'salesGoodsReturn',
        salesPriceKey: 'salesPrice',
        requestTrialKey: 'requestTrial',
        approvedSupplierKey: 'asl'
      }
      if (nameData[moduleKey]) {
        return this.$t(`menu.${nameData[moduleKey]}`)
      }
      return ''
    },
    initGetMenuTitle(tag) {
      if (tag.title === 'history') {
        const moduleName = this.getModuleKeyName(tag.query.moduleKey)
        if (this.language === 'en') {
          return moduleName + ' ' + this.$t('ui.approval')
        } else {
          return moduleName + this.$t('ui.approval')
        }
      }
      return this.getMenuTitleDelEdit(tag.title)
    },
    initDraggable() {
      this.destroyDraggable()
      setTimeout(() => {
        const el = this.$refs.scrollPane.$el.querySelectorAll('.el-scrollbar__view')[0]
        this.sortableDom = Sortable.create(el, {
          handle: '.tags-view-item',
          animation: 100,
          ghostClass: '',
          onEnd: (evt) => {
            if (evt.oldIndex === evt.newIndex) return
            const targetRow = this.visitedViews.splice(evt.oldIndex, 1)[0]
            this.visitedViews.splice(evt.newIndex, 0, targetRow)
          }
        })
      }, 200)
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },

    isActive(route) {
      return route.path === this.$route.path
    },
    activeStyle(tag) {
      if (!this.isActive(tag)) return {}
      return {
        'background-color': this.theme,
        'border-color': this.theme
      }
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    isFirstView() {
      try {
        return (
          this.selectedTag.fullPath === this.visitedViews[1].fullPath ||
          this.selectedTag.fullPath === '/index'
        )
      } catch (err) {
        return false
      }
    },
    isLastView() {
      try {
        return (
          this.selectedTag.fullPath === this.visitedViews[this.visitedViews.length - 1].fullPath
        )
      } catch (err) {
        return false
      }
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes))
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    async closeSelectedTag(view) {
      const curRoute = this.$route
      const msg = await formDirtyClass.showNotify(view.name)
      if (msg === 'save') {
        this.$router.push(view).catch(() => {})
        const pageItem = formDirtyClass.routeStatusData[view.name]
        pageItem.saveOrSubmitFn && pageItem.saveOrSubmitFn({ ...curRoute })
        return
      } else if (msg === 'stop') {
        return
      }

      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeRightTags() {
      this.$store.dispatch('tagsView/delRightTags', this.selectedTag).then((visitedViews) => {
        if (!visitedViews.find((i) => i.fullPath === this.$route.fullPath)) {
          this.toLastView(visitedViews)
        }
      })
    },
    closeLeftTags() {
      this.$store.dispatch('tagsView/delLeftTags', this.selectedTag).then((visitedViews) => {
        if (!visitedViews.find((i) => i.fullPath === this.$route.fullPath)) {
          this.toLastView(visitedViews)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag).catch(() => {})
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === this.$route.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 135
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-badge {
  position: relative;
  top: 4px !important;
  margin-left: 4px;
  margin-right: 4px;
}
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
