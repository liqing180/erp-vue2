// 字段路径对应 BPBusinessPartner 完整详情；集合使用持久化业务标识匹配历史快照。
import { businessPartnerProjects } from '../businessPartnerProjects'

export default {
  schemaKey: 'business-partner-version-comparison-v2',
  businessNoI18nKey: 'ui.businessPartnerCode',
  businessNoLabel: '生意伙伴编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'businessPartnerName', fieldLabel: '生意伙伴名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.businessPartnerName' },
        { fieldKey: 'abbreviation', fieldLabel: '简称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.abbreviation' },
        { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'bp.alias' },
        { fieldKey: 'businessPartnerNo', fieldLabel: '生意伙伴编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.businessPartnerCode', displayFields: ['businessPartnerNoShowStr'] },
        { fieldKey: 'businessPartnerType', dictType: 'business_partner_type', fieldLabel: '客户类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.category', displayFields: ['businessPartnerTypeShowStr'] },
        { fieldKey: 'email', fieldLabel: '邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.email' },
        { fieldKey: 'mobilePhone', fieldLabel: '手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.mobilePhone' },
        { fieldKey: 'isActive', fieldLabel: '是否活跃', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'ui.isActive' },
        { fieldKey: 'website', fieldLabel: '网站', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.website' },
        { fieldKey: 'countryId', fieldLabel: '国家', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.country', displayFields: ['country'] },
        { fieldKey: 'remarks', fieldLabel: '备注信息', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'shippingAgent', fieldLabel: '是否是承运商 0否1是', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'bp.shippingAgent' },
        { fieldKey: 'regCurrencyId', fieldLabel: '货币', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.currency', displayFields: ['regCurrency'] }
      ]
    },
    {
      sectionKey: 'registrationInfo',
      sectionLabel: '注册信息',
      sectionI18nKey: 'ui.registrationInfo',
      fields: [
        { fieldKey: 'taxpayerIdentificationNo', fieldLabel: '纳税人识别号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.taxpayerIdentificationNo' },
        { fieldKey: 'faxPhone', fieldLabel: '传真', fieldI18nKey: 'ui.fax', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'companyRegNo', fieldLabel: '公司注册号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.companyRegNo' },
        { fieldKey: 'registeredCapital', fieldLabel: '注册资本', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.registeredCapital' },
        { fieldKey: 'corporateRepresentative', fieldLabel: '法人代表', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.corporateRepresentative' }
      ]
    },
    {
      sectionKey: 'bpBusinessAccountCustomer',
      sectionLabel: '客户信息',
      sectionI18nKey: 'bp.customerInfo',
      fields: [
        { fieldKey: 'bpBusinessAccountCustomer.currencyId', fieldLabel: '货币', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.currency', displayFields: ['bpBusinessAccountCustomer.currency'] },
        { fieldKey: 'syncCustomer', fieldLabel: '系统对接', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'ui.systemDocking' },
        { fieldKey: 'displayProdCodeOnApp', fieldLabel: 'APP显示产品编号', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'bp.displayProdCodeOnApp' },
        { fieldKey: 'bpBusinessAccountCustomer.invoiceType', dictType: 'bp_invoice_type', fieldLabel: '发票类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.invoiceType' },
        { fieldKey: 'bpBusinessAccountCustomer.paymentTermId', fieldLabel: '支付条款', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.paymentTermName', displayFields: ['bpBusinessAccountCustomer.paymentTermName'] },
        { fieldKey: 'bpBusinessAccountCustomer.remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'bpBusinessAccountCustomer.customerType', dictType: 'bp_customer_type', fieldLabel: '客户类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.customerType' },
        { fieldKey: 'bpBusinessAccountCustomer.customerGroup', dictType: 'bp_customer_group', fieldLabel: '客户组别', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.customerGroup' },
        { fieldKey: 'bpBusinessAccountCustomer.bankName', fieldLabel: '银行名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.bankName' },
        { fieldKey: 'bpBusinessAccountCustomer.accountName', fieldLabel: '开户名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.accountName' },
        { fieldKey: 'bpBusinessAccountCustomer.bankRemarks', fieldLabel: '银行备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'bpBusinessAccountCustomer.beneficiaryName', fieldI18nKey: 'organization.beneficiaryName', fieldLabel: '收款账户名称', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountCustomer.bankAccountNumber', fieldI18nKey: 'organization.bankAccountNumber', fieldLabel: '银行账号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountCustomer.accountCurrencyCode', fieldLabel: '账户币种', componentType: 'REFERENCE', valueType: 'STRING', fieldI18nKey: 'organization.accountCurrency', displayFields: ['bpBusinessAccountCustomer.accountCurrency'] },
        { fieldKey: 'bpBusinessAccountCustomer.swiftCode', fieldI18nKey: 'organization.SWIFTCode', fieldLabel: 'SWIFT代码', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountCustomer.bankCode', fieldI18nKey: 'organization.bankCode', fieldLabel: '银行编号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountCustomer.branchCode', fieldI18nKey: 'organization.branchCode', fieldLabel: '分行代码', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountCustomer.address1', fieldLabel: '地址1', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.addressLine1' },
        { fieldKey: 'bpBusinessAccountCustomer.address2', fieldLabel: '地址2', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.addressLine2' },
        { fieldKey: 'bpBusinessAccountCustomer.province', fieldLabel: '省/州', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.provinceState' },
        { fieldKey: 'bpBusinessAccountCustomer.city', fieldLabel: '城市/城镇', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.cityTown' },
        { fieldKey: 'bpBusinessAccountCustomer.location', fieldLabel: '位置/辖区', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.locationPrecinct' },
        { fieldKey: 'bpBusinessAccountCustomer.postalCode', fieldLabel: '邮编', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.postalCode' },
        { fieldKey: 'bpBusinessAccountCustomer.bankCountry', fieldI18nKey: 'organization.bankCountry', fieldLabel: '银行国家名称', componentType: 'TEXT', valueType: 'STRING' }
      ]
    },
    {
      sectionKey: 'bpBusinessAccountSupplier',
      sectionLabel: '供应商信息',
      sectionI18nKey: 'bp.supplierInfo',
      fields: [
        { fieldKey: 'bpBusinessAccountSupplier.currencyId', fieldLabel: '货币', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.currency', displayFields: ['bpBusinessAccountSupplier.currency'] },
        { fieldKey: 'syncSupplier', fieldLabel: '系统对接', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'ui.systemDocking' },
        { fieldKey: 'bpBusinessAccountSupplier.invoiceType', dictType: 'bp_invoice_type', fieldLabel: '发票类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.invoiceType' },
        { fieldKey: 'bpBusinessAccountSupplier.paymentTermId', fieldLabel: '支付条款', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.paymentTermName', displayFields: ['bpBusinessAccountSupplier.paymentTermName'] },
        { fieldKey: 'bpBusinessAccountSupplier.remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'bpBusinessAccountSupplier.supplierType', dictType: 'bp_supplier_type', fieldLabel: '供应商类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.supplierType' },
        { fieldKey: 'bpBusinessAccountSupplier.supplierGroup', dictType: 'bp_supplier_group', fieldLabel: '供应商组别', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.supplierGroup' },
        { fieldKey: 'bpBusinessAccountSupplier.bankName', fieldLabel: '银行名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.bankName' },
        { fieldKey: 'bpBusinessAccountSupplier.accountName', fieldLabel: '开户名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'organization.accountName' },
        { fieldKey: 'bpBusinessAccountSupplier.bankRemarks', fieldLabel: '银行备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'bpBusinessAccountSupplier.beneficiaryName', fieldI18nKey: 'organization.beneficiaryName', fieldLabel: '收款账户名称', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountSupplier.bankAccountNumber', fieldI18nKey: 'organization.bankAccountNumber', fieldLabel: '银行账号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountSupplier.accountCurrencyCode', fieldLabel: '账户币种', componentType: 'REFERENCE', valueType: 'STRING', fieldI18nKey: 'organization.accountCurrency', displayFields: ['bpBusinessAccountSupplier.accountCurrency'] },
        { fieldKey: 'bpBusinessAccountSupplier.swiftCode', fieldI18nKey: 'organization.SWIFTCode', fieldLabel: 'SWIFT代码', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountSupplier.bankCode', fieldI18nKey: 'organization.bankCode', fieldLabel: '银行编号', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountSupplier.branchCode', fieldI18nKey: 'organization.branchCode', fieldLabel: '分行代码', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'bpBusinessAccountSupplier.address1', fieldLabel: '地址1', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.addressLine1' },
        { fieldKey: 'bpBusinessAccountSupplier.address2', fieldLabel: '地址2', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.addressLine2' },
        { fieldKey: 'bpBusinessAccountSupplier.province', fieldLabel: '省/州', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.provinceState' },
        { fieldKey: 'bpBusinessAccountSupplier.city', fieldLabel: '城市/城镇', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.cityTown' },
        { fieldKey: 'bpBusinessAccountSupplier.location', fieldLabel: '位置/辖区', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.locationPrecinct' },
        { fieldKey: 'bpBusinessAccountSupplier.postalCode', fieldLabel: '邮编', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.postalCode' },
        { fieldKey: 'bpBusinessAccountSupplier.bankCountry', fieldI18nKey: 'organization.bankCountry', fieldLabel: '银行国家名称', componentType: 'TEXT', valueType: 'STRING' }
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
      sectionKey: 'commonFileListTrademark',
      sectionLabel: '附件列表-商标',
      sectionI18nKey: 'organization.trademark',
      collections: [
        {
          fieldKey: 'commonFileListTrademark',
          fieldLabel: '附件列表-商标',
          fieldI18nKey: 'organization.trademark',
          itemKeyPrefix: 'commonFileListTrademark',
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
      sectionKey: 'bpBusinessContactPersonList',
      sectionLabel: '联系人列表',
      sectionI18nKey: 'ui.contactPersonInfo',
      collections: [
        {
          fieldKey: 'bpBusinessContactPersonList',
          fieldLabel: '联系人列表',
          fieldI18nKey: 'ui.contactPersonInfo',
          itemKeyPrefix: 'bpBusinessContactPersonList',
          identityRules: [
            {
              fields: [
                'businessContactPersonId'
              ],
              requiredEmptyFields: []
            },
            {
              fields: [
                'contactPersonId'
              ],
              requiredEmptyFields: []
            }
          ],
          itemLabelFields: [
            'contactPersonName'
          ],
          summaryFields: [
            'title',
            'position',
            'contactPersonName',
            'mobilePhone',
            'email'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'title', dictType: 'business_contact_person_title', fieldLabel: '称呼', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.title' },
            { fieldKey: 'position', fieldLabel: '职务', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.position' },
            { fieldKey: 'contactPersonName', fieldLabel: '联系人名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.contactPersonName' },
            { fieldKey: 'contactPersonCode', fieldLabel: '联系人编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'bp.contactPersonCode' },
            { fieldKey: 'extensionNumber', fieldLabel: '分机号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.extensionNumber' },
            { fieldKey: 'mobilePhone', fieldLabel: '手机号码', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.mobilePhone' },
            { fieldKey: 'email', fieldLabel: '邮箱', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.email' },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'isActive', fieldLabel: '是否活跃', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'ui.isActive' },
            { fieldKey: 'other', fieldLabel: '其他', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'bp.other' },
            { fieldKey: 'isPurchaseDefault', fieldLabel: '是否采购默认', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'ui.defaultPurchasingContact' },
            { fieldKey: 'isSalesDefault', fieldLabel: '是否销售默认', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'ui.defaultSalesContact' }
          ]
        }
      ]
    },
    {
      sectionKey: 'bpBusinessAddressList',
      sectionLabel: '地址列表',
      sectionI18nKey: 'ui.addressInfo',
      collections: [
        {
          fieldKey: 'bpBusinessAddressList',
          fieldLabel: '地址列表',
          fieldI18nKey: 'ui.addressInfo',
          itemKeyPrefix: 'bpBusinessAddressList',
          identityRules: [
            {
              fields: [
                'businessAddressId'
              ],
              requiredEmptyFields: []
            }
          ],
          itemLabelFields: [
            'address'
          ],
          summaryFields: [
            'label',
            'address1',
            'address2',
            'location',
            'city',
            'province',
            'postalCode'
          ],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'label', fieldLabel: '标记', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.label' },
            { fieldKey: 'address1', fieldLabel: '具体地址名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.addressLine1' },
            { fieldKey: 'address2', fieldLabel: '街道', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.addressLine2' },
            { fieldKey: 'location', fieldLabel: '位置', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.locationPrecinct' },
            { fieldKey: 'city', fieldLabel: '城市，村镇', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.cityTown' },
            { fieldKey: 'province', fieldLabel: '省/州', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.provinceState' },
            { fieldKey: 'postalCode', fieldLabel: '邮编', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.postalCode' },
            { fieldKey: 'countryId', fieldLabel: '国家', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'ui.country', displayFields: ['country'] },
            { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
            { fieldKey: 'isActive', fieldLabel: '是否活跃', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'ui.isActive' },
            { fieldKey: 'geofenceType', fieldLabel: '地理围栏类型', componentType: 'TEXT', valueType: 'STRING', formatter: { type: 'VALUE_MAP', values: [{ value: '1', labelI18nKey: 'mapLang.polygon', label: '多边形' }, { value: '2', labelI18nKey: 'mapLang.circle', label: '圆形' }] }, fieldI18nKey: 'mapLang.geofence' },
            { fieldKey: 'cityTown', fieldLabel: '城市/城镇', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'mapLang.cityTown' },
            { fieldKey: 'provinceState', fieldLabel: '省份/洲', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'mapLang.provinceState' }
          ]
        }
      ]
    },
    businessPartnerProjects
  ]
}
