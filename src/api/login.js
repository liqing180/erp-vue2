import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid, tenantCode, tenantType) {
  const data = {
    username,
    password,
    code,
    uuid,
    tenantCode,
    tenantType
  }
  return request({
    url: 'auth/login',
    method: 'post',
    headers: {
      isToken: false
    },
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function queryLoginLogo(data) {
  return request({
    url: '/external/common/queryLoginLogoForPC',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: 'system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: 'auth/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get',
    headers: {
      isToken: false
    },
    timeout: 20000
  })
}

// 获取系统对应的域名信息
export function queryDomainName() {
  return request({
    url: '/system/external/common/queryDomainName',
    method: 'get',
    headers: {
      isToken: false
    },
    timeout: 20000
  })
}

// 首页搜索
export function orderSearch(data) {
  return request({
    url: '/external/order/searchOrder',
    method: 'post',
    headers: {
      isToken: false
    },
    data
  })
}

// 订单跟踪
export function queryOrderTrackingNodeMsg(data) {
  return request({
    url: '/external/order/queryOrderTrackingNodeMsg',
    method: 'post',
    headers: {
      isToken: false
    },
    data
  })
}

// 运单信息
export function queryWaybillMsg(data) {
  return request({
    url: '/external/order/queryWaybillMsg',
    method: 'post',
    headers: {
      isToken: false
    },
    data
  })
}

// 运单节点跟踪信息
export function queryTrackingNodeMsg(data) {
  return request({
    url: '/external/waybill/queryTrackingNodeMsg',
    method: 'post',
    headers: {
      isToken: false
    },
    data
  })
}

// 查询地图轨迹
export function queryMapMsg(data) {
  return request({
    url: '/external/waybill/queryMapMsg',
    method: 'post',
    headers: {
      isToken: false
    },
    data
  })
}

// 忘记密码 第一步
export function resetPasswordForSubmitForPC(data) {
  return request({
    url: '/system/external/password/resetPasswordForStart',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 忘记密码 第二步
export function resetPasswordForSendVC(data) {
  return request({
    url: '/system/external/password/resetPasswordForSendVerificationCode',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 提交验证码 第二步
export function resetPasswordForSubmitVC(data) {
  return request({
    url: '/system/external/password/resetPasswordForSubmitVerificationCode',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 重置密码 第三步
export function resetPasswordForSubmitPW(data) {
  return request({
    url: '/system/external/password/resetPasswordForCompleted',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 验证重置密码链接是否有效
export function resetPasswordForVerificationUuid(data) {
  return request({
    url: '/system/external/password/resetPasswordForVerificationUuid',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 电话区号
export function queryDictDataListByType(data) {
  return request({
    url: '/external/common/queryDictDataListByType',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 承运商注册
export function registerCarrier(data) {
  return request({
    url: '/external/register/registerCarrier',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 货主注册
export function registerConsignor(data) {
  return request({
    url: '/external/register/registerConsignor',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 设置新密码
export function setNewPassword(data) {
  return request({
    url: '/external/password/setNewPassword',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 设置初始密码
export function setInitialPassword(data) {
  return request({
    url: '/external/password/setInitialPassword',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 设置新密码链接是否有效
export function setNewPasswordInfo(data) {
  return request({
    url: '/external/password/info',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 设置初始密码接口: system/userNew/initPassword (参数: password)
export function initPassword(data) {
  return request({
    url: '/system/userNew/initPassword',
    method: 'post',
    data: data
  })
}

// 查询具体采购报价: /purchase/external/purchaseQuotation/queryPurchaseQuotationById (purchaseQuotationId)
// 额外信息对象: otherExternalMsg
// 是否可以提交标识符: isCanSaveDraft
export function queryPurchaseQuotationById(data) {
  return request({
    url: '/purchase/external/purchaseQuotation/queryPurchaseQuotationById',
    method: 'post',
    data: data
  })
}

// 保存采购报价: /purchase/external/purchaseQuotation/saveDraftPurchaseQuotation
export function saveDraftPurchaseQuotation(data) {
  return request({
    url: '/purchase/external/purchaseQuotation/saveDraftPurchaseQuotation',
    method: 'post',
    data: data
  })
}

export function savePurchaseQuotation(data) {
  return request({
    url: '/purchase/external/purchaseQuotation/savePurchaseQuotation',
    method: 'post',
    data: data
  })
}

export function revisePurchaseQuotation(data) {
  return request({
    url: '/purchase/external/purchaseQuotation/revisePurchaseQuotation',
    method: 'post',
    data: data
  })
}

// EPR 互相跳转 token 转换： token, tenantType
export function exchange(data) {
  return request({
    url: 'auth/exchange',
    method: 'post',
    data: data
  })
}

// /system/external/common/queryIncotermList
export function queryIncotermList(data) {
  return request({
    url: '/system/external/common/queryIncotermList',
    method: 'post',
    data: data
  })
}

// /system/external/common/queryCanSelectPortList
export function queryCanSelectPortList(data) {
  return request({
    url: '/system/external/common/queryCanSelectPortList',
    method: 'post',
    data: data
  })
}

// 新接口：/external/common/getSystemSetup/{legalEntityId}
export function getSystemSetup(data) {
  return request({
    url: '/system/external/common/getSystemSetup/' + data,
    method: 'get'
  })
}

// /system/external/common/type/{dictType}
export function externalCommonType(data) {
  return request({
    url: '/system/external/common/type/' + data,
    method: 'get'
  })
}

export function queryPositionList() {
  return request({
    url: '/system/external/common/queryPositionList',
    method: 'get'
  })
}

export function queryMobileCodeListExternal(data) {
  return request({
    url: '/system/external/common/queryMobileCodeList',
    method: 'post',
    data
  })
}

// 外部用:PQ进行计算: purchase/external/purchaseQuotation/calculate
export function calculate(data) {
  return request({
    url: '/purchase/external/purchaseQuotation/calculate',
    method: 'post',
    data
  })
}

// system/external/common/queryAllUomList
export function queryAllUomList(params) {
  return request({
    url: '/system/external/common/queryAllUomList',
    method: 'get',
    params
  })
}
