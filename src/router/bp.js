import Layout from '@/layout'

const bp = {
  path: '/businessPartner',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'addBusinessPartner',
      component: (resolve) => require(['@/views/businessPartner/businessPartner/addBusinessPartner'], resolve),
      name: 'AddBusinessPartner',
      meta: { title: 'addBusinessPartner', activeMenu: '/businessPartnerManagement/businessPartner' }
    },
    {
      path: 'editBusinessPartner',
      component: (resolve) => require(['@/views/businessPartner/businessPartner/editBusinessPartner'], resolve),
      name: 'EditBusinessPartner',
      meta: { title: 'editBusinessPartner', activeMenu: '/businessPartnerManagement/businessPartner' }
    },
    {
      path: 'reviseBusinessPartner',
      component: (resolve) => require(['@/views/businessPartner/businessPartner/reviseBusinessPartner'], resolve),
      name: 'ReviseBusinessPartner',
      meta: { title: 'reviseBusinessPartner', activeMenu: '/businessPartnerManagement/businessPartner' }
    },
    {
      path: 'viewBusinessPartner',
      component: (resolve) => require(['@/views/businessPartner/businessPartner/viewBusinessPartner'], resolve),
      name: 'ViewBusinessPartner',
      meta: { title: 'viewBusinessPartner', activeMenu: '/businessPartnerManagement/businessPartner' }
    },
    {
      path: 'viewBpAssignment',
      component: (resolve) => require(['@/views/businessPartner/businessPartnerAssignment/viewBpAssignment'], resolve),
      name: 'ViewBpAssignment',
      meta: { title: 'viewBpAssignment', activeMenu: '/businessPartnerManagement/businessPartnerAssignment' }
    }
  ]
}

export default bp
