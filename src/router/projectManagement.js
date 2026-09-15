import Layout from '@/layout'

const projectManagement = {
  path: '/projectManagement',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'editProjectTask',
      component: (resolve) =>
        require(['@/views/projectManagement/projectTask/editProjectTask'], resolve),
      name: 'EditProjectTask',
      meta: { title: 'editProjectTask', activeMenu: '/projectManagement/projectTask' }
    },
    {
      path: 'viewProjectTask',
      component: (resolve) =>
        require(['@/views/projectManagement/projectTask/viewProjectTask'], resolve),
      name: 'ViewProjectTask',
      meta: { title: 'viewProjectTask', activeMenu: '/projectManagement/projectTask' }
    },
    {
      path: 'editProjectCost',
      component: (resolve) =>
        require(['@/views/projectManagement/projectCost/editProjectCost'], resolve),
      name: 'EditProjectCost',
      meta: { title: 'editProjectCost', activeMenu: '/projectManagement/projectCost' }
    },
    {
      path: 'viewProjectCost',
      component: (resolve) =>
        require(['@/views/projectManagement/projectCost/viewProjectCost'], resolve),
      name: 'ViewProjectCost',
      meta: { title: 'viewProjectCost', activeMenu: '/projectManagement/projectCost' }
    },
    {
      path: 'editMaterialList',
      component: (resolve) =>
        require(['@/views/projectManagement/materialList/editMaterialList'], resolve),
      name: 'EditMaterialList',
      meta: { title: 'editMaterialList', activeMenu: '/projectManagement/materialList' }
    },
    {
      path: 'viewMaterialList',
      component: (resolve) =>
        require(['@/views/projectManagement/materialList/viewMaterialList'], resolve),
      name: 'ViewMaterialList',
      meta: { title: 'viewMaterialList', activeMenu: '/projectManagement/materialList' }
    },
    {
      path: 'addStoreIssueChit',
      component: (resolve) =>
        require(['@/views/projectManagement/storeIssueChit/addStoreIssueChit'], resolve),
      name: 'AddStoreIssueChit',
      meta: { title: 'addStoreIssueChit', activeMenu: '/projectManagement/storeIssueChit' }
    },
    {
      path: 'viewStoreIssueChit',
      component: (resolve) =>
        require(['@/views/projectManagement/storeIssueChit/viewStoreIssueChit'], resolve),
      name: 'ViewStoreIssueChit',
      meta: { title: 'viewStoreIssueChit', activeMenu: '/projectManagement/storeIssueChit' }
    },
    {
      path: 'editStoreIssueChit',
      component: (resolve) =>
        require(['@/views/projectManagement/storeIssueChit/editStoreIssueChit'], resolve),
      name: 'EditStoreIssueChit',
      meta: { title: 'editStoreIssueChit', activeMenu: '/projectManagement/storeIssueChit' }
    },
    {
      path: 'addProjectProduction',
      component: (resolve) =>
        require(['@/views/projectManagement/projectProduction/addProjectProduction'], resolve),
      name: 'AddProjectProduction',
      meta: { title: 'addProjectProduction', activeMenu: '/projectManagement/projectProduction' }
    },
    {
      path: 'editProjectProduction',
      component: (resolve) =>
        require(['@/views/projectManagement/projectProduction/editProjectProduction'], resolve),
      name: 'EditProjectProduction',
      meta: { title: 'editProjectProduction', activeMenu: '/projectManagement/projectProduction' }
    },
    {
      path: 'viewProjectProduction',
      component: (resolve) =>
        require(['@/views/projectManagement/projectProduction/viewProjectProduction'], resolve),
      name: 'ViewProjectProduction',
      meta: { title: 'viewProjectProduction', activeMenu: '/projectManagement/projectProduction' }
    },

    {
      path: 'addProjectTemplate',
      component: (resolve) =>
        require(['@/views/projectManagement/projectTemplate/addProjectTemplate'], resolve),
      name: 'AddProjectTemplate',
      meta: { title: 'addProjectTemplate', activeMenu: '/projectManagement/projectTemplate' }
    },
    {
      path: 'editProjectTemplate',
      component: (resolve) =>
        require(['@/views/projectManagement/projectTemplate/editProjectTemplate'], resolve),
      name: 'EditProjectTemplate',
      meta: { title: 'editProjectTemplate', activeMenu: '/projectManagement/projectTemplate' }
    },
    {
      path: 'viewProjectTemplate',
      component: (resolve) =>
        require(['@/views/projectManagement/projectTemplate/viewProjectTemplate'], resolve),
      name: 'ViewProjectTemplate',
      meta: { title: 'viewProjectTemplate', activeMenu: '/projectManagement/projectTemplate' }
    },
    {
      path: 'addProjectTransfer',
      component: (resolve) =>
        require(['@/views/projectManagement/projectTransfer/addProjectTransfer'], resolve),
      name: 'AddProjectTransfer',
      meta: { title: 'addProjectTransfer', activeMenu: '/projectManagement/projectTransfer' }
    },
    {
      path: 'editProjectTransfer',
      component: (resolve) =>
        require(['@/views/projectManagement/projectTransfer/editProjectTransfer'], resolve),
      name: 'EditProjectTransfer',
      meta: { title: 'editProjectTransfer', activeMenu: '/projectManagement/projectTransfer' }
    },
    {
      path: 'viewProjectTransfer',
      component: (resolve) =>
        require(['@/views/projectManagement/projectTransfer/viewProjectTransfer'], resolve),
      name: 'ViewProjectTransfer',
      meta: { title: 'viewProjectTransfer', activeMenu: '/projectManagement/projectTransfer' }
    },
    {
      path: 'addProject',
      component: (resolve) =>
        require(['@/views/projectManagement/project/addProject'], resolve),
      name: 'AddProject',
      meta: { title: 'addProject', activeMenu: '/projectManagement/project' }
    },
    {
      path: 'editProject',
      component: (resolve) =>
        require(['@/views/projectManagement/project/editProject'], resolve),
      name: 'EditProject',
      meta: { title: 'editProject', activeMenu: '/projectManagement/project' }
    },
    {
      path: 'viewProject',
      component: (resolve) =>
        require(['@/views/projectManagement/project/viewProject'], resolve),
      name: 'ViewProject',
      meta: { title: 'viewProject', activeMenu: '/projectManagement/project' }
    },
    {
      path: 'viewDetail',
      component: (resolve) =>
        require(['@/views/projectManagement/project/viewDetail'], resolve),
      name: 'ViewDetail',
      meta: { title: 'viewProject', activeMenu: '/projectManagement/project' }
    }
  ]
}

export default projectManagement
