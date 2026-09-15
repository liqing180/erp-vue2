// 字段路径对应 InventoryInitialization 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'inventory-initialization-version-comparison-v2',
  businessNoI18nKey: 'INVENTORY.inventoryInitializationNo',
  businessNoLabel: '库存初始化编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'inventoryInitializationNo', fieldLabel: '库存初始化编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'INVENTORY.inventoryInitializationNo' },
        { fieldKey: 'warehouseId', fieldLabel: '仓库', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.warehouseName', displayFields: ['warehouseName'] },
        { fieldKey: 'currency', fieldI18nKey: 'ui.currency', fieldLabel: '货币名称', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'operatorBy', fieldI18nKey: 'INVENTORY.operator', fieldLabel: '操作人名称', componentType: 'TEXT', valueType: 'STRING' }
      ]
    },
    {
      sectionKey: 'inventoryInitializationProductList',
      sectionLabel: '产品列表',
      sectionI18nKey: 'INVENTORY.productInfo',
      collections: [
        {
          fieldKey: 'inventoryInitializationProductList',
          fieldLabel: '产品列表',
          fieldI18nKey: 'INVENTORY.productInfo',
          itemKeyPrefix: 'inventoryInitializationProductList',
          identityRules: [
            {
              fields: [
                'inventoryInitializationProductId'
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
            'description',
            'brand',
            'uom',
            'qty',
            'unitPrice',
            'decimalNum'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.alias' },
            { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
            { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.brand' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
            { fieldKey: 'qty', fieldLabel: '数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.qty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'unitPrice', fieldLabel: '单价-[采购价格]', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.purchasePrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'landedCost', fieldLabel: '到岸价', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'INVENTORY.landedCost', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'stockInQty', fieldLabel: '入库数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.stockInQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } }
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
