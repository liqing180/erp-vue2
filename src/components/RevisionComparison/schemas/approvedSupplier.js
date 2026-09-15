// 字段路径对应 PApprovedSupplier 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'approved-supplier-version-comparison-v2',
  businessNoI18nKey: 'PURCHASE.aslNo',
  businessNoLabel: '合格供应商编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'approvedSupplierNo', fieldI18nKey: 'PURCHASE.aslNo', fieldLabel: '合格供应商编号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'purchaseQuotationId', fieldLabel: '报价单', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.purchaseQuotationNo', displayFields: ['purchaseQuotationNo'] },
        { fieldKey: 'businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.supplierName', displayFields: ['businessPartnerName'] },
        { fieldKey: 'businessPartnerNo', fieldLabel: '生意伙伴编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.supplierCode' },
        { fieldKey: 'countryId', fieldLabel: '国家', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.country', displayFields: ['country'] },
        { fieldKey: 'contactPersonId', fieldI18nKey: 'PURCHASE.contactPerson', fieldLabel: '联系人', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['contactPersonName'] },
        { fieldKey: 'currencyCode', fieldLabel: '货币', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.currency', displayFields: ['currency'] },
        { fieldKey: 'paymentTermId', fieldLabel: '支付条款', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.paymentTerm', displayFields: ['paymentTermName'] },
        { fieldKey: 'incotermId', fieldI18nKey: 'PURCHASE.incoterm', fieldLabel: '国际贸易类型', componentType: 'TEXT', valueType: 'STRING', displayFields: ['incotermName'] },
        { fieldKey: 'taxRate', fieldI18nKey: 'PURCHASE.taxRate', fieldLabel: '税率', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'receivePortId', fieldI18nKey: 'PURCHASE.port', fieldLabel: '收货港口', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['receivePortName'] }
      ]
    },
    {
      sectionKey: 'detailList',
      sectionLabel: '明细列表',
      sectionI18nKey: 'PURCHASE.productInfo',
      collections: [
        {
          fieldKey: 'detailList',
          fieldLabel: '明细列表',
          fieldI18nKey: 'PURCHASE.productInfo',
          itemKeyPrefix: 'detailList',
          identityRules: [
            { fields: ['approvedSupplierMainId'], requiredEmptyFields: [] },
            {
              fields: [
                'productId'
              ],
              requiredEmptyFields: []
            },
            {
              fields: [
                'contactPersonId'
              ],
              requiredEmptyFields: []
            }
          ],
          itemLabelFields: [
            'internalPartNo',
            'productName'
          ],
          summaryFields: [
            'unitPrice'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'externalPartNo', fieldLabel: '外部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.externalPartNo' },
            { fieldKey: 'purchaseUom', fieldLabel: '采购单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.purchaseUOM' },
            { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.unitPrice', displayFields: ['unitPriceShowStr'], formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'authorizedPrice', fieldLabel: '授权价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.authorizedPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'moq', fieldLabel: '采购最小数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.MOQ', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'leadTime', fieldLabel: '生产周期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.leadTimeDays' },
            { fieldKey: 'warranty', fieldLabel: '保修期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.warrantyDays' },
            { fieldKey: 'purchaseUomCoefficient', fieldLabel: '采购单位系数', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.ratio' },
            {
              fieldKey: 'effectiveDate',
              fieldLabel: '生效日期',
              componentType: 'DATE',
              valueType: 'DATE',
              formatter: {
                type: 'DATE'
              },
              fieldI18nKey: 'PURCHASE.effectiveDate'
            },
            {
              fieldKey: 'expiryDate',
              fieldLabel: '失效日期',
              componentType: 'DATE',
              valueType: 'DATE',
              formatter: {
                type: 'DATE'
              },
              fieldI18nKey: 'PURCHASE.expiryDate'
            }
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
                'remarks'
              ],
              componentType: 'TABLE_ROW',
              fields: [
                { fieldKey: 'expenseItemName', fieldLabel: '费用项', fieldI18nKey: 'system.expenseItem', componentType: 'TEXT', valueType: 'STRING' },
                { fieldKey: 'unit', fieldLabel: '单位', fieldI18nKey: 'ui.unit', componentType: 'TEXT', valueType: 'STRING' },
                { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.unitPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
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
    }
    ]
}
