/* eslint-env node */
// 检查新版对比定义的翻译、字段结构及已修复问题；可传入 WMS 仓库路径。
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const assert = require('assert')
const root = path.resolve(__dirname, '..')
const babel = require(path.join(root, 'node_modules/@babel/core'))
const cache = new Map()
function load(file) {
  file = path.resolve(file)
  if (!path.extname(file)) file += '.js'
  if (cache.has(file)) return cache.get(file)
  const result = { exports: {} }
  cache.set(file, result.exports)
  const code = babel.transformSync(fs.readFileSync(file, 'utf8'), {
    babelrc: false,
    configFile: false,
    plugins: [require.resolve(path.join(root, 'node_modules/@babel/plugin-transform-modules-commonjs'))]
  }).code
  vm.runInNewContext(code, {
    exports: result.exports,
    module: result,
    require: name => load(path.resolve(path.dirname(file), name))
  }, { filename: file })
  cache.set(file, result.exports)
  return result.exports
}
function merge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) merge(target[key] || (target[key] = {}), value)
    else target[key] = value
  }
}
function messages(base, lang) {
  const files = ['src/lang/' + lang + '.js']
  for (const entry of fs.readdirSync(path.join(base, 'src/views'), { withFileTypes: true })) {
    if (entry.isDirectory()) files.push('src/views/' + entry.name + '/lang/' + lang + '.js')
  }
  files.push('src/components/RevisionComparison/' + lang + '.js')
  const output = {}
  for (const file of files) if (fs.existsSync(path.join(base, file))) merge(output, load(path.join(base, file)).default)
  for (const dir of ['stockInManagement/emergencyGoodsReceipt', 'warehouseManagement/labelScrap']) {
    const file = path.join(base, 'src/views', dir, 'revisionLocale.js')
    if (fs.existsSync(file)) merge(output, load(file).default[lang])
  }
  return output
}
const report = []
const translate = (locale, key) => key && key.split('.').reduce((v, k) => v && v[k], locale)
function check(base, file, isPo = false) {
  const schemaModule = load(path.join(base, file))
  for (const lang of ['zh', 'en']) {
    const locale = messages(base, lang)
    const t = key => translate(locale, key) || key
    const definition = isPo ? schemaModule.createPurchaseOrderVersionSchemaV2({ t }) : load(path.join(base, 'src/components/RevisionComparison/schema.js')).createRevisionDefinition(schemaModule.default, t)
    let count = 0
    const fieldKeys = []
    function visit(node, parentPath = '') {
      const nodeKey = node.fieldKey || node.sectionKey
      const current = [parentPath, nodeKey].filter(Boolean).join('.')
      const key = node.fieldI18nKey || node.sectionI18nKey
      if (nodeKey) {
        assert(key, `${file}: ${current} missing i18n key`)
        const label = translate(locale, key)
        assert(typeof label === 'string' && label, `${file}: ${lang} missing ${key}`)
        if (lang === 'en') assert(!/[\u4e00-\u9fff]/.test(label), `${file}: Chinese English label ${key}`)
      }
      for (const rule of node.identityRules || []) {
        assert(Array.isArray(rule.fields) && rule.fields.length, `${file}: empty identity rule`)
        assert(rule.fields.every(x => typeof x === 'string'), `${file}: non-string identity fields`)
      }
      for (const list of [node.summaryFields, node.itemLabelFields]) if (list) assert(list.every(x => typeof x === 'string'), `${file}: invalid path list`)
      if (node.fieldKey && !node.fields && !node.collections) {
        count++
        fieldKeys.push(node.propertyPath || node.fieldKey)
        assert(!/(^|[._])decimalNum$/.test(node.fieldKey), `${file}: decimalNum is a business field`)
        assert(node.fieldKey !== 'available', `${file}: attachment helper is a business field`)
      }
      for (const kind of ['sections', 'fields', 'collections']) for (const child of node[kind] || []) visit(child, current)
    }
    visit(definition)
    if (isPo) assert(fieldKeys.includes('emergencyGoodsReceiptNoListShowStr'), 'Protected EGR document field removed')
    if (file.includes('storeIssueChit')) {
      for (const key of ['qty', 'returnedQty', 'costProjectCode']) assert(fieldKeys.includes(key), `${file}: missing ${key}`)
      for (const key of ['qtyOnHand', 'availableQty', 'occupiedQty', 'inTransitQty', 'costProjectId']) assert(!fieldKeys.includes(key), `${file}: unexpected ${key}`)
    }
    if (lang === 'en') report.push({ repo: path.basename(base), file, fields: count })
  }
}
for (const file of fs.readdirSync(path.join(root, 'src/components/RevisionComparison/schemas'))) check(root, 'src/components/RevisionComparison/schemas/' + file)
check(root, 'src/views/purchaseManagement/purchaseOrder/purchaseOrderVersionSchemaV2.js', true)
const wms = process.argv[2] ? path.resolve(process.argv[2]) : null
if (wms) for (const file of ['stockInManagement/emergencyGoodsReceipt/emergencyGoodsReceiptVersionSchemaV2.js', 'stockOutManagement/storeIssueChit/storeIssueChitVersionSchemaV2.js', 'warehouseManagement/labelScrap/scrapVersionSchemaV2.js', 'warehouseManagement/inventoryAudit/inventoryAuditVersionSchemaV2.js']) check(wms, 'src/views/' + file)
console.log('PASS:', report.length, 'schemas;', report.reduce((n, r) => n + r.fields, 0), 'fields; Chinese/English labels, schema structure, protected fields')
