// 字段路径对应 SalesGoodsReturn 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'sales-goods-return-version-comparison-v2',
  businessNoI18nKey: 'SALES.salesGoodsReturnNo',
  businessNoLabel: '销售退货单编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'salesGoodsReturnNo', fieldLabel: '销售退货单编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.salesGoodsReturnNo' },
        { fieldKey: 'businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.customerName', displayFields: ['businessPartnerName'] },
        { fieldKey: 'deliveryOrderId', fieldLabel: '运单', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.deliveryOrderNo', displayFields: ['deliveryOrderNo'] },
        { fieldKey: 'salesOrderNo', fieldLabel: '销售订单编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.salesOrderNo' },
        { fieldKey: 'salesPersonBy', fieldLabel: '销售员名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.salesPerson' },
        { fieldKey: 'warehouseId', fieldLabel: '仓库', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.warehouseName', displayFields: ['warehouseName'] },
        { fieldKey: 'ourRef', fieldLabel: '我方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.ourRef' },
        { fieldKey: 'yourRef', fieldLabel: '你方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.yourRef' },
        {
          fieldKey: 'soldDate',
          fieldI18nKey: 'SALES.dateSold',
          fieldLabel: '销售日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          }
        },
        { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' }
      ]
    },
    {
      sectionKey: 'salesGoodsReturnProductList',
      sectionLabel: '产品信息',
      sectionI18nKey: 'SALES.productInfo',
      collections: [
        {
          fieldKey: 'salesGoodsReturnProductList',
          fieldLabel: '产品信息',
          fieldI18nKey: 'SALES.productInfo',
          itemKeyPrefix: 'salesGoodsReturnProductList',
          identityRules: [
            {
              fields: [
                'salesGoodsReturnProductId'
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
            'alias'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'returnedReason', dictType: 'sales_returned_reason', fieldLabel: '退货原因', fieldI18nKey: 'SALES.returnReason', componentType: 'SELECT', valueType: 'STRING' },
            { fieldKey: 'rmaType', dictType: 'sales_rma_type', fieldLabel: 'RMA类型', fieldI18nKey: 'SALES.RMAType', componentType: 'SELECT', valueType: 'STRING' },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.alias' },
            { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.brand' },
            { fieldKey: 'ackQty', fieldLabel: '已经签收数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.deliveredQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'balanceQty', fieldLabel: '剩余数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.returnableQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
            { fieldKey: 'qtyToReturn', fieldLabel: '本次退货数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.qtyToReturn', displayFields: ['qtyToReturnShowStr'], formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'returnedAmount', fieldLabel: '退货金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.returnedAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'qtyToRejected', fieldLabel: '本次拒货数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.qtyToRejected', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'rejectedAmount', fieldLabel: '拒货金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.rejectedAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            {
              fieldKey: 'scheduledReceivedDate',
              fieldLabel: '预计收货日期',
              componentType: 'DATE',
              valueType: 'DATE',
              formatter: {
                type: 'DATE'
              },
              fieldI18nKey: 'SALES.estimatedReturnDate'
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
