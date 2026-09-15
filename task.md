# 审批编辑页版本对比高亮接入说明

## 目标

在业务编辑页接入“审批修改内容高亮”。审批人进入页面后可直接看到：

- 普通字段修改前、修改后的值。
- 新增、修改、删除图例。
- 明细表新增行、修改单元格、删除行。
- 附件新增、修改、删除。
- 最近一次驳回意见（接口有数据时）。
- 对比态只读；有编辑权限时可退出对比态，恢复当前版本继续编辑。

不得影响原有提交、审批、驳回、撤回、作废、修订和版本记录功能。

## 参考实现

- 基准页面：`src/views/purchaseManagement/purchaseOrder/editFromPage.vue`
- 基准表格：`src/views/purchaseManagement/purchaseOrder/productTable.vue`
- 已复刻页面：`src/views/businessPartner/businessPartner/editFromPage.vue`
- 字段对比组件：`src/components/Common/comparisonInput/index.vue`
- 附件组件：`src/components/Common/htz-image-upload/my-upload.vue`
- 图片附件表格：`src/components/Common/htz-image-upload/my-upload-table.vue`
- 全局样式：`src/App.vue` 中的 `edit-outline`、`new-add-row`、`cancel-row`、`edit-table-cell`

`purchaseOrderVersionSchemaV2.js` 和 `revisionComparisonDlgV2.vue` 属于独立能力，不在本任务范围内，除非需求明确要求。

## 开始前检查

1. 阅读目标编辑页及其直接使用的表格、附件组件和 API。
2. 检查 `AGENTS.md`、`git status`，保留用户已有修改。
3. 找出详情查询、所有初始化分支、`reset()`、重新查询和进入编辑态的方法。
4. 确认 `buttonAuthMsg`、`approvedBtnShow`、`editAuth`、`dataType`、禁用状态等权限逻辑。
5. 检查详情接口真实返回的 `updateMsg`；字段名不得从其他模块猜测。
6. 检查现有版本对比弹窗使用的接口和参数，不能误用其他业务模块的弹窗。

## 数据契约

详情接口需要同时返回当前版本数据和 `updateMsg`。示例仅说明结构，字段名必须以目标接口为准：

```js
{
  buttonAuthMsg: {
    isCanSeeUpdateMsg: '1',
    isCanUpdate: '1'
  },
  updateMsg: {
    basicUpdateMsgList: [
      {
        name: 'fieldName',
        beforeValue: '修改前',
        afterValue: '修改后'
      }
    ],
    beforeDetailList: [],
    afterDetailList: [],
    beforeCommonFileList: [],
    afterCommonFileList: []
  }
}
```

变更类型：

- `updateType === '1'`：修改，变化字段放在行内 `updateMsgList`。
- `updateType === '2'`：新增。
- `updateType === '3'`：删除，通常只在对应 `beforeXxxList` 中，需要追加到展示列表。

必须确认：

- `updateMsgList[].name` 能否和表格 `column.property` 对应；不一致时显式映射。
- 选择器比较的是 ID 还是可读名称。页面展示必须使用名称，不得显示内部 ID。
- 多张表分别对应哪个 `beforeXxxList/afterXxxList`。
- 接口是否返回 `updateType` 和 `updateMsgList`。缺少时不能由前端伪造比较结果。

### ASL 已确认字段

ASL 详情接口当前使用以下命名，不能照搬旧版本弹窗或其他模块：

- 产品删除列表：`beforeDetailList`。
- 附加费删除列表：`beforeServiceSurchargeList`。
- 附件删除列表：`beforeCommonFileList`。
- 可读字段：`paymentTermName`、`contactPersonName`、`incotermName`、`currency`。
- 付款条款内容变化：`paymentTermMsg`；即使名称未变，也要显示修改样式。

## 实施清单

### 1. 状态和只读控制

页面按实际数据结构增加：

```js
basicUpdateProps: [],
basicUpdateMsgList: [],
updateMsg: {},
isComparison: false,
commonFileListCur: [],
detailListCur: []
```

有多张表时分别增加缓存，例如 `serviceListCur`。所有状态必须在 `reset()` 清空。

```js
modifyHighlight() {
  return (
    this.approvedBtnShow &&
    this.buttonAuthMsg.isCanSeeUpdateMsg === '1' &&
    this.isComparison
  )
}
```

详情和 `buttonAuthMsg` 赋值完成后再设置：

```js
this.isComparison =
  this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
```

原禁用计算属性最前面增加对比态只读判断，后续仍沿用原权限、状态和管理员逻辑：

```js
if (this.approvedBtnShow && this.isComparison) return true
```

### 2. 初始化和退出对比态

统一初始化方法必须完成：

