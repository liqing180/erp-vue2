// 采购订单版本对比 Schema v2：描述可对比字段、展示顺序、组件类型和格式化规则。
// 生成结果会作为 comparisonDefinition 直接传给后端，因此必须保持纯 JSON 可序列化。
export const PURCHASE_ORDER_SCHEMA_V2_KEY = 'purchase-order-version-comparison-v2'
export const PURCHASE_ORDER_SCHEMA_V2_VERSION = 2

export const PURCHASE_ORDER_SCHEMA_V2_COMPONENT_TYPES = [
  'TEXT',
  'TEXTAREA',
  'NUMBER',
  'MONEY',
  'DATE',
  'SELECT',
  'SWITCH',
  'REFERENCE',
  'TABLE_ROW',
  'ATTACHMENT'
]

const VALUE_TYPES = ['STRING', 'INTEGER', 'DECIMAL', 'DATE', 'DATETIME', 'BOOLEAN', 'ARRAY']
const FORMATTER_TYPES = [
  'DECIMAL',
  'DATE',
  'DATETIME',
  'VALUE_MAP',
  'FILE_SIZE',
  'PERCENT',
  'LIST_JOIN',
  'VARIABLE_TEMPLATE'
]
const TEMPORARY_IDENTITY_FIELDS = ['index', 'timerId', 'rowTimeId']
const SECTION_CONTENT_TYPES = ['FIELDS', 'COLLECTIONS']
// 金额最少显示两位、最多显示六位有效小数，并显示千分符。
const MONEY_FORMATTER = {
  type: 'DECIMAL',
  precision: 6,
  minPrecision: 2,
  useGrouping: true
}
// 与采购订单详情页保持一致：按版本快照生成变量内容，无法解析的占位符原样保留。
const CONDITION_VARIABLE_FORMATTER = {
  type: 'VARIABLE_TEMPLATE',
  variablePattern: '\\$\\{([A-Za-z0-9 _-]+)\\}',
  variableProvider: 'PURCHASE_ORDER_FORMATTED_VAR_CONTENT',
  unresolvedVariablePolicy: 'KEEP_PLACEHOLDER',
  compareFormattedValue: true
}
const COMPONENT_I18N_KEYS = {
  TEXT: 'component.text',
  TEXTAREA: 'component.textarea',
  NUMBER: 'component.number',
  MONEY: 'component.money',
  DATE: 'component.date',
  SELECT: 'component.select',
  SWITCH: 'component.switch',
  REFERENCE: 'component.reference',
  TABLE_ROW: 'component.tableRow',
  ATTACHMENT: 'component.attachment'
}

function translate(t, key, fallback) {
  if (typeof t !== 'function') return fallback || key
  const translated = t(key)
  return translated === key ? fallback || key : translated
}

function componentLabel(t, type) {
  return translate(t, `PURCHASE.versionComparisonV2.componentTypes.${type}`, type)
}

// 创建标准字段定义，路径、标签、类型及是否参与对比等公共属性。
function createField(t, options) {
  const componentType = options.componentType || 'TEXT'
  const result = {
    fieldKey: options.fieldKey,
    propertyPath: options.propertyPath || options.fieldKey,
    fieldLabel: translate(t, options.fieldI18nKey, options.fallbackLabel),
    fieldI18nKey: options.fieldI18nKey,
    componentType,
    componentLabel: componentLabel(t, componentType),
    componentI18nKey: COMPONENT_I18N_KEYS[componentType],
    valueType: options.valueType || 'STRING',
    compareEnabled: options.compareEnabled !== false,
    order: options.order
  }
  if (Array.isArray(options.displayFields) && options.displayFields.length > 0) {
    result.displayFields = options.displayFields
  }
  if (options.formatter) result.formatter = options.formatter
  return result
}

// 创建集合字段定义；identityRules 用于后端稳定识别新增、修改和删除的业务行。
function createCollection(t, options) {
  const componentType = options.componentType || 'TABLE_ROW'
  const summaryFields = new Set(options.summaryFields || [])
  ;(options.fields || []).forEach(field => {
    if (field.formatter && field.formatter.precisionPath) summaryFields.add(field.formatter.precisionPath)
  })
  const result = {
    fieldKey: options.fieldKey,
    propertyPath: options.propertyPath || options.fieldKey,
    fieldLabel: translate(t, options.fieldI18nKey, options.fallbackLabel),
    fieldI18nKey: options.fieldI18nKey,
    componentType,
    componentLabel: componentLabel(t, componentType),
    componentI18nKey: COMPONENT_I18N_KEYS[componentType],
    itemKeyPrefix: options.itemKeyPrefix,
    identityRules: options.identityRules,
    itemLabelFields: options.itemLabelFields || [],
    summaryFields: Array.from(summaryFields),
    orderSensitive: options.orderSensitive !== false,
    order: options.order,
    fields: options.fields || [],
    collections: options.collections || []
  }
  if (options.mergeChangesToParent === true) result.mergeChangesToParent = true
  return result
}

