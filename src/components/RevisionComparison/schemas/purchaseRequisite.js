// 字段路径对应 PPurchaseRequisite 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'purchase-requisite-version-comparison-v2',
  businessNoI18nKey: 'PURCHASE.purchaseRequisitionNo',
  businessNoLabel: '采购申请单编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'purchaseRequisiteNo', fieldLabel: '采购申请单编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.purchaseRequisitionNo' },
        { fieldKey: 'departmentName', fieldLabel: '部门名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.department' },
        { fieldKey: 'requiredId', fieldLabel: '申请人', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.requiredBy', displayFields: ['requiredBy'] },
        { fieldKey: 'dropShipping', fieldLabel: '是否直运', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'PURCHASE.dropShipping', displayFields: ['dropShippingShowStr'] },
        { fieldKey: 'warehouseId', fieldLabel: '仓库', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.warehouseName', displayFields: ['warehouseName'] },
        { fieldKey: 'receiveAddressName', fieldLabel: '收货地址名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.deliveryAddress' },
        { fieldKey: 'requiredType', fieldI18nKey: 'PURCHASE.requiredFrom', dictType: 'p_required_type', fieldLabel: '需求来源/申请来源', componentType: 'TEXT', valueType: 'STRING', displayFields: ['requiredTypeShowStr'] },
        { fieldKey: 'reason', fieldLabel: '原因', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'documentNo', fieldLabel: '业务编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.DocNo' },
        { fieldKey: 'productName', fieldLabel: '产品名信息逗号拼接', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.productName' },
        { fieldKey: 'costProjectId', fieldLabel: '成本项目', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.projectName', displayFields: ['costProjectName'] },
        { fieldKey: 'costProjectCode', fieldLabel: '成本项目编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.projectNameNo' },
        { fieldKey: 'contactPersonName', fieldLabel: '联系人名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.consignee', displayFields: ['contactPersonNameShowStr'] },
        { fieldKey: 'mobilePhone', fieldLabel: '手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.mobilePhone' },
        { fieldKey: 'email', fieldLabel: '邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.email' }
      ]
    },
    {
      sectionKey: 'purchaseRequisiteDetailList',
      sectionLabel: '行数据',
      sectionI18nKey: 'PURCHASE.productInfo',
      collections: [
        {
          fieldKey: 'purchaseRequisiteDetailList',
          fieldLabel: '行数据',
          fieldI18nKey: 'PURCHASE.productInfo',
          itemKeyPrefix: 'purchaseRequisiteDetailList',
          identityRules: [
            {
              fields: [
                'purchaseRequisiteDetailId'
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
            'alias',
            'internalPartNo',
            'description',
            'uom',
            'qty',
            'qtyOnHand'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PURCHASE.productName', displayFields: ['productName'] },
            { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.alias' },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.internalPartNo' },
            { fieldKey: 'description', fieldLabel: '产品描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.uom' },
            { fieldKey: 'qty', fieldLabel: '申请数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.qty', displayFields: ['qtyShowStr'], formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', trimZeroWhenPaths: ['isAdhocEntry', 'isCustomProduct'], usePageNumberFormat: true } },
            { fieldKey: 'qtyOnHand', fieldLabel: '实际库存', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.qTYOnHand', displayFields: ['qtyOnHandShowStr'], formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            {
              fieldKey: 'deliveryDate',
              fieldLabel: '交付日期',
              componentType: 'DATE',
              valueType: 'DATE',
              formatter: {
                type: 'DATE'
              },
              fieldI18nKey: 'PURCHASE.requestedReceiptDate',
              displayFields: [
                'deliveryDateShowStr'
              ]
            },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'externalPartNo', fieldLabel: '外部编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.externalPartNo' },
            { fieldKey: 'receiptQtyForBasic', fieldLabel: '收货数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PURCHASE.receivedQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } }
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
