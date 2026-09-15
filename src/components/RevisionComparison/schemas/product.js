// 字段路径对应 IvtProduct 完整详情；集合使用持久化业务标识匹配历史快照。
export default {
  schemaKey: 'product-version-comparison-v2',
  businessNoI18nKey: 'PRODUCT.internalPartNo',
  businessNoLabel: '内部产品编号',
  sections: [
    {
      sectionKey: 'basic',
      sectionLabel: '基本信息',
      sectionI18nKey: 'ui.basicInfo',
      fields: [
        { fieldKey: 'includeDecimal', fieldLabel: '是否包含小数,0否1是', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'PRODUCT.includeDecimal' },
        { fieldKey: 'productType', dictType: 'product_type', fieldLabel: '产品类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.productClass' },
        { fieldKey: 'productName', fieldLabel: '产品名称', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.productName' },
        { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.alias' },
        { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo', displayFields: ['internalPartNoShowStr'] },
        // 分类支持多选；单个 productCategoryId 仅保存第一项，无法覆盖其他分类的增删。
        { fieldKey: 'categoryIdList', fieldLabel: '产品分类', fieldI18nKey: 'PRODUCT.productCategory1', componentType: 'REFERENCE', valueType: 'ARRAY', displayFields: ['categoryNameShowStr'] },
        { fieldKey: 'description', fieldLabel: '描述', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.description' },
        { fieldKey: 'purpose', dictType: 'ivt_product_purpose', fieldLabel: '用途,产品类型', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.purpose', displayFields: ['purposeShowStr'] },
        { fieldKey: 'isActive', fieldLabel: '是否活跃', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'ui.isActive' },
        { fieldKey: 'brand', fieldLabel: '品牌', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.brand' },
        { fieldKey: 'uom', fieldLabel: '基本单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.inventoryUOM1' },
        { fieldKey: 'serviceType', fieldI18nKey: 'ui.type', dictType: 'service_type', fieldLabel: '服务类型', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'legalEntityNames', fieldLabel: '扩展组织', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.extendedOrganization' },
        { fieldKey: 'localization', dictType: 'sys_localization', fieldLabel: '本地化', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'ui.localization', displayFields: ['localizationShowStr'] },
        { fieldKey: 'isSequenceCode', fieldLabel: '是否序列码', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'PRODUCT.sequenceCode' },
        { fieldKey: 'packingNotice', fieldLabel: '是否需要打包', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'PRODUCT.packingNotice' },
        { fieldKey: 'setCombination', fieldLabel: '是否套装组合', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'PRODUCT.setCombination' },
        { fieldKey: 'isSystemDocking', fieldLabel: '是否系统对接', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'ui.systemDocking' },
        { fieldKey: 'assembledProduct', fieldLabel: '是否组装产品', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'PRODUCT.assembledProduct' },
        { fieldKey: 'labelManagement', fieldLabel: '标签管理', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'PRODUCT.labelManagement', formatter: { type: 'VALUE_MAP', values: [{ value: '0', label: '是', labelI18nKey: 'uiBtn.yes' }, { value: '1', label: '否', labelI18nKey: 'uiBtn.no' }] } },
        { fieldKey: 'printMethod', dictType: 'ivt_print_method', fieldLabel: '打印方式', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.printMethod' },
        { fieldKey: 'inventoryControlMode', dictType: 'inventory_control_mode', fieldLabel: '库存管理模式', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.inventoryControlMode' },
        { fieldKey: 'isPhantom', fieldLabel: '是否虚拟', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'PRODUCT.isPhantom' },
        { fieldKey: 'nonInventoryItem', fieldLabel: '非库存产品', componentType: 'SWITCH', valueType: 'STRING', fieldI18nKey: 'PRODUCT.nonInventoryItem' }
      ]
    },
    {
      sectionKey: 'ivtSpecifications',
      sectionLabel: '规格信息',
      sectionI18nKey: 'PRODUCT.specifications',
      fields: [
        { fieldKey: 'ivtSpecifications.color', fieldLabel: '颜色', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.color' },
        { fieldKey: 'ivtSpecifications.volume', fieldI18nKey: 'PRODUCT.volume', fieldLabel: '体积', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'ivtSpecifications.volumeUom', fieldI18nKey: 'PRODUCT.volumeUom', fieldLabel: '体积单位', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'ivtSpecifications.netWeight', fieldI18nKey: 'PRODUCT.netWeight', fieldLabel: '净重', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'ivtSpecifications.netWeightUom', fieldI18nKey: 'PRODUCT.netWeightUom', fieldLabel: '净重单位', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'ivtSpecifications.grossWeight', fieldI18nKey: 'PRODUCT.grossWeight', fieldLabel: '毛重', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'ivtSpecifications.grossWeightUom', fieldI18nKey: 'PRODUCT.grossWeightUom', fieldLabel: '毛重单位', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'ivtSpecifications.length', fieldI18nKey: 'PRODUCT.l', fieldLabel: '长度', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'ivtSpecifications.lengthUom', fieldI18nKey: 'PRODUCT.lengthUom', fieldLabel: '长度单位', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'ivtSpecifications.width', fieldI18nKey: 'PRODUCT.w', fieldLabel: '宽度', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'ivtSpecifications.widthUom', fieldI18nKey: 'PRODUCT.widthUom', fieldLabel: '宽度单位', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'ivtSpecifications.height', fieldI18nKey: 'PRODUCT.h', fieldLabel: '高度', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'ivtSpecifications.heightUom', fieldI18nKey: 'PRODUCT.heightUom', fieldLabel: '高度单位', componentType: 'TEXT', valueType: 'STRING' },
        { fieldKey: 'ivtSpecifications.remarks', fieldLabel: '备注', componentType: 'TEXTAREA', valueType: 'STRING', fieldI18nKey: 'ui.remarks' },
        { fieldKey: 'ivtSpecifications.type', fieldI18nKey: 'ui.type', dictType: 'mdm_material_type', fieldLabel: '类型.字典', componentType: 'TEXT', valueType: 'STRING', displayFields: ['ivtSpecifications.typeShowStr'] },
        { fieldKey: 'ivtSpecifications.toleranceType', dictType: 'mdm_material_tolerance_type', fieldLabel: '公差类型.字典', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.toleranceType' },
        { fieldKey: 'ivtSpecifications.specificGravity', fieldLabel: '比重', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PRODUCT.specificGravity' },
        { fieldKey: 'ivtSpecifications.overTolerance', fieldLabel: '公差上', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PRODUCT.overTolerance' },
        { fieldKey: 'ivtSpecifications.underTolerance', fieldLabel: '公差下', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PRODUCT.underTolerance' },
        { fieldKey: 'ivtSpecifications.minInMix', fieldLabel: '配合比设计最少值', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PRODUCT.minInMixDesign' },
        { fieldKey: 'ivtSpecifications.maxInMix', fieldLabel: '配合比设计最高值', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PRODUCT.maxInMixDesign' },
        { fieldKey: 'ivtSpecifications.minMoisture', fieldLabel: '最低湿度', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PRODUCT.minMoisture' },
        { fieldKey: 'ivtSpecifications.maxMoisture', fieldLabel: '最高湿度', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PRODUCT.maxMoisture' },
        { fieldKey: 'ivtSpecifications.minTemperatureC', fieldI18nKey: 'PRODUCT.minTemperatureC', fieldLabel: 'minTemperatureC', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'ivtSpecifications.maxTemperatureC', fieldI18nKey: 'PRODUCT.maxTemperatureC', fieldLabel: 'maxTemperatureC', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'ivtSpecifications.minFinenessModulus', fieldLabel: '最小细度比', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PRODUCT.minFinenessModulus' },
        { fieldKey: 'ivtSpecifications.maxFinenessModulus', fieldI18nKey: 'PRODUCT.maxFinenessModulus', fieldLabel: '最大细度比', componentType: 'NUMBER', valueType: 'DECIMAL' },
        { fieldKey: 'ivtSpecifications.extendRemarks', fieldI18nKey: 'ui.remarks', fieldLabel: '扩展页签的备注', componentType: 'TEXTAREA', valueType: 'STRING' }
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
      sectionKey: 'commonFileListForImage',
      sectionLabel: '图片列表',
      sectionI18nKey: 'PRODUCT.productImage',
      collections: [
        {
          fieldKey: 'commonFileListForImage',
          fieldLabel: '图片列表',
          fieldI18nKey: 'PRODUCT.productImage',
          itemKeyPrefix: 'commonFileListForImage',
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
      sectionKey: 'setCombinationList',
      sectionLabel: '套装组合集合',
      sectionI18nKey: 'PRODUCT.setCombination',
      collections: [
        {
          fieldKey: 'setCombinationList',
          fieldLabel: '套装组合集合',
          fieldI18nKey: 'PRODUCT.setCombination',
          itemKeyPrefix: 'setCombinationList',
          identityRules: [
            {
              fields: [
                'productSetCombinationId'
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
          summaryFields: ['productName', 'internalPartNo', 'alias', 'uom', 'qty'],
          componentType: 'TABLE_ROW',
          fields: [
            { fieldKey: 'productId', fieldLabel: '产品名称', componentType: 'REFERENCE', valueType: 'INTEGER', fieldI18nKey: 'PRODUCT.productName', displayFields: ['productName'] },
            { fieldKey: 'internalPartNo', fieldLabel: '内部产品编号', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.internalPartNo' },
            { fieldKey: 'alias', fieldLabel: '别名', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.alias' },
            { fieldKey: 'uom', fieldLabel: '产品单位', componentType: 'TEXT', valueType: 'STRING', fieldI18nKey: 'PRODUCT.inventoryUOM1' },
            { fieldKey: 'qty', fieldLabel: '产品数量', componentType: 'NUMBER', valueType: 'DECIMAL', fieldI18nKey: 'PRODUCT.qty', formatter: { type: 'DECIMAL', precisionPath: 'decimalNum', usePageNumberFormat: true } }
          ]
        }
      ]
    }
  ]
}
