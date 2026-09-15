import i18n from '@/lang'
import { markRead } from '@/api/notice/notice'
// import store from '@/store'
import { Notification, Button } from 'element-ui'
// import { getUserCanZoneList } from '@/api/operation/zone'
import { getToken } from '@/utils/auth'
import { browserNotify } from './browserNotify'
class SysNotifyClass {
  constructor() {
    this.notifyComponent = {}
    this.$createElement = null
    this.$vue = null
    this.$router = null
    this.$store = null
    this.$reload = null
    this.pageAll = {
      0: '/inventoryManagement/viewInventoryInitialization',
      1: '/purchaseManagement/editPurchaseOrder',
      2: '/purchaseManagement/editPurchaseRequisition',
      3: '/purchaseManagement/editPurchaseQuotation',
      4: '/purchaseManagement/viewRequestForQuotation',
      10: '/salesManagement/editServiceOrder',
      11: '/salesManagement/editSalesInquiry',
      12: '/salesManagement/editSalesQuotation',
      13: '/salesManagement/editSalesOrder',
      14: '/salesManagement/editPreDeliveryNotice',
      15: '/salesManagement/editSalesGoodsReturn',
      16: '/purchaseManagement/editPurchaseReturnOrder',
      17: '/salesManagement/editDeliveryOrder',
      18: '/purchaseManagement/editAsl',

      22: '/inventoryManagement/editTransferOrder',
      23: '/projectManagement/editStoreIssueChit',
      24: '/inventoryManagement/editInventoryAudit',
      26: '/inventoryManagement/editInventoryAdjustment',
      27: '/inventoryManagement/editEmergencyGoodsReceipt',

      30: '/purchaseManagement/editConsignmentOrder',
      36: '/projectManagement/editProjectTemplate',
      37: '/projectManagement/editProjectProduction',
      39: '/productManagement/editMixDesign',

      101: '/organization/updateLegalEntity',
      102: '/organization/editBranchCompany',
      103: '/organization/editDepartment',
      104: '/organization/editPost',
      105: '/organization/editRole',
      106: '/user/editUser',
      107: '/businessPartner/editBusinessPartner',
      108: '/organization/editZone',
      109: '/productManagement/editProductCategory',
      110: '/productManagement/editProductInfo',
      111: '/productManagement/editBOMManagement',
      112: '/system/editDriver',
      113: '/system/editVehicle',
      114: '/system/editTax',
      115: '/system/editSeaport',
      116: '/productManagement/editExtendedProductInfo',
      117: '/productManagement/editProductRelationship',
      118: '/productManagement/editSalesExpansionInformation',
      119: '/salesManagement/editQuestionnaireTemplate',
      120: '/salesManagement/editDeliveryOrder',
      121: '/salesManagement/viewQuestionnaireTemplate',
      122: '/salesManagement/editSalesPriceStrategy',
      123: '/salesManagement/editServicePriceList',
      126: '/system/editPaymentTerm'
    }

    this.mainListPageAll = {
      4: {
        routeName: 'RequestForQuotation',
        routePath: '/purchaseManagement/requestForQuotation',
        authKey: 'purchaseManagement:requestForQuotation:pendInquiry'
      },
      107: {
        routeName: 'BusinessPartner',
        routePath: '/businessPartnerManagement/businessPartner',
        authKey: 'businessPartner:businessPartner:list'
      },
      110: {
        routeName: 'ProductInfo',
        routePath: '/productManagement/productInfo',
        authKey: 'productManagement:productInfo:list'
      },
      112: {
        routeName: 'DriverManagement',
        routePath: '/system/driverManagement',
        authKey: 'system:driverManagement:list'
      },
      113: {
        routeName: 'VehicleManagement',
        routePath: '/system/vehicleManagement',
        authKey: 'system:vehicleManagement:list'
      },
      116: {
        routeName: 'ProductExtended',
        routePath: '/productManagement/productExtended',
        authKey: 'productManagement:productExtended:list'
      },
      117: {
        routeName: 'ProductRelationship',
        routePath: '/productManagement/productRelationship',
        authKey: 'productManagement:productRelationship:list'
      },
      118: {
        routeName: 'ProductConfigurationTable',
        routePath: '/productManagement/productConfigurationTable',
        authKey: 'productManagement:productConfigurationTable:list'
      },
      122: {
        routeName: 'SalesPriceStrategy',
        routePath: '/salesManagement/salesPriceStrategy',
        authKey: 'salesManagement:salesPriceStrategy:list'
      },
      123: {
        routeName: 'ServicePriceList',
        routePath: '/salesManagement/servicePriceList',
        authKey: 'salesManagement:servicePriceList:list'
      }
    }

    this.zoneList = []

    this.testMsgShow = (params = {}) => {
      /* 无内容体，过滤不显示 */
      if (!params.content) return

      const h = this.$createElement
      const row = { ...params }
      const notifyID = row.messageId
      if (this.notifyComponent[notifyID]) {
        this.notifyComponent[notifyID].close()
        delete this.notifyComponent[notifyID]
      }
      browserNotify.closeNotify(notifyID)

      row.showType = row.documentType

      row.showResolve = this.getShowResolve(row)

      /* notification 会返回当前 Notification 的实例 */
      const position = row.popupSettings || 'top-left' // top-right/top-left/bottom-right/bottom-left

      const notifyItem = Notification({
        showClose: false,
        position: position,
        customClass: position === 'top-left' ? 'my-notification-left' : 'my-notification',
        duration: 0,
        offset: position.includes('top-') ? 70 : 0,
        title: row.titleName,
        onClose: () => {
          this.closeNotify(notifyID)
        },
        message: h(
          'div',
          {
            style: 'color: #666;border-top: 1px solid #E4E7ED;margin-top: 10px;padding-top: 4px;'
          },
          [
            h('div', this.createContent(row)),
            h(
              'div',
              {
                style: 'text-align: right;margin-top: 6px'
              },
              [
                row.templateKey === 'DELIVERY_ORDER_Created'
                  ? h(
                      Button,
                      {
                        props: {
                          size: 'mini',
                          plain: true
                        },
                        style: 'margin-top: 6px',
                        on: {
                          click: () => {
                            this.clickHandler(row, 'printPDF', notifyID)
                          }
                        }
                      },
                      i18n.t('notification.printPDF')
                    )
                  : null,

                row.showResolve
                  ? h(
                      Button,
                      {
                        props: {
                          size: 'mini',
                          type: 'primary'
                        },
                        style: 'margin-top: 6px',
                        on: {
                          click: () => {
                            this.clickHandler(row, 'resolve', notifyID)
                          }
                        }
                      },
                      this.getResolveBtnText(row)
                    )
                  : null,
                h(
                  Button,
                  {
                    props: {
                      size: 'mini',
                      plain: true
                    },
                    style: 'margin-top: 6px',
                    on: {
                      click: () => {
                        this.clickHandler(row, 'read', notifyID)
                      }
                    }
                  },
                  i18n.t('notification.read')
                )
              ]
            )
          ]
        )
      })

      this.notifyComponent[notifyID] = notifyItem

      browserNotify.showNotify({
        notifyID: notifyID,
        title: row.titleName,
        body: row.content
      })
      // console.log(this.notifyComponent)
    }

    this.getShowResolve = (item) => {
      // jumpType 0：跳详情 1：跳主列表 2：没有跳转按钮
      if (item.jumpType === 2) return false
      if (item.jumpType === 1) {
        const page = this.mainListPageAll[item.documentType]
        if (!page) {
          return false
        }
        return this.$vue.checkPermi([page.authKey])
      }
      return !!this.pageAll[item.documentType]
    }

    this.getResolveBtnText = (item) => {
      return i18n.t('notification.detail')
    }

    this.handleRead = (param) => {
      markRead(param)
        .then((res) => {
          this.$store.commit('setUnReadNum', res.data)
        })
        .catch(() => {})
      if (this.notifyComponent[param.notifyID]) {
        this.notifyComponent[param.notifyID].close()
        delete this.notifyComponent[param.notifyID]
      }
      browserNotify.closeNotify(param.notifyID)
    }

    this.clickHandler = async (item, clickType, notifyID) => {
      const param = {
        ids: item.messageId,
        notifyID: notifyID || item.messageId
      }
      if (clickType === 'read') {
        this.handleRead(param)
      }
      if (clickType === 'resolve') {
        /* 消息弹窗进行跳转页面时，关闭所有 el-dialog */
        try {
          const dialogWrapper = document.querySelectorAll('.app-body>.el-dialog__wrapper')
          dialogWrapper.forEach((dom) => {
            dom.__vue__.$options.parent._renderProxy.handleClose()
          })
        } catch (error) {
          console.log(error)
        }
        /* const check = await this.checkZone(row.zoneId)
        if (!check) {
          return
        } */
        if (item.status !== 1) {
          this.handleRead(param)
        }
        let pushRoutePath = this.pageAll[item.documentType]
        let queryData = {
          timeId: Date.now(),
          id: item.documentId
        }
        let params = {}

        switch (item.documentType) {
          case '103':
            queryData = {
              timeId: Date.now(),
              departmentId: item.documentId
            }
            break
          case '104':
            queryData = {
              timeId: Date.now(),
              postId: item.documentId
            }
            break
          case '105':
            queryData = {
              timeId: Date.now(),
              roleId: item.documentId
            }
            break
        }

        if (item.documentType === '121') {
          this.$vue.$EventBus.$emit('taskNotificationOpenDlg', {
            type: 'customerQuestionnaire',
            customerQuestionnaireId: item.documentId
          })
          return
        }
        if (item.jumpType === 0) {
          queryData.backType = '2'
        }
        if (item.jumpType === 0) {
          if (item.documentType === '110' && item.documentJson) {
            const jsonData = JSON.parse(item.documentJson)
            // 产品信息，判断是跳转 正常产品 还是服务产品
            if (jsonData.productType === '2') {
              pushRoutePath = '/productManagement/editService'
            }
          }
          /* 跳详情页面 */
          /* 多次跳转同一路由，需要特殊处理 */
          const curName = this.$vue.$route.path
          if (curName === pushRoutePath) {
            this.$router
              .replace({
                path: '/redirect' + pushRoutePath,
                query: queryData
              })
              .catch()
          } else {
            this.$router
              .push({
                path: pushRoutePath,
                query: queryData
              })
              .catch()
          }
        } else if (item.jumpType === 1) {
          /* 跳主列表 */
          const page = this.mainListPageAll[item.documentType]
          if (!page) return
          const pushRouteName = page.routeName
          queryData = {
            timeId: Date.now()
          }
          params = {
            isGetList: true,
            ids: item.jumpToIds
          }
          this.$router
            .push({
              name: pushRouteName,
              query: queryData,
              params: params
            })
            .catch()
        }
      }
      if (clickType === 'printPDF') {
        const token = getToken()
        const myUrl =
          process.env.VUE_APP_BASE_API +
          '/sales/deliveryOrder/preview' +
          `/${item.documentId}` +
          '?token=' +
          `${token}`
        window.open(myUrl, 'print')
      }
    }

    this.penaliseDriver = (row, notifyID) => {
      this.$vue.$EventBus.$emit('taskNotificationOpenDlg', {
        type: 'PenaliseDriver',
        driverId: row.driverId
      })
    }

    this.closeNotify = (notifyID) => {
      if (this.notifyComponent[notifyID]) {
        delete this.notifyComponent[notifyID]
      }
      browserNotify.closeNotify(notifyID)
    }

    this.closeNotifyAll = () => {
      const data = this.notifyComponent
      Object.keys(data).forEach((key) => {
        data[key].close()
        delete data[key]
      })
      browserNotify.closeNotifyAll()
    }
    this.formatText = (str) => {
      return str.replace(/\n/g, '<br />')
    }

    this.createContent = (row, getEleList = true) => {
      let rowList = []
      switch (row.showType) {
        case '1':
          rowList = [
            {
              label: 'null',
              templateKey: row.templateKey,
              value: row.content
            }
            /*  {
              label: i18n.t('notification.plant'),
              value: row.plantName
            } */
          ]
          break
        default:
          rowList = [
            {
              label: 'null',
              templateKey: row.templateKey,
              value: row.content
            }
          ]
          break
      }

      if (getEleList) {
        return this.createItemList(rowList)
      } else {
        return rowList
      }
    }
    this.createItemList = (rowList) => {
      const h = this.$createElement
      return rowList.map((item) => {
        return h(
          'div',
          {
            style: {
              width: '300px',
              'text-align': 'left'
            }
          },
          [
            item.label !== 'null'
              ? h(
                  'span',
                  {
                    class: 'm-label',
                    style: {
                      'font-weight': 'bold',
                      color: '#444'
                    },
                    attrs: {
                      title: item.label
                    }
                  },
                  item.label + ' : '
                )
              : null,
            // Product_Master_BUSINESS_GROUP_UPDATE_PRODUCT 需要换行
            item.value !== 'null'
              ? item.templateKey === 'Product_Master_BUSINESS_GROUP_UPDATE_PRODUCT' ||
                item.templateKey === 'Emergency_Goods_Receipt_PROCUREMENT' ||
                item.templateKey === 'PRE_DELIVERY_NOTICE_Sys_Created_FROM_PO' ||
                item.templateKey === 'SALES_INQUIRY_Quoted' ||
                item.templateKey === 'DELIVERY_ORDER_Created'
                ? h('div', {
                    style: 'line-height: 1.8',
                    domProps: {
                      innerHTML: this.formatText(item.value)
                    },
                    class: 'm-value'
                  })
                : h(
                    'span',
                    {
                      class: 'm-value'
                    },
                    item.value
                  )
              : null
          ]
        )
      })
    }

    this.checkZone = async (zoneId) => {
      /* if (this.zoneList.length <= 0) {
        await getUserCanZoneList({ type: '' }).then((res) => {
          this.zoneList = res.data || []
        })
      }
      if (this.zoneList.length > 0) {
        if (this.zoneList.find((item) => item.zoneId === zoneId)) {
          return true
        }
      } */
      // this.$vue.$modal.msgError(i18n.t('ui.notAuth'))
      return true
    }
  }
}

export default new SysNotifyClass()
