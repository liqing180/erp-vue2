<template>
  <el-dialog
    v-dialogDrag
    :title="$t('menu.acknowledge')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-table border ref="tables" v-loading="loading" :data="tableList" v-if="blanketOrder === '1'">
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
          <span v-if="['ackQty'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'ackQty'">
            <el-input-number
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              style="width: 96%"
              v-model="scope.row.ackQty"
              controls-position="right"
              :precision="scope.row.decimalNum"
              :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
              :max="scope.row.preQty || 0"
              :disabled="scope.row.preQty <= 0"
              @change="qtyChange(scope.row)"
            />
          </template>
          <template v-else-if="item.prop === 'preQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>

          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <el-form class="mt20" ref="form" :model="form" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.acknowledgedBy')}`" prop="acknowledgedBy">
            <el-input v-model="form.acknowledgedBy" type="text" class="form-wd" maxlength="50" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="`${$t('ui.dateAcknowledged')}`" prop="acknowledgedTime">
            <el-date-picker
              v-model="form.acknowledgedTime"
              :picker-options="PickerOptions"
              :format="fmtForYmd"
              value-format="timestamp"
              :style="{ width: '100%' }"
              placeholder
            ></el-date-picker>
            <!-- type="datetime"
            default-time="10:00:00" -->
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="`${$t('ui.remarks')}`" prop="acknowledgedRemarks">
            <MyInput
              type="textarea"
              v-model="form.acknowledgedRemarks"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`" required>
            <myUpload ref="uploadRef" :limit="9" :disabled="false" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  acknowledgeDeliveryOrder,
  queryDeliveryOrderById
} from '@/api/salesManagement/deliveryOrder'

import pageMixin from '@/mixins/tableMinx'

export default {
  mixins: [pageMixin],
  components: {},
  props: {},
  data() {
    const vm = this

    return {
      loading: false,
      saveKey: '9',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'preQty',
          label: vm.$t('SALES.qty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'ackQty',
          label: vm.$t('SALES.actualQuantityReceived'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        }
      ],
      visible: false,
      tableList: [],

      fullscreenLoading: false,
      form: {},
      rules: {
        acknowledgedBy: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        acknowledgedTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      PickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date() - 90 * 24 * 60 * 60 * 1000
          )
        }
      },
      deliveryOrderId: undefined,
      blanketOrder: undefined
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    getCurrentTime() {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
    handleOpen(row) {
      this.reset()
      this.blanketOrder = row.blanketOrder
      this.deliveryOrderId = row.deliveryOrderId
      if (this.blanketOrder === '1') {
        this.handleUpdate()
      }
      this.visible = true
    },
    handleUpdate() {
      queryDeliveryOrderById({ deliveryOrderId: this.deliveryOrderId }).then((res) => {
        const data = res.data || {}
        const deliveryOrderProductList = data.deliveryOrderProductList || []
        deliveryOrderProductList.forEach((x) => {
          this.$set(x, 'ackQty', x.preQty)
        })
        this.tableList = deliveryOrderProductList
      })
    },
    qtyChange(row) {},
    reset() {
      this.blanketOrder = undefined
      this.deliveryOrderId = undefined
      this.form = {
        acknowledgedBy: undefined,
        acknowledgedTime: undefined,
        acknowledgedRemarks: undefined
      }
      this.tableList = []
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      this.resetForm('form')
    },
    back() {
      this.visible = false
      this.closed()
    },
    closed() {
      this.fullscreenLoading = false
    },
    submitForm() {
      if (this.blanketOrder === '1') {
        const qtyReq = this.tableList.find((item) => {
          return !this.$resultOfBoolean(item.ackQty)
        })
        if (qtyReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.actualQuantityReceived'))
          )
          return
        }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          const param = {
            ...vm.form,
            deliveryOrderId: vm.deliveryOrderId
          }
          const fileIds = this.$refs.uploadRef.getFileIds({
            required: true,
            requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
          })
          if (fileIds === false) {
            return
          }
          param.commonFileListForAcknowledged = fileIds
          if (this.blanketOrder === '1') {
            param.deliveryOrderProductList = this.tableList
          }
          vm.fullscreenLoading = true
          acknowledgeDeliveryOrder(param)
            .then((res) => {
              if (res.code === 200) {
                vm.$emit('submitSuccess')
                this.back()
              }
              vm.fullscreenLoading = false
            })
            .catch(() => {
              vm.fullscreenLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-select-group__title .option-title-box {
  display: flex;
  flex-direction: row;
  // background-color: #aaaaaa;
  font-weight: bold;
  // color: #000000;
  color: #606266;
  font-size: 14px;
  margin-left: -20px;
  text-align: left;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .option-title-a {
    width: 85px;
  }
  .option-title-b {
    padding-left: 3px;
    padding-right: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 120px;
  }
  .option-title-c {
    width: 85px;
  }
}
</style>
<style scoped lang="scss">
.dialog-footer {
  margin-bottom: 20px;
}

.return-gp-box .el-select-dropdown__item {
  height: auto;
  white-space: wrap;
  overflow: auto;
  text-overflow: none;
}

.op-list {
  display: flex;
  flex-direction: row;
  text-align: left;
  margin-left: -20px;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .op-list-a {
    width: 85px;
  }
  .op-list-b {
    padding-left: 3px;
    padding-right: 3px;
    word-break: break-all;
    white-space: normal;
  }
  .op-list-c {
    width: 85px;
  }
}
</style>
