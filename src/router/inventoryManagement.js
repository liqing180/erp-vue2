import Layout from '@/layout'

const inventoryManagement = {
  path: '/inventoryManagement',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'warehouseManagement/addWarehouse',
      component: (resolve) =>
        require([
          '@/views/inventoryManagement/warehouseManagement/warehouse/addWarehouse'
        ], resolve),
      name: 'AddWarehouse',
      meta: {
        title: 'addWarehouse',
        activeMenu: '/inventoryManagement/warehouseManagement/warehouse'
      }
    },
    {
      path: 'warehouseManagement/editWarehouse',
      component: (resolve) =>
        require([
          '@/views/inventoryManagement/warehouseManagement/warehouse/editWarehouse'
        ], resolve),
      name: 'EditWarehouse',
      meta: {
        title: 'editWarehouse',
        activeMenu: '/inventoryManagement/warehouseManagement/warehouse'
      }
    },
    {
      path: 'warehouseManagement/viewWarehouse',
      component: (resolve) =>
        require([
          '@/views/inventoryManagement/warehouseManagement/warehouse/viewWarehouse'
        ], resolve),
      name: 'ViewWarehouse',
      meta: {
        title: 'viewWarehouse',
        activeMenu: '/inventoryManagement/warehouseManagement/warehouse'
      }
    },

    {
      path: 'viewStockCertificate',
      component: (resolve) =>
        require(['@/views/inventoryManagement/stockCertificate/viewStockCertificate'], resolve),
      name: 'ViewStockCertificate',
      meta: { title: 'viewStockCertificate', activeMenu: '/inventoryManagement/stockCertificate' }
    },
    {
      path: 'safetyStock/addSafetyStock',
      component: (resolve) =>
        require(['@/views/inventoryManagement/safetyStock/addSafetyStock'], resolve),
      name: 'AddSafetyStock',
      meta: { title: 'addSafetyStock', activeMenu: '/inventoryManagement/safetyStock' }
    },
    {
      path: 'safetyStock/editSafetyStock',
      component: (resolve) =>
        require(['@/views/inventoryManagement/safetyStock/editSafetyStock'], resolve),
      name: 'EditSafetyStock',
      meta: { title: 'editSafetyStock', activeMenu: '/inventoryManagement/safetyStock' }
    },
    {
      path: 'addTransferOrder',
      component: (resolve) =>
        require(['@/views/inventoryManagement/transferOrder/addTransferOrder'], resolve),
      name: 'AddTransferOrder',
      meta: { title: 'addTransferOrder', activeMenu: '/inventoryManagement/transferOrder' }
    },
    {
      path: 'editTransferOrder',
      component: (resolve) =>
        require(['@/views/inventoryManagement/transferOrder/editTransferOrder'], resolve),
      name: 'EditTransferOrder',
      meta: { title: 'editTransferOrder', activeMenu: '/inventoryManagement/transferOrder' }
    },
    {
      path: 'viewTransferOrder',
      component: (resolve) =>
        require(['@/views/inventoryManagement/transferOrder/viewTransferOrder'], resolve),
      name: 'ViewTransferOrder',
      meta: { title: 'editTransferOrder', activeMenu: '/inventoryManagement/transferOrder' }
    },

    {
      path: 'addInventoryAudit',
      component: (resolve) =>
        require(['@/views/inventoryManagement/inventoryAudit/addInventoryAudit'], resolve),
      name: 'AddInventoryAudit',
      meta: { title: 'addInventoryAudit', activeMenu: '/inventoryManagement/inventoryAudit' }
    },
    {
      path: 'editInventoryAudit',
      component: (resolve) =>
        require(['@/views/inventoryManagement/inventoryAudit/editInventoryAudit'], resolve),
      name: 'EditInventoryAudit',
      meta: { title: 'editInventoryAudit', activeMenu: '/inventoryManagement/inventoryAudit' }
    },
    {
      path: 'editInventoryAdjustment',
      component: (resolve) =>
        require(['@/views/inventoryManagement/inventoryAudit/editInventoryAdjustment'], resolve),
      name: 'EditInventoryAdjustment',
      meta: { title: 'editInventoryAdjustment', activeMenu: '/inventoryManagement/inventoryAudit' }
    },
    {
      path: 'viewInventoryAudit',
      component: (resolve) =>
        require(['@/views/inventoryManagement/inventoryAudit/viewInventoryAudit'], resolve),
      name: 'ViewInventoryAudit',
      meta: { title: 'viewInventoryAudit', activeMenu: '/inventoryManagement/inventoryAudit' }
    },
    {
      path: 'viewInventoryAdjustment',
      component: (resolve) =>
        require(['@/views/inventoryManagement/inventoryAudit/viewInventoryAdjustment'], resolve),
      name: 'ViewInventoryAdjustment',
      meta: { title: 'viewInventoryAdjustment', activeMenu: '/inventoryManagement/inventoryAudit' }
    },

    {
      path: 'addInventoryInitialization',
      component: (resolve) =>
        require([
          '@/views/inventoryManagement/inventoryInitialization/addInventoryInitialization'
        ], resolve),
      name: 'AddInventoryInitialization',
      meta: {
        title: 'addInventoryInitialization',
        activeMenu: '/inventoryManagement/inventoryInitialization'
      }
    },
    {
      path: 'viewInventoryInitialization',
      component: (resolve) =>
        require([
          '@/views/inventoryManagement/inventoryInitialization/viewInventoryInitialization'
        ], resolve),
      name: 'ViewInventoryInitialization',
      meta: {
        title: 'viewInventoryInitialization',
        activeMenu: '/inventoryManagement/inventoryInitialization'
      }
    },
    {
      path: 'addCostSettings',
      component: (resolve) =>
        require(['@/views/inventoryManagement/inventoryCostAnalysis/addCostSettings'], resolve),
      name: 'AddCostSettings1',
      meta: {
        title: 'addCostSettings',
        activeMenu: '/inventoryManagement/inventoryCostAnalysis'
      }
    },
    {
      path: 'editCostSettings',
      component: (resolve) =>
        require(['@/views/inventoryManagement/inventoryCostAnalysis/editCostSettings'], resolve),
      name: 'EditCostSettings1',
      meta: {
        title: 'editCostSettings',
        activeMenu: '/inventoryManagement/inventoryCostAnalysis'
      }
    },
    /* 紧急收货单 */
    {
      path: 'addEmergencyGoodsReceipt',
      component: (resolve) =>
        require([
          '@/views/inventoryManagement/emergencyGoodsReceipt/addEmergencyGoodsReceipt'
        ], resolve),
      name: 'AddEmergencyGoodsReceipt',
      meta: {
        title: 'addEmergencyGoodsReceipt',
        activeMenu: '/inventoryManagement/emergencyGoodsReceipt'
      }
    },
    {
      path: 'editEmergencyGoodsReceipt',
      component: (resolve) =>
        require([
          '@/views/inventoryManagement/emergencyGoodsReceipt/editEmergencyGoodsReceipt'
        ], resolve),
      name: 'EditEmergencyGoodsReceipt',
      meta: {
        title: 'editEmergencyGoodsReceipt',
        activeMenu: '/inventoryManagement/emergencyGoodsReceipt'
      }
    },
    {
      path: 'viewEmergencyGoodsReceipt',
      component: (resolve) =>
        require([
          '@/views/inventoryManagement/emergencyGoodsReceipt/viewEmergencyGoodsReceipt'
        ], resolve),
      name: 'ViewEmergencyGoodsReceipt',
      meta: {
        title: 'viewEmergencyGoodsReceipt',
        activeMenu: '/inventoryManagement/emergencyGoodsReceipt'
      }
    }
  ]
}

export default inventoryManagement
