// 销售页面的费用及配合比明细，字段来自对应详情对象。
const remarksField = { fieldKey: 'remarks', fieldLabel: '备注', fieldI18nKey: 'ui.remarks', componentType: 'TEXTAREA', valueType: 'STRING' }
const amountField = { fieldKey: 'amount', fieldLabel: '金额', fieldI18nKey: 'SALES.amount', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } }
const picField = { fieldKey: 'picUserId', fieldI18nKey: 'SALES.PIC', fieldLabel: '负责人', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['picUserBy'] }

export const expenseItemCollection = {
  fieldKey: 'expenseItemList',
fieldLabel: '费用明细',
fieldI18nKey: 'SALES.expenseItem',
  itemKeyPrefix: 'expense',
componentType: 'TABLE_ROW',
  identityRules: [{ fields: ['expenseItemId'] }, { fields: ['expenseItemName', 'expenseItemType'] }],
  itemLabelFields: ['expenseItemName'],
  fields: [
    { fieldKey: 'expenseItemName', fieldLabel: '费用项目', fieldI18nKey: 'SALES.expenseItemName', componentType: 'TEXT', valueType: 'STRING' },
    { fieldKey: 'expenseItemType', fieldLabel: '类型', fieldI18nKey: 'ui.type', componentType: 'SELECT', valueType: 'STRING', formatter: { type: 'VALUE_MAP', values: [{ value: '1', labelI18nKey: 'SALES.expenseProportion6', label: '费用比例' }, { value: '2', labelI18nKey: 'SALES.amount6', label: '金额' }] } },
    { fieldKey: 'expenseProportionAmount', fieldLabel: '费用比例/金额', fieldI18nKey: 'SALES.expenseProportionAmount', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, precisionSelectorPath: 'expenseItemType', precisionByValue: { 1: 1, 2: 2 }, usePageNumberFormat: true } },
    { fieldKey: 'subTotal', fieldLabel: '小计', fieldI18nKey: 'SALES.subTotal1', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
    { fieldKey: 'expenseAmount', fieldLabel: '费用金额', fieldI18nKey: 'SALES.expenseAmount', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
    { fieldKey: 'description', fieldLabel: '描述', fieldI18nKey: 'ui.description', componentType: 'TEXTAREA', valueType: 'STRING' }
  ]
}

export const projectCostCollection = {
  fieldKey: 'projectCostDetailList',
fieldLabel: '项目费用明细',
fieldI18nKey: 'SALES.projectCost',
itemKeyPrefix: 'projectCost',
componentType: 'TABLE_ROW',
  identityRules: [{ fields: ['projectCostDetailId'] }, { fields: ['expenseItem', 'currencyId'] }],
  itemLabelFields: ['expenseItem'],
  fields: [
    { fieldKey: 'expenseItem', fieldLabel: '费用项目', fieldI18nKey: 'SALES.expenseItem', componentType: 'TEXT', valueType: 'STRING' },
    picField,
    { fieldKey: 'currencyId', fieldLabel: '币种', fieldI18nKey: 'ui.currency', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['currencyCode'] },
    amountField, remarksField
  ],
  collections: [{
    fieldKey: 'projectCostFiles',
propertyPath: 'commonFileList',
fieldLabel: '附件',
fieldI18nKey: 'PURCHASE.attachmentInfo',
    itemKeyPrefix: 'projectCostFile',
componentType: 'ATTACHMENT',
    identityRules: [{ fields: ['fileMd5'] }, { fields: ['id'] }, { fields: ['fileName', 'size'] }],
    itemLabelFields: ['fileName'],
    fields: [
      { fieldKey: 'fileName', fieldLabel: '文件名', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileName', componentType: 'TEXT', valueType: 'STRING' },
      { fieldKey: 'size', fieldLabel: '文件大小', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileSize', componentType: 'NUMBER', valueType: 'INTEGER', formatter: { type: 'FILE_SIZE' } },
      remarksField
    ]
  }]
}

export const mixDesignCollection = {
  fieldKey: 'salesQuotationMixDesignList',
fieldLabel: '配合比明细',
fieldI18nKey: 'SALES.mixDesign',
itemKeyPrefix: 'mixDesign',
componentType: 'TABLE_ROW',
  identityRules: [{ fields: ['salesQuotationMixDesignId'] }, { fields: ['mixDesignId', 'variationId'] }, { fields: ['mixDesignId'] }],
  itemLabelFields: ['mixDesignName'],
  fields: [
    { fieldKey: 'mixDesignId', fieldI18nKey: 'SALES.mixDesignName', fieldLabel: '配合比', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['mixDesignName'] },
    { fieldKey: 'variationId', fieldI18nKey: 'SALES.trialMixVariation', fieldLabel: '变体', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['variationShowStr', 'variation'] },
    { fieldKey: 'productCode', fieldLabel: '产品编号', fieldI18nKey: 'SALES.productCode', componentType: 'TEXT', valueType: 'STRING' },
    { fieldKey: 'volume', fieldI18nKey: 'SALES.volume', fieldLabel: '体积', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
    { fieldKey: 'unitPrice', fieldLabel: '单价', fieldI18nKey: 'SALES.unitPrice', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
    { fieldKey: 'lineTotal', fieldI18nKey: 'SALES.lineTotal', fieldLabel: '行金额', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
    { fieldKey: 'productRemarks', fieldLabel: '备注', fieldI18nKey: 'SALES.productRemarks', componentType: 'TEXTAREA', valueType: 'STRING' },
    { fieldKey: 'natureOfCasting', fieldI18nKey: 'SALES.natureOfCasting', fieldLabel: '浇筑性质', componentType: 'TEXT', valueType: 'STRING' },
    { fieldKey: 'trialMix', fieldI18nKey: 'SALES.trialMix', fieldLabel: '试配', componentType: 'TEXT', valueType: 'STRING' },
    { fieldKey: 'passingRequirements', fieldI18nKey: 'SALES.passingRequirements', fieldLabel: '通过要求', componentType: 'TEXT', valueType: 'STRING' }
  ]
}
