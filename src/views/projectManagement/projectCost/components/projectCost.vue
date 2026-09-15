<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('menu.projectCost')"
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
        label-width="100px"
        class="mt22"
        :disabled="isView"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.expenseItem')}`" prop="expenseItem">
              <el-input v-model="form.expenseItem" maxlength="200" />
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
            <el-form-item :label="`${$t('ui.currency')}`" prop="currency">
              <el-input :value="formData.currency" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.amount')}`" prop="amount">
              <el-input-number
                style="width: 100%"
                v-model="form.amount"
                controls-position="right"
                :precision="2"
                v-thousandSplit="{ precision: 2 }"
                :min="0.01"
                :max="999999999999.99"
                @change="inputNumberChange('amount')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
              <MyInput
                type="textarea"
                v-model="form.remarks"
                :autosize="{ minRows: 2, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
              <myUpload ref="uploadRef" :limit="9" :disabled="isView" />
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
      :data="comTableList"
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
        <template slot-scope="scope">
          <span v-if="!scope.row.isTotal">{{ scope.$index + 1 }}</span>
        </template>
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
          <template v-else-if="item.prop === 'amount'">
            <template v-if="!scope.row.isTotal">{{ $numberStr(scope.row[item.prop], 2) }}</template>
            <template v-else>{{ $numberStr(comAmount, 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'attachment'">
            <span v-if="scope.row.commonFileList && scope.row.commonFileList.length > 0">
              {{ scope.row.commonFileList.length }}
            </span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ui.action')" width="160" fixed="right" align="center">
        <template slot-scope="scope" v-if="!isView && scope.row.picUserId">
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
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="updateTableList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectPicTable from '@/views/organization/corporate/selectPicTable.vue'

export default {
  name: 'ProjectCost',
  components: { selectPicTable },
  mixins: [pageMixin],
  dicts: [],
  props: {
    isView: {
      type: Boolean,
      default: true
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '6',
      form: {},
      rules: {
        expenseItem: [
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
        amount: [
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
          prop: 'expenseItem',
          label: vm.$t('PRODUCT.expenseItem'),
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
          prop: 'currency',
          label: vm.$t('ui.currency'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },

        {
          prop: 'amount',
          label: vm.$t('PRODUCT.amount'),
          visible: true,
          minWidth: 200,
          align: 'right',
          tooltip: true,
          padding: 50
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'attachment',
          label: vm.$t('ui.attachment'),
          visible: true,
          minWidth: 200,
          tooltip: true
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
        downFileUrl: '/sales/projectCost/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/projectCost/checkImportData',
        // 提交导入
        importUrl: '/sales/projectCost/importData',
        // 下载文件名
        fileName: 'Project Cost'
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
    },
    comTableList() {
      if (this.tableList.length > 1) {
        return [...this.tableList, { isTotal: '1' }]
      } else {
        return this.tableList
      }
    },
    comAmount() {
      const amountList = this.tableList.map((item) => item.amount)
      let total = 0
      amountList.forEach((amount) => {
        if (amount) {
          total += amount
        }
      })
      return total
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init(data = []) {
      const rows = JSON.parse(JSON.stringify(data))
      this.tableList = rows
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    reset() {
      const vm = this
      this.resetForm('form')
      this.tableList = []
      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
        vm.$refs.form && vm.$refs.form.clearValidate()
        this.form = {}
      }, 20)
    },
    handleAdd() {
      this.resetContentHandle()
      this.visible = true
    },
    closed() {
      this.resetContentHandle()
    },
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
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
    editContentHandle() {
      const vm = this
      const myFileIds = this.$refs.uploadRef.getFileIds()
      console.log(myFileIds)
      if (myFileIds === false) {
        return
      }
      vm.form = vm.$trimOfObj(vm.form)
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.form.commonFileList = myFileIds
          vm.form.currency = vm.formData.currency
          vm.form.currencyCode = vm.formData.currencyCode
          vm.form.currencyId = vm.formData.currencyId
          const params = JSON.parse(JSON.stringify(vm.form))
          vm.$set(vm.tableList, vm.editIndex, { ...params })
          vm.editIndex = undefined
          vm.form = {}
          // vm.resetContentHandle()
          vm.isContentEdit = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          vm.visible = false
        }
      })
    },
    addContentHandle() {
      const vm = this
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      vm.form = vm.$trimOfObj(vm.form)
      vm.form.commonFileList = myFileIds
      vm.isContentEdit = false
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.form.currency = vm.formData.currency
          vm.form.currencyCode = vm.formData.currencyCode
          vm.form.currencyId = vm.formData.currencyId
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
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
        vm.$refs.form && vm.$refs.form.clearValidate()
        this.form = {}
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
      if (!dataRow.picUserId) {
        this.resetContentHandle()
        return
      }
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
      this.$nextTick(() => {
        const { commonFileList } = vm.form
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList(commonFileList || [])
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    },
    updateTableList(e) {
      const { data } = e
      const newTableList = this.tableList.concat(data)
      this.tableList = newTableList
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    }
  }
}
</script>
