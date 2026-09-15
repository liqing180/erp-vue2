<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('SALES.closureReason')"
    :visible.sync="visible"
    width="1200px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('SALES.closedBy')}`" prop="closedBy">
            <el-input v-model="form.closedBy" :title="form.closedBy" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('SALES.dateClosed')}`" prop="dateClosed">
            <el-input :value="form.dateClosed" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.remarks')}`" prop="closedRemarks">
            <MyInput
              type="textarea"
              v-model="form.closedRemarks"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.reason')}`" prop="closedReason">
            <el-select v-model="form.closedReason" placeholder="" style="width: 100%" clearable>
              <el-option
                v-for="dict in dictData"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`">
            <myUpload ref="uploadRef" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      border
      ref="tables"
      :data="tableList"
      :max-height="tableMaxHeight"
      @sort-change="handleSortChange"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
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
          <template v-if="item.prop === 'qty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'returnedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'balanceQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-form class="mt20" :model="form" @submit.native.prevent label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`">
            <myUpload ref="uploadRef" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> -->

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submit"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  closedStoreIssueChit,
  queryStoreIssueChitById
} from '@/api/projectManagement/storeIssueChit'
import locale from '@/views/productManagement/lang/index'
import pageMixin from '@/mixins/tableMinx'
export default {
  name: 'closeDlg',
  mixins: [pageMixin],
  dicts: ['store_issue_chit_closed_reason'],
  props: {
    warehouseId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '15',
      savePath: 'projectMDlg',
      btnLoading: false,
      loading: false,
      rowIdKey: 'productId',
      tableList: [],
      visible: false,
      form: {},
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.sicQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('SALES.returnedQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'balanceQty',
          label: vm.$t('SALES.balanceQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }
      ],
      rules: {
        closedRemarks: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        closedReason: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      dictData: []
    }
  },

  computed: {},
  watch: {},
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  updated() {},
  methods: {
    async handleAdd(row) {
      this.reset()
      const data = await this.MyDictDataClass.getDictFn('store_issue_chit_closed_reason')
      this.dictData = data || []
      this.visible = true
      const { storeIssueChitId, storeIssueChitNo } = row
      this.$set(this.form, 'storeIssueChitId', storeIssueChitId)
      this.$set(this.form, 'storeIssueChitNo', storeIssueChitNo)
      this.getList()
    },
    getList() {
      queryStoreIssueChitById({ storeIssueChitId: this.form.storeIssueChitId })
        .then((response) => {
          const { storeIssueChitProductList } = response.data
          this.tableList = storeIssueChitProductList
          // this.tableList = storeIssueChitProductList.filter((x) => x.balanceQty && x.balanceQty > 0)
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          window.console.error(err)
        })
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    reset() {
      this.form = {
        closedRemarks: undefined,
        closedReason: undefined,
        closedBy: this.$store.state.user.nickName
      }
      this.tableList = []
      this.resetForm('form')
      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      }, 100)
    },
    closed() {
      this.reset()
    },
    async submit() {
      if (this.btnLoading) return
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      const valid = await this.$refs.form.validate().catch((err) => {
        return err
      })
      if (valid) {
        this.btnLoading = true
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
        param.commonFileList = myFileIds
        closedStoreIssueChit(param)
          .then((res) => {
            this.$modal.msgSuccess(
              this.$t('SALES.closeSuccess').replace('$1', param.storeIssueChitNo)
            )
            this.$emit('onSuccess')
            this.btnLoading = false

            this.handleBack()
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
