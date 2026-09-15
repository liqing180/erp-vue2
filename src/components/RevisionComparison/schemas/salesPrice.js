// 字段路径对应 SalesPrice 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'sales-price-version-comparison-v2',
  businessNoI18nKey: 'SALES.rrpCode1',
  businessNoLabel: '销售定价单编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'salesPriceNo', fieldLabel: '销售定价单编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.rrpCode' },
        { fieldKey: 'salesOrganizationName', fieldLabel: '销售组织名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.salesOrganization' },
        { fieldKey: 'reason', fieldLabel: '原因', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.reason' },
        { fieldKey: 'departmentName', fieldLabel: '部门名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.department' }
      ]
    },
    {
      sectionKey: 'salesPriceProductList',
      sectionLabel: '产品信息',
      sectionI18nKey: 'SALES.productInfo',
      collections: [
        {
          fieldKey: 'salesPriceProductList',
          fieldLabel: '产品信息',
          fieldI18nKey: 'SALES.productInfo',
          itemKeyPrefix: 'salesPriceProductList',
          identityRules: [
            {
              fields: [
                'salesPriceProductId'
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
            'currency',
            'pricingUom',
            'competitorPriceForMax',
            'competitorPriceForMin'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'currency', fieldLabel: '货币名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.currency' },
            { fieldKey: 'pricingUom', fieldLabel: '定价单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.pricingUnit' },
            { fieldKey: 'competitorPriceForMax', fieldLabel: '竞品价格', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.competitorPricingHigh', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'competitorPriceForMin', fieldLabel: '竞品价格', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.competitorPricingLow', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'recommendedRetailPrice', fieldLabel: '建议售价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.recommendedRetailPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesRetailPrice', fieldLabel: '销售定价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'minRate', fieldLabel: '最低率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.minRate' },
            { fieldKey: 'minPrice', fieldLabel: '最低限价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.minimumPriceFloor', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'maxRate', fieldLabel: '最高率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.maxRate' },
            { fieldKey: 'maxPrice', fieldLabel: '最高限价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.maximumPriceCeiling', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'salesPartNo', fieldLabel: '销售编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.salesPartNo' },
            { fieldKey: 'inventoryCost', fieldLabel: '库存成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.costOfGoods', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } }
          ]
        }
      ]
    }
  ]
}
