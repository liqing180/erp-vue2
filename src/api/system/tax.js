import request from '@/utils/request'

// POST /sysEmailTemplate/querySysEmailTemplateList 查询邮件模板列表
export function querySysEmailTemplateList(data) {
  return request({
    url: '/system/sysEmailTemplate/querySysEmailTemplateList',
    method: 'post',
    data: data
  })
}

// GET /sysEmailTemplate/queryUserTemplateFor 查询当前用户,当前业务实体,数据库中拥有的TemplateFor
export function queryUserTemplateFor(id) {
  return request({
    url: '/system/sysEmailTemplate/queryUserTemplateFor',
    method: 'get'
  })
}

// POST /taxCode/queryTaxCodeList 查询税码列表
export function queryTaxCodeList(data) {
  return request({
    url: '/system/taxCode/queryTaxCodeList',
    method: 'post',
    data: data
  })
}

// POST /taxCode/saveTaxCode 添加税码
export function saveTaxCode(data) {
  return request({
    url: '/system/taxCode/saveTaxCode',
    method: 'post',
    data: data
  })
}

// GET /taxCode/queryTaxCodeById/{id} 根据id查询税码
export function queryTaxCodeById(id) {
  return request({
    url: '/system/taxCode/queryTaxCodeById/' + id,
    method: 'get'
  })
}

// POST /taxCode/updateTaxCode 修改税码
export function updateTaxCode(data) {
  return request({
    url: '/system/taxCode/updateTaxCode',
    method: 'post',
    data: data
  })
}

// GET /taxCode/queryAllTaxCodeByCountryId/{id} 根据国家id查询对应的所有税码
export function queryAllTaxCodeByCountryId(id) {
  return request({
    url: '/system/taxCode/queryAllTaxCodeByCountryId/' + id,
    method: 'get'
  })
}

// GET /taxCode/queryAllTaxCode 查询获取业务实体下的所有税码
export function queryAllTaxCode(id) {
  return request({
    url: '/system/taxCode/queryAllTaxCode',
    method: 'get'
  })
}

// GET /taxCode/queryAllFreightTaxCode 查询获取业务实体下的所有运费税码
export function queryAllFreightTaxCode(id) {
  return request({
    url: '/system/taxCode/queryAllFreightTaxCode',
    method: 'get'
  })
}

// GET /taxCode/queryPurchaseCategoryTreeList 查询税模块的库存分类树列表-活跃的分类
export function queryPurchaseCategoryTreeList(id) {
  return request({
    url: '/system/taxCode/queryPurchaseCategoryTreeList',
    method: 'get'
  })
}

// GET /taxCode/queryTaxCodeCountry 查询出当前业务实体税下的国家列表
export function queryTaxCodeCountry(id) {
  return request({
    url: '/system/taxCode/queryTaxCodeCountry',
    method: 'get'
  })
}

// POST /taxCode/queryAllTaxForSales 根据BP的国家ID,产品分类查询获取业务实体下的所有税码
export function queryAllTaxForSales(data) {
  return request({
    url: '/system/taxCode/queryAllTaxForSales',
    method: 'post',
    data: data
  })
}

// POST /taxCode/queryDefaultTaxForSales 根据产品行分类ID查询默认税
export function queryDefaultTaxForSales(data) {
  return request({
    url: '/system/taxCode/queryDefaultTaxForSales',
    method: 'post',
    data: data
  })
}

// POST /taxCode/queryAllTaxForPurchase 根据BP的国家ID,产品分类查询获取业务实体下的所有税码
export function queryAllTaxForPurchase(data) {
  return request({
    url: '/system/taxCode/queryAllTaxForPurchase',
    method: 'post',
    data: data
  })
}

// POST /taxCode/queryDefaultTaxForPurchase 根据产品行分类ID查询默认税
export function queryDefaultTaxForPurchase(data) {
  return request({
    url: '/system/taxCode/queryDefaultTaxForPurchase',
    method: 'post',
    data: data
  })
}

// GET /taxCode/queryAllFreightTaxForPurchase/{countryId} 根据BP的国家ID,查询获取业务实体下的所有运费税码
export function queryAllFreightTaxForPurchase(id) {
  return request({
    url: '/system/taxCode/queryAllFreightTaxForPurchase/' + id,
    method: 'get'
  })
}

// GET /taxCode/queryAllFreightTaxForSales/{countryId} 根据BP的国家ID,查询获取业务实体下的所有运费税码
export function queryAllFreightTaxForSales(id) {
  return request({
    url: '/system/taxCode/queryAllFreightTaxForSales/' + id,
    method: 'get'
  })
}
/* 获取国家与本公司对应的税率 */
export function queryTaxCodeByCountryId(countryId) {
  return request({
    url: '/system/taxCode/queryTaxCodeByCountryId/' + countryId,
    method: 'get'
  })
}

/* 根据国家id查询默认税码 */
export function queryDefaultTaxCodeByCountryId(countryId) {
  return request({
    url: '/system/taxCode/queryDefaultTaxCodeByCountryId/' + countryId,
    method: 'get'
  })
}
// 根据BPid查询对应的所有税码:
export function queryAllTaxCodeByBusinessPartnerId(businessPartnerId) {
  return request({
    url: '/system/taxCode/queryAllTaxCodeByBusinessPartnerId/' + businessPartnerId,
    method: 'get'
  })
}
