import Layout from '@/layout'

const system = {
  path: '/system',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'addUom',
      component: (resolve) => require(['@/views/system/uom/addUom'], resolve),
      name: 'AddUom',
      meta: { title: 'addUom', activeMenu: '/system/uom' }
    },
    {
      path: 'editUom',
      component: (resolve) => require(['@/views/system/uom/editUom'], resolve),
      name: 'EditUom',
      meta: { title: 'editUom', activeMenu: '/system/uom' }
    },
    {
      path: 'addSeaport',
      component: (resolve) => require(['@/views/system/seaport/addSeaport'], resolve),
      name: 'AddSeaport',
      meta: { title: 'addSeaport', activeMenu: '/system/seaport' }
    },
    {
      path: 'editSeaport',
      component: (resolve) => require(['@/views/system/seaport/editSeaport'], resolve),
      name: 'EditSeaport',
      meta: { title: 'editSeaport', activeMenu: '/system/seaport' }
    },
    {
      path: 'addPaymentTerm',
      component: (resolve) => require(['@/views/system/paymentTerm/addPaymentTerm'], resolve),
      name: 'AddPaymentTerm',
      meta: { title: 'addPaymentTerm', activeMenu: '/system/paymentTerm' }
    },
    {
      path: 'editPaymentTerm',
      component: (resolve) => require(['@/views/system/paymentTerm/editPaymentTerm'], resolve),
      name: 'EditPaymentTerm',
      meta: { title: 'editPaymentTerm', activeMenu: '/system/paymentTerm' }
    },
    {
      path: 'emailManagement/emailDetail',
      component: (resolve) =>
        require(['@/views/system/emailManagement/sentEmail/emailDetail'], resolve),
      name: 'EmailDetail',
      meta: { title: 'emailDetail', activeMenu: '/system/emailManagement/sentEmail' }
    },
    {
      path: 'emailManagement/editPendingSendEmail',
      component: (resolve) =>
        require(['@/views/system/emailManagement/pendingSendEmail/editPendingSendEmail'], resolve),
      name: 'EditPendingSendEmail',
      meta: {
        title: 'editPendingSendEmail',
        activeMenu: '/system/emailManagement/pendingSendEmail'
      }
    },
    {
      path: 'emailManagement/addEmailTemplate',
      component: (resolve) =>
        require(['@/views/system/emailManagement/emailTemplate/addEmailTemplate'], resolve),
      name: 'AddEmailTemplate',
      meta: { title: 'addEmailTemplate', activeMenu: '/system/emailManagement/emailTemplate' }
    },
    {
      path: 'emailManagement/editEmailTemplate',
      component: (resolve) =>
        require(['@/views/system/emailManagement/emailTemplate/editEmailTemplate'], resolve),
      name: 'EditEmailTemplate',
      meta: { title: 'editEmailTemplate', activeMenu: '/system/emailManagement/emailTemplate' }
    },
    {
      path: 'addTax',
      component: (resolve) => require(['@/views/system/tax/addTax'], resolve),
      name: 'AddTax',
      meta: { title: 'addTax', activeMenu: '/system/tax' }
    },
    {
      path: 'editTax',
      component: (resolve) => require(['@/views/system/tax/editTax'], resolve),
      name: 'EditTax',
      meta: { title: 'editTax', activeMenu: '/system/tax' }
    },
    {
      path: 'addIssue',
      component: (resolve) => require(['@/views/system/issueList/addIssue'], resolve),
      name: 'AddIssue',
      meta: { title: 'addIssue', activeMenu: '/system/issueList' }
    },
    {
      path: 'editIssue',
      component: (resolve) => require(['@/views/system/issueList/editIssue'], resolve),
      name: 'EditIssue',
      meta: { title: 'editIssue', activeMenu: '/system/issueList' }
    },
    {
      path: 'addVehicleModel',
      component: (resolve) =>
        require(['@/views/system/vehicleModelManagement/addVehicleModel'], resolve),
      name: 'AddVehicleModel',
      meta: { title: 'addVehicleModel', activeMenu: '/system/vehicleModelManagement' }
    },
    {
      path: 'editVehicleModel',
      component: (resolve) =>
        require(['@/views/system/vehicleModelManagement/editVehicleModel'], resolve),
      name: 'EditVehicleModel',
      meta: { title: 'editVehicleModel', activeMenu: '/system/vehicleModelManagement' }
    },
    {
      path: 'addVehicle',
      component: (resolve) => require(['@/views/system/vehicleManagement/addVehicle'], resolve),
      name: 'AddVehicle',
      meta: { title: 'addVehicle', activeMenu: '/system/vehicleManagement' }
    },
    {
      path: 'editVehicle',
      component: (resolve) => require(['@/views/system/vehicleManagement/editVehicle'], resolve),
      name: 'EditVehicle',
      meta: { title: 'editVehicle', activeMenu: '/system/vehicleManagement' }
    },
    {
      path: 'addDriver',
      component: (resolve) => require(['@/views/system/driverManagement/addDriver'], resolve),
      name: 'AddDriver',
      meta: { title: 'addDriver', activeMenu: '/system/driverManagement' }
    },
    {
      path: 'editDriver',
      component: (resolve) => require(['@/views/system/driverManagement/editDriver'], resolve),
      name: 'EditDriver',
      meta: { title: 'editDriver', activeMenu: '/system/driverManagement' }
    },
    {
      path: 'addCodeRule',
      component: (resolve) => require(['@/views/system/createCodeRule/addCodeRule'], resolve),
      name: 'AddCodeRule',
      meta: { title: 'addCreateCodeRule', activeMenu: '/system/createCodeRule' }
    },
    {
      path: 'editCodeRule',
      component: (resolve) => require(['@/views/system/createCodeRule/editCodeRule'], resolve),
      name: 'EditCodeRule',
      meta: { title: 'editCreateCodeRule', activeMenu: '/system/createCodeRule' }
    }
  ]
}

export default system