function normalizeStatusOptions(options) {
  return (options || []).map((item) => ({ value: item.value, label: item.label }))
}

// 采购订单基础信息字段。
function buildBasicFields(t, statusOptions, booleanLabels) {
  return [
    createField(t, { fieldKey: 'businessPartnerId', fieldI18nKey: 'ui.supplier', fallbackLabel: 'Supplier', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['businessPartnerName'], order: 1 }),
    createField(t, { fieldKey: 'purchaseOrderStatus', fieldI18nKey: 'ui.status', fallbackLabel: 'Status', componentType: 'SELECT', formatter: statusOptions.length ? { type: 'VALUE_MAP', values: statusOptions } : null, compareEnabled: false, order: 2 }),
    createField(t, { fieldKey: 'purchaseOrderNo', fieldI18nKey: 'PURCHASE.purchaseOrderNo', fallbackLabel: 'Purchase Order No.', order: 3 }),
    createField(t, { fieldKey: 'purchaseRequisiteList', fieldI18nKey: 'PURCHASE.purchaseRequisitionNo', fallbackLabel: 'Purchase Requisition No.', componentType: 'REFERENCE', valueType: 'ARRAY', formatter: { type: 'LIST_JOIN', itemPath: 'purchaseRequisiteNo', separator: ', ' }, order: 4 }),
    createField(t, { fieldKey: 'purchaseQuotationId', fieldI18nKey: 'PURCHASE.purchaseQuotationNo', fallbackLabel: 'Purchase Quotation No.', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['purchaseQuotationNo'], order: 5 }),
    createField(t, { fieldKey: 'leadTimeForDay', fieldI18nKey: 'PURCHASE.leadTimeDays', fallbackLabel: 'Lead Time (Days)', componentType: 'NUMBER', valueType: 'INTEGER', formatter: { type: 'DECIMAL', precision: 0 }, order: 6 }),
    createField(t, { fieldKey: 'ourRef', fieldI18nKey: 'PURCHASE.ourRef', fallbackLabel: 'Our Ref.', order: 7 }),
    createField(t, { fieldKey: 'currencyId', fieldI18nKey: 'ui.currency', fallbackLabel: 'Currency', componentType: 'SELECT', valueType: 'INTEGER', displayFields: ['currency'], order: 8 }),
    createField(t, { fieldKey: 'purchasePersonId', fieldI18nKey: 'PURCHASE.purchaser', fallbackLabel: 'Purchaser', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['purchasePersonBy'], order: 9 }),
    createField(t, { fieldKey: 'yourRef', fieldI18nKey: 'PURCHASE.yourRef', fallbackLabel: 'Your Ref.', order: 10 }),
    createField(t, { fieldKey: 'paymentTermId', fieldI18nKey: 'PURCHASE.paymentTerm', fallbackLabel: 'Payment Term', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['paymentTermName'], order: 11 }),
    createField(t, { fieldKey: 'paymentTermMsg', fieldI18nKey: 'PURCHASE.versionComparisonV2.paymentTermDetails', fallbackLabel: 'Payment Term Details', componentType: 'TEXTAREA', compareEnabled: true, order: 12 }),
    createField(t, { fieldKey: 'validityForDay', fieldI18nKey: 'PURCHASE.validityDays', fallbackLabel: 'Validity (Days)', componentType: 'NUMBER', valueType: 'INTEGER', formatter: { type: 'DECIMAL', precision: 0 }, order: 13 }),
    createField(t, { fieldKey: 'validity', fieldI18nKey: 'PURCHASE.versionComparisonV2.validityDate', fallbackLabel: 'Validity Date', componentType: 'DATE', valueType: 'DATE', formatter: { type: 'DATE' }, order: 14 }),
    createField(t, { fieldKey: 'basicRemarks', fieldI18nKey: 'ui.remarks', fallbackLabel: 'Remarks', componentType: 'TEXTAREA', order: 15 }),
    createField(t, { fieldKey: 'automatedEmail', fieldI18nKey: 'PURCHASE.automatedEmail', fallbackLabel: 'Automated Email', componentType: 'SWITCH', valueType: 'BOOLEAN', formatter: { type: 'VALUE_MAP', values: booleanLabels }, order: 16 }),
    createField(t, { fieldKey: 'dropShipping', fieldI18nKey: 'PURCHASE.dropShipping', fallbackLabel: 'Drop-Shipping', componentType: 'SWITCH', valueType: 'BOOLEAN', formatter: { type: 'VALUE_MAP', values: booleanLabels }, order: 17 }),
    createField(t, { fieldKey: 'taxIncluded', fieldI18nKey: 'system.taxIncluded', fallbackLabel: 'Tax Included', componentType: 'SWITCH', valueType: 'BOOLEAN', formatter: { type: 'VALUE_MAP', values: booleanLabels }, order: 18 })
  ]
}

