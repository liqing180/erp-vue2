// 字段路径对应 IStoreIssueChit 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'store-issue-chit-version-comparison-v2',
  businessNoI18nKey: 'SALES.storeIssueChitNo',
  businessNoLabel: '借货单号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'storeIssueChitNo', fieldLabel: '借货单号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.storeIssueChitNo' },
        { fieldKey: 'warehouseName', fieldLabel: '调出仓库名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'INVENTORY.warehouseName' },
        { fieldKey: 'storeIssueChitType', dictType: 'store_issue_chit_type', fieldLabel: '单据类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.type', displayFields: ['storeIssueChitTypeShowStr'] },
        { fieldKey: 'requiredId', fieldLabel: '申请人', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.requiredBy', displayFields: ['requiredBy'] },
        { fieldKey: 'isLoan', fieldLabel: '是否归还 0否1是', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.isLoan' },
        {
          fieldKey: 'returnBy',
          fieldLabel: '归还日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'SALES.returnBy'
        },
        { fieldKey: 'reason', fieldLabel: '原因', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.reason' },
        { fieldKey: 'departmentName', fieldLabel: '部门名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.department' },
        { fieldKey: 'costProjectCode', fieldLabel: '成本项目编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.projectCode' },
        { fieldKey: 'licensePlateNo', fieldLabel: '车牌号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.vehicleNo' },
        { fieldKey: 'driverName', fieldLabel: '司机名字', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.driverName' }
      ]
    },
    {
      sectionKey: 'shippingInfo',
      sectionLabel: '收货信息',
      sectionI18nKey: 'SALES.shippingInfo',
      fields: [
        { fieldKey: 'businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.customerName', displayFields: ['businessPartnerName'] },
        { fieldKey: 'receiveAddress', fieldLabel: '收货地址', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.deliveryAddress' },
        { fieldKey: 'bpContactPersonId', fieldLabel: 'bp联系人', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.contactPerson', displayFields: ['bpContactPersonName'] },
        { fieldKey: 'bpMobilePhone', fieldLabel: 'bp手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.mobilePhone' },
        { fieldKey: 'bpEmail', fieldLabel: 'bp邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.email' }
      ]
    },
    {
      sectionKey: 'storeIssueChitProductList',
      sectionLabel: '产品信息',
      sectionI18nKey: 'menu.productInfo',
      collections: [
        {
          fieldKey: 'storeIssueChitProductList',
          fieldLabel: '产品信息',
          fieldI18nKey: 'menu.productInfo',
          itemKeyPrefix: 'storeIssueChitProductList',
          identityRules: [
            {
              fields: [
                'storeIssueChitProductId'
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
            'brand',
            'qty',
            'returnedQty'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.alias' },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PURCHASE.brand' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
            { fieldKey: 'qty', fieldLabel: '借货数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.sicQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'returnedQty', fieldLabel: '已归还数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.returnedQty1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'warehouseName', fieldLabel: '仓库名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'INVENTORY.warehouseName' },
            { fieldKey: 'srUsedQty', fieldLabel: '服务订单使用数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.usedQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } }
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
