import Layout from '@/layout'

const organization = {
  path: '/organization',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'corporateDetail',
      component: (resolve) => require(['@/views/organization/corporate/corporateDetail'], resolve),
      name: 'CorporateDetail2',
      meta: { title: 'corporateDetail', activeMenu: '/organization/corporateDetail' }
    },
    {
      path: 'updateBusinessGroup',
      component: (resolve) => require(['@/views/organization/corporate/updateBusinessGroup'], resolve),
      name: 'UpdateBusinessGroup',
      meta: { title: 'businessGroup', activeMenu: '/organization/corporate' }
    },
    {
      path: 'addLegalEntity',
      component: (resolve) => require(['@/views/organization/corporate/addLegalEntity'], resolve),
      name: 'AddLegalEntity',
      meta: { title: 'addLegalEntity', activeMenu: '/organization/corporate' }
    },
    {
      path: 'updateLegalEntity',
      component: (resolve) => require(['@/views/organization/corporate/updateLegalEntity'], resolve),
      name: 'UpdateLegalEntity',
      meta: { title: 'editLegalEntity', activeMenu: '/organization/corporate' }
    },
    {
      path: 'addBranchCompany',
      component: (resolve) => require(['@/views/organization/corporate/addBranchCompany'], resolve),
      name: 'AddBranchCompany',
      meta: { title: 'addBranchCompany', activeMenu: '/organization/corporate' }
    },
    {
      path: 'editBranchCompany',
      component: (resolve) => require(['@/views/organization/corporate/editBranchCompany'], resolve),
      name: 'EditBranchCompany',
      meta: { title: 'editBranchCompany', activeMenu: '/organization/corporate' }
    },
    {
      path: 'addDepartment',
      component: (resolve) => require(['@/views/organization/departmentManagement/addDepartment'], resolve),
      name: 'AddDepartment',
      meta: { title: 'department', activeMenu: '/organization/departmentManagement' }
    },
    {
      path: 'editDepartment',
      component: (resolve) => require(['@/views/organization/departmentManagement/editDepartment'], resolve),
      name: 'EditDepartment',
      meta: { title: 'department', activeMenu: '/organization/departmentManagement' }
    },
    {
      path: 'addSonDepartment',
      component: (resolve) => require(['@/views/organization/corporate/addSonDepartment'], resolve),
      name: 'AddSonDepartment',
      meta: { title: 'addSonDepartment', activeMenu: '/organization/corporate' }
    },
    {
      path: 'editSonDepartment',
      component: (resolve) => require(['@/views/organization/corporate/editSonDepartment'], resolve),
      name: 'EditSonDepartment',
      meta: { title: 'editSonDepartment', activeMenu: '/organization/corporate' }
    },
    {
      path: 'addRole',
      component: (resolve) => require(['@/views/organization/role/addRole'], resolve),
      name: 'AddRole',
      meta: { title: 'addRole', activeMenu: '/organization/role' }
    },
    {
      path: 'editRole',
      component: (resolve) => require(['@/views/organization/role/editRole'], resolve),
      name: 'EditRole',
      meta: { title: 'editRole', activeMenu: '/organization/role' }
    },
    {
      path: 'functionalPermissions',
      component: (resolve) => require(['@/views/organization/role/functionalPermissions'], resolve),
      name: 'FunctionalPermissions',
      meta: { title: 'functionalPermissions', activeMenu: '/organization/role' }
    },
    {
      path: 'assignUser',
      component: (resolve) => require(['@/views/organization/role/assignUser'], resolve),
      name: 'AssignUser',
      meta: { title: 'assignUser', activeMenu: '/organization/role' }
    },
    {
      path: 'accessPermissions',
      component: (resolve) => require(['@/views/organization/role/accessPermissions'], resolve),
      name: 'AccessPermissions',
      meta: { title: 'accessPermissions', activeMenu: '/organization/role' }
    },
    {
      path: 'addPost',
      component: (resolve) => require(['@/views/system/post/addPost'], resolve),
      name: 'AddPost',
      meta: { title: 'addPost', activeMenu: '/organization/post' }
    },
    {
      path: 'editPost',
      component: (resolve) => require(['@/views/system/post/editPost'], resolve),
      name: 'EditPost',
      meta: { title: 'editPost', activeMenu: '/organization/post' }
    },
    {
      path: 'positionStructure',
      component: (resolve) => require(['@/views/system/post/positionStructure'], resolve),
      name: 'PositionStructure',
      meta: { title: 'positionStructure', activeMenu: '/organization/post' }
    },
    {
      path: 'addZone',
      component: (resolve) => require(['@/views/organization/zone/addZone'], resolve),
      name: 'AddZone',
      meta: { title: 'addZone', activeMenu: '/organization/zone' }
    },
    {
      path: 'editZone',
      component: (resolve) => require(['@/views/organization/zone/editZone'], resolve),
      name: 'EditZone',
      meta: { title: 'editZone', activeMenu: '/organization/zone' }
    }
  ]
}

export default organization