function buildRecipientFields(t) {
  return [
    createField(t, { fieldKey: 'incotermId', fieldI18nKey: 'PURCHASE.incoterm', fallbackLabel: 'Incoterm', componentType: 'REFERENCE', displayFields: ['incotermName'], order: 1 }),
    createField(t, { fieldKey: 'receivePortId', fieldI18nKey: 'PURCHASE.port', fallbackLabel: 'Port', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['receivePortName'], order: 2 }),
    createField(t, { fieldKey: 'receiveAddressId', fieldI18nKey: 'PURCHASE.deliveryAddress', fallbackLabel: 'Delivery Address', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['receiveAddressName'], order: 3 }),
    createField(t, { fieldKey: 'requestedId', fieldI18nKey: 'PURCHASE.consignee', fallbackLabel: 'Consignee', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['requestedBy'], order: 4 }),
    createField(t, { fieldKey: 'requestedEmail', fieldI18nKey: 'PURCHASE.requestedEmail', fallbackLabel: 'Consignee Email', order: 5 }),
    createField(t, { fieldKey: 'requestedMobilePhone', fieldI18nKey: 'PURCHASE.requestedMobilePhone', fallbackLabel: 'Consignee Mobile', order: 6 }),
    createField(t, { fieldKey: 'shipRemarks', fieldI18nKey: 'ui.remarks', fallbackLabel: 'Remarks', componentType: 'TEXTAREA', order: 7 })
  ]
}

