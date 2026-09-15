import Layout from '@/layout'

const salesManagement = {
  path: '/salesManagement',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'addSalesPriceStrategy',
      component: (resolve) =>
        require(['@/views/salesManagement/salesPriceStrategy/addSalesPriceStrategy'], resolve),
      name: 'AddSalesPriceStrategy',
      meta: { title: 'addSalesPriceStrategy', activeMenu: '/salesManagement/salesPriceStrategy' }
    },
    {
      path: 'editSalesPriceStrategy',
      component: (resolve) =>
        require(['@/views/salesManagement/salesPriceStrategy/editSalesPriceStrategy'], resolve),
      name: 'EditSalesPriceStrategy',
      meta: { title: 'editSalesPriceStrategy', activeMenu: '/salesManagement/salesPriceStrategy' }
    },
    {
      path: 'batchEditSalesPriceStrategy',
      component: (resolve) =>
        require([
          '@/views/salesManagement/salesPriceStrategy/batchEditSalesPriceStrategy'
        ], resolve),
      name: 'BatchEditSalesPriceStrategy',
      meta: { title: 'editSalesPriceStrategy', activeMenu: '/salesManagement/salesPriceStrategy' }
    },
    {
      path: 'editServicePriceList',
      component: (resolve) =>
        require(['@/views/salesManagement/servicePriceList/editServicePriceList'], resolve),
      name: 'EditServicePriceList',
      meta: { title: 'editServicePriceList', activeMenu: '/salesManagement/servicePriceList' }
    },
    {
      path: 'addQuestionnaireTemplate',
      component: (resolve) =>
        require([
          '@/views/salesManagement/questionnaireTemplate/addQuestionnaireTemplate'
        ], resolve),
      name: 'AddQuestionnaireTemplate',
      meta: {
        title: 'addQuestionnaireTemplate',
        activeMenu: '/salesManagement/questionnaireTemplate'
      }
    },
    {
      path: 'editQuestionnaireTemplate',
      component: (resolve) =>
        require([
          '@/views/salesManagement/questionnaireTemplate/editQuestionnaireTemplate'
        ], resolve),
      name: 'EditQuestionnaireTemplate',
      meta: {
        title: 'editQuestionnaireTemplate',
        activeMenu: '/salesManagement/questionnaireTemplate'
      }
    },
    {
      path: 'viewQuestionnaireTemplate',
      component: (resolve) =>
        require([
          '@/views/salesManagement/questionnaireTemplate/viewQuestionnaireTemplate'
        ], resolve),
      name: 'ViewQuestionnaireTemplate',
      meta: {
        title: 'viewQuestionnaireTemplate',
        activeMenu: '/salesManagement/questionnaireTemplate'
      }
    },
    {
      path: 'writeQuestionnaireTemplate',
      component: (resolve) =>
        require([
          '@/views/salesManagement/questionnaireTemplate/writeQuestionnaireTemplate'
        ], resolve),
      name: 'WriteQuestionnaireTemplate',
      meta: {
        title: 'writeQuestionnaireTemplate',
        activeMenu: '/salesManagement/questionnaireTemplate'
      }
    },

    {
      path: 'addServiceOrder',
      component: (resolve) =>
        require(['@/views/salesManagement/serviceOrder/addServiceOrder'], resolve),
      name: 'AddServiceOrder',
      meta: { title: 'addServiceOrder', activeMenu: '/salesManagement/serviceOrder' }
    },
    {
      path: 'editServiceOrder',
      component: (resolve) =>
        require(['@/views/salesManagement/serviceOrder/editServiceOrder'], resolve),
      name: 'EditServiceOrder',
      meta: { title: 'editServiceOrder', activeMenu: '/salesManagement/serviceOrder' }
    },
    {
      path: 'viewServiceOrder',
      component: (resolve) =>
        require(['@/views/salesManagement/serviceOrder/viewServiceOrder'], resolve),
      name: 'ViewServiceOrder',
      meta: { title: 'viewServiceOrder', activeMenu: '/salesManagement/serviceOrder' }
    },

    {
      path: 'addSalesInquiry',
      component: (resolve) =>
        require(['@/views/salesManagement/salesInquiry/addSalesInquiry'], resolve),
      name: 'AddSalesInquiry',
      meta: { title: 'addSalesInquiry', activeMenu: '/salesManagement/salesInquiry' }
    },
    {
      path: 'editSalesInquiry',
      component: (resolve) =>
        require(['@/views/salesManagement/salesInquiry/editSalesInquiry'], resolve),
      name: 'EditSalesInquiry',
      meta: { title: 'editSalesInquiry', activeMenu: '/salesManagement/salesInquiry' }
    },
    {
      path: 'viewSalesInquiry',
      component: (resolve) =>
        require(['@/views/salesManagement/salesInquiry/viewSalesInquiry'], resolve),
      name: 'ViewSalesInquiry',
      meta: { title: 'viewSalesInquiry', activeMenu: '/salesManagement/salesInquiry' }
    },
    {
      path: 'addSalesQuotation',
      component: (resolve) =>
        require(['@/views/salesManagement/salesQuotation/addSalesQuotation'], resolve),
      name: 'AddSalesQuotation',
      meta: { title: 'addSalesQuotation', activeMenu: '/salesManagement/salesQuotation' }
    },
    {
      path: 'editSalesQuotation',
      component: (resolve) =>
        require(['@/views/salesManagement/salesQuotation/editSalesQuotation'], resolve),
      name: 'EditSalesQuotation',
      meta: { title: 'editSalesQuotation', activeMenu: '/salesManagement/salesQuotation' }
    },
    {
      path: 'reviseSalesQuotation',
      component: (resolve) =>
        require(['@/views/salesManagement/salesQuotation/reviseSalesQuotation'], resolve),
      name: 'ReviseSalesQuotation',
      meta: { title: 'reviseSalesQuotation', activeMenu: '/salesManagement/salesQuotation' }
    },
    {
      path: 'viewSalesQuotation',
      component: (resolve) =>
        require(['@/views/salesManagement/salesQuotation/viewSalesQuotation'], resolve),
      name: 'ViewSalesQuotation',
      meta: { title: 'viewSalesQuotation', activeMenu: '/salesManagement/salesQuotation' }
    },

    {
      path: 'editSalesOrder',
      component: (resolve) =>
        require(['@/views/salesManagement/salesOrder/editSalesOrder'], resolve),
      name: 'EditSalesOrder',
      meta: { title: 'editSalesOrder', activeMenu: '/salesManagement/salesOrder' }
    },
    {
      path: 'viewSalesOrder',
      component: (resolve) =>
        require(['@/views/salesManagement/salesOrder/viewSalesOrder'], resolve),
      name: 'ViewSalesOrder',
      meta: { title: 'viewSalesOrder', activeMenu: '/salesManagement/salesOrder' }
    },

    {
      path: 'addProformaInvoice',
      component: (resolve) =>
        require(['@/views/salesManagement/proformaInvoice/addProformaInvoice'], resolve),
      name: 'AddProformaInvoice',
      meta: { title: 'addProformaInvoice', activeMenu: '/salesManagement/proformaInvoice' }
    },
    {
      path: 'editProformaInvoice',
      component: (resolve) =>
        require(['@/views/salesManagement/proformaInvoice/editProformaInvoice'], resolve),
      name: 'EditProformaInvoice',
      meta: { title: 'editProformaInvoice', activeMenu: '/salesManagement/proformaInvoice' }
    },
    {
      path: 'reviseProformaInvoice',
      component: (resolve) =>
        require(['@/views/salesManagement/proformaInvoice/reviseProformaInvoice'], resolve),
      name: 'ReviseProformaInvoice',
      meta: { title: 'reviseProformaInvoice', activeMenu: '/salesManagement/proformaInvoice' }
    },
    {
      path: 'viewProformaInvoice',
      component: (resolve) =>
        require(['@/views/salesManagement/proformaInvoice/viewProformaInvoice'], resolve),
      name: 'ViewProformaInvoice',
      meta: { title: 'viewProformaInvoice', activeMenu: '/salesManagement/proformaInvoice' }
    },

    {
      path: 'deliverySchedule',
      component: (resolve) =>
        require(['@/views/salesManagement/salesOrder/deliverySchedule/deliverySchedule'], resolve),
      name: 'DeliverySchedule',
      meta: { title: 'deliverySchedule', activeMenu: '/salesManagement/salesOrder' }
    },
    {
      path: 'paymentSchedule',
      component: (resolve) =>
        require(['@/views/salesManagement/salesOrder/paymentSchedule/paymentSchedule'], resolve),
      name: 'PaymentSchedule',
      meta: { title: 'paymentSchedule', activeMenu: '/salesManagement/salesOrder' }
    },

    {
      path: 'addRequestTrial',
      component: (resolve) =>
        require(['@/views/salesManagement/requestTrial/addRequestTrial'], resolve),
      name: 'AddRequestTrial',
      meta: { title: 'addRequestTrial', activeMenu: '/salesManagement/salesOrder' }
    },
    {
      path: 'editRequestTrial',
      component: (resolve) =>
        require(['@/views/salesManagement/requestTrial/editRequestTrial'], resolve),
      name: 'EditRequestTrial',
      meta: { title: 'editRequestTrial', activeMenu: '/salesManagement/salesOrder' }
    },
    {
      path: 'viewRequestTrial',
      component: (resolve) =>
        require(['@/views/salesManagement/requestTrial/viewRequestTrial'], resolve),
      name: 'ViewRequestTrial',
      meta: { title: 'viewRequestTrial', activeMenu: '/salesManagement/salesOrder' }
    },

    {
      path: 'addPreDeliveryNotice',
      component: (resolve) =>
        require(['@/views/salesManagement/preDeliveryNotice/addPreDeliveryNotice'], resolve),
      name: 'AddPreDeliveryNotice',
      meta: { title: 'addPreDeliveryNotice', activeMenu: '/salesManagement/preDeliveryNotice' }
    },
    {
      path: 'editPreDeliveryNotice',
      component: (resolve) =>
        require(['@/views/salesManagement/preDeliveryNotice/editPreDeliveryNotice'], resolve),
      name: 'EditPreDeliveryNotice',
      meta: { title: 'editPreDeliveryNotice', activeMenu: '/salesManagement/preDeliveryNotice' }
    },
    {
      path: 'viewPreDeliveryNotice',
      component: (resolve) =>
        require(['@/views/salesManagement/preDeliveryNotice/viewPreDeliveryNotice'], resolve),
      name: 'ViewPreDeliveryNotice',
      meta: { title: 'viewPreDeliveryNotice', activeMenu: '/salesManagement/preDeliveryNotice' }
    },
    {
      path: 'editDeliveryOrder',
      component: (resolve) =>
        require(['@/views/salesManagement/deliveryOrder/editDeliveryOrder'], resolve),
      name: 'EditDeliveryOrder',
      meta: { title: 'viewDeliveryOrder', activeMenu: '/salesManagement/deliveryOrder' }
    },
    {
      path: 'viewDeliveryOrder',
      component: (resolve) =>
        require(['@/views/salesManagement/deliveryOrder/viewDeliveryOrder'], resolve),
      name: 'ViewDeliveryOrder',
      meta: { title: 'viewDeliveryOrder', activeMenu: '/salesManagement/deliveryOrder' }
    },
    {
      path: 'rejectDeliveryOrder',
      component: (resolve) =>
        require(['@/views/salesManagement/deliveryOrder/rejectDeliveryOrder'], resolve),
      name: 'RejectDeliveryOrder',
      meta: { title: 'rejectDeliveryOrder', activeMenu: '/salesManagement/deliveryOrder' }
    },

    {
      path: 'addSalesGoodsReturn',
      component: (resolve) =>
        require(['@/views/salesManagement/salesGoodsReturn/addSalesGoodsReturn'], resolve),
      name: 'AddSalesGoodsReturn',
      meta: { title: 'addSalesGoodsReturn', activeMenu: '/salesManagement/salesGoodsReturn' }
    },
    {
      path: 'editSalesGoodsReturn',
      component: (resolve) =>
        require(['@/views/salesManagement/salesGoodsReturn/editSalesGoodsReturn'], resolve),
      name: 'EditSalesGoodsReturn',
      meta: { title: 'editSalesGoodsReturn', activeMenu: '/salesManagement/salesGoodsReturn' }
    },
    {
      path: 'viewSalesGoodsReturn',
      component: (resolve) =>
        require(['@/views/salesManagement/salesGoodsReturn/viewSalesGoodsReturn'], resolve),
      name: 'ViewSalesGoodsReturn',
      meta: { title: 'viewSalesGoodsReturn', activeMenu: '/salesManagement/salesGoodsReturn' }
    },
    {
      path: 'addCompetitiveMaterials',
      component: (resolve) =>
        require(['@/views/salesManagement/competitiveMaterials/addCompetitiveMaterials'], resolve),
      name: 'AddCompetitiveMaterials',
      meta: {
        title: 'addCompetitiveMaterials',
        activeMenu: '/salesManagement/competitiveMaterials'
      }
    },
    {
      path: 'editCompetitiveMaterials',
      component: (resolve) =>
        require(['@/views/salesManagement/competitiveMaterials/editCompetitiveMaterials'], resolve),
      name: 'EditCompetitiveMaterials',
      meta: {
        title: 'editCompetitiveMaterials',
        activeMenu: '/salesManagement/competitiveMaterials'
      }
    },
    {
      path: 'addProductTypesChoosing',
      component: (resolve) =>
        require(['@/views/salesManagement/productTypesChoosing/addProductTypesChoosing'], resolve),
      name: 'AddProductTypesChoosing',
      meta: {
        title: 'addProductTypesChoosing',
        activeMenu: '/salesManagement/productTypesChoosing'
      }
    },
    {
      path: 'editProductTypesChoosing',
      component: (resolve) =>
        require(['@/views/salesManagement/productTypesChoosing/editProductTypesChoosing'], resolve),
      name: 'EditProductTypesChoosing',
      meta: {
        title: 'editProductTypesChoosing',
        activeMenu: '/salesManagement/productTypesChoosing'
      }
    },
    {
      path: 'addCostSettings',
      component: (resolve) =>
        require(['@/views/salesManagement/salesCost/addCostSettings'], resolve),
      name: 'AddCostSettings',
      meta: {
        title: 'addCostSettings',
        activeMenu: '/salesManagement/salesCost'
      }
    },
    {
      path: 'editCostSettings',
      component: (resolve) =>
        require(['@/views/salesManagement/salesCost/editCostSettings'], resolve),
      name: 'EditCostSettings',
      meta: {
        title: 'editCostSettings',
        activeMenu: '/salesManagement/salesCost'
      }
    },
    {
      path: 'addSalesPrice',
      component: (resolve) =>
        require(['@/views/salesManagement/salesPrice/addSalesPrice'], resolve),
      name: 'AddSalesPrice',
      meta: {
        title: 'addSalesPrice',
        activeMenu: '/salesManagement/salesPrice'
      }
    },
    {
      path: 'editSalesPrice',
      component: (resolve) =>
        require(['@/views/salesManagement/salesPrice/editSalesPrice'], resolve),
      name: 'EditSalesPrice',
      meta: {
        title: 'editSalesPrice',
        activeMenu: '/salesManagement/salesPrice'
      }
    }
  ]
}

export default salesManagement
