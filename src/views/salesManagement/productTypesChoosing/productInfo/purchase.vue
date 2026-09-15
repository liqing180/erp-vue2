<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button @click="handleAddBtn" type="primary" icon="el-icon-plus" size="mini">{{
          $t('uiBtn.add')
        }}</el-button>
      </el-col>
    </el-row>

    <el-table
      border
      ref="tables"
      v-loading="loading"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      v-table-tab
    >
      <el-table-column
        v-if="false"
        :selectable="selectable"
        type="selection"
        key="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
        class-name="allowDrag"
      >
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
        <template slot="header" slot-scope="{ column }">
          <span
            v-if="
              ['supplierName', 'productName', 'description', 'estimatedPrice'].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'supplierName'">
            <template v-if="!comDisFrom">
              <el-input v-model="scope.row.supplierName" style="width: 98%" maxlength="200" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'productName'">
            <template v-if="!comDisFrom">
              <el-input v-model="scope.row.productName" style="width: 98%" maxlength="200" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'description'">
            <template v-if="!comDisFrom">
              <el-input v-model="scope.row.description" style="width: 98%" maxlength="200" />
            </template>
            <template v-else>
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
          </template>
          <template v-else-if="item.prop === 'estimatedPrice'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                style="width: 98%"
                v-model="scope.row.estimatedPrice"
                controls-position="right"
                :precision="2"
                :min="1"
                :max="999999"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="addBtnShow"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-form
      ref="form"
      class="mt20"
      :model="contentForm"
      @submit.native.prevent
      label-width="180px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('ui.remarks')" prop="remarks">
            <MyInput
              type="textarea"
              v-model="contentForm.remarks"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="3000"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="24">
        <el-form-item :label="`${$t('ui.attachment')}`" required>
          <myUpload ref="uploadRef" />
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'

export default {
  mixins: [pageMixin],
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    productList: {
      type: Array,
      default() {
        return []
      }
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateProps: {
      type: Array,
      default() {
        return []
      }
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || {}
      }
    },
    'formData.salesGoodsReturnProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesGoodsReturnProductList
        this.changeTableList()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '25',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        {
          prop: 'supplierName',
          label: vm.$t('SALES.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('SALES.productDescription'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'estimatedPrice',
          label: vm.$t('SALES.estimatedPrice'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      totalForm: {},
      tableList: [],
      rowIdKey: 'productId',
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      contentForm: {}
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    addBtnShow() {
      /* 项目类型的销售需求, 没有新增按钮 */
      if (this.comDisFrom) {
        return false
      }
      return true
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'supplierName':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'productName':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'estimatedPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'description':
            item.fixedWidth = vm.comDisFrom ? undefined : 220
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    getList() {
      return this.tableList
    },
    handleAddBtn() {
      this.tableList.push({})
      this.changeTableList()
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    // 行删除
    handleDelRow(index, row) {
      this.tableList.splice(index, 1)
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
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    async submit() {
      try {
        const myFileIds = this.$refs.uploadRef.getFileIds({
          required: true,
          requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
        })
        if (myFileIds === false) {
          return false
        }
        if (this.tableList.length <= 0) {
          this.$modal.msgError(this.$t('SALES.purchaseTableEmpty'))
          return false
        }
        const supplierName = this.tableList.find((item) => {
          return !this.$resultOfBoolean(item.supplierName)
        })
        if (supplierName) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.supplierName'))
          )
          return false
        }

        const productName = this.tableList.find((item) => {
          return !this.$resultOfBoolean(item.productName)
        })
        if (productName) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
          )
          return false
        }
        const description = this.tableList.find((item) => {
          return !this.$resultOfBoolean(item.description)
        })
        if (description) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.productDescription'))
          )
          return false
        }
        const estimatedPrice = this.tableList.find((item) => {
          return !this.$resultOfBoolean(item.estimatedPrice)
        })
        if (estimatedPrice) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.estimatedPrice'))
          )
          return false
        }
        await this.$refs.form.validate()
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.contentForm)))
        param.commonFileList = myFileIds
        return param
      } catch (err) {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-content {
  float: right;
  display: flex;
  justify-content: center;
  margin-right: 20px;
  // height: 40px;
  line-height: 28px;
  font-weight: 600;
  color: #606266;
  font-size: 12px;
}
</style>
