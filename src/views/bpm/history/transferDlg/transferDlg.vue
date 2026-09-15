<template>
  <el-dialog
    v-dialogDrag
    :title="$t('transfer.dlgTitle')"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('transfer.dlgTitle')}`" prop="picUserName">
            <SelectInput
              :value="form.picUserName"
              :title="form.picUserName"
              @clear="picUserNameClear"
              clearable
              @click="openPicTable"
              class="form-wd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('transfer.taskName')}`" prop="taskName">
            <el-input
              v-model="form.taskName"
              :title="!form.taskName ? '' : form.taskName"
              type="text"
              disabled
              class="form-wd"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="`${$t('transfer.initiator')}`" prop="applyUserName">
            <el-input v-model="form.applyUserName" disabled type="text" class="form-wd" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="`${$t('transfer.reason')}`" prop="reason">
            <MyInput
              type="textarea"
              v-model="form.reason"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :disabled="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>

    <selectPicTable ref="selectPicTable" @updatePic="updatePic" />
  </el-dialog>
</template>

<script>
import locale from './locale'
import optionsTitleFmt from '@/directive/optionsTitleFmt'
import { getReturnNodeMsgs, approvalTransfer } from '@/api/bpm/bpm'
import selectPicTable from '@/views/bpm/history/transferDlg/selectPicTable.vue'

export default {
  directives: { optionsTitleFmt },
  components: { selectPicTable },
  props: {},
  data() {
    const vm = this
    const participantVld = (rule, value, callback) => {
      if (!Array.isArray(value)) {
        callback()
      } else {
        const len = value.length
        if (len <= 0) {
          callback(new Error(vm.$t('transfer.participantReq')))
        } else {
          callback()
        }
      }
    }
    return {
      visible: false,

      fullscreenLoading: false,

      returnNodeName: '',
      returnOptions: [],
      participantOptions: [],
      returnOptionsTitle: `${vm.$t('transfer.returnNode')},${vm.$t('transfer.taskName')}`,

      form: {
        participant: []
      },
      rules: {
        picUserName: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        participant: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          },
          {
            validator: participantVld,
            trigger: ['change', 'blur']
          }
        ],
        reason: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      selectList: []
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    titleReturn() {
      const vm = this
      if (!vm.form.return) {
        return ''
      } else {
        const obj = vm.returnOptions[0].options.find((item) => {
          return item.nodeId === vm.form.return
        })

        if (obj) {
          return `${obj.nodeName}(${obj.nodeNum})`
        } else {
          return ''
        }
      }
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    // 清空pic
    picUserNameClear() {
      this.$set(this.form, 'picUserName', undefined)
      this.$set(this.form, 'picUserId', undefined)
      this.selectList = []
      // this.$set(this.form, 'mobilePhone', undefined)
      // this.$set(this.form, 'mobileCode', undefined)
      // this.$set(this.form, 'mobileNum', undefined)
    },
    // 打开pic弹窗
    openPicTable() {
      const selectList = JSON.parse(JSON.stringify(this.selectList))
      this.$refs.selectPicTable.handleOpen(selectList, this.form.todoUserIdList)
    },
    updatePic(data) {
      this.selectList = JSON.parse(JSON.stringify(data))
      const nickNames = data.map((x) => x.nickName).join(',')
      const userIds = data.map((x) => x.userId)
      // const { userName, userId, mobilePhone, mobileCode, mobileNum } = row
      this.$set(this.form, 'picUserName', nickNames)
      this.$set(this.form, 'picUserId', userIds)
      // this.$set(this.form, 'mobilePhone', mobilePhone)
      // this.$set(this.form, 'mobileCode', mobileCode)
      // this.$set(this.form, 'mobileNum', mobileNum)
    },
    handleOpen(row) {
      console.log(row)
      const vm = this
      this.reset()
      vm.participantOptions = []
      if (row) {
        this.form = Object.assign(this.form, row)
        // const processInstance = row.processInstance
        // vm.getReturnNodeMsgs(processInstance)
      }
      this.visible = true
    },
    reset() {
      this.form = {
        return: '',
        reason: '',
        picUserName: '',
        picUserId: '',
        mobilePhone: '',
        mobileCode: '',
        mobileNum: '',
        participant: []
      }
      this.selectList = []
      this.returnNodeName = ''

      this.resetForm('form')
    },
    returnChg(val) {
      const vm = this

      // participantOptions

      if (!val) {
        return []
      }

      const t = vm.returnOptions[0].options.find((item) => {
        return item.nodeId === val
      })

      if (!t) {
        return []
      }

      const tObj = t.todoUserMap
      const keys = Object.keys(tObj)

      vm.returnNodeName = t.nodeName

      vm.$set(vm.form, 'participant', [])
      vm.form.participant.length = 0
      if (vm.$refs.form) {
        this.$nextTick(() => {
          vm.$refs.form.clearValidate('participant')
        })
      }

      vm.participantOptions.length = 0

      // eslint-disable-next-line array-callback-return
      keys.map((item) => {
        vm.participantOptions.push({ value: item, label: tObj[item] })
      })
    },
    getReturnNodeMsgs(processInstance) {
      const vm = this
      vm.table_loading = true
      // eslint-disable-next-line no-undef
      getReturnNodeMsgs(processInstance)
        .then((res) => {
          const { data } = res
          vm.table_loading = false

          if (data.status === 200) {
            const results = data.msg || []
            vm.returnOptions = [
              {
                label: vm.returnOptionsTitle,
                options: results
              }
            ]
          } else {
            vm.$modal.msgError(data.message)
          }
        })
        .catch((err) => {
          vm.table_loading = false
          window.console.error(err)
        })
    },
    back() {
      this.visible = false
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          const param = {
            // participant: vm.form.participant.toString(),
            processInstance: vm.form.processInstance,
            reason: vm.form.reason,
            taskId: vm.form.taskId,
            moduleKey: vm.form.moduleKey,
            businessId: vm.form.businessId,
            userIdList: vm.form.picUserId
            // returnNodeId: vm.form.return,
            // returnNodeName: vm.returnNodeName
          }
          vm.fullscreenLoading = true
          approvalTransfer(param)
            .then((res) => {
              vm.$message.success(
                `${vm.$t('transfer.returnSubmitSuccess').replace('$1', `[${vm.form.taskName}]`)}`
              )
              vm.back()
              vm.$emit('onSuccess')
              vm.fullscreenLoading = false
            })
            .catch((err) => {
              vm.fullscreenLoading = false
              window.console.error(err)
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
