// 字段路径对应 ProformaInvoice 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'proforma-invoice-version-comparison-v2',
  businessNoI18nKey: 'SALES.piNo',
  businessNoLabel: '形式发票编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'proformaInvoiceNo', fieldLabel: '形式发票编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.piNo' },
        { fieldKey: 'documentId', fieldLabel: '关联单', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.sourceDocNo', displayFields: ['documentNo'] },
        { fieldKey: 'businessPartnerName', fieldLabel: '生意伙伴名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.customerName' },
        { fieldKey: 'ourRef', fieldI18nKey: 'SALES.ourRef', fieldLabel: '我方参照', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'yourRef', fieldI18nKey: 'SALES.yourRef', fieldLabel: '你方参照', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'incotermName', fieldLabel: '贸易形式', fieldI18nKey: 'SALES.incoterm', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'receivePortName', fieldLabel: '收货港口名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.port' },
        {
          fieldKey: 'proformaInvoiceDate',
          fieldLabel: '形式发票日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'SALES.piDate'
        },
        {
          fieldKey: 'issueDate',
          fieldLabel: '签发日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'SALES.issueDate'
        },
        { fieldKey: 'costProjectName', fieldI18nKey: 'SALES.project', fieldLabel: '成本项目名称', componentType: 'TEXT', valueType: 'STRING' }
      ]
    },
    {
      sectionKey: 'proformaInvoiceSelection',
      sectionLabel: '形式发票销售订单范围信息',
      sectionI18nKey: 'SALES.soLineSelectionReference',
      fields: [
        { fieldKey: 'proformaInvoiceSelection.selectedSoLine', fieldI18nKey: 'SALES.selectedSOLine', fieldLabel: '已选订单行数', componentType: 'NUMBER', valueType: 'INTEGER' },
        { fieldKey: 'proformaInvoiceSelection.selectedQty', fieldI18nKey: 'SALES.selectedQTY', fieldLabel: '已选数量', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 3, keepDec: false, usePageNumberFormat: true } },
        { fieldKey: 'proformaInvoiceSelection.soTotalAmount', fieldLabel: '销售订单总金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.soTotalAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'proformaInvoiceSelection.currency', fieldLabel: '货币名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.currency' },
        { fieldKey: 'proformaInvoiceSelection.salesOrderId', fieldLabel: '销售订单', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.salesOrderNo', displayFields: ['proformaInvoiceSelection.salesOrderNo'] },
        { fieldKey: 'proformaInvoiceSelection.businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.customerName', displayFields: ['proformaInvoiceSelection.businessPartnerName'] },
        { fieldKey: 'proformaInvoiceSelection.incotermId', fieldLabel: '贸易形式', fieldI18nKey: 'SALES.incoterm', componentType: 'TEXT', valueType: 'STRING', displayFields: ['proformaInvoiceSelection.incotermName'] },
        { fieldKey: 'proformaInvoiceSelection.amount', fieldI18nKey: 'SALES.amount', fieldLabel: '金额', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'proformaInvoiceSelection.paymentPercentage', fieldI18nKey: 'SALES.paymentPercentage', fieldLabel: '付款比例', componentType: 'NUMBER', valueType: 'INTEGER' },
        { fieldKey: 'proformaInvoiceSelection.paymentAmount', fieldI18nKey: 'SALES.paymentAmount', fieldLabel: '付款金额', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'proformaInvoiceSelection.totalAmountDue', fieldI18nKey: 'SALES.totalAmountDue', fieldLabel: '应付总额', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'proformaInvoiceSelection.remarks', fieldI18nKey: 'ui.remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING' }
      ],
      collections: [
        {
          fieldKey: 'proformaInvoiceSelection.proformaInvoiceSelectionDetailList',
          fieldLabel: '形式发票销售订单范围信息明细',
          fieldI18nKey: 'SALES.soLineSelectionReference',
          itemKeyPrefix: 'proformaInvoiceSelection.proformaInvoiceSelectionDetailList',
          identityRules: [
            {
              fields: [
                'proformaInvoiceSelectionDetailId'
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
            'internalPartNo'
          ],
          summaryFields: [
            'productId',
            'internalPartNo',
            'description',
            'uom',
            'soQty',
            'proformaInvoiceQty',
            'netUnitPrice',
            'lineTotal'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.productName', displayFields: ['productName'] },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.uom' },
            { fieldKey: 'soQty', fieldLabel: '销售订单数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.orderQTY', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'reservedQty', fieldLabel: '占用数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.reservedQTY', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'balanceQty', fieldLabel: '剩余数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.balanceQTY', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'proformaInvoiceQty', fieldLabel: '开票数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.qty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'netUnitPrice', fieldLabel: '净单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.netUnitPrice1', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'includedInScope', fieldLabel: '是否纳入范围.0否1是', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.includedInScope' }
          ]
        }
      ]
    },
    {
      sectionKey: 'proformaInvoicePayment',
      sectionLabel: '形式发票付款条款信息',
      sectionI18nKey: 'SALES.paymentTermStageInfo',
      fields: [
        { fieldKey: 'proformaInvoicePayment.paymentTermNo', fieldI18nKey: 'SALES.paymentTerm', fieldLabel: '付款条款编号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoicePayment.stageName', fieldI18nKey: 'SALES.paymentStage', fieldLabel: '阶段名称', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoicePayment.percentage', fieldLabel: '付款百分比', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.percentage1' },
        { fieldKey: 'proformaInvoicePayment.soTotalAmount', fieldLabel: '销售订单总金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.soTotalAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'proformaInvoicePayment.stageAmount', fieldI18nKey: 'SALES.stageAmount', fieldLabel: '阶段金额金额', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'proformaInvoicePayment.currentProformaInvoiceAmount', fieldI18nKey: 'SALES.currentPIAmount', fieldLabel: '当前PI金额', componentType: 'MONEY', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        {
          fieldKey: 'proformaInvoicePayment.dueDate',
          fieldLabel: '到期日',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'SALES.dueDate2'
        },
        { fieldKey: 'proformaInvoicePayment.dueDays', fieldI18nKey: 'SALES.dueDays', fieldLabel: '到期天数', componentType: 'NUMBER', valueType: 'INTEGER' },
        { fieldKey: 'proformaInvoicePayment.paymentTermDescription', fieldI18nKey: 'SALES.paymentTermDescription', fieldLabel: '付款条款说明', componentType: 'TEXTAREA', valueType: 'STRING' }
      ]
    },
    {
      sectionKey: 'proformaInvoiceCustomer',
      sectionLabel: '形式发票客户信息',
      sectionI18nKey: 'SALES.customerBillingBankInfo',
      fields: [
        { fieldKey: 'proformaInvoiceCustomer.businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.customerName', displayFields: ['proformaInvoiceCustomer.businessPartnerName'] },
        { fieldKey: 'proformaInvoiceCustomer.businessPartnerNo', fieldLabel: '生意伙伴编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.customerCode' },
        { fieldKey: 'proformaInvoiceCustomer.billingAddressId', fieldI18nKey: 'SALES.billingAddress', fieldLabel: '账单地址', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['proformaInvoiceCustomer.billingAddress'] },
        { fieldKey: 'proformaInvoiceCustomer.countryId', fieldLabel: '国家', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.country', displayFields: ['proformaInvoiceCustomer.country'] },
        { fieldKey: 'proformaInvoiceCustomer.companyRegNo', fieldI18nKey: 'SALES.businessRegNo', fieldLabel: '公司注册号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.taxpayerIdentificationNo', fieldI18nKey: 'SALES.taxRegistrationNo', fieldLabel: '纳税人识别号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.bpContactPersonId', fieldI18nKey: 'SALES.contactPerson', fieldLabel: 'bp联系人', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['proformaInvoiceCustomer.bpContactPersonName'] },
        { fieldKey: 'proformaInvoiceCustomer.bpMobilePhone', fieldLabel: 'bp手机号码', fieldI18nKey: 'ui.mobilePhone', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.bpEmail', fieldI18nKey: 'SALES.email', fieldLabel: 'bp邮箱', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.attentionTo', fieldI18nKey: 'SALES.attentionTo', fieldLabel: '收件部门', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.customerPoNo', fieldI18nKey: 'SALES.customerPoNo', fieldLabel: '客户采购单号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.accountId', fieldI18nKey: 'SALES.accountName', fieldLabel: '账户', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['proformaInvoiceCustomer.accountName'] },
        { fieldKey: 'proformaInvoiceCustomer.beneficiaryName', fieldI18nKey: 'SALES.beneficiaryName', fieldLabel: '收款账户名称', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.bankName', fieldI18nKey: 'SALES.bankName', fieldLabel: '银行名称', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.bankAccountNumber', fieldI18nKey: 'SALES.bankAccountNumber', fieldLabel: '银行账号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.bankCode', fieldI18nKey: 'SALES.bankCode', fieldLabel: '银行代码', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.branchCode', fieldI18nKey: 'SALES.branchCode', fieldLabel: '分行代码', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.bankCountry', fieldI18nKey: 'SALES.bankCountry', fieldLabel: '银行国家名称', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.accountCurrency', fieldI18nKey: 'SALES.bankCurrency', fieldLabel: '银行账户币种名称', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.swiftCode', fieldI18nKey: 'SALES.swiftCode', fieldLabel: 'SWIFT代码', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'proformaInvoiceCustomer.bankAddress', fieldI18nKey: 'SALES.bankAddress', fieldLabel: '银行地址', componentType: 'TEXT', valueType: 'STRING' }
      ]
    },
    {
      sectionKey: 'proformaInvoiceEmailSetting',
      sectionLabel: '形式发票当前版本邮件设置',
      sectionI18nKey: 'SALES.emailSettings',
      fields: [
        { fieldKey: 'proformaInvoiceEmailSetting.deliveryMethod', fieldI18nKey: 'SALES.deliveryMethod', fieldLabel: '投递方式，字典', componentType: 'TEXT', valueType: 'STRING', formatter: { type: 'VALUE_MAP', values: [{ value: 'DONT_SEND', labelI18nKey: 'SALES.donSend', label: '不发送' }, { value: 'AUTO_SEND', labelI18nKey: 'SALES.autoSend', label: '自动发送' }] } },
        { fieldKey: 'proformaInvoiceEmailSetting.recipientSource', fieldLabel: '收件人来源，字典', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.recipientSource' },
        { fieldKey: 'proformaInvoiceEmailSetting.templateId', fieldLabel: '邮件模板', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.emailTemplate', displayFields: ['proformaInvoiceEmailSetting.templateNo'] },
        { fieldKey: 'proformaInvoiceEmailSetting.attachPdfId', fieldLabel: '附加的PI版本主', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.attachPDF' }
      ],
      collections: [
        {
          fieldKey: 'proformaInvoiceEmailSetting.toRecipientList',
          fieldLabel: '收件人',
          fieldI18nKey: 'SALES.TO',
          itemKeyPrefix: 'toRecipient',
          identityRules: [{ fields: ['sourceType', 'sourceId'] }, { fields: ['email'] }],
          itemLabelFields: ['displayName', 'email'],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'displayName', fieldLabel: '联系人名称', fieldI18nKey: 'ui.contactPersonName', componentType: 'TEXT', valueType: 'STRING' },
            { fieldKey: 'email', fieldLabel: '邮箱', fieldI18nKey: 'ui.email', componentType: 'TEXT', valueType: 'STRING' }
          ]
        },
        {
          fieldKey: 'proformaInvoiceEmailSetting.ccRecipientList',
          fieldLabel: '抄送',
          fieldI18nKey: 'SALES.CC',
          itemKeyPrefix: 'ccRecipient',
          identityRules: [{ fields: ['sourceType', 'sourceId'] }, { fields: ['email'] }],
          itemLabelFields: ['displayName', 'email'],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'displayName', fieldLabel: '联系人名称', fieldI18nKey: 'ui.contactPersonName', componentType: 'TEXT', valueType: 'STRING' },
            { fieldKey: 'email', fieldLabel: '邮箱', fieldI18nKey: 'ui.email', componentType: 'TEXT', valueType: 'STRING' }
          ]
        }
      ]
    }
  ]
}
