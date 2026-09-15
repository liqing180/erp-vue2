// 字段路径对应 SalesQuotation 完整详情；集合使用持久化业务标识匹配历史快照。
import { expenseItemCollection, projectCostCollection, mixDesignCollection } from '../businessCollections'
export default {
  schemaKey: 'sales-quotation-version-comparison-v2',
  businessNoI18nKey: 'SALES.salesQuotationNo',
  businessNoLabel: '销售报价编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'salesQuotationType', dictType: 'sales_quotation_type', fieldLabel: '销售报价类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.salesQuotationType', displayFields: ['salesQuotationTypeShowStr'] },
        { fieldKey: 'salesInquiryNo', fieldI18nKey: 'SALES.salesInquiryNo', fieldLabel: '销售需求编号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.customerName', displayFields: ['businessPartnerName'] },
        { fieldKey: 'businessPartnerNo', fieldLabel: '生意伙伴编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.customerCode' },
        { fieldKey: 'countryId', fieldLabel: '国家', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.country', displayFields: ['country'] },
        { fieldKey: 'customerQuestionnaireId', fieldLabel: '客户问卷', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.customerQuestionnaire', displayFields: ['customerQuestionnaireNo'] },
        { fieldKey: 'paymentTermId', fieldLabel: '支付条款', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.paymentTerm', displayFields: ['paymentTermName'] },
        { fieldKey: 'currencyId', fieldLabel: '货币', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.currency', displayFields: ['currency'] },
        { fieldKey: 'salesPersonId', fieldLabel: '销售员', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.salesPerson', displayFields: ['salesPersonBy'] },
        { fieldKey: 'validityForDay', fieldI18nKey: 'SALES.validityDays', fieldLabel: '有效期', componentType: 'NUMBER', valueType: 'INTEGER' },
        { fieldKey: 'deliveryDateForDay', fieldLabel: '交付日期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.leadTimeDays2' },
        { fieldKey: 'ourRef', fieldLabel: '我方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.ourRef' },
        { fieldKey: 'yourRef', fieldLabel: '你方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.yourRef' },
        { fieldKey: 'basicRemarks', fieldLabel: '备注', fieldI18nKey: 'ui.remarks', componentType: 'TEXTAREA', valueType: 'STRING' },
        { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
        { fieldKey: 'automatedEmail', fieldLabel: '是否自动发送邮件', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.automatedEmail', displayFields: ['automatedEmailShowStr'] },
        { fieldKey: 'dropShipping', fieldLabel: '是否直运', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.dropShipping', displayFields: ['dropShippingShowStr'] },
        { fieldKey: 'subTotal', fieldLabel: '总计', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.subTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalFreight', fieldLabel: '总运费', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.totalFreight', displayFields: ['totalFreightShowStr'], formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalTaxAmount', fieldLabel: '总税额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.taxAmount', displayFields: ['totalTaxAmountShowStr'], formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalDiscount', fieldLabel: '总优惠', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.totalDiscount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalAmount', fieldLabel: '总价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.totalAmount', displayFields: ['totalAmountShowStr'], formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'departmentName', fieldLabel: '部门名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.department' },
        { fieldKey: 'poType', fieldI18nKey: 'SALES.poType', dictType: 'sales_po_type', fieldLabel: '采购类型', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'taxRate', fieldLabel: '税率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.taxRate', displayFields: ['taxRateShowStr'] },
        { fieldKey: 'salesProfit', fieldLabel: '销售利润', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesProfit', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true, normalizeNegativeZero: true } },
        {
          fieldKey: 'consignmentStartTime',
          fieldI18nKey: 'SALES.consignmentStart',
          fieldLabel: '寄卖开始时间',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          }
        },
        {
          fieldKey: 'consignmentEndTime',
          fieldI18nKey: 'SALES.consignmentEnd',
          fieldLabel: '寄卖结束时间',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          }
        },
        { fieldKey: 'projectId', fieldLabel: '项目', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.projectName', displayFields: ['projectName'] },
        { fieldKey: 'projectCode', fieldLabel: '项目编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.projectCode' },
        { fieldKey: 'zoneId', fieldLabel: '区域', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.zone', displayFields: ['zoneName'] },
        { fieldKey: 'projectContactPersonNames', fieldLabel: '项目-联系人名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.projectContactPersonName' },
        { fieldKey: 'specialRequirement', dictType: 'sales_special_requirement', fieldLabel: '特殊要求', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.specialRequirement', displayFields: ['specialRequirementShowStr'] },
        { fieldKey: 'cubeSpacingNum', fieldI18nKey: 'SALES.cubeSpacingNum', fieldLabel: '立方体间隔次数', componentType: 'NUMBER', valueType: 'INTEGER' },
        { fieldKey: 'cubeDoNum', fieldI18nKey: 'SALES.cubeDoNum', fieldLabel: '做立方体数量', componentType: 'NUMBER', valueType: 'INTEGER' },
        { fieldKey: 'isNonDigital', fieldLabel: '是否电子运单', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.isNonDigital' },
        { fieldKey: 'isCod', fieldLabel: '是否货到付款', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.COD' },
        { fieldKey: 'sealRequired', fieldLabel: '需要封条', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.sealRequired' },
        { fieldKey: 'priceTypeId', fieldLabel: '价格类型Id,', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.priceType', displayFields: ['priceTypeName'] },
        { fieldKey: 'costProjectCode', fieldLabel: '成本项目编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.projectCode' },
        { fieldKey: 'priceTbd', fieldLabel: '是否价格另议.0否1是', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.priceTbd' },
        { fieldKey: 'limitingValuesOfConcreteComposition', fieldI18nKey: 'SALES.limitingValuesofConcreteComposition', fieldLabel: '混凝土成分限值', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'typeStrengthClassOfCement', fieldI18nKey: 'SALES.typeStrengthClassofCement', fieldLabel: '水泥类型及强度等级', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'typeOfAdmixtureAddition', fieldI18nKey: 'SALES.typeofAdmixtureAddition', fieldLabel: '外加剂和添加剂类型', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'blanketOrder', fieldLabel: '是否一揽子协议.0否1是', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.blanketOrder' },
        {
          fieldKey: 'expirationDate',
          fieldLabel: '截止日期',
          fieldI18nKey: 'SALES.expirationDate',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          }
        },
        { fieldKey: 'exchangeRateDesc', fieldLabel: '汇率描述', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'menu.exchangeRate' }
      ]
    },
    {
      sectionKey: 'customerPODetail',
      sectionLabel: '客户采购订单信息',
      sectionI18nKey: 'SALES.customerPODetail',
      fields: [
        { fieldKey: 'poNo', fieldI18nKey: 'SALES.poNo', fieldLabel: '采购客户单号', componentType: 'TEXT', valueType: 'STRING' },
        {
          fieldKey: 'poDate',
          fieldI18nKey: 'SALES.poDate',
          fieldLabel: '采购单签收日期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          }
        },
        { fieldKey: 'poContactPersonId', fieldI18nKey: 'SALES.purchaseContactPerson', fieldLabel: 'bp联系人', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['poContactPersonName'] },
        { fieldKey: 'poMobilePhone', fieldLabel: 'bp手机号码', fieldI18nKey: 'ui.mobilePhone', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'poEmail', fieldI18nKey: 'ui.email', fieldLabel: 'bp邮箱', componentType: 'TEXT', valueType: 'STRING' }
      ]
    },
    {
      sectionKey: 'shippingInfo',
      sectionLabel: '收货信息',
      sectionI18nKey: 'SALES.shippingInfo',
      fields: [
        { fieldKey: 'consignee', fieldLabel: '收货人', fieldI18nKey: 'SALES.consignee', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'warehouseName', fieldLabel: '仓库名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'INVENTORY.warehouseName' },
        { fieldKey: 'incotermId', fieldLabel: '国际贸易类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.incoterm', displayFields: ['incotermName'] },
        { fieldKey: 'receivePortId', fieldLabel: '港口', fieldI18nKey: 'SALES.port', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['receivePortName'] },
        { fieldKey: 'district', fieldLabel: '区域名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.zone' },
        { fieldKey: 'receiveAddress', fieldLabel: '收货地址', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.deliveryAddress' },
        { fieldKey: 'bpContactPersonId', fieldLabel: 'bp联系人', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.contactPerson', displayFields: ['bpContactPersonName'] },
        { fieldKey: 'bpMobilePhone', fieldLabel: 'bp手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.mobilePhone' },
        { fieldKey: 'bpEmail', fieldLabel: 'bp邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.email' }
      ]
    },
    {
      sectionKey: 'salesQuotationProductList',
      sectionLabel: '销售报价产品明细',
      sectionI18nKey: 'SALES.productDetail',
      collections: [
        {
          fieldKey: 'salesQuotationProductList',
          fieldLabel: '销售报价产品明细',
          fieldI18nKey: 'SALES.productDetail',
          itemKeyPrefix: 'salesQuotationProductList',
          identityRules: [
            {
              fields: [
                'salesQuotationProductId'
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
            'brand',
            'description',
            'salesPartNo',
            'qty',
            'unitPrice',
            'lineTotal'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.brand' },
            { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
            { fieldKey: 'salesPartNo', fieldLabel: '销售编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.salesPartNo' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
            { fieldKey: 'qty', fieldLabel: '数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesQTY1', displayFields: ['qtyShowStr'], formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', trimZeroWhenPath: 'isAdhocEntry', usePageNumberFormat: true } },
            { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'discount', fieldLabel: '优惠金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'discountPer', fieldLabel: '优惠金额百分比', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discountPer', formatter: { type: 'DECIMAL', precision: 3, usePageNumberFormat: true } },
            { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesCost', fieldLabel: '销售成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesCost', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesProfit', fieldLabel: '销售利润', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesProfit', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true, normalizeNegativeZero: true } },
            { fieldKey: 'warranty', fieldLabel: '保修期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.warrantyDays' },
            { fieldKey: 'deliveryDateForDay', fieldLabel: '交付日期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.leadTimeDays2' },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'productType', dictType: 'product_type', fieldLabel: '产品类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.productClass' },
            { fieldKey: 'unitCost', fieldLabel: '成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitCost1', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'targetMargin', fieldLabel: '目标毛利率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.targetMargin1' },
            { fieldKey: 'netQty', fieldLabel: '净数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.netQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'scrapRate', fieldLabel: '损耗率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.scrapRate' },
            { fieldKey: 'pricingQty', fieldLabel: '计价数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.pricingQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'lineTotalPricingCost', fieldLabel: '小计金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } }
          ],
          collections: [
            {
              fieldKey: 'childProductList',
              fieldLabel: '子集',
              fieldI18nKey: 'SALES.productDetail',
              itemKeyPrefix: 'childProductList',
              identityRules: [
                {
                  fields: [
                    'salesQuotationProductId'
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
            'brand',
            'description',
            'salesPartNo',
            'qty',
            'unitPrice',
            'lineTotal'
          ],
              componentType: 'TABLE_ROW',
              fields: [
                { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
                { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
                { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.brand' },
                { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
                { fieldKey: 'salesPartNo', fieldLabel: '销售编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.salesPartNo' },
                { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
                { fieldKey: 'qty', fieldLabel: '数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesQTY1', displayFields: ['qtyShowStr'], formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', trimZeroWhenPath: 'isAdhocEntry', usePageNumberFormat: true } },
                { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'discount', fieldLabel: '优惠金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'discountPer', fieldLabel: '优惠金额百分比', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discountPer', formatter: { type: 'DECIMAL', precision: 3, usePageNumberFormat: true } },
                { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'salesCost', fieldLabel: '销售成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesCost', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'salesProfit', fieldLabel: '销售利润', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesProfit', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true, normalizeNegativeZero: true } },
                { fieldKey: 'warranty', fieldLabel: '保修期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.warrantyDays' },
                { fieldKey: 'deliveryDateForDay', fieldLabel: '交付日期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.leadTimeDays2' },
                { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
                { fieldKey: 'productType', dictType: 'product_type', fieldLabel: '产品类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.productClass' },
                { fieldKey: 'unitCost', fieldLabel: '成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitCost1', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'targetMargin', fieldLabel: '目标毛利率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.targetMargin1' },
                { fieldKey: 'netQty', fieldLabel: '净数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.netQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
                { fieldKey: 'scrapRate', fieldLabel: '损耗率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.scrapRate' },
                { fieldKey: 'pricingQty', fieldLabel: '计价数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.pricingQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
                { fieldKey: 'lineTotalPricingCost', fieldLabel: '小计金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } }
              ]
            },
            {
              fieldKey: 'childProjectTemplateContentList',
              fieldLabel: '子集项目模板内容集合',
              fieldI18nKey: 'SALES.productDetail',
              itemKeyPrefix: 'childProjectTemplateContentList',
              identityRules: [
                {
                  fields: [
                    'salesQuotationProductId'
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
            'brand',
            'description',
            'salesPartNo',
            'qty',
            'unitPrice',
            'lineTotal'
          ],
              componentType: 'TABLE_ROW',
              fields: [
                { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
                { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
                { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.brand' },
                { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
                { fieldKey: 'salesPartNo', fieldLabel: '销售编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.salesPartNo' },
                { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
                { fieldKey: 'qty', fieldLabel: '数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesQTY1', displayFields: ['qtyShowStr'], formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', trimZeroWhenPath: 'isAdhocEntry', usePageNumberFormat: true } },
                { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'discount', fieldLabel: '优惠金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'discountPer', fieldLabel: '优惠金额百分比', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discountPer', formatter: { type: 'DECIMAL', precision: 3, usePageNumberFormat: true } },
                { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'salesCost', fieldLabel: '销售成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesCost', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'salesProfit', fieldLabel: '销售利润', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesProfit', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true, normalizeNegativeZero: true } },
                { fieldKey: 'warranty', fieldLabel: '保修期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.warrantyDays' },
                { fieldKey: 'deliveryDateForDay', fieldLabel: '交付日期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.leadTimeDays2' },
                { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
                { fieldKey: 'productType', dictType: 'product_type', fieldLabel: '产品类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.productClass' },
                { fieldKey: 'unitCost', fieldLabel: '成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitCost1', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'targetMargin', fieldLabel: '目标毛利率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.targetMargin1' },
                { fieldKey: 'netQty', fieldLabel: '净数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.netQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
                { fieldKey: 'scrapRate', fieldLabel: '损耗率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.scrapRate' },
                { fieldKey: 'pricingQty', fieldLabel: '计价数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.pricingQty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
                { fieldKey: 'lineTotalPricingCost', fieldLabel: '小计金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } }
              ]
            }
          ]
        }
      ]
    },
    {
      sectionKey: 'salesQuotationServiceList',
      sectionLabel: '销售报价服务明细',
      sectionI18nKey: 'SALES.productDetail',
      collections: [
        {
          fieldKey: 'salesQuotationServiceList',
          fieldLabel: '销售报价服务明细',
          fieldI18nKey: 'SALES.productDetail',
          itemKeyPrefix: 'salesQuotationServiceList',
          identityRules: [
            {
              fields: [
                'salesQuotationServiceId'
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
            'description',
            'brand',
            'serviceType',
            'qty',
            'unitPrice',
            'lineTotal'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
            { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.brand' },
            { fieldKey: 'serviceType', dictType: 'service_type', fieldLabel: '服务类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.type', displayFields: ['serviceTypeShowStr'] },
            { fieldKey: 'salesPartNo', fieldLabel: '销售编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.salesPartNo' },
            { fieldKey: 'priceType', fieldLabel: '价格类型.字典', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.priceType' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
            { fieldKey: 'qty', fieldLabel: '数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesQTY1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'discount', fieldLabel: '优惠金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'discountPer', fieldLabel: '优惠金额百分比', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discountPer', formatter: { type: 'DECIMAL', precision: 3, usePageNumberFormat: true } },
            { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesCost', fieldLabel: '销售成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesCost', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesProfit', fieldLabel: '销售利润', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesProfit', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true, normalizeNegativeZero: true } },
            { fieldKey: 'warranty', fieldLabel: '保修期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.warrantyDays' },
            { fieldKey: 'deliveryDateForDay', fieldLabel: '交付日期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.leadTimeDays2' },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'productType', dictType: 'product_type', fieldLabel: '产品类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.productClass' }
          ]
        }
      ]
    },
    {
      sectionKey: 'salesQuotationProjectList',
      sectionLabel: '销售报价项目明细',
      sectionI18nKey: 'SALES.projectInfo',
      collections: [
        {
          fieldKey: 'salesQuotationProjectList',
          fieldLabel: '销售报价项目明细',
          fieldI18nKey: 'SALES.projectInfo',
          itemKeyPrefix: 'salesQuotationProjectList',
          identityRules: [
            {
              fields: [
                'salesQuotationProjectId'
              ],
              requiredEmptyFields: []
            }
          ],
          itemLabelFields: [
            'projectName'
          ],
          summaryFields: [
            'projectDescription',
            'projectQuotationContent',
            'projectTermsConditions',
            'subTotal',
            'totalAmount',
            'projectId'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'projectDescription', fieldLabel: '项目描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'PRODUCT.projectDescription' },
            { fieldKey: 'projectQuotationContent', fieldLabel: '项目报价', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'menu.projectCost' },
            { fieldKey: 'projectTermsConditions', fieldLabel: '项目条款和条件', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'PRODUCT.projectTermsConditions' },
            { fieldKey: 'subTotal', fieldLabel: '共计', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.subTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'totalAmount', fieldLabel: '总金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.totalAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'projectId', fieldLabel: '项目', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.projectName', displayFields: ['projectName'] },
            { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' }
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
      sectionKey: 'commonFileListForPO',
      sectionLabel: '附件列表',
      sectionI18nKey: 'ui.attachment',
      collections: [
        {
          fieldKey: 'commonFileListForPO',
          fieldLabel: '附件列表',
          fieldI18nKey: 'ui.attachment',
          itemKeyPrefix: 'commonFileListForPO',
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
    },
    {
      sectionKey: 'conditions',
      sectionLabel: '条款',
      sectionI18nKey: 'ui.conditions',
      collections: [
        {
          fieldKey: 'conditionsTableList',
          fieldLabel: '条款',
          fieldI18nKey: 'ui.conditions',
          itemKeyPrefix: 'condition',
          componentType: 'TABLE_ROW',
          identityRules: [
            {
              fields: [
                'conditionsId'
              ],
              requiredEmptyFields: []
            },
            {
              fields: [
                'category'
              ],
              requiredEmptyFields: []
            }
          ],
          itemLabelFields: [
            'category'
          ],
          summaryFields: [
            'category',
            'conditions'
          ],
          fields: [
            { fieldKey: 'category', fieldLabel: '分类', fieldI18nKey: 'ui.category', componentType: 'TEXT', valueType: 'STRING' },
            { fieldKey: 'conditions', fieldLabel: '条款', fieldI18nKey: 'ui.conditions', componentType: 'TEXTAREA', valueType: 'STRING' }
          ]
        }
      ]
    },
    { sectionKey: 'expenses', sectionLabel: '费用明细', sectionI18nKey: 'SALES.expenseItem', collections: [expenseItemCollection, projectCostCollection] },
    { sectionKey: 'mixDesign', sectionLabel: '配合比明细', sectionI18nKey: 'SALES.mixDesign', collections: [mixDesignCollection] }
  ]
}
