使用表格动态计算宽度

### 注意事项

1. 在数据返回时就取字典值 label, 若字典值数据还未请求成功, 会导致主列表的字典值为空
   处理方案: 在页面 methods 新增一个方法, 这个方法会在字典值加载完成后被调用

```
  onDictReady() {
    this.tableList.forEach((item) => {
      // 备注: 一定要用 propBy 字段
      item.approvedStatusStr = this.selectDictLabel(
        this.dict.type.approved_status,
        item.approvedStatus
      )
    })
    this.$$getColumnContentMaxWidth(this.columns, this.tableList)
  },
```

### 字段注释解析

columns: [
{

prop: 'salesOrderCode',
label: vm.$t('SALES.orderNo'),
visible: true,
tooltip: true,
fixed: true,
sortable: 'custom',
required: false, // 计算表头宽度是使用，必填星号占位

  <!-- 以下字段都非必须, 按需求填写参数 -->

propBy: undefined, // 字段描述解析在下面
width: undefined, // 设置此字段, 列固定宽度,不会与其他列平分表格多余的宽度, 不会计算表头与内容文本宽度
fixedWidth: undefined, // 设置此字段, 列固定宽度, 与其他列平分表格多余的宽度 , 不会计算表头与内容文本宽度
headerWidth: undefined, // 不用设置, 计算得出, 表头文本宽度, 排序按钮宽度算入在内
colMinWidth: undefined, // 列内容最小宽度, 用于设置给 创建时间与修改时间 这类固定宽度的
colWidth: undefined, // 不用设置, 计算得出, 此列内容最长的文本宽度
maxWidth: undefined, // 设置此字段, 表格列的最大宽度, 不设置则取默认值 300px

},
....
]

### propBy 的使用时机

propBy 可能使用到的时机, 一般用于字典值
表格列需要动态计算宽度时, 需要在表格数据返回时就将 字典值获取到字典值对应的 label 保存进字段
如果这个字段页面有用于做判断的时候, 或者字段有再次编辑, 就会导致出 bug
所以字典值字段获取 label 进行保存时, 不能保存到 原 prop 字段, 应该保存到 propBy
详细示例参照 src\views\dispatchManagement\loadOrderDispatching\components\orders.vue

### tableMinx 动态计算宽度相关的 methods 方法

### getMinWidth 获取列的宽度

使用与示例
:min-width="getMinWidth(item)"
<el-table-column
v-for="item in customColumns"
:key="item.prop"
:prop="item.prop"
:label="item.label"
:width="item.width"
:min-width="getMinWidth(item)"
:show-overflow-tooltip="item.tooltip"
:sortable="'custom'"
:align="item.align || 'left'"
header-align="center"

> </el-table-column>

### $$initColumnHeaderWidth(columns) 计算表头字符的宽度

使用与示例

1. 主列表已经在 $$initColumnVisible 中调用, 不需要另外调用
2. 自定义列 this.$$initColumnHeaderWidth(this.customColumns)

### $$getColumnContentMaxWidth(columns, tableList) 计算每一列的内容最大宽度

1. 主列表每次内容发生变化时需要调用, 一般是 getList 方法返回时调用
   this.$$getColumnContentMaxWidth(this.columns, this.tableList)
2. 自定义列, 一般是 getList 方法返回时调用
   this.$$getColumnContentMaxWidth(this.customColumns, this.tableList)

```

```
