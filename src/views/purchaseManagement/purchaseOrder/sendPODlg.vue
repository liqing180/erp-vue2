<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.logisticsInformation')"
    :visible.sync="open"
    width="1100px"
    append-to-body
    @closed="closed"
  >
    <div class="flexStart">
      <strong style="font-size: 15px; margin-right: 16px">{{
        $t('PURCHASE.purchaseOrder')
      }}</strong>
      <svg-icon
        v-if="!comDisFrom"
        icon-class="add"
        @click="addRow"
        style="height: 30px; width: 30px; cursor: pointer; color: #606266"
      />
    </div>
    <div class="mt10">
      <el-table
        border
        ref="tables"
        v-loading="loading"
        :data="tableList"
        :max-height="tableMaxHeight"
        v-table-tab
      >
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
            <span v-if="['purchaseOrderNo', 'carrier'].includes(item.prop)">
              <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
            </span>
            <span v-else>{{ column.label }}</span>
          </template>
          <template slot-scope="scope">
            <template v-if="item.prop === 'purchaseOrderNo'">
              <el-select
                style="width: 98%"
                v-model="scope.row.purchaseOrderNo"
                :title="scope.row.purchaseOrderNo"
                placeholder=""
                v-if="!comDisFrom"
                @change="purchaseOrderNoChange(scope.row)"
              >
                <el-option
                  v-for="item in poRowList"
                  :key="item.purchaseOrderNo"
                  :label="item.purchaseOrderNo"
                  :value="item.purchaseOrderNo"
                >
                </el-option>
              </el-select>
              <template v-else>{{ scope.row.purchaseOrderNo }}</template>
            </template>
            <template v-else-if="item.prop === 'carrier'">
              <el-input
                v-if="!comDisFrom"
                style="width: 98%"
                :title="scope.row.carrier"
                v-model="scope.row.carrier"
                :maxlength="200"
              />
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <template v-else-if="item.prop === 'deliveryOrderNo'">
              <el-input
                v-if="!comDisFrom"
                style="width: 98%"
                :title="scope.row.deliveryOrderNo"
                v-model="scope.row.deliveryOrderNo"
                :maxlength="200"
              />
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <template v-else-if="item.prop === 'remarks'">
              <descriptionEditDlg
                v-model="scope.row.remarks"
                :maxlength="200"
                :disabled="comDisFrom"
              />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ui.action')"
          key="action"
          align="center"
          width="120"
          class-name="small-padding fixed-width"
          fixed="right"
          v-if="!comDisFrom"
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
      <div class="mt20">
        <el-form @submit.native.prevent label-width="140px">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('ui.remarks')">
                <MyInput
                  type="textarea"
                  v-model="form.basicRemarks"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  resize="none"
                  show-word-limit
                  :disabled="comDisFrom"
                  :maxlength="3000"
                ></MyInput>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="flexStart" style="border-top: 1px solid #ccc; padding-top: 10px; user-select: none">
      <strong style="font-size: 15px; margin-right: 16px">{{ $t('PURCHASE.secondStage') }}</strong>
      <el-switch
        v-model="form.isSecond"
        active-value="1"
        inactive-value="0"
        :disabled="true"
      ></el-switch>
    </div>
    <div class="mt20" v-if="form.isSecond === '1'">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" :disabled="comDisFrom">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('PURCHASE.shippingAgent')}`" prop="carrier">
              <el-input v-model="form.carrier" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('PURCHASE.billsOfLadingNo')}`" prop="billsOfLadingNo">
              <el-input v-model="form.billsOfLadingNo" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.remarks')}`" prop="secondRemarks">
              <MyInput
                type="textarea"
                v-model="form.secondRemarks"
                :autosize="{ minRows: 1, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.attachment')}`" required>
              <myUpload ref="uploadRef" :disabled="comDisFrom" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button
        type="primary"
        :disabled="tableList.length === 0"
        @click="submitForm"
        :loading="btnLoading"
        v-if="!comDisFrom"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { sendPO, queryCanSendPOList, queryPOSendMsg } from '@/api/purchaseManagement/purchaseOrder'
