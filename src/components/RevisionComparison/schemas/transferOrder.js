// 字段路径对应 ITransferOrder 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'transfer-order-version-comparison-v2',
  businessNoI18nKey: 'INVENTORY.transferOrderNo',
  businessNoLabel: '调拨单号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'INVENTORY.deliveryInfo',
      fields: [
        { fieldKey: 'transferOrderNo', fieldLabel: '调拨单号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'INVENTORY.transferOrderNo' },
        { fieldKey: 'fromWarehouseId', fieldLabel: '调出仓库', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.transferFrom', displayFields: ['fromWarehouseName'] },
        { fieldKey: 'requiredId', fieldLabel: '申请人', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.requiredBy', displayFields: ['requiredBy'] },
        {
          fieldKey: 'scheduledTransferDate',
          fieldLabel: '计划调拨日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'INVENTORY.scheduledTransferDate'
        },
        { fieldKey: 'ourRef', fieldLabel: '我方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'INVENTORY.ourRef' },
        { fieldKey: 'reason', fieldLabel: '原因', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.reason' },
        { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'salesOrderId', fieldLabel: '销售订单', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.salesOrderNo', displayFields: ['salesOrderNo'] },
        { fieldKey: 'salesOrderTransferOrderType', fieldI18nKey: 'ui.type', fieldLabel: '销售订单TO转移类型. 1寄卖,2提取. 字典', componentType: 'TEXT', valueType: 'STRING' }
      ]
    },
    {
      sectionKey: 'shippingInfo',
      sectionLabel: '收货信息',
      sectionI18nKey: 'INVENTORY.shippingInfo',
      fields: [
        { fieldKey: 'toWarehouseId', fieldLabel: '目的仓库', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.transferTo', displayFields: ['toWarehouseName'] },
        { fieldKey: 'toWarehouseAddressShowStr', fieldLabel: '收货地址', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'INVENTORY.deliveryAddress' },
        { fieldKey: 'toUserId', fieldI18nKey: 'INVENTORY.contactPerson', fieldLabel: '目的仓库联系人', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['toUserBy'] },
        { fieldKey: 'toMobilePhone', fieldI18nKey: 'INVENTORY.mobilePhone1', fieldLabel: '目的仓库联系人手机号码', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'toEmail', fieldI18nKey: 'ui.email', fieldLabel: '目的仓库联系人邮箱', componentType: 'TEXT', valueType: 'STRING' }
      ]
    },
    {
      sectionKey: 'transferOrderProductList',
      sectionLabel: '产品行数据',
      sectionI18nKey: 'INVENTORY.productInfo',
      collections: [
        {
          fieldKey: 'transferOrderProductList',
          fieldLabel: '产品行数据',
          fieldI18nKey: 'INVENTORY.productInfo',
          itemKeyPrefix: 'transferOrderProductList',
          identityRules: [
            {
              fields: [
                'transferOrderProductId'
              ],
              requiredEmptyFields: []
            },
            {
              fields: [
                'productId'
              ],
              requiredEmptyFields: []
            }
          ],
          itemLabelFields: [
            'internalPartNo',
            'productName'
          ],
          summaryFields: [
            'productId',
            'alias',
            'internalPartNo',
            'stockOutQty',
            'stockInQty',
            'uom',
            'qty'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.alias' },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'stockOutQty', fieldLabel: '出库数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.outboundedQTY', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'stockInQty', fieldLabel: '入库数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.stockInQTY', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
            { fieldKey: 'qty', fieldLabel: '数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.qty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'availableQtyFrom', fieldLabel: '可用数量,调出', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.availableQTYFrom', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'availableQtyTo', fieldLabel: '可用数量,目的', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.availableQTYTo', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'salesOrderQty', fieldLabel: '销售订单数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.orderQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'outedQty', fieldLabel: '已调出数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.transferredOutQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'balanceQty', fieldLabel: '剩余数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.balanceQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' }
          ]
        }
      ]
    },
    {
      sectionKey: 'commonFileList',
      sectionLabel: '附件列表',
      sectionI18nKey: 'ui.attachment',
      collections: [
        {
          fieldKey: 'commonFileList',
          fieldLabel: '附件列表',
          fieldI18nKey: 'ui.attachment',
          itemKeyPrefix: 'commonFileList',
          identityRules: [
            {
              fields: [
                'fileMd5'
              ],
              requiredEmptyFields: []
            },
            {
              fields: [
                'fileId'
              ],
              requiredEmptyFields: []
            },
            {
              fields: [
                'fileName',
                'fileSize'
              ],
              requiredEmptyFields: []
            }
          ],
          itemLabelFields: [
            'fileName'
          ],
          summaryFields: ['fileName', 'fileExtension', 'fileSize', 'remarks'],
          componentType: 'ATTACHMENT',
          fields: [
            { fieldKey: 'fileName', fieldLabel: '文件名', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileName', componentType: 'TEXT', valueType: 'STRING' },
            { fieldKey: 'fileExtension', fieldLabel: '文件类型', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileType', componentType: 'TEXT', valueType: 'STRING' },
            { fieldKey: 'fileSize', fieldLabel: '文件大小', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileSize', componentType: 'NUMBER', valueType: 'INTEGER', formatter: { type: 'FILE_SIZE' } },
            { fieldKey: 'remarks', fieldLabel: '备注', fieldI18nKey: 'ui.remarks', componentType: 'TEXTAREA', valueType: 'STRING' }
          ]
        }
      ]
    }
  ]
}
