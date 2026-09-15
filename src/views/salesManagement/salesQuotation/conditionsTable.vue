<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-popover
          placement="right"
          v-model="conditionsPopoverVisible"
          @show="conditionsPopoverShow"
          @hide="salesConditionsCheckList = []"
        >
          <el-checkbox-group v-model="salesConditionsCheckList">
            <div class="conditions-item-box">
              <table cellspacing="0px 20px">
                <tr
                  class="conditions-item"
                  v-for="item in comSalesConditionsList"
                  :key="item.conditionsId"
                >
                  <td class="conditions-label">
                    <div v-show="item.hideLabel !== '1'">
                      {{ item.category }}
                    </div>
                  </td>
                  <td>
                    <el-checkbox
                      :label="item.conditionsId"
                      :disabled="isOptionDisabled(item, salesConditionsCheckList)"
                    >
                      <div class="conditions-content">
                        {{ item.conditions }}
                      </div>
                    </el-checkbox>
                  </td>
                </tr>
              </table>
            </div>
          </el-checkbox-group>
          <div style="text-align: right; margin-top: 10px">
            <el-button size="mini" @click="conditionsPopoverVisible = false">{{
              $t('uiBtn.back')
            }}</el-button>
            <el-button type="primary" size="mini" @click="handleSaveConditions">{{
              $t('uiBtn.save')
            }}</el-button>
          </div>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            slot="reference"
            :disabled="comSalesConditionsList.length === 0"
            >{{ $t('system.addConditions') }}</el-button
          >
        </el-popover>
      </el-col>
    </el-row>
    <!-- <quill-editor
      ref="quillEditorRef"
      v-model="formData.conditions"
      :options="{
        placeholder: ' ',
        modules: {
          toolbar: false
        }
      }"
      @blur="handleBlur"
    ></quill-editor> -->

    <el-table
      ref="dragTable"
      border=""
      row-key="conditionsId"
      class="mb20"
      :data="tableList"
      :key="'tableKey' + modifyHighlight"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
    >
      <el-table-column
        type="index"
        :label="$t('ui.sn')"
        width="60"
        align="center"
        class-name="allowDrag"
      >
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="category"
        :label="$t('ui.category')"
        header-align="center"
        align="left"
        width="200"
        :show-overflow-tooltip="true"
        class-name="allowDrag"
      >
      </el-table-column>
      <el-table-column
        prop="conditions"
        :label="$t('ui.conditions')"
        header-align="center"
        align="left"
        min-width="400"
        :show-overflow-tooltip="true"
      >
        <template slot="header" slot-scope="{ column }">
          <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
        </template>
        <template slot-scope="scope">
          <!-- <div style="margin: 0 auto; width: 97%">
            <quill-editor
              :key="scope.row.conditionsId + 'editor'"
              ref="quillEditorRef"
              :value="scope.row.conditions"
              :options="{
                placeholder: ' ',
                modules: {
                  toolbar: false
                },
                syntax: false
              }"
              @focus="handleFocus($event, scope.row)"
              @blur="handleBlur(scope.row)"
              @change="handleChange($event, scope.row)"
              :disabled="comDisFrom"
            ></quill-editor>
          </div> -->
          <div
            style="margin: 0 auto; width: 97%"
            v-if="editConditionsId === scope.row.conditionsId"
          >
            <MyInput
              type="textarea"
              v-model="scope.row.conditions"
              :autosize="{ minRows: 1, maxRows: 8 }"
              resize="none"
              :show-word-limit="false"
              :maxlength="3000"
              :disabled="comDisFrom"
            ></MyInput>
          </div>
          <div v-else style="margin: 0 auto; width: 97%">
            <div
              style="word-break: break-word; white-space: pre-wrap; line-height: 1.2"
              v-html="getShowStr(scope.row.conditions, varContentData)"
            ></div>
            <!--
              {
                  Incoterm: formData.incotermName,
                  ValidityDays: formData.validityForDay
                }
            -->
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        v-if="!comDisFrom"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              v-if="editConditionsId === scope.row.conditionsId"
              class="el-icon-s-claim primary-pointer mr10"
              style="font-size: 20px"
              :title="$t('uiBtn.save')"
              @click="editConditionsId = null"
            ></i>
            <template v-else>
              <i
                v-if="conditionsIsCanEdit(scope.row.conditions, varContentData)"
                class="el-icon-edit primary-pointer mr10"
                style="font-size: 20px"
                :title="$t('uiBtn.edit')"
                @click="editConditionsId = scope.row.conditionsId"
              ></i>
              <span v-else style="display: inline-block; width: 20px" class="mr10"></span>
            </template>
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelConditions(scope.$index)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },

    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    varContentData: {
      type: Object,
      default() {
        return {}
      }
    },
    comSalesConditionsList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    'formData.conditionsTableList': {
      immediate: true,
      deep: false,
      handler: function (selected) {
        if (!this.formData.conditionsTableList) {
          this.$set(this.formData, 'conditionsTableList', [])
        }
        this.tableList = this.formData.conditionsTableList
        if (this.editConditionsId) {
          const fItem = this.tableList.find((item) => this.editConditionsId === item.conditionsId)
          if (!fItem) {
            this.editConditionsId = ''
          }
        }
        this.changeTableList()
      }
    }
  },
  data() {
    return {
      salesConditionsCheckList: [],
      conditionsPopoverVisible: false,
      maxConditionsLength: 3000,
      currentLength: 0,
      tableList: [],
      variables: [
        {
          formKey: 'IncotermName',
          category: 'Incoterm',
          varKey: 'Incoterm'
        }
      ],
      editConditionsId: ''
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }
      return cellClass
    },
    conditionsIsCanEdit(conditions, varContentData) {
      const conditionsCopy = conditions || ''
      const varContentDataCopy = varContentData || {}
      const nullVarList = []
      conditionsCopy.replace(/\$\{([A-Za-z0-9 _-]+)\}/g, (match, varKey) => {
        // console.log('match', match)
        // console.log('varKey', varKey)
        const is = varContentDataCopy[varKey]
        if (!this.$resultOfBoolean(is)) {
          nullVarList.push(match)
        }
        const value = match // 保留原占位符
        return value
      })
      return nullVarList.length <= 0
    },
    isOptionDisabled(item, CheckList) {
      // 1. 找到当前分类下已选中的选项ID
      const checkedInSameCategory = CheckList.find((id) => {
        const checkedItem = this.comSalesConditionsList.find((i) => i.conditionsId === id)
        return checkedItem?.category === item.category
      })
      // 2. 禁用条件：分类已选中其他选项 + 自身未被选中
      return checkedInSameCategory && checkedInSameCategory !== item.conditionsId
    },

    conditionsPopoverShow() {
      this.salesConditionsCheckList = this.tableList.map((item) => item.conditionsId)
      // console.log(this.comSalesConditionsList)
    },
    handleFocus(e, row) {
      // console.log('handleFocus', row.conditionsId, e)
      // setTimeout(() => {
      //   e.focus()
      // }, 2000)
    },
    handleBlur(row) {
      // if (row.conditionsCody) {
      //   row.conditions = row.conditionsCody
      //   delete row.conditionsCody
      // }
      // console.log('handleBlur', row.conditionsId)
    },
    handleChange(e, row) {
      // console.log('handleChange', e, row)
      row.conditionsCody = e.html
      /*
        表单提交时，调用 handleSetConditionsHtmlStr
        将 conditionsCody 赋值给 conditions
        在表格内使用富文本，实时对 scope.row.conditions 进行赋值，
        会输入字符后立即失去焦点
      */
      /* 删除超出的字符 */
      // if (this.maxConditionsLength) {
      //   this.$nextTick(() => {
      //     e.quill.deleteText(this.maxConditionsLength, 4)
      //   })
      // }
    },
    changeTableList() {
      console.log('changeTableList')
      // this.$nextTick(() => {
      //   this.$$getColumnContentMaxWidth(this.columns, this.comTableList)
      // })
      setTimeout(() => {
        this.setDragTable()
      }, 200)
    },
    handleSaveConditions() {
      const newCheckedList = this.salesConditionsCheckList
      // 删除取消勾选的行-倒序遍历避免索引错乱
      for (let i = this.tableList.length - 1; i >= 0; i--) {
        const row = this.tableList[i]
        if (!newCheckedList.includes(row.conditionsId)) {
          this.tableList.splice(i, 1) // 移除当前行，保留响应式
        }
      }
      // 2. 第二步：找出选中ID中未在表格的项（需新增的行）
      const tableExistIds = this.tableList.map((row) => row.conditionsId)
      const needAddIds = newCheckedList.filter((id) => !tableExistIds.includes(id))
      // 3. 第三步：新增行（用push添加，不赋值）
      needAddIds.forEach((id) => {
        const newRow = this.comSalesConditionsList.find((item) => item.conditionsId === id)
        if (newRow) {
          this.tableList.push(JSON.parse(JSON.stringify(newRow))) // 新增行到表格末尾
        }
      })
      this.conditionsPopoverVisible = false
    },
    handleDelConditions(index) {
      const list = this.tableList || []
      list.splice(index, 1)
      setTimeout(() => {
        this.setDragTable()
      }, 200)
    },
    setDragTable() {
      this.destroyDraggable()
      if (this.comDisFrom) return
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortableDom = Sortable.create(el, {
        handle: '.allowDrag',
        animation: 100,
        ghostClass: 'blue-background-class',
        onEnd: (evt) => {
          if (evt.oldIndex === evt.newIndex) return
          const list = this.tableList || []
          const targetRow = list.splice(evt.oldIndex, 1)[0]
          list.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },
    getShowStr(conditions, varContentData) {
      // console.log(conditions)
      return conditions.replace(/\$\{([A-Za-z0-9 _-]+)\}/g, (match, varKey) => {
        // console.log('match', match)
        // console.log('varKey', varKey)
        const value = this.$resultOfBoolean(varContentData[varKey]) ? varContentData[varKey] : match // 无值则保留原占位符
        // 生成带标记的标签（样式透明，和普通文本一致）
        return value
      })
    }
  }
}
</script>

<style></style>