export default {
  name: 'SendPODlg',
  mixins: [pageMixin],
  props: {
    zoneForm: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    const vm = this
    return {
      saveKey: '10',
      savePath: 'purchaseMTable',
      loading: false,
      btnLoading: false,
      open: false,
      title: '',
      form: {},
      // 表单校验
      rules: {
        carrier: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        billsOfLadingNo: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      tableList: [],
      comDisFrom: false,
      poRowList: [],
      columns: [
        {
          prop: 'purchaseOrderNo',
          label: vm.$t('PURCHASE.purchaseOrder'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplier'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'carrier',
          label: vm.$t('PURCHASE.shippingAgent'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'deliveryOrderNo',
          label: vm.$t('PURCHASE.shippingNo'),
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
      ]
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
    reset() {
      this.form = {
        isSecond: '1',
        carrier: undefined,
        billsOfLadingNo: undefined,
        secondRemarks: undefined,
        requestedMobilePhone: undefined
      }
      this.tableList = []
      this.activeName = '1'
      this.resetForm('form')
      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      }, 100)
    },
    handleAdd(selectList) {
      this.reset()
      this.form = {
        isSecond: '1'
      }
      this.open = true
      this.comDisFrom = false
      const list = selectList || []
      this.tableList = list.map((item) => {
        return {
          purchaseOrderId: item.purchaseOrderId,
          purchaseOrderNo: item.purchaseOrderNo,
          businessPartnerName: item.businessPartnerName,
          businessPartnerId: item.businessPartnerId
        }
      })
      this.changeTableList()
      this.queryCanSendPOList()
      this.initColumnWidth()
    },
    handleEdit(row) {
      this.reset()
      this.open = true
      this.comDisFrom = true
      queryPOSendMsg({ purchaseOrderId: row.purchaseOrderId }).then((res) => {
        console.log(res)
        const data = res.data || {}
        this.form = data
        this.tableList = data.sendDetailList
        if (data.isSecond === '1') {
          setTimeout(() => {
            this.$refs.uploadRef.initFileList(data.commonFileList || [])
          }, 300)
        }
      })
    },

    queryCanSendPOList() {
      queryCanSendPOList({ menuPerms: this.menuKey.PO }).then((res) => {
        const data = res.data || []
        this.poRowList = data
      })
    },
    addRow() {
      this.tableList.push({})
    },
    purchaseOrderNoChange(row) {
      const curSelect = this.poRowList.find((item) => item.purchaseOrderNo === row.purchaseOrderNo)
      if (curSelect) {
        this.$set(row, 'purchaseOrderId', curSelect.purchaseOrderId)
        this.$set(row, 'businessPartnerName', curSelect.businessPartnerName)
        this.$set(row, 'businessPartnerId', curSelect.businessPartnerId)
      }
      this.changeTableList()
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'purchaseOrderNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'carrier':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'deliveryOrderNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.btnLoading = false
      this.reset()
    },
    // 行删除
    handleDelRow(index, row) {
      this.tableList.splice(index, 1)
      this.changeTableList()
    },
    changeTableList() {
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    /** 提交按钮 */
    async submitForm() {
      let param = { ...this.form }
      param.sendDetailList = this.tableList
      param = this.$trimOfObj(param)
      const validProduct = this.validProductList(param.sendDetailList)
      if (!validProduct) {
        this.collapseWarningForProductInfo = true
        return
      }

      const isSecond = this.form.isSecond
      let valid = true
      if (isSecond === '1') {
        valid = await this.$refs.form.validate().catch((err) => {
          return err
        })
      }
      if (valid) {
        if (isSecond === '1') {
          const myFileIds1 = this.$refs.uploadRef.getFileIds({
            required: true,
            requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
          })
          if (myFileIds1 === false) {
            return
          }
          param.commonFileList = myFileIds1
        }

        if (this.btnLoading) return
        this.btnLoading = true
        this.$modal
          .confirm(this.$t('PURCHASE.sendConfirm'))
          .then(() => {
            return sendPO(param)
          })
          .then((response) => {
            this.$emit('submitSuccess')
            this.$message.success(this.$t('PURCHASE.sendSuccess'))
            this.open = false
            this.btnLoading = false
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    },
    validProductList(detailList) {
      const valid = false
      const purchaseOrderNoReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.purchaseOrderNo)
      })
      if (purchaseOrderNoReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseOrderNo'))
        )
        return valid
      }

      const carrierReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.carrier)
      })
      if (carrierReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.shippingAgent'))
        )
        return valid
      }

      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
  }
  .con-right {
    margin-left: 10px;
    line-height: 0;
  }
}
</style>
