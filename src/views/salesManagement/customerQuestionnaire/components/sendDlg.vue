<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :visible.sync="open"
    :title="$t('menu.send')"
    width="1200px"
    append-to-body
    top="5vh"
    @close="close"
    class="dialog"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('menu.questionnaireTemplate')" prop="questionnaireTemplateId">
            <CommonSelect
              :id="form.questionnaireTemplateId"
              :label="form.questionnaireTemplateName"
              idKey="questionnaireTemplateId"
              labelKey="questionnaireTemplateName"
              :options="questionnaireTemplateList"
              @change="questionnaireTemplateChange"
              filterable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('SALES.questionnaireNo')" prop="questionnaireTemplateNo">
            <el-input v-model="form.questionnaireTemplateNo" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item :label="$t('ui.description')" prop="description">
          <MyInput
            type="textarea"
            v-model="form.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            resize="none"
            show-word-limit
            :maxlength="3000"
            disabled
          ></MyInput>
        </el-form-item>
      </el-row>
    </el-form>

    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
    >
      <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </search-form>
    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      :row-class-name="'pointer'"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      :max-height="tableMaxHeight"
      v-table-tab
    >
      <el-table-column type="selection" width="55" :selectable="selectable" align="center">
      </el-table-column>
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
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
        <template slot="header" slot-scope="{ column }">
          <span v-if="item.prop === 'contactPerson'">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'contactPerson'">
            <span v-if="showContactPerson(scope.row)">{{ scope.row.customContactPersonName }}</span>
            <el-select
              style="width: 98%"
              v-model="scope.row.customContactPersonId"
              placeholder=""
              clearable
              v-else
            >
              <el-option
                v-for="dict in scope.row.bpBusinessContactPersonList"
                :key="dict.contactPersonId"
                :label="dict.contactPersonName"
                :value="dict.contactPersonId"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.prop === 'costProjectCode'">
            <span v-if="showContactPerson(scope.row)"></span>
            <CommonSelect
              v-else
              style="width: 98%"
              :id="scope.row.costProjectId"
              :label="scope.row.costProjectCode"
              :title="form.costProjectCode"
              idKey="costProjectId"
              labelKey="costProjectCode"
              :options="scope.row.costProjectList || []"
              @change="costProjectChange($event, scope.row)"
              size="mini"
            />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :saveKey="saveKey"
      :savePath="savePath"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <div slot="footer" class="dialog-footer">
      <el-form>
        <el-button @click="close">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" :disabled="selectList.length <= 0" @click="submit">{{
          $t('uiBtn.submit')
        }}</el-button>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryCanSelectQuestionnaireTemplateListNoPage,
  queryCanSelectCustomerListHavePage,
  sendCustomerQuestionnaire
} from '@/api/salesManagement/customerQuestionnaire'
import locale from '@/views/productManagement/lang/index'

