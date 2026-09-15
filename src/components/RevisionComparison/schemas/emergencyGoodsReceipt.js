// 字段路径对应 IEmergencyGoodsReceipt 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'emergency-goods-receipt-version-comparison-v2',
  businessNoI18nKey: 'PURCHASE.emergencyGoodsReceiptNo',
  businessNoLabel: '紧急收货单号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'emergencyGoodsReceiptNo', fieldLabel: '紧急收货单号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.emergencyGoodsReceiptNo' },
        { fieldKey: 'businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.supplierName', displayFields: ['businessPartnerName'] },
        { fieldKey: 'departmentName', fieldLabel: '部门名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.department' },
        { fieldKey: 'requiredId', fieldI18nKey: 'PURCHASE.requiredBy', fieldLabel: '申请人', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['requiredBy'] },
        { fieldKey: 'warehouseId', fieldLabel: '仓库', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.warehouseName', displayFields: ['warehouseName'] },
        { fieldKey: 'deliveryOrderNo', fieldLabel: '运单号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.deliveryOrderNo1' },
        { fieldKey: 'costProjectCode', fieldLabel: '成本项目编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.projectNameNo' },
        {
          fieldKey: 'receivedDate',
          fieldLabel: '收货日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'PURCHASE.receivedDate'
        },
        { fieldKey: 'currency', fieldLabel: '货币名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.currency' },
        { fieldKey: 'zoneId', fieldI18nKey: 'PURCHASE.zone', fieldLabel: '区域', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['zoneName'] },
        { fieldKey: 'reason', fieldI18nKey: 'ui.reason', fieldLabel: '原因', componentType: 'TEXTAREA', valueType: 'STRING' },
        { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'dropShipping', fieldI18nKey: 'PURCHASE.dropShipping', fieldLabel: '是否直运', componentType: 'SWITCH', valueType: 'STRING', displayFields: ['dropShippingShowStr'] },
        { fieldKey: 'receiveAddressName', fieldI18nKey: 'PURCHASE.deliveryAddress', fieldLabel: '收货地址名称', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'contactPersonName', fieldI18nKey: 'PURCHASE.consignee', fieldLabel: '联系人名称', componentType: 'TEXT', valueType: 'STRING', displayFields: ['contactPersonNameShowStr'] },
        { fieldKey: 'mobilePhone', fieldLabel: '手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.mobilePhone' },
        { fieldKey: 'email', fieldLabel: '邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.email' }
      ]
    },
    {
      sectionKey: 'emergencyGoodsReceiptDetailList',
      sectionLabel: '行数据',
      sectionI18nKey: 'PURCHASE.goodsReceiptDetails',
      collections: [
        {
          fieldKey: 'emergencyGoodsReceiptDetailList',
          fieldLabel: '行数据',
          fieldI18nKey: 'PURCHASE.goodsReceiptDetails',
          itemKeyPrefix: 'emergencyGoodsReceiptDetailList',
          identityRules: [
            {
              fields: [
                'emergencyGoodsReceiptDetailId'
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
            'description',
            'uom',
            'receivedQty',
            'unitPrice',
            'lineTotal'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.productName', displayFields: ['productName'] },
            { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.alias' },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.internalPartNo' },
            { fieldKey: 'description', fieldLabel: '产品描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.uom' },
            { fieldKey: 'receivedQty', fieldLabel: '收货数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.receiveQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'stockInQty', fieldLabel: '入库数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.stockInQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.unitPrice', formatter: { type: 'DECIMAL', precision: 6, minPrecision: 2, usePageNumberFormat: true } },
            { fieldKey: 'lineTotal', fieldLabel: '总金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.lineTotal', formatter: { type: 'DECIMAL', precision: 6, minPrecision: 2, usePageNumberFormat: true } },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' }
          ],
          collections: [
            {
              fieldKey: 'serviceSurchargeList',
              fieldLabel: '服务附加费列表',
              fieldI18nKey: 'PURCHASE.surchargeDetails',
              itemKeyPrefix: 'serviceSurchargeList',
              identityRules: [
                {
                  fields: [
                    'serviceSurchargeId'
                  ],
                  requiredEmptyFields: []
                },
                {
                  fields: [
                    'expenseItemName',
                    'unit'
                  ],
                  requiredEmptyFields: []
                }
              ],
              itemLabelFields: [
                'expenseItemName'
              ],
              summaryFields: [
                'unitPrice',
                'lineTotal',
                'description',
                'remarks'
              ],
              componentType: 'TABLE_ROW',
              fields: [
                { fieldKey: 'expenseItemName', fieldLabel: '费用项', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.expenseItem' },
                { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.unitPrice', formatter: { type: 'DECIMAL', precision: 6, minPrecision: 2, usePageNumberFormat: true } },
                { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.lineTotal', formatter: { type: 'DECIMAL', precision: 6, minPrecision: 2, usePageNumberFormat: true } },
                { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
                { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' }
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
    },
    {
      sectionKey: 'commonFileListForDO',
      sectionLabel: 'DO附件列表',
      sectionI18nKey: 'ui.attachment',
      sectionLabelSuffix: '(DO)',
      collections: [
        {
          fieldKey: 'commonFileListForDO',
          fieldLabel: 'DO附件列表',
          fieldI18nKey: 'ui.attachment',
          fieldLabelSuffix: '(DO)',
          itemKeyPrefix: 'commonFileListForDO',
          identityRules: [
            {
              fields: [
                'fileMd5'
              ],
              requiredEmptyFields: []
            },
            {
              fields: [
                'id'
              ],
              requiredEmptyFields: []
            },
            {
              fields: [
                'fileName',
                'size'
              ],
              requiredEmptyFields: []
            }
          ],
          itemLabelFields: [
            'fileName'
          ],
          summaryFields: [
            'fileName',
            'fileExtension',
            'size',
            'remarks'
          ],
          componentType: 'ATTACHMENT',
          fields: [
            { fieldKey: 'fileName', fieldLabel: '文件名', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileName', componentType: 'TEXT', valueType: 'STRING' },
            { fieldKey: 'fileExtension', fieldLabel: '文件类型', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileType', componentType: 'TEXT', valueType: 'STRING' },
            { fieldKey: 'size', fieldLabel: '文件大小', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileSize', componentType: 'NUMBER', valueType: 'INTEGER', formatter: { type: 'FILE_SIZE' } },
            { fieldKey: 'remarks', fieldLabel: '备注', fieldI18nKey: 'ui.remarks', componentType: 'TEXTAREA', valueType: 'STRING' }
          ]
        }
      ]
    }
  ]
}
