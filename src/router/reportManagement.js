import Layout from '@/layout'
const reportManagement = {
  path: '/reportManagement',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'addCostSettings',
      component: (resolve) =>
        require(['@/views/reportManagement/inventoryCostAnalysis/addCostSettings'], resolve),
      name: 'AddCostSettings',
      meta: {
        title: 'addCostSettings',
        activeMenu: '/reportManagement/inventoryCostAnalysis'
      }
    },
    {
      path: 'editCostSettings',
      component: (resolve) =>
        require(['@/views/reportManagement/inventoryCostAnalysis/editCostSettings'], resolve),
      name: 'EditCostSettings1',
      meta: {
        title: 'editCostSettings',
        activeMenu: '/reportManagement/inventoryCostAnalysis'
      }
    }
  ]
}
export default reportManagement
