// 字段路径对应 PPurchaseReturn 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'purchase-return-version-comparison-v2',
  businessNoI18nKey: 'PURCHASE.purchaseReturnOrderNo',
  businessNoLabel: '采购退货编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'purchaseReturnNo', fieldLabel: '采购退货编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.purchaseReturnOrderNo' },
        { fieldKey: 'purchaseReturnType', dictType: 'purchase_return_type', fieldLabel: '采购退货类型', fieldI18nKey: 'PURCHASE.returnType', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'purchaseOrderId', fieldLabel: '采购订单', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.purchaseOrderNo', displayFields: ['purchaseOrderNo'] },
        { fieldKey: 'consignmentOrderId', fieldLabel: '寄售订单', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.consignmentOrderNo', displayFields: ['consignmentOrderNo'] },
        { fieldKey: 'businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.supplierName', displayFields: ['businessPartnerName'] },
        { fieldKey: 'warehouseId', fieldLabel: '仓库', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.warehouseName', displayFields: ['warehouseName'] },
        { fieldKey: 'purchasePersonBy', fieldLabel: '采购员名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.purchaser' },
        { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        {
          fieldKey: 'purchaseDate',
          fieldI18nKey: 'PURCHASE.datePurchased',
          fieldLabel: '采购日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          }
        },
        {
          fieldKey: 'returnDate',
          fieldLabel: '退货日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'PURCHASE.returnDate'
        },
        { fieldKey: 'ourRef', fieldLabel: '我方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.ourRef' },
        { fieldKey: 'yourRef', fieldLabel: '你方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.yourRef' },
        { fieldKey: 'logisticsDocumentId', fieldLabel: '物流单据', fieldI18nKey: 'PURCHASE.logisticsCostNo', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['logisticsDocumentNo'] }
      ]
    },
    {
      sectionKey: 'returnInfo',
      sectionLabel: '退货信息',
      sectionI18nKey: 'PURCHASE.returnInfo',
      fields: [
        { fieldKey: 'incotermId', fieldLabel: '国际贸易类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.incoterm', displayFields: ['incotermName'] },
        { fieldKey: 'receivePortId', fieldLabel: '收货港口', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.port', displayFields: ['receivePortName'] },
        { fieldKey: 'district', fieldLabel: '地区', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.zone' },
        { fieldKey: 'receiveAddress', fieldLabel: '收货地址', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.deliveryAddress' },
        { fieldKey: 'bpContactPersonId', fieldLabel: 'bp联系人', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.contactPerson', displayFields: ['bpContactPersonName'] },
        { fieldKey: 'bpMobilePhone', fieldLabel: 'bp手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.mobilePhone' },
        { fieldKey: 'bpEmail', fieldLabel: 'bp邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.email' }
      ]
    },
    {
      sectionKey: 'purchaseReturnProductList',
      sectionLabel: '行数据',
      sectionI18nKey: 'PURCHASE.productInfo',
      collections: [
        {
          fieldKey: 'purchaseReturnProductList',
          fieldLabel: '行数据',
          fieldI18nKey: 'PURCHASE.productInfo',
          itemKeyPrefix: 'purchaseReturnProductList',
          identityRules: [
            {
              fields: [
                'purchaseReturnProductId'
              ],
              requiredEmptyFields: []
            },
            {
              fields: [
                'productId',
                'costProjectId'
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
            'internalPartNo',
            'alias',
            'brand',
            'purchaseQty',
            'returnedQty'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'purchaseReturnProductType', fieldLabel: '类型', fieldI18nKey: 'ui.type', componentType: 'SELECT', valueType: 'STRING', displayFields: ['purchaseReturnProductTypeShowStr'] },
            { fieldKey: 'returnedType', dictType: 'purchase_returned_type', fieldLabel: '退货类型', fieldI18nKey: 'PURCHASE.RMAType', componentType: 'SELECT', valueType: 'STRING', displayFields: ['returnedTypeShowStr'] },
            { fieldKey: 'returnedReason', dictType: 'purchase_returned_reason', fieldLabel: '退货原因', fieldI18nKey: 'PURCHASE.returnReason', componentType: 'SELECT', valueType: 'STRING' },
            { fieldKey: 'returnedResult', dictType: 'purchase_returned_type', fieldLabel: '退货处理结果', fieldI18nKey: 'PURCHASE.result', componentType: 'SELECT', valueType: 'STRING' },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.alias' },
            { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.brand' },
            { fieldKey: 'purchaseUom', fieldLabel: '采购单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.uom' },
            { fieldKey: 'purchaseQty', fieldLabel: '订单数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.qty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'orderStockInQty', fieldLabel: '来源单据入库数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.receivedQTY', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'returnedQty', fieldLabel: '来源单据已经退货数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.returnedQTY1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'qtyToReturn', fieldLabel: '本单退货数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.qtyToReturn', displayFields: ['qtyToReturnShowStr'], formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'returnedAmount', fieldLabel: '退货金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.returnedAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'qtyOnHand', fieldLabel: '实际库存', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.qTYOnHand', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'availableQty', fieldLabel: '可用数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.availableQTY', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'balanceQty', fieldLabel: '剩余数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.balanceQTY', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'rejectedQty', fieldLabel: '用户拒收', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.rejectedQty1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'rejectedQtyForWarehouse', fieldLabel: '拒收退给仓库数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.returnedQtyWarehouse', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'rejectedQtyForVendor', fieldLabel: '拒收退给供应商数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.returnedQtySupplier', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'dropShippingReceivedQty', fieldLabel: '直运已签收数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.qtyAck1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'dropShippingReturnedQty', fieldLabel: '直运已退货数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.returnedQTY1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'deliveryOrderNo', fieldLabel: '运单编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.deliveryOrderNo1' },
            { fieldKey: 'costProjectCode', fieldLabel: '成本项目编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.projectCode' }
          ],
          collections: [
            {
              fieldKey: 'purchaseReturnAssignMsgList',
              fieldLabel: '记录退货信息',
              fieldI18nKey: 'PURCHASE.returnInfo',
              itemKeyPrefix: 'purchaseReturnAssignMsgList',
              identityRules: [
                {
                  fields: [
                    'assignId'
                  ],
                  requiredEmptyFields: []
                }
              ],
              itemLabelFields: [],
              summaryFields: [
                'costProjectCode',
                'returnedQty'
              ],
              componentType: 'TABLE_ROW',
              fields: [
                { fieldKey: 'costProjectCode', fieldLabel: '成本项目编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.projectCode' },
                { fieldKey: 'returnedQty', fieldLabel: '退货数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.returnedQTY1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } }
              ]
            }
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
