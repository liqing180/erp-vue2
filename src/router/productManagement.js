import Layout from '@/layout'

const productManagement = {
  path: '/productManagement',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'addProductCategory',
      component: (resolve) =>
        require(['@/views/productManagement/productCategory/addProductCategory'], resolve),
      name: 'AddProductCategory',
      meta: { title: 'addProductCategory', activeMenu: '/productManagement/productCategory' }
    },
    {
      path: 'editProductCategory',
      component: (resolve) =>
        require(['@/views/productManagement/productCategory/editProductCategory'], resolve),
      name: 'EditProductCategory',
      meta: { title: 'editProductCategory', activeMenu: '/productManagement/productCategory' }
    },
    {
      path: 'addProductInfo',
      component: (resolve) =>
        require(['@/views/productManagement/productInfo/addProductInfo'], resolve),
      name: 'AddProductInfo',
      meta: { title: 'addProductInfo', activeMenu: '/productManagement/productInfo' }
    },
    {
      path: 'editProductInfo',
      component: (resolve) =>
        require(['@/views/productManagement/productInfo/editProductInfo'], resolve),
      name: 'EditProductInfo',
      meta: { title: 'editProductInfo', activeMenu: '/productManagement/productInfo' }
    },
    {
      path: 'reviseProductInfo',
      component: (resolve) =>
        require(['@/views/productManagement/productInfo/reviseProductInfo'], resolve),
      name: 'ReviseProductInfo',
      meta: { title: 'reviseProductInfo', activeMenu: '/productManagement/productInfo' }
    },
    {
      path: 'viewProductInfo',
      component: (resolve) =>
        require(['@/views/productManagement/productInfo/viewProductInfo'], resolve),
      name: 'ViewProductInfo',
      meta: { title: 'viewProductInfo', activeMenu: '/productManagement/productInfo' }
    },
    {
      path: 'addProductRelationship',
      component: (resolve) =>
        require(['@/views/productManagement/productRelationship/addProductRelationship'], resolve),
      name: 'AddProductRelationship',
      meta: {
        title: 'addProductRelationship',
        activeMenu: '/productManagement/productRelationship'
      }
    },
    {
      path: 'editProductRelationship',
      component: (resolve) =>
        require(['@/views/productManagement/productRelationship/editProductRelationship'], resolve),
      name: 'EditProductRelationship',
      meta: {
        title: 'editProductRelationship',
        activeMenu: '/productManagement/productRelationship'
      }
    },
    {
      path: 'batchEditProductRelationship',
      component: (resolve) =>
        require([
          '@/views/productManagement/productRelationship/batchEditProductRelationship'
        ], resolve),
      name: 'BatchEditProductRelationship',
      meta: {
        title: 'editProductRelationship',
        activeMenu: '/productManagement/productRelationship'
      }
    },

    {
      path: 'addService',
      component: (resolve) => require(['@/views/productManagement/service/addService'], resolve),
      name: 'AddService',
      meta: { title: 'addService', activeMenu: '/productManagement/productInfo' }
    },
    {
      path: 'editService',
      component: (resolve) => require(['@/views/productManagement/service/editService'], resolve),
      name: 'EditService',
      meta: { title: 'editService', activeMenu: '/productManagement/productInfo' }
    },
    {
      path: 'reviseService',
      component: (resolve) => require(['@/views/productManagement/service/reviseService'], resolve),
      name: 'ReviseService',
      meta: { title: 'reviseService', activeMenu: '/productManagement/productInfo' }
    },
    {
      path: 'viewService',
      component: (resolve) => require(['@/views/productManagement/service/viewService'], resolve),
      name: 'ViewService',
      meta: { title: 'viewService', activeMenu: '/productManagement/productInfo' }
    },
    {
      path: 'addSalesExpansionInformation',
      component: (resolve) =>
        require([
          '@/views/productManagement/productConfigurationTable/addSalesExpansionInformation'
        ], resolve),
      name: 'AddSalesExpansionInformation',
      meta: {
        title: 'addProductConfigurationTable',
        activeMenu: '/productManagement/productConfigurationTable'
      }
    },
    {
      path: 'editSalesExpansionInformation',
      component: (resolve) =>
        require([
          '@/views/productManagement/productConfigurationTable/editSalesExpansionInformation'
        ], resolve),
      name: 'EditSalesExpansionInformation',
      meta: {
        title: 'editProductConfigurationTable',
        activeMenu: '/productManagement/productConfigurationTable'
      }
    },
    {
      path: 'batchEditSalesExpansionInformation',
      component: (resolve) =>
        require([
          '@/views/productManagement/productConfigurationTable/batchEditSalesExpansionInformation'
        ], resolve),
      name: 'BatchEditSalesExpansionInformation',
      meta: {
        title: 'editProductConfigurationTable',
        activeMenu: '/productManagement/productConfigurationTable'
      }
    },
    {
      path: 'addExtendedProductInfo',
      component: (resolve) =>
        require(['@/views/productManagement/productExtended/addProductInfo'], resolve),
      name: 'AddExtendedProductInfo',
      meta: { title: 'addProductInfo', activeMenu: '/productManagement/productExtended' }
    },
    {
      path: 'editExtendedProductInfo',
      component: (resolve) =>
        require(['@/views/productManagement/productExtended/editProductInfo'], resolve),
      name: 'EditExtendedProductInfo',
      meta: { title: 'editProductInfo', activeMenu: '/productManagement/productExtended' }
    },
    {
      path: 'reviseExtendedProductInfo',
      component: (resolve) =>
        require(['@/views/productManagement/productExtended/reviseProductInfo'], resolve),
      name: 'ReviseExtendedProductInfo',
      meta: { title: 'reviseProductInfo', activeMenu: '/productManagement/productExtended' }
    },
    {
      path: 'viewExtendedProductInfo',
      component: (resolve) =>
        require(['@/views/productManagement/productExtended/viewProductInfo'], resolve),
      name: 'ViewExtendedProductInfo',
      meta: { title: 'viewProductInfo', activeMenu: '/productManagement/productExtended' }
    },
    {
      path: 'addProductExtended',
      component: (resolve) =>
        require(['@/views/productManagement/productExtended/addProductExtended'], resolve),
      name: 'AddProductExtended',
      meta: { title: 'addProductExtended', activeMenu: '/productManagement/productExtended' }
    },
    {
      path: 'addBOMManagement',
      component: (resolve) =>
        require(['@/views/productManagement/BOMManagement/addBOMManagement'], resolve),
      name: 'AddBOMManagement',
      meta: { title: 'addBOMManagement', activeMenu: '/productManagement/BOMManagement' }
    },
    {
      path: 'editBOMManagement',
      component: (resolve) =>
        require(['@/views/productManagement/BOMManagement/editBOMManagement'], resolve),
      name: 'EditBOMManagement',
      meta: { title: 'editBOMManagement', activeMenu: '/productManagement/BOMManagement' }
    },
    {
      path: 'reviseBOMManagement',
      component: (resolve) =>
        require(['@/views/productManagement/BOMManagement/reviseBOMManagement'], resolve),
      name: 'ReviseBOMManagement',
      meta: { title: 'reviseBOMManagement', activeMenu: '/productManagement/BOMManagement' }
    },
    {
      path: 'viewBOMManagement',
      component: (resolve) =>
        require(['@/views/productManagement/BOMManagement/viewBOMManagement'], resolve),
      name: 'viewBOMManagement',
      meta: { title: 'viewBOMManagement', activeMenu: '/productManagement/BOMManagement' }
    },

    {
      path: 'addMixDesign',
      component: (resolve) =>
        require(['@/views/productManagement/mixDesign/addMixDesign'], resolve),
      name: 'AddMixDesign',
      meta: { title: 'addMixDesign', activeMenu: '/productManagement/mixDesign' }
    },
    {
      path: 'editMixDesign',
      component: (resolve) =>
        require(['@/views/productManagement/mixDesign/editMixDesign'], resolve),
      name: 'EditMixDesign',
      meta: { title: 'editMixDesign', activeMenu: '/productManagement/mixDesign' }
    },
    {
      path: 'reviseMixDesign',
      component: (resolve) =>
        require(['@/views/productManagement/mixDesign/reviseMixDesign'], resolve),
      name: 'ReviseMixDesign',
      meta: { title: 'reviseMixDesign', activeMenu: '/productManagement/mixDesign' }
    },
    {
      path: 'viewMixDesign',
      component: (resolve) =>
        require(['@/views/productManagement/mixDesign/viewMixDesign'], resolve),
      name: 'ViewMixDesign',
      meta: { title: 'viewMixDesign', activeMenu: '/productManagement/mixDesign' }
    }
  ]
}

export default productManagement
