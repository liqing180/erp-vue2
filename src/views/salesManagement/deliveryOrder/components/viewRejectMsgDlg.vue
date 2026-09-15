<template>
  <el-dialog
    v-dialogDrag
    :title="$t('ui.details')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.rejectedReason')}`">
            <el-input
              :value="selectDictLabel(dict.type.sales_returned_reason, form.returnedReason)"
              disabled
              type="text"
              class="form-wd"
              maxlength="50"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="`${$t('ui.remarks')}`">
            <MyInput
              type="textarea"
              v-model="form.returnedRemarks"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
              disabled
            ></MyInput>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`">
            <myUpload ref="uploadRef" :limit="9" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryDetailRejectedMsg } from '@/api/salesManagement/deliveryOrder'
export default {
  dicts: ['sales_returned_reason'],
  components: {},
  props: {},
  data() {
    return {
      visible: false,
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
          return time.getTime() > Date.now()
        }
      },
      deliveryOrderId: undefined
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  methods: {
    handleOpen(row) {
      this.reset()
      queryDetailRejectedMsg({ deliveryOrderProductId: row.deliveryOrderProductId }).then((res) => {
        const data = res.data || {}
        this.form = data
        this.visible = true
        setTimeout(() => {
          this.$refs.uploadRef && this.$refs.uploadRef.initFileList(data.commonFileListForRejected)
        }, 300)
      })
    },
    reset() {
      this.form = {
        acknowledgedBy: undefined,
        acknowledgedTime: undefined,
        acknowledgedRemarks: undefined
      }
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      this.resetForm('form')
    },
    back() {
      this.visible = false
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