// 产品明细字段，order 同时决定集合行内变更字段的展示顺序。
function buildProductFields(t) {
  return [
    createField(t, { fieldKey: 'productId', fieldI18nKey: 'PURCHASE.productName', fallbackLabel: 'Product Name', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['productName'], order: 1 }),
    createField(t, { fieldKey: 'internalPartNo', fieldI18nKey: 'PURCHASE.internalPartNo', fallbackLabel: 'Internal Part No.', order: 2 }),
    createField(t, { fieldKey: 'description', fieldI18nKey: 'ui.description', fallbackLabel: 'Description', componentType: 'TEXTAREA', order: 3 }),
    createField(t, { fieldKey: 'externalPartNo', fieldI18nKey: 'PURCHASE.externalPartNo', fallbackLabel: 'External Part No.', order: 4 }),
    createField(t, { fieldKey: 'purchaseUom', fieldI18nKey: 'PURCHASE.purchaseUOM', fallbackLabel: 'Purchase UOM', order: 5 }),
    createField(t, { fieldKey: 'moq', fieldI18nKey: 'PURCHASE.MOQ', fallbackLabel: 'MOQ', componentType: 'NUMBER', valueType: 'DECIMAL', order: 6 }),
    createField(t, { fieldKey: 'purchaseQty', fieldI18nKey: 'PURCHASE.qty', fallbackLabel: 'Quantity', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum' }, order: 7 }),
    createField(t, { fieldKey: 'stockInQty', fieldI18nKey: 'PURCHASE.stockInQty', fallbackLabel: 'Stock-in Quantity', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum' }, order: 8 }),
    createField(t, { fieldKey: 'receiptQty', fieldI18nKey: 'PURCHASE.receivedQty', fallbackLabel: 'Received Quantity', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum' }, order: 9 }),
    createField(t, { fieldKey: 'qcFailedQty', fieldI18nKey: 'PURCHASE.qcFailedQty', fallbackLabel: 'QC Failed Quantity', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum' }, order: 10 }),
    createField(t, { fieldKey: 'rejectedQty', fieldI18nKey: 'PURCHASE.rejectedQty1', fallbackLabel: 'Rejected Quantity', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum' }, order: 11 }),
    createField(t, { fieldKey: 'unitPrice', fieldI18nKey: 'PURCHASE.unitPrice', fallbackLabel: 'Unit Price', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 12 }),
    createField(t, { fieldKey: 'lineTotal', fieldI18nKey: 'PURCHASE.lineTotal', fallbackLabel: 'Line Total', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 13 }),
    createField(t, { fieldKey: 'legalEntityLineTotal', fieldI18nKey: 'PURCHASE.referenceAmount', fallbackLabel: 'Reference Amount', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 14 }),
    createField(t, { fieldKey: 'leadTime', fieldI18nKey: 'PURCHASE.leadTimeDays', fallbackLabel: 'Lead Time (Days)', componentType: 'NUMBER', valueType: 'INTEGER', formatter: { type: 'DECIMAL', precision: 0 }, order: 15 }),
    createField(t, { fieldKey: 'warranty', fieldI18nKey: 'PURCHASE.warrantyDays', fallbackLabel: 'Warranty (Days)', componentType: 'NUMBER', valueType: 'INTEGER', formatter: { type: 'DECIMAL', precision: 0 }, order: 16 }),
    createField(t, { fieldKey: 'remarks', fieldI18nKey: 'ui.remarks', fallbackLabel: 'Remarks', componentType: 'TEXTAREA', order: 17 }),
    createField(t, { fieldKey: 'purchaseRequisiteListShowStr', fieldI18nKey: 'PURCHASE.DocNo', fallbackLabel: 'Source Document No.', componentType: 'REFERENCE', order: 18 }),
    createField(t, { fieldKey: 'emergencyGoodsReceiptNoListShowStr', fieldI18nKey: 'PURCHASE.DocNo', fallbackLabel: 'Source Document No.', componentType: 'REFERENCE', order: 19 }),
    createField(t, { fieldKey: 'costProjectId', fieldI18nKey: 'PURCHASE.projectCode', fallbackLabel: 'Project Code', componentType: 'REFERENCE', displayFields: ['costProjectCode'], order: 20 })
  ]
}

// purchaseQty 是 assignList 的汇总；子集合只负责识别重新分配，变更内容合并到所属产品行。
function buildProductAssignmentCollection(t) {
  return createCollection(t, {
    fieldKey: 'assignList',
    fieldI18nKey: 'PURCHASE.versionComparisonV2.purchaseQtyAllocationDetails',
    fallbackLabel: 'Purchase Quantity Allocation Details',
    itemKeyPrefix: 'productAssignment',
    identityRules: [
      { fields: ['purchaseRequisiteDetailId'], requiredEmptyFields: [] },
      { fields: ['purchaseRequisiteId', 'costProjectId'], requiredEmptyFields: [] },
      { fields: ['purchaseRequisiteNo', 'costProjectCode'], requiredEmptyFields: [] },
      { fields: ['assignId'], requiredEmptyFields: [] }
    ],
    itemLabelFields: ['purchaseRequisiteNo', 'costProjectCode', 'documentNo'],
    summaryFields: ['purchaseRequisiteNo', 'costProjectCode', 'documentNo', 'purchaseQty'],
    orderSensitive: false,
    mergeChangesToParent: true,
    fields: [
      createField(t, { fieldKey: 'purchaseRequisiteNo', fieldI18nKey: 'PURCHASE.PRNo', fallbackLabel: 'Purchase Requisition No.', componentType: 'REFERENCE', order: 1 }),
      createField(t, { fieldKey: 'costProjectId', fieldI18nKey: 'PURCHASE.projectCode', fallbackLabel: 'Project Code', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['costProjectCode'], order: 2 }),
      createField(t, { fieldKey: 'documentId', fieldI18nKey: 'PURCHASE.PQorPCNo', fallbackLabel: 'PQ/PC No.', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['documentNo'], order: 3 }),
      createField(t, { fieldKey: 'purchaseQty', fieldI18nKey: 'PURCHASE.qty', fallbackLabel: 'Quantity', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum' }, order: 4 })
    ],
    order: 1
  })
}

// 服务附加费是产品子行，新增、修改、删除统一合并到所属产品行展示。
function buildServiceCollection(t) {
  return createCollection(t, {
    fieldKey: 'serviceSurchargeList',
    fieldI18nKey: 'PURCHASE.surchargeDetails',
    fallbackLabel: 'Service Surcharge',
    itemKeyPrefix: 'serviceSurcharge',
    identityRules: [
      { fields: ['serviceSurchargeId'], requiredEmptyFields: [] },
      { fields: ['expenseItemName', 'unit'], requiredEmptyFields: [] }
    ],
    itemLabelFields: ['expenseItemName'],
    summaryFields: ['expenseItemName', 'qty', 'unitPrice', 'lineTotal'],
    mergeChangesToParent: true,
    fields: [
      createField(t, { fieldKey: 'expenseItemName', fieldI18nKey: 'PURCHASE.expenseItem', fallbackLabel: 'Expense Item', order: 1 }),
      createField(t, { fieldKey: 'unit', fieldI18nKey: 'PURCHASE.purchaseUOM', fallbackLabel: 'Unit', order: 2 }),
      createField(t, { fieldKey: 'qty', fieldI18nKey: 'PURCHASE.qty', fallbackLabel: 'Quantity', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum' }, order: 3 }),
      createField(t, { fieldKey: 'unitPrice', fieldI18nKey: 'PURCHASE.unitPrice', fallbackLabel: 'Unit Price', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 4 }),
      createField(t, { fieldKey: 'lineTotal', fieldI18nKey: 'PURCHASE.lineTotal', fallbackLabel: 'Line Total', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 5 }),
      createField(t, { fieldKey: 'legalEntityLineTotal', fieldI18nKey: 'PURCHASE.referenceAmount', fallbackLabel: 'Reference Amount', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 6 }),
      createField(t, { fieldKey: 'remarks', fieldI18nKey: 'ui.remarks', fallbackLabel: 'Remarks', componentType: 'TEXTAREA', order: 7 })
    ],
    order: 2
  })
}

// 产品区域的业务集合：产品明细及费用明细。
function buildProductCollections(t) {
  const productCollection = createCollection(t, {
    fieldKey: 'purchaseOrderDetailList',
    fieldI18nKey: 'PURCHASE.productDetail',
    fallbackLabel: 'Product Details',
    itemKeyPrefix: 'product',
    identityRules: [
      { fields: ['productId'], requiredEmptyFields: [] },
      { fields: ['productId', 'documentId', 'costProjectId'], requiredEmptyFields: [] }
    ],
    itemLabelFields: ['internalPartNo', 'productName'],
    summaryFields: [
      'internalPartNo',
      'productName',
      'purchaseQty',
      'unitPrice',
      'emergencyGoodsReceiptNoListShowStr'
    ],
    orderSensitive: false,
    fields: buildProductFields(t),
    collections: [buildProductAssignmentCollection(t), buildServiceCollection(t)],
    order: 1
  })

  const expenseCollection = createCollection(t, {
    fieldKey: 'detailsOfExpensesList',
    fieldI18nKey: 'PURCHASE.detailsOfExpenses',
    fallbackLabel: 'Expense Details',
    itemKeyPrefix: 'expense',
    identityRules: [
      { fields: ['detailsOfExpensesId'], requiredEmptyFields: [] },
      { fields: ['expenseItem', 'currencyCode'], requiredEmptyFields: [] }
    ],
    itemLabelFields: ['expenseItem'],
    summaryFields: ['expenseItem', 'currencyCode', 'amount', 'referenceAmount'],
    fields: [
      createField(t, { fieldKey: 'expenseItem', fieldI18nKey: 'PURCHASE.expenseItem', fallbackLabel: 'Expense Item', order: 1 }),
      createField(t, { fieldKey: 'currencyCode', fieldI18nKey: 'ui.currency', fallbackLabel: 'Currency', componentType: 'SELECT', order: 2 }),
      createField(t, { fieldKey: 'amount', fieldI18nKey: 'PURCHASE.amount', fallbackLabel: 'Amount', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 3 }),
      createField(t, { fieldKey: 'referenceAmount', fieldI18nKey: 'PURCHASE.referenceAmount1', fallbackLabel: 'Reference Amount', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 4 }),
      createField(t, { fieldKey: 'remarks', fieldI18nKey: 'ui.remarks', fallbackLabel: 'Remarks', componentType: 'TEXTAREA', order: 5 })
    ],
    order: 2
  })

  return [productCollection, expenseCollection]
}

// 附件独立成 Section，文件大小由 FILE_SIZE formatter 转换为 B/KB/MB/GB/TB。
function buildAttachmentCollection(t) {
  return createCollection(t, {
    fieldKey: 'commonFileList',
    fieldI18nKey: 'PURCHASE.attachmentInfo',
    fallbackLabel: 'Attachments',
    componentType: 'ATTACHMENT',
    itemKeyPrefix: 'attachment',
    identityRules: [
      { fields: ['fileMd5'], requiredEmptyFields: [] },
      { fields: ['fileId'], requiredEmptyFields: [] },
      { fields: ['fileName', 'fileSize'], requiredEmptyFields: [] }
    ],
    itemLabelFields: ['fileName'],
    summaryFields: ['fileName', 'fileExtension', 'fileSize', 'remarks'],
    fields: [
      createField(t, { fieldKey: 'fileName', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileName', fallbackLabel: 'File Name', order: 1 }),
      createField(t, { fieldKey: 'fileExtension', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileType', fallbackLabel: 'File Type', order: 2 }),
      createField(t, { fieldKey: 'fileSize', fieldI18nKey: 'PURCHASE.versionComparisonV2.fileSize', fallbackLabel: 'File Size', componentType: 'NUMBER', valueType: 'INTEGER', formatter: { type: 'FILE_SIZE' }, order: 3 }),
      createField(t, { fieldKey: 'remarks', fieldI18nKey: 'ui.remarks', fallbackLabel: 'Remarks', componentType: 'TEXTAREA', order: 4 })
    ],
    order: 1
  })
}

function buildProductSummaryFields(t) {
  return [
    createField(t, { fieldKey: 'totalRemarks', fieldI18nKey: 'ui.remarks', fallbackLabel: 'Remarks', componentType: 'TEXTAREA', order: 1 }),
    createField(t, { fieldKey: 'subTotal', fieldI18nKey: 'PURCHASE.subTotal', fallbackLabel: 'Sub Total', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 2 }),
    createField(t, { fieldKey: 'totalFreight', fieldI18nKey: 'PURCHASE.totalFreight', fallbackLabel: 'Total Freight', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 3 }),
    createField(t, { fieldKey: 'exchangeRateDesc', fieldI18nKey: 'menu.exchangeRate', fallbackLabel: 'Exchange Rate', order: 4 }),
    createField(t, { fieldKey: 'taxRate', fieldI18nKey: 'PURCHASE.taxRate', fallbackLabel: 'Tax Rate', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'PERCENT', precision: 1 }, order: 5 }),
    createField(t, { fieldKey: 'totalTaxAmount', fieldI18nKey: 'PURCHASE.taxAmount', fallbackLabel: 'Tax Amount', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 6 }),
    createField(t, { fieldKey: 'totalAmount', fieldI18nKey: 'PURCHASE.totalAmount', fallbackLabel: 'Total Amount', componentType: 'MONEY', valueType: 'DECIMAL', formatter: MONEY_FORMATTER, order: 7 })
  ]
}

function buildConditionCollection(t) {
  return createCollection(t, {
    fieldKey: 'conditionsTableList',
    fieldI18nKey: 'ui.conditions',
    fallbackLabel: 'Conditions',
    itemKeyPrefix: 'condition',
    identityRules: [
      { fields: ['conditionsId'], requiredEmptyFields: [] },
      { fields: ['category', 'conditions'], requiredEmptyFields: [] }
    ],
    itemLabelFields: ['category'],
    summaryFields: ['category', 'conditions'],
    fields: [
      createField(t, { fieldKey: 'category', fieldI18nKey: 'ui.category', fallbackLabel: 'Category', order: 1 }),
      createField(t, { fieldKey: 'conditions', fieldI18nKey: 'ui.conditions', fallbackLabel: 'Conditions', componentType: 'TEXTAREA', formatter: CONDITION_VARIABLE_FORMATTER, order: 2 })
    ],
    order: 1
  })
}

function buildContactFields(t) {
  return [
    createField(t, { fieldKey: 'bpContactPersonId', fieldI18nKey: 'PURCHASE.deliveryBy', fallbackLabel: 'Contact', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['bpContactPersonName'], order: 1 }),
    createField(t, { fieldKey: 'bpEmail', fieldI18nKey: 'PURCHASE.deliveryEmail', fallbackLabel: 'Email', order: 2 }),
    createField(t, { fieldKey: 'bpMobilePhone', fieldI18nKey: 'PURCHASE.deliveryMobilePhone', fallbackLabel: 'Mobile', order: 3 }),
    createField(t, { fieldKey: 'bpAddress', fieldI18nKey: 'PURCHASE.deliveryAddress1', fallbackLabel: 'Address', componentType: 'REFERENCE', order: 4 })
  ]
}

function hasFunction(value) {
  if (typeof value === 'function') return true
  if (Array.isArray(value)) return value.some((item) => hasFunction(item))
  if (!value || typeof value !== 'object') return false
  return Object.keys(value).some((key) => hasFunction(value[key]))
}

// 在发送请求前校验 Schema 的结构完整性、路径安全性及 JSON 可序列化性。
export function validatePurchaseOrderVersionSchemaV2(schema) {
  const errors = []
  const registeredSectionKeys = new Set()
  const validPathPattern = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/

  if (!schema || typeof schema !== 'object') return ['Schema must be an object.']
  if (schema.schemaKey !== PURCHASE_ORDER_SCHEMA_V2_KEY) errors.push('Schema key is invalid.')
  if (schema.schemaVersion !== PURCHASE_ORDER_SCHEMA_V2_VERSION) errors.push('Schema version is invalid.')
  if ('schemaHash' in schema) errors.push('schemaHash is not supported by Schema v2.')
  if (!Array.isArray(schema.sections) || schema.sections.length === 0) errors.push('Schema sections are required.')
  if (hasFunction(schema)) errors.push('Schema must not contain functions.')

  const validatePath = (value, message) => {
    if (!value || !validPathPattern.test(value)) errors.push(message)
  }

  const visitFields = (fields, scope) => {
    const keys = new Set()
    if (!Array.isArray(fields)) {
      errors.push(`Fields must be an array in ${scope}.`)
      return
    }
    fields.forEach((field) => {
      const fieldScope = `${scope}.${field.fieldKey || ''}`
      if (!field.fieldKey || !field.propertyPath) errors.push(`Field key and propertyPath are required in ${scope}.`)
      if (keys.has(field.fieldKey)) errors.push(`Duplicate field key in ${scope}: ${field.fieldKey}.`)
      keys.add(field.fieldKey)
      validatePath(field.propertyPath, `Unsafe field path at ${fieldScope}.`)
      if (!field.fieldLabel || !field.fieldI18nKey) errors.push(`Field labels are required at ${fieldScope}.`)
      if (!field.componentLabel || !field.componentI18nKey) errors.push(`Component labels are required at ${fieldScope}.`)
      if (!PURCHASE_ORDER_SCHEMA_V2_COMPONENT_TYPES.includes(field.componentType)) errors.push(`Unsupported component type at ${fieldScope}.`)
      if (!VALUE_TYPES.includes(field.valueType)) errors.push(`Unsupported value type at ${fieldScope}.`)
      if (typeof field.compareEnabled !== 'boolean') errors.push(`compareEnabled must be boolean at ${fieldScope}.`)
      if (field.formatter && !FORMATTER_TYPES.includes(field.formatter.type)) errors.push(`Unsupported formatter at ${fieldScope}.`)
        ; (field.displayFields || []).forEach((displayField) => validatePath(displayField, `Unsafe display field at ${fieldScope}.`))
    })
  }

  const visitCollections = (collections, scope, depth) => {
    const keys = new Set()
    if (!Array.isArray(collections)) {
      errors.push(`Collections must be an array in ${scope}.`)
      return
    }
    if (depth > 3) {
      errors.push(`Collection nesting is too deep at ${scope}.`)
      return
    }
    collections.forEach((collection) => {
      const collectionScope = `${scope}.${collection.fieldKey || ''}`
      if (!collection.fieldKey || !collection.propertyPath) errors.push(`Collection key and propertyPath are required in ${scope}.`)
      if (keys.has(collection.fieldKey)) errors.push(`Duplicate collection key in ${scope}: ${collection.fieldKey}.`)
      keys.add(collection.fieldKey)
      validatePath(collection.propertyPath, `Unsafe collection path at ${collectionScope}.`)
      if (!collection.fieldLabel || !collection.fieldI18nKey) errors.push(`Collection labels are required at ${collectionScope}.`)
      if (!collection.componentLabel || !collection.componentI18nKey) errors.push(`Collection component labels are required at ${collectionScope}.`)
      if (!PURCHASE_ORDER_SCHEMA_V2_COMPONENT_TYPES.includes(collection.componentType)) errors.push(`Unsupported collection component type at ${collectionScope}.`)
      if (!collection.itemKeyPrefix) errors.push(`Collection itemKeyPrefix is required at ${collectionScope}.`)
      if (
        collection.mergeChangesToParent !== undefined &&
        typeof collection.mergeChangesToParent !== 'boolean'
      ) {
        errors.push(`mergeChangesToParent must be boolean at ${collectionScope}.`)
      }
      if (!Array.isArray(collection.identityRules) || collection.identityRules.length === 0) {
        errors.push(`Collection identityRules are required at ${collectionScope}.`)
      }
      ; (collection.identityRules || []).forEach((rule) => {
        if (!Array.isArray(rule.fields) || rule.fields.length === 0) errors.push(`Identity fields are required at ${collectionScope}.`)
          ;[...(rule.fields || []), ...(rule.requiredEmptyFields || [])].forEach((identityField) => {
            validatePath(identityField, `Unsafe identity field at ${collectionScope}.`)
            if (TEMPORARY_IDENTITY_FIELDS.includes(identityField)) errors.push(`Temporary identity field is forbidden at ${collectionScope}: ${identityField}.`)
          })
      })
        ;[...(collection.itemLabelFields || []), ...(collection.summaryFields || [])].forEach((summaryField) => {
          validatePath(summaryField, `Unsafe summary field at ${collectionScope}.`)
        })
      visitFields(collection.fields, collectionScope)
      visitCollections(collection.collections, collectionScope, depth + 1)
    })
  }

    ; (schema.sections || []).forEach((section) => {
      if (!section.sectionKey) errors.push('Section key is required.')
      if (registeredSectionKeys.has(section.sectionKey)) errors.push(`Duplicate section key: ${section.sectionKey}.`)
      registeredSectionKeys.add(section.sectionKey)
      if (!section.sectionLabel || !section.sectionI18nKey) errors.push(`Section labels are required at ${section.sectionKey}.`)
      if (
        !Array.isArray(section.contentOrder) ||
        section.contentOrder.length !== SECTION_CONTENT_TYPES.length ||
        new Set(section.contentOrder).size !== SECTION_CONTENT_TYPES.length ||
        section.contentOrder.some((type) => !SECTION_CONTENT_TYPES.includes(type))
      ) {
        errors.push(`Section contentOrder is invalid at ${section.sectionKey}.`)
      }
      visitFields(section.fields, section.sectionKey)
      visitCollections(section.collections, section.sectionKey, 1)
    })

  try {
    JSON.stringify(schema)
  } catch (error) {
    errors.push('Schema must be JSON serializable.')
  }
  return errors
}

// 根据当前语言和页面字典生成后端所需的完整 schema。
export function createPurchaseOrderVersionSchemaV2(options = {}) {
  const t = options.t
  const statusOptions = normalizeStatusOptions(options.purchaseOrderStatusOptions)
  const booleanLabels = [
    { value: '1', label: translate(t, 'PURCHASE.versionComparisonV2.yes', 'Yes') },
    { value: '0', label: translate(t, 'PURCHASE.versionComparisonV2.no', 'No') },
    { value: true, label: translate(t, 'PURCHASE.versionComparisonV2.yes', 'Yes') },
    { value: false, label: translate(t, 'PURCHASE.versionComparisonV2.no', 'No') }
  ]
  const section = (
    sectionKey,
    sectionI18nKey,
    fallbackLabel,
    order,
    fields,
    collections,
    contentOrder = SECTION_CONTENT_TYPES
  ) => ({
    sectionKey,
    sectionLabel: translate(t, sectionI18nKey, fallbackLabel),
    sectionI18nKey,
    order,
    contentOrder,
    fields,
    collections
  })

  const comparisonDefinition = {
    schemaKey: PURCHASE_ORDER_SCHEMA_V2_KEY,
    schemaVersion: PURCHASE_ORDER_SCHEMA_V2_VERSION,
    sections: [
      section('basic', 'ui.basicInfo', 'Basic Information', 1, buildBasicFields(t, statusOptions, booleanLabels), []),
      section('recipient', 'PURCHASE.RecipientInfo', 'Recipient Information', 2, buildRecipientFields(t), []),
      section(
        'product',
        'PURCHASE.productInfo',
        'Product Information',
        3,
        buildProductSummaryFields(t),
        buildProductCollections(t),
        ['COLLECTIONS', 'FIELDS']
      ),
      section(
        'attachment',
        'PURCHASE.attachmentInfo',
        'Attachments',
        4,
        [],
        [buildAttachmentCollection(t)],
        ['COLLECTIONS', 'FIELDS']
      ),
      section('conditions', 'ui.conditions', 'Conditions', 5, [], [buildConditionCollection(t)]),
      section('contact', 'PURCHASE.contactInfo', 'Contact Information', 6, buildContactFields(t), [])
    ]
  }

  const errors = validatePurchaseOrderVersionSchemaV2(comparisonDefinition)
  if (errors.length > 0) throw new Error(errors.join(' '))
  return comparisonDefinition
}
