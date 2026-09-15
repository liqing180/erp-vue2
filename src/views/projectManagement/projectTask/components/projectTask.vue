<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('menu.projectTask')"
      :visible.sync="visible"
      width="1140px"
      :modal="true"
      :close-on-click-modal="false"
      @closed="closed"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="130px"
        class="mt22"
        :disabled="isView"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.taskName')}`" prop="taskName">
              <el-input v-model="form.taskName" maxlength="200" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.pic')}`" prop="picUserBy">
              <SelectInput
                :value="form.picUserBy"
                :title="form.picUserBy"
                @clear="picUserNameClear"
                clearable
                @click="openPicTable"
                class="form-wd"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.taskType')}`" prop="taskType">
              <el-input
                :value="selectDictLabel(dict.type.s_task_type, form.taskType) || ''"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
              <SelectInput
                :value="form.productName"
                :title="form.productName"
                @clear="productNameClear"
                clearable
                @click="openProductName"
                class="form-wd"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`" prop="internalPartNo">
              <el-input v-model="form.internalPartNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.productType')}`" prop="productType">
              <el-input
                :value="selectDictLabel(dict.type.service_type, form.serviceType) || ''"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.qty')}`" prop="qty">
              <el-input-number
                style="width: 100%"
                v-model="form.qty"
                controls-position="right"
                :key="`qty${form.decimalNum}`"
                :precision="form.decimalNum"
                v-thousandSplit="{ precision: form.decimalNum }"
                :min="form.includeDecimal === '1' ? 0.001 : 1"
                :max="999"
                @change="inputNumberChange('qty')"
                :disabled="!form.productId"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.uom1')}`" prop="uom">
              <el-input v-model="form.uom" :title="showUomLabel(form.uom)" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.unitPrice')}`" prop="unitPrice">
              <el-input-number
                style="width: 100%"
                v-model="form.unitPrice"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.productParameter')}`" prop="serviceParameter">
              <el-input v-model="form.serviceParameter" maxlength="200" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.amount')}`" prop="amount">
              <el-input-number
                style="width: 100%"
                :value="form.amount"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.description')}`" prop="description">
              <MyInput
                type="textarea"
                v-model="form.description"
                :autosize="{ minRows: 2, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="isContentEdit">
          <el-button type="primary" size="small" @click="editContentHandle">{{
            $t('uiBtn.save')
          }}</el-button>
          <el-button size="small" @click="visible = false">{{ $t('uiBtn.back') }}</el-button>
          <!-- <el-button size="small" @click="resetContentHandle">{{ $t('uiBtn.reset') }}</el-button> -->
        </template>
        <template v-else>
          <el-button type="primary" size="small" @click="addContentHandle">{{
            $t('uiBtn.add')
          }}</el-button>
          <el-button size="small" @click="resetContentHandle">{{ $t('uiBtn.reset') }}</el-button>
        </template>
      </div>
    </el-dialog>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-if="!isView"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-if="!isView"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col>

      <right-toolbar
        :saveKey="saveKey"
        @queryTable="queryTable"
        :showRefreshBtn="false"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      ref="termTable"
      :data="tableList"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      stripe
      class="mt22"
      max-height="390"
      border
      header-row-class-name="th-primary"
      @row-dblclick="contentRowClick"
      style="cursor: pointer"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope"
          ><span>{{ scope.$index + 1 }} </span></template
        >
      </el-table-column>
      <el-table-column
        v-for="item in visibleColumn"
        :key="item.prop + item.colSortIndex"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="getMinWidth(item)"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName'">
            <commonProductAndPicture :row="scope.row" />
          </template>
          <template v-else-if="item.prop === 'picture'">
            <div v-if="scope.row.defaultImageUrl" style="line-height: 0; height: 30px">
              <el-image
                style="height: 100%"
                :src="scope.row.defaultImageUrl"
                :preview-src-list="[scope.row.defaultImageUrl]"
              />
            </div>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">{{
            $numberStr(scope.row.unitPrice, 2)
          }}</template>
          <template v-else-if="item.prop === 'amount'">{{
            $numberStr(scope.row.amount, 2)
          }}</template>

          <template v-else-if="item.prop === 'qty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ui.action')" width="160" fixed="right" align="center">
        <template slot-scope="scope" v-if="!isView">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              @click.stop="editContentRow(scope.row, scope.$index)"
            ></i>
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click.stop="delContentRowHandle(scope.$index)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <selectPicTable ref="selectPicTable" @updatePic="updatePic" />
    <selectProductTable
      ref="selectProductTable"
      :currencyId="currencyId"
      @onSuccess="updateProductName"
    />
    <ImportExcelDlg
      ref="importDlg"
      :importOptions="importOptions"
      :currencyId="currencyId"
      @onSuccess="updateTableList"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectPicTable from '@/views/organization/corporate/selectPicTable.vue'