1. 保存完整 `updateMsg`、`basicUpdateMsgList` 和变化字段名。
2. 深拷贝缓存当前产品、附加费、附件等列表。
3. 只从对应 `beforeXxxList` 追加 `updateType === '3'` 的记录。
4. 为追加行补齐稳定的 `rowTimeId`；树表删除父行时同步标记子行。
5. 先设置表格数据，最后初始化附件，避免被原有 `$nextTick/setTimeout` 覆盖。

退出对比态不得重新请求接口，应：

1. 设置 `isComparison = false`。
2. 从缓存深拷贝恢复当前版本表格，移除仅用于展示的删除行。
3. 调用现有子组件 `initList()`（如果组件提供）。
4. 调用附件组件 `initFileList(commonFileListCur)`。

“编辑”按钮至少同时校验：模块编辑权限、业务主键、可更新来源、`isCanUpdate`、审批状态和当前对比态。

### 3. 普通字段

单值控件在对比态使用 `ComparisonInput`，非对比态才显示原控件：

```vue
<ComparisonInput
  v-if="isModified('fieldName')"
  :beforeValue="getBeforeValue('fieldName')"
  :afterValue="getAfterValue('fieldName', form.fieldName)"
/>
<el-input v-else v-model="form.fieldName" />
```

注意：

- 使用 `ComparisonInput` 后，外层不要再添加 `edit-outline`，避免样式叠加。
- 选择器使用可读名称字段，不使用 ID；字段名必须和接口 `updateMsg` 一致。
- 金额、税率、数量、日期按页面原展示精度和格式处理，例如 `$numberStr`、`parseTime`。
- `paymentTermMsg` 这类“名称未变、内部内容变化”的字段可使用 `showEditType` 强制显示修改样式。
- 原本不可编辑且未参与高亮的字段保持只读，不扩大比较范围。
- 开关、复选组、多行备注、组合输入等复杂控件保留原组件，通过外层 `isModified()` 整体高亮。

### 4. 表格

父页面向子表传递 `modifyHighlight`。表格必须同时绑定行、单元格 class：

```js
tableRowClassName({ row }) {
  if (!this.modifyHighlight) return ''
  if (row.updateType === '2') return 'new-add-row'
  if (row.updateType === '3') return 'cancel-row'
  return ''
},
tableCellClassName({ row, column }) {
  if (
    this.modifyHighlight &&
    row.updateType === '1' &&
    (row.updateMsgList || []).some((item) => item.name === column.property)
  ) {
    return 'edit-table-cell'
  }
  return ''
}
```

必须保留表格原有错误单元格、选中行、树表和冻结列逻辑。接口字段与列 `prop` 不一致时显式映射。

### 5. 附件、图例和驳回意见

- `myUpload` 传入 `:modifyHighlight="modifyHighlight"`。
- 当前附件与 `beforeCommonFileList` 中的删除附件合并后展示。
- 附件外层不要重复添加 `edit-outline`。
- 退出对比态后重新传入 `commonFileListCur`。
- 图片表格若残留旧行颜色，通过动态 `key` 在 `initFileList()` 后重建表格。
- 对比态显示新增、修改、删除图例，颜色必须复用全局定义。
- 接口有 `operationLogForLastReject` 时显示意见、操作人和格式化时间，并将折叠项加入默认展开数组。

### 6. 原版本对比

内联高亮与版本对比弹窗是两套能力：

- 弹窗按钮可见性使用 `buttonAuthMsg.isCanSeeUpdateMsg === '1'`，不要依赖 `modifyHighlight`。
- 退出内联对比态后，版本对比按钮仍应存在。
- 复用目标模块已有弹窗，并确认接口、业务主键参数正确；没有现成能力时不要临时复制 V2 弹窗。

## 验收

- 普通编辑页不显示图例、不误高亮，原编辑功能正常。
- 审批页无查看权限时不进入对比态。
- 有查看权限时自动进入只读对比态。
- 字段新增、修改、删除均正确显示前后值。
- 选择器显示名称，数值与日期格式正确。
- 表格新增行、修改单元格、删除行正确高亮，树形子行不遗漏。
- 附件新增、修改、删除正确高亮。
- 有驳回记录时正确显示，无数据时不显示空卡片。
- 有编辑权限时可退出对比态并恢复当前产品、附加费、附件；删除展示行不残留。
- 提交、审批、驳回、撤回、作废、修订、版本记录保持原行为。
- 切换单据后无上一单据的高亮和缓存残留。

## 验证与交付

修改 `.js/.vue` 后，优先对相关文件执行 ESLint：

```bash
npx eslint path/to/editFromPage.vue path/to/directTableComponent.vue
```

涉及路由、构建配置、依赖或跨模块公共能力时再执行：

```bash
npm run build:prod
```

交付说明必须包含：修改内容、根因或接入原因、实际执行的验证、未验证范围和剩余风险。不得声称未执行的检查已经通过。
