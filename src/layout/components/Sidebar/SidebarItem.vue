<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
          style="position: relative"
          @click="menuItemClick(onlyOneChild)"
        >
          <template v-if="onlyOneChild.name === 'ToDoTask'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              v-if="bpmTaskCountData.myTodoTaskCount"
              :max="99"
              :value="bpmTaskCountData.myTodoTaskCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'ProcessPendingAction'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              v-if="bpmTaskCountData.systemTodoTaskCount"
              :max="99"
              :value="bpmTaskCountData.systemTodoTaskCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'InventoryAudit'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="inventoryCountData.auditPendingCount"
              :value="inventoryCountData.auditPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'StoreIssueChit'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="inventoryCountData.storeIssueChitPendingCount"
              :value="inventoryCountData.storeIssueChitPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'EmergencyGoodsReceipt'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="inventoryCountData.egrPendingCount"
              :value="inventoryCountData.egrPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <!-- 销售模块 -->
          <template v-else-if="onlyOneChild.name === 'SalesInquiry'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              v-if="salesCountData.siPendingCount"
              :max="99"
              :value="salesCountData.siPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'SalesQuotation'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              v-if="salesCountData.sqPendingCount"
              :max="99"
              :value="salesCountData.sqPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'SalesOrder'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="salesCountData.soPendingCount"
              :value="salesCountData.soPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'PreDeliveryNotice'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="salesCountData.pdnPendingCount"
              :value="salesCountData.pdnPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'SalesGoodsReturn'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              v-if="salesCountData.sgrPendingCount"
              :max="99"
              :value="salesCountData.sgrPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>

          <template v-else-if="onlyOneChild.name === 'ProformaInvoice'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              v-if="salesCountData.piPendingCount"
              :max="99"
              :value="salesCountData.piPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <!-- 采购模块 -->
          <template v-else-if="onlyOneChild.name === 'PurchaseRequisition'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              v-if="purchaseCountData.prPendingCount"
              :max="99"
              :value="purchaseCountData.prPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'RequestForQuotation'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="purchaseCountData.rfqPendingCount"
              :value="purchaseCountData.rfqPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'PurchaseQuotation'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="purchaseCountData.pqPendingCount"
              :value="purchaseCountData.pqPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'PurchaseOrder'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="purchaseCountData.poPendingCount"
              :value="purchaseCountData.poPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'PurchaseReturnOrder'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="purchaseCountData.purchaseReturnPendingCount"
              :value="purchaseCountData.purchaseReturnPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <template v-else-if="onlyOneChild.name === 'ConsignmentOrder'">
            <span class="flow1 mr10">
              <item
                :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                :title="onlyOneChild.meta.title"
              />
            </span>
            <el-badge
              :max="99"
              v-if="purchaseCountData.consignmentOrderPendingCount"
              :value="purchaseCountData.consignmentOrderPendingCount"
              class="bpm-item"
            >
            </el-badge>
          </template>
          <item
            v-else
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
          <span> </span>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <!-- <span class="flow1 mr10">
          <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
        </span> -->
        <template
          v-if="
            [
              'Bpm',
              'MyTask',
              'AdministratorOperation',
              'InventoryManagement',
              'ProjectManagement',
              'SalesManagement',
              'PurchaseManagement'
            ].includes(item.name)
          "
        >
          <div class="flow1 mr10">
            <item
              :icon="item.meta.icon || (item.meta && item.meta.icon)"
              :title="item.meta.title"
            />
          </div>
          <el-badge
            v-if="item.name === 'Bpm' && bpmTaskCountData.allTodoTaskCount"
            :max="99"
            :value="bpmTaskCountData.allTodoTaskCount"
            is-dot
            class="bpm-item"
          >
          </el-badge>
          <el-badge
            v-if="item.name === 'MyTask' && bpmTaskCountData.myTodoTaskCount"
            :max="99"
            :value="bpmTaskCountData.myTodoTaskCount"
            is-dot
            class="bpm-item"
          >
          </el-badge>
          <el-badge
            v-if="item.name === 'AdministratorOperation' && bpmTaskCountData.systemTodoTaskCount"
            :max="99"
            :value="bpmTaskCountData.systemTodoTaskCount"
            is-dot
            class="bpm-item"
          >
          </el-badge>
          <el-badge
            v-if="item.name === 'InventoryManagement' && comInventoryManagementCount > 0"
            :max="99"
            :value="comInventoryManagementCount"
            is-dot
            class="bpm-item"
          >
          </el-badge>
          <el-badge
            v-if="
              item.name === 'ProjectManagement' && inventoryCountData.storeIssueChitPendingCount
            "
            :max="99"
            :value="inventoryCountData.storeIssueChitPendingCount"
            is-dot
            class="bpm-item"
          >
          </el-badge>
          <el-badge
            v-if="item.name === 'SalesManagement' && comSalesManagementCount > 0"
            :max="99"
            :value="comSalesManagementCount"
            is-dot
            class="bpm-item"
          >
          </el-badge>
          <el-badge
            v-if="item.name === 'PurchaseManagement' && comPurchaseManagementCount > 0"
            :max="99"
            :value="comPurchaseManagementCount"
            is-dot
            class="bpm-item"
          >
          </el-badge>
        </template>
        <item v-else-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  computed: {
    bpmTaskCountData() {
      return this.$store.getters.bpmTaskCountData
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
    comSalesManagementCount() {
      const data = this.salesCountData
      return (
        (data.siPendingCount || 0) +
        (data.sqPendingCount || 0) +
        (data.soPendingCount || 0) +
        (data.pdnPendingCount || 0) +
        (data.sgrPendingCount || 0) +
        (data.piPendingCount || 0)
      )
    },
    comPurchaseManagementCount() {
      const data = this.purchaseCountData
      return (
        (data.prPendingCount || 0) +
        (data.rfqPendingCount || 0) +
        (data.pqPendingCount || 0) +
        (data.poPendingCount || 0) +
        (data.purchaseReturnPendingCount || 0) +
        (data.consignmentOrderPendingCount || 0)
      )
    },
    comInventoryManagementCount() {
      const data = this.inventoryCountData
      return (data.auditPendingCount || 0) + (data.egrPendingCount || 0)
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      if (!children) {
        children = []
      }
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath, routeQuery) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      if (routeQuery) {
        const query = JSON.parse(routeQuery)
        return { path: path.resolve(this.basePath, routePath), query: query }
      }
      return path.resolve(this.basePath, routePath)
    },
    menuItemClick(item) {
      if (this.$route.name === item.name) {
        if (item.name === 'ToDoTask') {
          this.$EventBus.$emit('toDoTaskQueryList')
        }
        if (item.name === 'ProcessPendingAction') {
          this.$EventBus.$emit('processPendingActionQueryList')
        }
      }
    }
  }
}
</script>

<style scoped>
.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bpm-item {
  flex-shrink: 0;
  position: absolute;
  right: 6px;
  top: 0;
  z-index: 300;
}
</style>