export default {
  components: {},
  mixins: [pageMixin],
  dicts: ['bp_business_partner_status', 'approved_status', 'bp_customer_type', 'bp_customer_group'],
  data() {
    const vm = this
    return {
      open: false,
      saveKey: '2',
      savePath: 'salesMTable',
      searchFormKey: Date.now(),
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      rowIdKey: 'businessPartnerMainId',
      tableList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      selectList: [],
      columns: [
        {
          prop: 'businessPartnerName',
          label: vm.$t('SALES.customerName'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('SALES.customerCode'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerStatus',
          propBy: 'businessPartnerStatusStr',
          label: vm.$t('ui.status'),
          minWidth: 170,
          sortable: 'custom',
          visible: true,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'customerType',
          propBy: 'customerTypeStr',
          label: vm.$t('ui.customerType'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'customerGroup',
          propBy: 'customerGroupStr',
          label: vm.$t('ui.customerGroup'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'contactPerson',
          label: vm.$t('PRODUCT.contactPerson'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('SALES.projectCode'),
          minWidth: 200,
          visible: true,
          tooltip: true
        }
      ],
      form: {},
      // 表单校验
      rules: {
        questionnaireTemplateId: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.postName')),
            trigger: ['blur', 'change']
          }
        ]
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('SALES.customerSearch')}`,
          type: 'InputEle'
        }
      ],
      questionnaireTemplateList: []
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleOpen() {
      this.reset()
      this.open = true
      this.queryCanSelectQuestionnaireTemplateListNoPage()
      this.getList()
    },
    questionnaireTemplateChange(row) {
      if (row && JSON.stringify(row) !== '{}') {
        const { questionnaireTemplateId, questionnaireTemplateNo, description } = row
        this.$set(this.form, 'questionnaireTemplateId', questionnaireTemplateId)
        this.$set(this.form, 'questionnaireTemplateNo', questionnaireTemplateNo)
        this.$set(this.form, 'description', description)
      } else {
        this.form = {
          questionnaireTemplateId: undefined,
          questionnaireTemplateNo: undefined,
          description: undefined
        }
      }
    },
    showContactPerson(row) {
      const flag = this.selectList.some(
        (x) => x.businessPartnerMainId === row.businessPartnerMainId
      )
      return !flag
    },
    costProjectChange(data, row) {
      this.$set(row, 'costProjectName', data.costProjectName)
      this.$set(row, 'costProjectCode', data.costProjectCode)
      this.$set(row, 'costProjectId', data.costProjectId)
    },

    queryCanSelectQuestionnaireTemplateListNoPage() {
      queryCanSelectQuestionnaireTemplateListNoPage({}).then((res) => {
        this.questionnaireTemplateList = res.data || []
      })
    },
    getList() {
      this.selectList = []
      const vm = this
      const param = { ...this.queryParams, menuPerms: this.menuKey.customerQuestionnaire }
      param.needCostProject = '1'
      this.$trimOfObj(param)
      this.loading = true
      queryCanSelectCustomerListHavePage(param)
        .then((response) => {
          this.loading = false
          this.total = response.total
          const rows = response.rows
          rows.forEach((item) => {
            item.businessPartnerStatusStr = this.selectDictLabel(
              this.dict.type.bp_business_partner_status,
              item.businessPartnerStatus
            )
            item.approvedStatusStr = this.selectDictLabel(
              this.dict.type.approved_status,
              item.approvedStatus
            )
            item.customerTypeStr = this.selectDictLabel(
              this.dict.type.bp_customer_type,
              item.customerType
            )
            item.customerGroupStr = this.selectDictLabel(
              this.dict.type.bp_customer_group,
              item.customerGroup
            )

            const { bpBusinessContactPersonList } = item
            if (!bpBusinessContactPersonList || bpBusinessContactPersonList.length <= 0) {
              item.customContactPersonName = ''
              item.customContactPersonId = ''
            } else {
              const arr = bpBusinessContactPersonList.filter((x) => x.isDefault === '1')
              if (arr.length >= 1) {
                item.customContactPersonName = arr[0].contactPersonName
                item.customContactPersonId = arr[0].contactPersonId
              } else {
                item.customContactPersonName = ''
                item.customContactPersonId = ''
              }
            }
          })
          this.tableList = rows
          this.initColumnWidth()
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          // this.$nextTick(() => {
          //   this.selectList.forEach((row) => {
          //     this.tableList.forEach((item) => {
          //       if (row[this.rowIdKey] === item[this.rowIdKey]) {
          //         this.$refs.tables.toggleRowSelection(item, true)
          //       }
          //     })
          //   })
          // })
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.businessPartnerStatusStr = this.selectDictLabel(
          this.dict.type.bp_business_partner_status,
          item.businessPartnerStatus
        )
        item.approvedStatusStr = this.selectDictLabel(
          this.dict.type.approved_status,
          item.approvedStatus
        )
        item.customerTypeStr = this.selectDictLabel(
          this.dict.type.bp_customer_type,
          item.customerType
        )
        item.customerGroupStr = this.selectDictLabel(
          this.dict.type.bp_customer_group,
          item.customerGroup
        )
      })
    },
    initColumnWidth() {
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'contactPerson':
            item.fixedWidth = this.tableList.length > 0 ? 200 : undefined
            break
          case 'costProjectCode':
            item.fixedWidth = this.tableList.length > 0 ? 200 : undefined
            break
        }
      })
    },
    reset() {
      this.total = 0
      this.tableList = []
      this.single = true
      this.multiple = true
      this.selectList = []
      this.form = {
        questionnaireTemplateId: undefined,
        questionnaireTemplateNo: undefined,
        description: undefined
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selectList.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selectList.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selectList = vm.selectList.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 有则删除，无则添加
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selectList.length; i++) {
        if (vm.selectList[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selectList.splice(i, 1)
        }
      }
      vm.selectList.push(row)
    },
    handleRowClick(row) {
      const index = this.selectList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    },
    close() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.selectList = []
      this.tableList = []
      this.$refs.tables.clearSelection()
      this.$refs.tables.clearSort()
      this.open = false
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const bpBusinessPartnerList = JSON.parse(JSON.stringify(this.selectList))
          const flag = bpBusinessPartnerList.some((x) => !x.customContactPersonId)
          if (flag) {
            // this.$modal.msgError(this.$t('ui.reqMsg'))
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.contactPerson'))
            )
            return
          }
          bpBusinessPartnerList.forEach((x) => {
            x.bpBusinessContactPersonList.forEach((k) => {
              if (x.customContactPersonId === k.contactPersonId) {
                k.isSelect = '1'
              }
            })
          })
          const names = bpBusinessPartnerList.map((x) => x.businessPartnerName).join(', ')
          this.$modal
            .confirm(this.$t('SALES.customerConfirm').replace('$1', names))
            .then(() => {
              this.btnLoading = true
              return sendCustomerQuestionnaire({
                bpBusinessPartnerList,
                questionnaireTemplateId: this.form.questionnaireTemplateId
              })
            })
            .then((response) => {
              this.btnLoading = false
              this.$modal.msgSuccess(this.$t('SALES.customerSuccess'))
              this.open = false
              this.$emit('onSuccess')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
