// 字段路径对应 PConsignmentOrder 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'consignment-order-version-comparison-v2',
  businessNoI18nKey: 'PURCHASE.consignmentOrderNo',
  businessNoLabel: '寄售订单编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'consignmentOrderNo', fieldLabel: '寄售订单编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.consignmentOrderNo' },
        { fieldKey: 'businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.supplierName', displayFields: ['businessPartnerName'] },
        { fieldKey: 'countryId', fieldLabel: '国家', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.country', displayFields: ['country'] },
        { fieldKey: 'currencyId', fieldLabel: '货币', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.currency', displayFields: ['currency'] },
        { fieldKey: 'departmentName', fieldLabel: '部门名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.department' },
        { fieldKey: 'purchasePersonId', fieldLabel: '采购员', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.purchaser', displayFields: ['purchasePersonBy'] },
        { fieldKey: 'paymentTermId', fieldLabel: '支付条款', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.paymentTerm', displayFields: ['paymentTermName'] },
        { fieldKey: 'ourRef', fieldLabel: '我方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.ourRef' },
        { fieldKey: 'yourRef', fieldLabel: '你方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.yourRef' },
        {
          fieldKey: 'committedDate',
          fieldLabel: '承诺日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'PURCHASE.committedDate'
        },
        { fieldKey: 'basicRemarks', fieldI18nKey: 'ui.remarks', fieldLabel: '基本信息备注', componentType: 'TEXTAREA', valueType: 'STRING' },
        { fieldKey: 'deliveryOrderNo', fieldLabel: '运输单号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.shippingNo' },
        { fieldKey: 'taxRate', fieldLabel: '税率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.taxRate', displayFields: ['taxRateShowStr'] },
        { fieldKey: 'subTotal', fieldLabel: '总计', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.subTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalFreight', fieldLabel: '总运费', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.totalFreight', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalTaxAmount', fieldLabel: '总税额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.taxAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalAmount', fieldLabel: '总价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.totalAmount', displayFields: ['totalAmountShowStr'], formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        {
          fieldKey: 'consignmentStartTime',
          fieldI18nKey: 'PURCHASE.consignmentStart',
          fieldLabel: '寄卖开始时间',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          }
        },
        {
          fieldKey: 'consignmentEndTime',
          fieldI18nKey: 'PURCHASE.consignmentEnd',
          fieldLabel: '寄卖结束时间',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          }
        }
      ]
    },
    {
      sectionKey: 'shippingInfo',
      sectionLabel: '收货信息',
      sectionI18nKey: 'PURCHASE.shippingInfo',
      fields: [
        { fieldKey: 'incotermId', fieldLabel: '国际贸易类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.incoterm', displayFields: ['incotermName'] },
        { fieldKey: 'shipToAddressId', fieldLabel: '收货地址', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.shipToAddress1', displayFields: ['shipToAddressName'] },
        // 寄售订单的 receiveAddressId/Name 保存所选仓库，与 warehouseId/Name 同步，按表单只展示一次。
        { fieldKey: 'receiveAddressId', fieldLabel: '仓库名称', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.warehouseName', displayFields: ['receiveAddressName'] },
        { fieldKey: 'requestedBy', fieldLabel: '收货联系人名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.requestedBy' },
        { fieldKey: 'requestedMobilePhone', fieldLabel: '仓库手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.requestedMobilePhone' },
        { fieldKey: 'requestedEmail', fieldLabel: '仓库邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.requestedEmail' },
        { fieldKey: 'shipRemarks', fieldI18nKey: 'ui.remarks', fieldLabel: '收货地址备注', componentType: 'TEXTAREA', valueType: 'STRING' }
      ]
    },
    {
      sectionKey: 'deliveryInfo',
      sectionLabel: '发货信息',
      sectionI18nKey: 'PURCHASE.deliveryInfo',
      fields: [
        { fieldKey: 'bpAddress', fieldLabel: 'bp地址', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.deliveryAddress1' },
        { fieldKey: 'bpContactPersonId', fieldLabel: 'bp联系人', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.deliveryBy', displayFields: ['bpContactPersonName'] },
        { fieldKey: 'bpMobilePhone', fieldLabel: 'bp手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.deliveryMobilePhone' },
        { fieldKey: 'bpEmail', fieldLabel: 'bp邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.deliveryEmail' }
      ]
    },
    {
      sectionKey: 'consignmentOrderDetailList',
      sectionLabel: '产品行数据列表',
      sectionI18nKey: 'PURCHASE.productInfo',
      collections: [
        {
          fieldKey: 'consignmentOrderDetailList',
          fieldLabel: '产品行数据列表',
          fieldI18nKey: 'PURCHASE.productInfo',
          itemKeyPrefix: 'consignmentOrderDetailList',
          identityRules: [
            {
              fields: [
                'consignmentOrderDetailId'
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
            'description',
            'internalPartNo',
            'brand',
            'externalPartNo',
            'uom',
            'lineTotal'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.productName', displayFields: ['productName'] },
            { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.internalPartNo' },
            { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.brand' },
            { fieldKey: 'externalPartNo', fieldLabel: '外部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.externalPartNo' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.uom' },
            { fieldKey: 'uomCoefficient', fieldLabel: '单位系数', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.ratio' },
            { fieldKey: 'consignedQty', fieldLabel: '寄售数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.consignedQty', displayFields: ['consignedQtyShowStr'], formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'consignedCost', fieldLabel: '寄售成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.consignedCost', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'consignedAmount', fieldLabel: '寄售价格', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.consignedAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'warranty', fieldLabel: '保修期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.warrantyDays' },
            {
              fieldKey: 'committedDate',
              fieldLabel: '承诺日期',
              componentType: 'DATE',
              valueType: 'DATE',
              formatter: {
                type: 'DATE'
              },
              fieldI18nKey: 'PURCHASE.committedDate'
            },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'stockInQty', fieldLabel: '已经入库数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.stockInQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'qcFailedQty', fieldLabel: '已经入库数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.qcFailedQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } }
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
