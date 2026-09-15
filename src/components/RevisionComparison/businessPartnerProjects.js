// 系统对接开启后可编辑的项目；使用提交后的业务集合，不比较选择器临时 ID 或审计信息。
export const businessPartnerProjects = {
  sectionKey: 'projectList',
  sectionLabel: '项目',
  sectionI18nKey: 'bp.project',
  collections: [{
    fieldKey: 'projectList',
    fieldLabel: '项目',
    fieldI18nKey: 'bp.project',
    itemKeyPrefix: 'project',
    identityRules: [{ fields: ['projectId'] }, { fields: ['projectCode'] }],
    itemLabelFields: ['projectCode', 'projectName'],
    componentType: 'TABLE_ROW',
    fields: [
      { fieldKey: 'projectCode', fieldLabel: '项目编号', fieldI18nKey: 'bp.projectCode', componentType: 'TEXT', valueType: 'STRING' },
      { fieldKey: 'projectName', fieldLabel: '项目名称', fieldI18nKey: 'bp.projectName', componentType: 'TEXT', valueType: 'STRING' },
      { fieldKey: 'projectAbbreviation', fieldLabel: '项目简称', fieldI18nKey: 'bp.projectAbbreviation', componentType: 'TEXT', valueType: 'STRING' },
      { fieldKey: 'zoneId', fieldLabel: '区域', fieldI18nKey: 'bp.projectZone', componentType: 'REFERENCE', valueType: 'INTEGER', displayFields: ['zoneName'] },
      { fieldKey: 'productMinVol', fieldLabel: '最小方量', fieldI18nKey: 'bp.productMinVol', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
      { fieldKey: 'projectMaxVol', fieldLabel: '最大方量', fieldI18nKey: 'bp.projectMaxVol', componentType: 'NUMBER', valueType: 'DECIMAL', formatter: { type: 'DECIMAL', precision: 2, usePageNumberFormat: true } },
      { fieldKey: 'truckCountLimit', fieldLabel: '车辆数量', fieldI18nKey: 'bp.noOfTrucks', componentType: 'SELECT', valueType: 'STRING', dictType: 'mdm_truck_count_limit' },
      { fieldKey: 'remarks', fieldLabel: '备注', fieldI18nKey: 'ui.remarks', componentType: 'TEXTAREA', valueType: 'STRING' },
      { fieldKey: 'isActive', fieldLabel: '是否活跃', fieldI18nKey: 'ui.isActive', componentType: 'SWITCH', valueType: 'STRING' },
      { fieldKey: 'credit', fieldLabel: '信用', fieldI18nKey: 'bp.credit', componentType: 'SWITCH', valueType: 'STRING' },
      { fieldKey: 'creditRemarks', fieldLabel: '备注', fieldI18nKey: 'ui.remarks', componentType: 'TEXTAREA', valueType: 'STRING' }
    ],
    collections: [
      {
        fieldKey: 'customerAddressList',
        fieldLabel: '项目地址',
        fieldI18nKey: 'bp.projectAddress',
        itemKeyPrefix: 'projectAddress',
        identityRules: [{ fields: ['businessAddressId'] }, { fields: ['addressCode'] }, { fields: ['address1', 'country'] }],
        itemLabelFields: ['address1'],
        componentType: 'TABLE_ROW',
        fields: [
          { fieldKey: 'address1', fieldLabel: '地址', fieldI18nKey: 'ui.addressLine1', componentType: 'TEXT', valueType: 'STRING' },
          { fieldKey: 'city', fieldLabel: '城市', fieldI18nKey: 'ui.cityTown', componentType: 'TEXT', valueType: 'STRING' },
          { fieldKey: 'cityTown', fieldLabel: '城市', fieldI18nKey: 'mapLang.cityTown', componentType: 'TEXT', valueType: 'STRING' },
          { fieldKey: 'province', fieldLabel: '省份', fieldI18nKey: 'ui.provinceState', componentType: 'TEXT', valueType: 'STRING' },
          { fieldKey: 'provinceState', fieldLabel: '省份', fieldI18nKey: 'mapLang.provinceState', componentType: 'TEXT', valueType: 'STRING' },
          { fieldKey: 'country', fieldLabel: '国家', fieldI18nKey: 'ui.country', componentType: 'TEXT', valueType: 'STRING' }
        ]
      },
      {
        fieldKey: 'projectContactPersonList',
        fieldLabel: '项目联系人',
        fieldI18nKey: 'bp.projectContactPersonName',
        itemKeyPrefix: 'projectContact',
        identityRules: [{ fields: ['contactPersonId'] }, { fields: ['contactPersonName'] }],
        itemLabelFields: ['contactPersonName'],
        componentType: 'TABLE_ROW',
        fields: [{ fieldKey: 'contactPersonName', fieldLabel: '联系人', fieldI18nKey: 'ui.contactPersonName', componentType: 'TEXT', valueType: 'STRING' }]
      },
      {
        fieldKey: 'mdmProjectRestrictedVehicleList',
        fieldLabel: '限制车辆',
        fieldI18nKey: 'bp.restrictedVehicle',
        itemKeyPrefix: 'projectVehicle',
        identityRules: [{ fields: ['truckId'] }, { fields: ['truckCode'] }],
        itemLabelFields: ['truckCode'],
        componentType: 'TABLE_ROW',
        fields: [{ fieldKey: 'truckCode', fieldLabel: '车辆编号', fieldI18nKey: 'mapLang.truckCode', componentType: 'TEXT', valueType: 'STRING' }]
      },
      {
        fieldKey: 'mixDesignList',
        fieldLabel: '配合比',
        fieldI18nKey: 'bp.mixDesign',
        itemKeyPrefix: 'projectMixDesign',
        identityRules: [{ fields: ['mixDesignId'] }, { fields: ['productCode'] }],
        itemLabelFields: ['productName'],
        componentType: 'TABLE_ROW',
        fields: [{ fieldKey: 'productName', fieldLabel: '产品名称', fieldI18nKey: 'PRODUCT.productName', componentType: 'TEXT', valueType: 'STRING' }]
      }
    ]
  }]
}
