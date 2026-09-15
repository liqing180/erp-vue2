import request from '@/utils/request'

// /productCategory/queryProductCategoryList 查询产品分类列表
export function queryProductCategoryList(data) {
  return request({
    url: '/system/productCategory/queryProductCategoryList',
    method: 'post',
    data
  })
}

// /productCategory/save 新增产品分类
export function save(data) {
  return request({
    url: '/system/productCategory/save',
    method: 'post',
    data
  })
}

// /productCategory/queryProductCategoryById 获取产品分类信息
export function queryProductCategoryById(id) {
  return request({
    url: '/system/productCategory/queryProductCategoryById/' + id,
    method: 'get'
  })
}

// /productCategory/update 修改产品分类
export function update(data) {
  return request({
    url: '/system/productCategory/update',
    method: 'post',
    data
  })
}

// /productCategory/updateActive 停用启用
export function updateActive(data) {
  return request({
    url: '/system/productCategory/updateActive',
    method: 'post',
    data
  })
}

// 下载导入模板
export function importTemplate(data) {
  return request({
    url: '/system/productCategory/importTemplate',
    method: 'post',
    responseType: 'blob',
    data
  })
}
// /productCategory/export 导出
export function productCategoryExport(data) {
  return request({
    url: '/system/productCategory/export',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// /productCategory/importData 导入
export function importData(data) {
  return request({
    url: '/system/productCategory/importData?updateSupport=0',
    method: 'post',
    data
  })
}

// 无视类型: 查询所有分类
export function queryAllCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryAllCategoryTreeList',
    method: 'get'
  })
}
// 无视类型: 查询所有活跃分类
export function queryActiveCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryActiveCategoryTreeList',
    method: 'get'
  })
}
// 无视类型: 查询业务单据选择分类(带全部)
export function queryBusinessSelectCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryBusinessSelectCategoryTreeList',
    method: 'get'
  })
}

// 产品: 查询所有分类
export function queryAllProductCategoryTreeList() {
  return request({
    url: '/system/productCategory/queryAllProductCategoryTreeList',
    method: 'get'
  })
}
// 产品: 查询所有活跃分类
export function queryActiveProductCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryActiveProductCategoryTreeList',
    method: 'get'
  })
}
// 产品: 查询业务单据选择分类(带全部)
export function queryBusinessSelectProductCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryBusinessSelectProductCategoryTreeList',
    method: 'get'
  })
}

// 服务: 查询所有分类
export function queryAllServiceCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryAllServiceCategoryTreeList',
    method: 'get'
  })
}
// 服务: 查询所有活跃分类
export function queryActiveServiceCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryActiveServiceCategoryTreeList',
    method: 'get'
  })
}
// 服务: 查询业务单据选择分类(带全部)
export function queryBusinessSelectServiceCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryBusinessSelectServiceCategoryTreeList',
    method: 'get'
  })
}

// 虚拟产品: 查询业务单据选择分类(带全部)
export function queryPhantomCategoryTreeList(data) {
  return request({
    url: '/system/productCategory/queryPhantomCategoryTreeList',
    method: 'get'
  })
}
