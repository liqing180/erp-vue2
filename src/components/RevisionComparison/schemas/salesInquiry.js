// 字段路径对应 SalesInquiry 完整详情；集合使用持久化业务标识匹配历史快照。
import { expenseItemCollection, projectCostCollection } from '../businessCollections'
export default {
  schemaKey: 'sales-inquiry-version-comparison-v2',
  businessNoI18nKey: 'SALES.salesInquiryNo',
  businessNoLabel: '销售需求编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'salesInquiryNo', fieldLabel: '销售需求编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.salesInquiryNo' },
        { fieldKey: 'salesInquiryType', fieldI18nKey: 'SALES.salesInquiryType', dictType: 'sales_inquiry_type', fieldLabel: '销售需求类型', componentType: 'TEXT', valueType: 'STRING', displayFields: ['salesInquiryTypeShowStr'] },
        { fieldKey: 'businessPartnerId', fieldLabel: '生意伙伴', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.customerName', displayFields: ['businessPartnerName'] },
        { fieldKey: 'businessPartnerNo', fieldLabel: '生意伙伴编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.customerCode' },
        { fieldKey: 'countryId', fieldLabel: '国家', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.country', displayFields: ['country'] },
        { fieldKey: 'customerQuestionnaireId', fieldLabel: '客户问卷', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.customerQuestionnaire', displayFields: ['customerQuestionnaireNo'] },
        { fieldKey: 'paymentTermId', fieldLabel: '支付条款', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.paymentTerm', displayFields: ['paymentTermName'] },
        { fieldKey: 'currencyId', fieldLabel: '货币', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.currency', displayFields: ['currency'] },
        { fieldKey: 'salesPersonId', fieldLabel: '销售员', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.salesPerson', displayFields: ['salesPersonBy'] },
        { fieldKey: 'validityForDay', fieldI18nKey: 'SALES.validityDays', fieldLabel: '有效期', componentType: 'NUMBER', valueType: 'INTEGER' },
        {
          fieldKey: 'deliveryDate',
          fieldI18nKey: 'SALES.leadTimeDays2',
          fieldLabel: '期望交期',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          }
        },
        { fieldKey: 'deliveryDateForDay', fieldLabel: '交付日期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.leadTimeDays2' },
        { fieldKey: 'ourRef', fieldLabel: '我方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.ourRef' },
        { fieldKey: 'yourRef', fieldLabel: '你方参照', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.yourRef' },
        { fieldKey: 'basicRemarks', fieldI18nKey: 'ui.remarks', fieldLabel: '基本信息备注', componentType: 'TEXTAREA', valueType: 'STRING' },
        { fieldKey: 'dropShipping', fieldLabel: '是否直运', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.dropShipping', displayFields: ['dropShippingShowStr'] },
        { fieldKey: 'subTotal', fieldLabel: '总计', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.subTotal1', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalFreight', fieldLabel: '总运费', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.totalFreight', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalTaxAmount', fieldLabel: '总税额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.taxAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalDiscount', fieldLabel: '总优惠', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.totalDiscount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'totalAmount', fieldLabel: '总价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.totalAmount', displayFields: ['totalAmountShowStr'], formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'departmentName', fieldLabel: '部门名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.department' },
        { fieldKey: 'taxRate', fieldLabel: '税率', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.taxRate' },
        { fieldKey: 'expenseAmount', fieldLabel: '费用总金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.expenseAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'salesProfit', fieldLabel: '销售利润', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesProfit', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
        { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
        {
          fieldKey: 'consignmentStartTime',
          fieldLabel: '寄卖开始时间',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'SALES.consignmentStart'
        },
        {
          fieldKey: 'consignmentEndTime',
          fieldLabel: '寄卖结束时间',
          componentType: 'DATE',
          valueType: 'DATE',
          formatter: {
            type: 'DATE'
          },
          fieldI18nKey: 'SALES.consignmentEnd'
        },
        { fieldKey: 'priceTypeId', fieldLabel: '价格类型Id,', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.priceType', displayFields: ['priceTypeName'] },
        { fieldKey: 'costProjectCode', fieldLabel: '成本项目编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.projectCode' },
        { fieldKey: 'priceTbd', fieldLabel: '是否价格另议.0否1是', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'SALES.priceTbd' }
      ]
    },
    {
      sectionKey: 'shippingInfo',
      sectionLabel: '收货信息',
      sectionI18nKey: 'SALES.shippingInfo',
      fields: [
        { fieldKey: 'consignee', fieldI18nKey: 'SALES.consignee', fieldLabel: '收货人', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'warehouseId', fieldLabel: '仓库', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'INVENTORY.warehouseName', displayFields: ['warehouseName'] },
        { fieldKey: 'incotermId', fieldLabel: '国际贸易类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.incoterm', displayFields: ['incotermName'] },
        { fieldKey: 'receivePortId', fieldI18nKey: 'SALES.port', fieldLabel: '收货港口', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['receivePortName'] },
        { fieldKey: 'district', fieldLabel: '区域名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.zone' },
        { fieldKey: 'receiveAddress', fieldLabel: '收货地址', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.deliveryAddress', displayFields: ['receiveAddress', 'receiveAddressName'] },
        { fieldKey: 'bpContactPersonId', fieldLabel: 'bp联系人', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'SALES.contactPerson', displayFields: ['bpContactPersonName'] },
        { fieldKey: 'bpMobilePhone', fieldLabel: 'bp手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.mobilePhone' },
        { fieldKey: 'bpEmail', fieldLabel: 'bp邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.email' }
      ]
    },
    {
      sectionKey: 'salesInquiryProductList',
      sectionLabel: '销售需求产品明细',
      sectionI18nKey: 'SALES.productDetail',
      collections: [
        {
          fieldKey: 'salesInquiryProductList',
          fieldLabel: '销售需求产品明细',
          fieldI18nKey: 'SALES.productDetail',
          itemKeyPrefix: 'salesInquiryProductList',
          identityRules: [
            {
              fields: [
                'salesInquiryProductId'
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
            'dateQuoted',
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
            {
              fieldKey: 'dateQuoted',
              fieldLabel: '报价日期',
              componentType: 'DATE',
              valueType: 'DATE',
              formatter: {
                type: 'DATE'
              },
              fieldI18nKey: 'SALES.dateQuoted'
            },
            { fieldKey: 'purchaseQuotationNo', fieldLabel: '报价单编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.purchaseQuotationNo' },
            { fieldKey: 'pplUnitPrice', fieldLabel: 'PPL价格', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.purchasePrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesPartNo', fieldLabel: '销售编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.salesPartNo' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
            { fieldKey: 'qty', fieldLabel: '数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesQTY1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'discount', fieldLabel: '优惠金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'discountPer', fieldLabel: '优惠金额百分比', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discountPer', formatter: { type: 'DECIMAL', precision: 3, usePageNumberFormat: true } },
            { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesCost', fieldLabel: '销售成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesCost', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesProfit', fieldLabel: '销售利润', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesProfit', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'warranty', fieldLabel: '保修期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.warrantyDays' },
            {
              fieldKey: 'deliveryDate',
              fieldI18nKey: 'SALES.leadTimeDays2',
              fieldLabel: '预计交期',
              componentType: 'DATE',
              valueType: 'DATE',
              formatter: {
                type: 'DATE'
              }
            },
            { fieldKey: 'deliveryDateForDay', fieldLabel: '交付日期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.leadTimeDays2' },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'expenseAmount', fieldLabel: '库存费用金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.expenseAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
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
                    'salesInquiryProductId'
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
            'dateQuoted',
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
                {
                  fieldKey: 'dateQuoted',
                  fieldLabel: '报价日期',
                  componentType: 'DATE',
                  valueType: 'DATE',
                  formatter: {
                    type: 'DATE'
                  },
                  fieldI18nKey: 'SALES.dateQuoted'
                },
                { fieldKey: 'purchaseQuotationNo', fieldLabel: '报价单编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.purchaseQuotationNo' },
                { fieldKey: 'pplUnitPrice', fieldLabel: 'PPL价格', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.purchasePrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'salesPartNo', fieldLabel: '销售编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.salesPartNo' },
                { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
                { fieldKey: 'qty', fieldLabel: '数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesQTY1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
                { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'discount', fieldLabel: '优惠金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'discountPer', fieldLabel: '优惠金额百分比', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discountPer', formatter: { type: 'DECIMAL', precision: 3, usePageNumberFormat: true } },
                { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'salesCost', fieldLabel: '销售成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesCost', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'salesProfit', fieldLabel: '销售利润', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesProfit', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
                { fieldKey: 'warranty', fieldLabel: '保修期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.warrantyDays' },
                {
                  fieldKey: 'deliveryDate',
                  fieldI18nKey: 'SALES.leadTimeDays2',
                  fieldLabel: '预计交期',
                  componentType: 'DATE',
                  valueType: 'DATE',
                  formatter: {
                    type: 'DATE'
                  }
                },
                { fieldKey: 'deliveryDateForDay', fieldLabel: '交付日期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.leadTimeDays2' },
                { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
                { fieldKey: 'expenseAmount', fieldLabel: '库存费用金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.expenseAmount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
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
      sectionKey: 'salesInquiryServiceList',
      sectionLabel: '销售需求服务明细',
      sectionI18nKey: 'SALES.productDetail',
      collections: [
        {
          fieldKey: 'salesInquiryServiceList',
          fieldLabel: '销售需求服务明细',
          fieldI18nKey: 'SALES.productDetail',
          itemKeyPrefix: 'salesInquiryServiceList',
          identityRules: [
            {
              fields: [
                'salesInquiryServiceId'
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
            { fieldKey: 'purchaseQuotationNo', fieldLabel: '报价单编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.purchaseQuotationNo' },
            { fieldKey: 'pplUnitPrice', fieldLabel: 'PPL价格', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.purchasePrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesPartNo', fieldLabel: '销售编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.salesPartNo' },
            { fieldKey: 'uom', fieldLabel: '单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.uom1' },
            { fieldKey: 'qty', fieldLabel: '数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesQTY1', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } },
            { fieldKey: 'unitPrice', fieldLabel: '单价', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.unitPrice', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'discount', fieldLabel: '优惠金额', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discount', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'discountPer', fieldLabel: '优惠金额百分比', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.discountPer', formatter: { type: 'DECIMAL', precision: 3, usePageNumberFormat: true } },
            { fieldKey: 'lineTotal', fieldLabel: '小计金额', componentType: 'MONEY', valueType: 'DECIMAL', fieldI18nKey: 'SALES.lineTotal', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesCost', fieldLabel: '销售成本', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesCost', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'salesProfit', fieldLabel: '销售利润', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'SALES.salesProfit', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
            { fieldKey: 'warranty', fieldLabel: '保修期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.warrantyDays' },
            {
              fieldKey: 'deliveryDate',
              fieldI18nKey: 'SALES.leadTimeDays2',
              fieldLabel: '预计交期',
              componentType: 'DATE',
              valueType: 'DATE',
              formatter: {
                type: 'DATE'
              }
            },
            { fieldKey: 'deliveryDateForDay', fieldLabel: '交付日期', componentType: 'NUMBER', valueType: 'INTEGER', fieldI18nKey: 'SALES.leadTimeDays2' },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            {
              fieldKey: 'dateQuoted',
              fieldLabel: '报价日期',
              componentType: 'DATE',
              valueType: 'DATE',
              formatter: {
                type: 'DATE'
              },
              fieldI18nKey: 'SALES.dateQuoted'
            }
          ]
        }
      ]
    },
    {
      sectionKey: 'salesInquiryProjectList',
      sectionLabel: '销售需求项目明细',
      sectionI18nKey: 'SALES.projectInfo',
      collections: [
        {
          fieldKey: 'salesInquiryProjectList',
          fieldLabel: '销售需求项目明细',
          fieldI18nKey: 'SALES.projectInfo',
          itemKeyPrefix: 'salesInquiryProjectList',
          identityRules: [
            {
              fields: [
                'salesInquiryProjectId'
              ],
              requiredEmptyFields: []
            }
          ],
          itemLabelFields: [
            'projectName'
          ],
          summaryFields: [
            'projectName',
            'description'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'projectName', fieldLabel: '项目名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'SALES.projectName' },
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
    { sectionKey: 'expenses', sectionLabel: '费用明细', sectionI18nKey: 'SALES.expenseItem', collections: [expenseItemCollection, projectCostCollection] }
  ]
}