import selectProductTable from './selectProductTable.vue'
import ImportExcelDlg from './importDlg.vue'
export default {
  components: { selectPicTable, selectProductTable, ImportExcelDlg },
  mixins: [pageMixin],
  dicts: ['s_task_type', 'service_type'],
  props: {
    isView: {
      type: Boolean,
      default: true
    },
    currencyId: {
      type: String,
      default: ''
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '9',
      form: {
        taskType: '1'
      },
      rules: {
        taskName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        picUserBy: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        productName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        qty: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ]
      },
      columns: [
        {
          prop: 'taskName',
          label: vm.$t('PRODUCT.taskName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'picUserBy',
          label: vm.$t('PRODUCT.pic'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'taskType',
          propBy: 'taskTypeStr',
          label: vm.$t('PRODUCT.taskType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'serviceType',
          propBy: 'serviceTypeStr',
          label: vm.$t('PRODUCT.productType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },

        {
          prop: 'serviceParameter',
          label: vm.$t('PRODUCT.productParameter'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PRODUCT.unitPrice'),
          visible: true,
          minWidth: 200,
          align: 'right',
          tooltip: true,
          padding: 50
        },
        {
          prop: 'qty',
          label: vm.$t('PRODUCT.qty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'amount',
          label: vm.$t('PRODUCT.amount'),
          visible: true,
          minWidth: 200,
          align: 'right',
          padding: 50,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/sales/projectTask/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/projectTask/checkImportData',
        // 提交导入
        importUrl: '/sales/projectTask/importData',
        // 下载文件名
        fileName: 'Project Task'
      },
      options: [],
      isContentEdit: false,
      tableList: [],
      editIndex: undefined,
      visible: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init(data = []) {
      const rows = JSON.parse(JSON.stringify(data))
      rows.forEach((item) => {
        item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
        item.taskTypeStr = this.selectDictLabel(this.dict.type.s_task_type, item.taskType)
      })
      this.tableList = rows
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    handleAdd() {
      this.resetContentHandle()
      this.visible = true
    },
    closed() {
      this.resetContentHandle()
    },
    reset() {
      const vm = this
      this.resetForm('form')
      this.tableList = []
      setTimeout(() => {
        vm.$refs.form && vm.$refs.form.clearValidate()
        this.form = {}
        this.$set(this.form, 'taskType', '1')
      }, 20)
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
        item.taskTypeStr = this.selectDictLabel(this.dict.type.s_task_type, item.taskType)
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
      if (code === 'qty') {
        const { qty, unitPrice } = this.form
        if (qty && unitPrice) {
          let count = 1000 * qty * unitPrice
          count = (count / 1000).toFixed(2)
          this.$set(this.form, 'amount', count)
        } else {
          this.$set(this.form, 'amount', undefined)
        }
      }
    },
    // 清空pic
    picUserNameClear() {
      this.$set(this.form, 'picUserBy', undefined)
      this.$set(this.form, 'picUserId', undefined)
      this.$set(this.form, 'mobilePhone', undefined)
      this.$set(this.form, 'mobileCode', undefined)
      this.$set(this.form, 'mobileNum', undefined)
    },
    // 打开pic弹窗
    openPicTable() {
      this.$refs.selectPicTable.handleOpen()
    },
    updatePic(row) {
      const { nickName, userId, mobilePhone, mobileCode, mobileNum } = row
      this.$set(this.form, 'picUserBy', nickName)
      this.$set(this.form, 'picUserId', userId)
      this.$set(this.form, 'mobilePhone', mobilePhone)
      this.$set(this.form, 'mobileCode', mobileCode)
      this.$set(this.form, 'mobileNum', mobileNum)
    },
    openProductName() {
      let ids = this.tableList.map((x) => x.productId)
      if (this.form.productId) {
        ids = ids.filter((x) => x !== this.form.productId)
      }
      this.$refs.selectProductTable.handleAdd(ids)
    },
    productNameClear() {
      this.$set(this.form, 'productMainId', undefined)
      this.$set(this.form, 'productName', undefined)
      this.$set(this.form, 'productId', undefined)
      this.$set(this.form, 'internalPartNo', undefined)
      this.$set(this.form, 'serviceType', undefined)
      this.$set(this.form, 'serviceTypeStr', undefined)
      this.$set(this.form, 'uom', undefined)
      this.$set(this.form, 'qty', undefined)
      this.$set(this.form, 'unitPrice', undefined)
      this.$set(this.form, 'amount', undefined)
      this.$set(this.form, 'taskTypeStr', undefined)
      this.$set(this.form, 'decimalNum', undefined)
      this.$set(this.form, 'includeDecimal', undefined)
    },
    updateProductName(row) {
      const {
        productMainId,
        productName,
        productId,
        internalPartNo,
        serviceType,
        valuationUnit,
        valuationAmount,
        decimalNum,
        includeDecimal
      } = row
      this.$set(this.form, 'productMainId', productMainId)
      this.$set(this.form, 'productName', productName)
      this.$set(this.form, 'productId', productId)
      this.$set(this.form, 'internalPartNo', internalPartNo)
      this.$set(this.form, 'serviceType', serviceType)
      this.$set(this.form, 'decimalNum', decimalNum)
      this.$set(this.form, 'includeDecimal', includeDecimal)
      this.$set(
        this.form,
        'serviceTypeStr',
        this.selectDictLabel(this.dict.type.service_type, serviceType)
      )
      this.$set(
        this.form,
        'taskTypeStr',
        this.selectDictLabel(this.dict.type.s_task_type, this.form.taskType)
      )

      this.$set(this.form, 'uom', valuationUnit)
      this.$set(this.form, 'unitPrice', valuationAmount)
      this.$set(this.form, 'amount', undefined)
      this.$refs.form.clearValidate('required')
    },

    editContentHandle() {
      const vm = this
      vm.form = vm.$trimOfObj(vm.form)
      vm.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(vm.form))
          vm.$set(vm.tableList, vm.editIndex, { ...params })
          vm.editIndex = undefined
          vm.form = { taskType: '1' }
          // vm.resetContentHandle()
          vm.isContentEdit = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          vm.visible = false
        }
      })
    },

    addContentHandle() {
      const vm = this
      vm.form = vm.$trimOfObj(vm.form)
      vm.form.taskType = '1'
      vm.isContentEdit = false
      vm.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(vm.form))
          vm.tableList.push({
            ...params
          })
          vm.visible = false
          // vm.resetContentHandle()
        }
      })
    },

    resetContentHandle() {
      const vm = this
      this.resetForm('form')
      vm.isContentEdit = false
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      setTimeout(() => {
        vm.$refs.form && vm.$refs.form.clearValidate()
        this.form = {}
        this.$set(this.form, 'taskType', '1')
      }, 20)
    },

    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      // const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      // if (cur) {
      //   color = 'table-SelectedRow-bgcolor'
      // }
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

    delContentRowHandle(index) {
      const vm = this

      vm.tableList.splice(index, 1)
      vm.resetContentHandle()
    },

    contentRowClick(dataRow) {
      const vm = this

      vm.editIndex = vm.tableList.findIndex((item) => item.index === dataRow.index)
      vm.editContentRow(dataRow, vm.editIndex)
    },

    editContentRow(dataRow, index) {
      const vm = this

      vm.$refs.form && vm.$refs.form.clearValidate()

      if (index !== undefined) {
        vm.editIndex = index
      }

      vm.isContentEdit = true

      if (!dataRow.inventoryCategory && !!dataRow.inventoryCategoryIds) {
        dataRow.inventoryCategory = JSON.parse(dataRow.inventoryCategoryIds)
      }
      const params = JSON.parse(JSON.stringify(dataRow))
      vm.form = {
        ...params
      }
      vm.visible = true
    },
    submitForm() {
      const vm = this
      const len = vm.tableList.length
      if (len <= 0) {
        vm.$modal.msgError(`${vm.$t('taxCode.taxCodeDetailEmpty')}`)
        this.collapseWarningForContent = true
        return
      }
      this.collapseWarningForContent = false

      const content = vm.$t('taxCode.confirm')
      this.$modal.confirm(content).then(() => {
        let param = {}
        param.tableList = vm.tableList.map((item) => {
          delete item.inventoryCategory
          return item
        })
        param = vm.$trimOfObj(param)
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    },
    updateTableList(e) {
      const { data } = e
      const ids = data.map((x) => x.productId)
      const arr = this.tableList.filter((x) => ids.indexOf(x.productId) === -1)
      const hash = []
      const newData = data.reduce((pre, cur) => {
        // eslint-disable-next-line no-unused-expressions
        hash[cur.productId] ? '' : (hash[cur.productId] = true && pre.push(cur))
        return pre
      }, [])
      const newTableList = newData.concat(arr)
      newTableList.forEach((item) => {
        item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
        item.taskTypeStr = this.selectDictLabel(this.dict.type.s_task_type, '1')
      })
      this.tableList = newTableList
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    }
  }
}
</script>
