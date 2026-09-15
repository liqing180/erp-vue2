import Layout from '@/layout'
import addPurchaseRequisition from '@/views/purchaseManagement/purchaseRequisition/addPurchaseRequisition'
const productManagement = {
  path: '/purchaseManagement',
  component: Layout,
  hidden: true,
  children: [
    /* 采购申请 */
    {
      path: 'addPurchaseRequisition',
      component: addPurchaseRequisition,
      name: 'AddPurchaseRequisition',
      meta: {
        title: 'addPurchaseRequisition',
        activeMenu: '/purchaseManagement/purchaseRequisition'
      }
    },
    {
      path: 'editPurchaseRequisition',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/purchaseRequisition/editPurchaseRequisition'
        ], resolve),
      name: 'EditPurchaseRequisition',
      meta: {
        title: 'editPurchaseRequisition',
        activeMenu: '/purchaseManagement/purchaseRequisition'
      }
    },
    {
      path: 'revisePurchaseRequisition',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/purchaseRequisition/revisePurchaseRequisition'
        ], resolve),
      name: 'RevisePurchaseRequisition',
      meta: {
        title: 'revisePurchaseRequisition',
        activeMenu: '/purchaseManagement/purchaseRequisition'
      }
    },
    {
      path: 'viewPurchaseRequisition',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/purchaseRequisition/viewPurchaseRequisition'
        ], resolve),
      name: 'ViewPurchaseRequisition',
      meta: {
        title: 'viewPurchaseRequisition',
        activeMenu: '/purchaseManagement/purchaseRequisition'
      }
    },
    /* RFQ */
    {
      path: 'addRequestForQuotation',
      component: (resolve) =>
        require(['@/views/purchaseManagement/requestForQuotation/addRequestForQuotation'], resolve),
      name: 'AddRequestForQuotation',
      meta: {
        title: 'addRequestForQuotation',
        activeMenu: '/purchaseManagement/requestForQuotation'
      }
    },
    {
      path: 'viewRequestForQuotation',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/requestForQuotation/viewRequestForQuotation'
        ], resolve),
      name: 'ViewRequestForQuotation',
      meta: {
        title: 'viewRequestForQuotation',
        activeMenu: '/purchaseManagement/requestForQuotation'
      }
    },
    {
      path: 'editRequestForQuotation',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/requestForQuotation/editRequestForQuotation'
        ], resolve),
      name: 'EditRequestForQuotation',
      meta: {
        title: 'editRequestForQuotation',
        activeMenu: '/purchaseManagement/requestForQuotation'
      }
    },
    /* 采购报价 */
    {
      path: 'addPurchaseQuotation',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseQuotation/addPurchaseQuotation'], resolve),
      name: 'AddPurchaseQuotation',
      meta: { title: 'addPurchaseQuotation', activeMenu: '/purchaseManagement/purchaseQuotation' }
    },
    {
      path: 'editPurchaseQuotation',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseQuotation/editPurchaseQuotation'], resolve),
      name: 'EditPurchaseQuotation',
      meta: { title: 'editPurchaseQuotation', activeMenu: '/purchaseManagement/purchaseQuotation' }
    },
    {
      path: 'revisePurchaseQuotation',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseQuotation/revisePurchaseQuotation'], resolve),
      name: 'RevisePurchaseQuotation',
      meta: {
        title: 'revisePurchaseQuotation',
        activeMenu: '/purchaseManagement/purchaseQuotation'
      }
    },
    {
      path: 'viewPurchaseQuotation',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseQuotation/viewPurchaseQuotation'], resolve),
      name: 'ViewPurchaseQuotation',
      meta: { title: 'viewPurchaseQuotation', activeMenu: '/purchaseManagement/purchaseQuotation' }
    },
    /* 采购订单 PO */
    {
      path: 'addPurchaseOrder',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseOrder/addPurchaseOrder'], resolve),
      name: 'AddPurchaseOrder',
      meta: { title: 'addPurchaseOrder', activeMenu: '/purchaseManagement/purchaseOrder' }
    },
    {
      path: 'editPurchaseOrder',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseOrder/editPurchaseOrder'], resolve),
      name: 'EditPurchaseOrder',
      meta: { title: 'editPurchaseOrder', activeMenu: '/purchaseManagement/purchaseOrder' }
    },
    {
      path: 'revisePurchaseOrder',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseOrder/revisePurchaseOrder'], resolve),
      name: 'RevisePurchaseOrder',
      meta: { title: 'revisePurchaseOrder', activeMenu: '/purchaseManagement/purchaseOrder' }
    },
    {
      path: 'viewPurchaseOrder',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseOrder/viewPurchaseOrder'], resolve),
      name: 'ViewPurchaseOrder',
      meta: { title: 'viewPurchaseOrder', activeMenu: '/purchaseManagement/purchaseOrder' }
    },
    /* {
      path: 'addLogistics',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseOrder/logistics/addLogistics'], resolve),
      name: 'AddLogistics',
      meta: { title: 'addLogistics', activeMenu: '/purchaseManagement/purchaseOrder' }
    },
    {
      path: 'editLogistics',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseOrder/logistics/editLogistics'], resolve),
      name: 'EditLogistics',
      meta: { title: 'editLogistics', activeMenu: '/purchaseManagement/purchaseOrder' }
    },
    {
      path: 'viewLogistics',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseOrder/logistics/viewLogistics'], resolve),
      name: 'ViewLogistics',
      meta: { title: 'viewLogistics', activeMenu: '/purchaseManagement/purchaseOrder' }
    }, */
    /* 新的物流成本菜单 */
    {
      path: 'addLogisticsCost',
      component: (resolve) =>
        require(['@/views/purchaseManagement/logisticsCost/addLogisticsCost'], resolve),
      name: 'AddLogisticsCost',
      meta: { title: 'addLogisticsCost', activeMenu: '/purchaseManagement/logisticsCost' }
    },
    {
      path: 'editLogisticsCost',
      component: (resolve) =>
        require(['@/views/purchaseManagement/logisticsCost/editLogisticsCost'], resolve),
      name: 'EditLogisticsCost',
      meta: { title: 'editLogisticsCost', activeMenu: '/purchaseManagement/logisticsCost' }
    },
    {
      path: 'reviseLogisticsCost',
      component: (resolve) =>
        require(['@/views/purchaseManagement/logisticsCost/reviseLogisticsCost'], resolve),
      name: 'ReviseLogisticsCost',
      meta: { title: 'reviseLogisticsCost', activeMenu: '/purchaseManagement/logisticsCost' }
    },
    {
      path: 'viewLogisticsCost',
      component: (resolve) =>
        require(['@/views/purchaseManagement/logisticsCost/viewLogisticsCost'], resolve),
      name: 'ViewLogisticsCost',
      meta: { title: 'viewLogisticsCost', activeMenu: '/purchaseManagement/logisticsCost' }
    },
    /* 采购合同 */
    {
      path: 'addPurchaseContract',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseContract/addPurchaseContract'], resolve),
      name: 'AddPurchaseContract',
      meta: { title: 'addPurchaseContract', activeMenu: '/purchaseManagement/purchaseContract' }
    },
    {
      path: 'editPurchaseContract',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseContract/editPurchaseContract'], resolve),
      name: 'EditPurchaseContract',
      meta: { title: 'editPurchaseContract', activeMenu: '/purchaseManagement/purchaseContract' }
    },
    {
      path: 'revisePurchaseContract',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseContract/revisePurchaseContract'], resolve),
      name: 'RevisePurchaseContract',
      meta: { title: 'revisePurchaseContract', activeMenu: '/purchaseManagement/purchaseContract' }
    },
    {
      path: 'viewPurchaseContract',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseContract/viewPurchaseContract'], resolve),
      name: 'ViewPurchaseContract',
      meta: { title: 'viewPurchaseContract', activeMenu: '/purchaseManagement/purchaseContract' }
    },
    /* 采购入库 */
    {
      path: 'viewPurchaseStockIn',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseStockIn/viewPurchaseStockIn'], resolve),
      name: 'ViewPurchaseStockIn',
      meta: { title: 'viewPurchaseStockIn', activeMenu: '/purchaseManagement/purchaseStockIn' }
    },
    /* 采购退货单 */
    {
      path: 'addPurchaseReturnOrder',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchaseReturnOrder/addPurchaseReturnOrder'], resolve),
      name: 'AddPurchaseReturnOrder',
      meta: {
        title: 'addPurchaseReturnOrder',
        activeMenu: '/purchaseManagement/purchaseReturnOrder'
      }
    },
    {
      path: 'addConsignmentReturnOrder',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/purchaseReturnOrder/addConsignmentReturnOrder'
        ], resolve),
      name: 'AddConsignmentReturnOrder',
      meta: {
        title: 'addConsignmentReturnOrder',
        activeMenu: '/purchaseManagement/purchaseReturnOrder'
      }
    },
    {
      path: 'addPurchaseDirectShippingReturn',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/purchaseReturnOrder/addPurchaseDirectShippingReturn'
        ], resolve),
      name: 'AddPurchaseDirectShippingReturn',
      meta: {
        title: 'addPurchaseDirectShippingReturn',
        activeMenu: '/purchaseManagement/purchaseReturnOrder'
      }
    },
    {
      path: 'editPurchaseReturnOrder',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/purchaseReturnOrder/editPurchaseReturnOrder'
        ], resolve),
      name: 'EditPurchaseReturnOrder',
      meta: {
        title: 'editPurchaseReturnOrder',
        activeMenu: '/purchaseManagement/purchaseReturnOrder'
      }
    },
    {
      path: 'editConsignmentReturnOrder',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/purchaseReturnOrder/editConsignmentReturnOrder'
        ], resolve),
      name: 'EditConsignmentReturnOrder',
      meta: {
        title: 'editConsignmentReturnOrder',
        activeMenu: '/purchaseManagement/purchaseReturnOrder'
      }
    },
    {
      path: 'viewPurchaseReturnOrder',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/purchaseReturnOrder/viewPurchaseReturnOrder'
        ], resolve),
      name: 'ViewPurchaseReturnOrder',
      meta: {
        title: 'viewPurchaseReturnOrder',
        activeMenu: '/purchaseManagement/purchaseReturnOrder'
      }
    },
    {
      path: 'viewConsignmentReturnOrder',
      component: (resolve) =>
        require([
          '@/views/purchaseManagement/purchaseReturnOrder/viewConsignmentReturnOrder'
        ], resolve),
      name: 'ViewConsignmentReturnOrder',
      meta: {
        title: 'viewConsignmentReturnOrder',
        activeMenu: '/purchaseManagement/purchaseReturnOrder'
      }
    },
    /* 寄售订单 */
    {
      path: 'addConsignmentOrder',
      component: (resolve) =>
        require(['@/views/purchaseManagement/consignmentOrder/addConsignmentOrder'], resolve),
      name: 'AddConsignmentOrder',
      meta: { title: 'addConsignmentOrder', activeMenu: '/purchaseManagement/consignmentOrder' }
    },
    {
      path: 'editConsignmentOrder',
      component: (resolve) =>
        require(['@/views/purchaseManagement/consignmentOrder/editConsignmentOrder'], resolve),
      name: 'EditConsignmentOrder',
      meta: { title: 'editConsignmentOrder', activeMenu: '/purchaseManagement/consignmentOrder' }
    },
    {
      path: 'viewConsignmentOrder',
      component: (resolve) =>
        require(['@/views/purchaseManagement/consignmentOrder/viewConsignmentOrder'], resolve),
      name: 'ViewConsignmentOrder',
      meta: { title: 'viewConsignmentOrder', activeMenu: '/purchaseManagement/consignmentOrder' }
    },

    {
      path: 'addConsignmentPickUp',
      component: (resolve) =>
        require(['@/views/purchaseManagement/consignmentPickUp/addConsignmentPickUp'], resolve),
      name: 'AddConsignmentPickUp',
      meta: { title: 'addConsignmentPickUp', activeMenu: '/purchaseManagement/consignmentPickUp' }
    },
    {
      path: 'editConsignmentPickUp',
      component: (resolve) =>
        require(['@/views/purchaseManagement/consignmentPickUp/editConsignmentPickUp'], resolve),
      name: 'EditConsignmentPickUp',
      meta: { title: 'editConsignmentPickUp', activeMenu: '/purchaseManagement/consignmentPickUp' }
    },
    {
      path: 'viewConsignmentPickUp',
      component: (resolve) =>
        require(['@/views/purchaseManagement/consignmentPickUp/viewConsignmentPickUp'], resolve),
      name: 'ViewConsignmentPickUp',
      meta: { title: 'viewConsignmentPickUp', activeMenu: '/purchaseManagement/consignmentPickUp' }
    },
    // {
    //   path: 'addCostSettings',
    //   component: (resolve) =>
    //     require(['@/views/purchaseManagement/inventoryCostAnalysis/addCostSettings'], resolve),
    //   name: 'AddCostSettings',
    //   meta: {
    //     title: 'addCostSettings',
    //     activeMenu: '/purchaseManagement/inventoryCostAnalysis'
    //   }
    // },
    // {
    //   path: 'editCostSettings',
    //   component: (resolve) =>
    //     require(['@/views/purchaseManagement/inventoryCostAnalysis/editCostSettings'], resolve),
    //   name: 'EditCostSettings1',
    //   meta: {
    //     title: 'editCostSettings',
    //     activeMenu: '/purchaseManagement/inventoryCostAnalysis'
    //   }
    // },
    {
      path: 'addSupplierContract',
      component: (resolve) =>
        require(['@/views/purchaseManagement/supplierContract/addSupplierContract'], resolve),
      name: 'AddSupplierContract',
      meta: { title: 'addSupplierContract', activeMenu: '/purchaseManagement/supplierContract' }
    },
    {
      path: 'editSupplierContract',
      component: (resolve) =>
        require(['@/views/purchaseManagement/supplierContract/editSupplierContract'], resolve),
      name: 'EditSupplierContract',
      meta: { title: 'editSupplierContract', activeMenu: '/purchaseManagement/supplierContract' }
    },
    {
      path: 'viewPurchasePriceList',
      component: (resolve) =>
        require(['@/views/purchaseManagement/purchasePriceList/viewPurchasePriceList'], resolve),
      name: 'ViewPurchasePriceList',
      meta: { title: 'viewPurchasePriceList', activeMenu: '/purchaseManagement/purchasePriceList' }
    },
    {
      path: 'addAsl',
      component: (resolve) => require(['@/views/purchaseManagement/asl/addAsl'], resolve),
      name: 'AddAsl',
      meta: { title: 'addAsl', activeMenu: '/purchaseManagement/asl' }
    },
    {
      path: 'editAsl',
      component: (resolve) => require(['@/views/purchaseManagement/asl/editAsl'], resolve),
      name: 'EditAsl',
      meta: { title: 'editAsl', activeMenu: '/purchaseManagement/asl' }
    },
    {
      path: 'reviseAsl',
      component: (resolve) => require(['@/views/purchaseManagement/asl/reviseAsl'], resolve),
      name: 'ReviseAsl',
      meta: { title: 'reviseAsl', activeMenu: '/purchaseManagement/asl' }
    },
    {
      path: 'viewAsl',
      component: (resolve) => require(['@/views/purchaseManagement/asl/viewAsl'], resolve),
      name: 'ViewAsl',
      meta: { title: 'viewAsl', activeMenu: '/purchaseManagement/asl' }
    }
  ]
}

export default productManagement
