export function translateLabel(t, key, fallback) {
  const label = key ? t(key) : ''
  return label && label !== key ? label : fallback
}

export function getRevisionDictTypes(schema) {
  const types = new Set()
  const visit = node => {
    ;(node.fields || []).forEach(field => {
      if (field.dictType) types.add(field.dictType)
    })
    ;(node.collections || []).forEach(visit)
  }
  schema.sections.forEach(visit)
  return Array.from(types)
}

export function normalizeRevisionOptions(items) {
  const options = new Map()
  ;(Array.isArray(items) ? items : []).forEach(item => {
    if (!item) return
    const value = item.value !== undefined ? item.value : item.dictValue
    const label = item.label !== undefined ? item.label : item.dictLabel
    if (value === undefined || value === null || label === undefined || label === null || label === '') return
    options.set(String(value), { value, label: String(label) })
  })
  return Array.from(options.values())
}

function createFields(fields, t, dictionaries) {
  return (fields || []).map((field, index) => {
    const { dictType, ...definition } = field
    let formatter = field.formatter
    if (dictType) {
      const values = normalizeRevisionOptions(dictionaries[dictType])
      if (values.length) formatter = { type: 'VALUE_MAP', values }
    }
    if (field.componentType === 'SWITCH' && !formatter) {
      formatter = {
        type: 'VALUE_MAP',
        values: [
          { value: field.valueType === 'BOOLEAN' ? false : '0', label: t('uiBtn.no') },
          { value: field.valueType === 'BOOLEAN' ? true : '1', label: t('uiBtn.yes') }
        ]
      }
    }
    if (formatter && formatter.type === 'VALUE_MAP') {
      formatter = {
        ...formatter,
        values: formatter.values.map(({ labelI18nKey, ...option }) => ({
          ...option,
          label: translateLabel(t, labelI18nKey, option.label)
        }))
      }
    }
    return {
      ...definition,
      fieldKey: field.fieldKey.replace(/\./g, '_'),
      propertyPath: field.propertyPath || field.fieldKey,
      fieldLabel: translateLabel(t, field.fieldI18nKey, field.fieldLabel),
      ...(formatter ? { formatter } : {}),
      order: index + 1
    }
  })
}

function createCollections(collections, t, dictionaries) {
  return (collections || []).map((collection, index) => {
    const fields = createFields(collection.fields, t, dictionaries)
    const children = createCollections(collection.collections, t, dictionaries)
    // 通用接口的新增/删除行只返回摘要，必须同时保留名称和子行数据。
    const summaryFields = new Set(collection.summaryFields || [])
    ;(collection.itemLabelFields || []).forEach(path => summaryFields.add(path))
    fields.forEach(field => {
      summaryFields.add(field.propertyPath)
      ;(field.displayFields || []).forEach(path => summaryFields.add(path))
      if (field.formatter && field.formatter.precisionPath) {
        summaryFields.add(field.formatter.precisionPath)
      }
      if (field.formatter && field.formatter.trimZeroWhenPath) {
        summaryFields.add(field.formatter.trimZeroWhenPath)
      }
      if (field.formatter && field.formatter.trimZeroWhenPaths) {
        field.formatter.trimZeroWhenPaths.forEach(path => summaryFields.add(path))
      }
      if (field.formatter && field.formatter.precisionSelectorPath) {
        summaryFields.add(field.formatter.precisionSelectorPath)
      }
    })
    children.forEach(child => summaryFields.add(child.propertyPath))
    return {
      ...collection,
      fieldKey: collection.fieldKey.replace(/\./g, '_'),
      itemKeyPrefix: collection.itemKeyPrefix.replace(/\./g, '_'),
      propertyPath: collection.propertyPath || collection.fieldKey,
      fieldLabel: translateLabel(t, collection.fieldI18nKey, collection.fieldLabel) + (collection.fieldLabelSuffix || ''),
      summaryFields: Array.from(summaryFields),
      order: index + 1,
      orderSensitive: collection.orderSensitive === true,
      fields,
      collections: children
    }
  })
}

// 使用静态业务字段白名单；不从当前表单推断，历史中已删除的字段仍可参与比较。
export function createRevisionDefinition(schema, t, dictionaries = {}) {
  return {
    schemaKey: schema.schemaKey,
    schemaVersion: 2,
    sections: schema.sections.map((section, index) => ({
      ...section,
      sectionLabel: translateLabel(t, section.sectionI18nKey, section.sectionLabel) + (section.sectionLabelSuffix || ''),
      order: index + 1,
      fields: createFields(section.fields, t, dictionaries),
      collections: createCollections(section.collections, t, dictionaries)
    }))
  }
}
