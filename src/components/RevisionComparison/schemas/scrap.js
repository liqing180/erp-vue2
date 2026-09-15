// 字段路径对应 IScrap 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'scrap-version-comparison-v2',
  businessNoI18nKey: 'WAREHOUSE.scrNo',
  businessNoLabel: '报废编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'scrapNo', fieldI18nKey: 'WAREHOUSE.scrNo', fieldLabel: '报废编号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'remarks', fieldI18nKey: 'ui.remarks', fieldLabel: '报废备注', componentType: 'TEXTAREA', valueType: 'STRING' },
        { fieldKey: 'scrapAmount', fieldLabel: '标签金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'WAREHOUSE.scrapAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } }
      ]
    },
    {
      sectionKey: 'scrapDetailList',
      sectionLabel: '报废详情列表',
      sectionI18nKey: 'WAREHOUSE.productInfo',
      collections: [
        {
          fieldKey: 'scrapDetailList',
          fieldLabel: '报废详情列表',
          fieldI18nKey: 'WAREHOUSE.productInfo',
          itemKeyPrefix: 'scrapDetailList',
          identityRules: [
            {
              fields: [
                'scrapDetailId'
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
            'labelNo',
            'productId',
            'internalPartNo',
            'sourceBy',
            'warehouseStructureCode',
            'scrapQty',
            'reason',
            'scrapAmount'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'labelNo', fieldLabel: '标签编号/位置代码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'WAREHOUSE.labelNo' },
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'WAREHOUSE.productName', displayFields: ['productName'] },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'WAREHOUSE.internalPartNo' },
            { fieldKey: 'sourceBy', fieldLabel: '货物来源名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'WAREHOUSE.source' },
            { fieldKey: 'warehouseStructureCode', fieldLabel: '仓库结构代码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'WAREHOUSE.location1' },
            { fieldKey: 'warehouseStructureCodeParents', fieldLabel: '位置代码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'WAREHOUSE.locationCode' },
            { fieldKey: 'availableQty', fieldLabel: '可报废数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'WAREHOUSE.scrapableQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'scrapQty', fieldLabel: '报废数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'WAREHOUSE.scrapQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'reason', dictType: 'label_scrap_reason', fieldLabel: '报废原因', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.reason' },
            { fieldKey: 'scrapAmount', fieldLabel: '标签金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'WAREHOUSE.scrapAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } }
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
