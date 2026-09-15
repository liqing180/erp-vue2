<template>
  <el-dialog
    v-dialogDrag
    :title="$t('approvalSkipOver.approvalSkipOverTitle')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('approvalSkipOver.skipOver')}`" prop="skipOver">
            <el-select
              v-model="form.skipOver"
              :prefix="0"
              class="form-wd"
              placeholder=""
              @change="returnChg"
              style="width: 100%"
            >
              <el-option
                v-for="item in returnOptions"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('approvalSkipOver.taskName')}`" prop="taskName">
            <el-input
              v-model="form.taskName"
              :title="!form.taskName ? '' : form.taskName"
              type="text"
              disabled
              class="form-wd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="false">
          <el-form-item :label="`${$t('approvalSkipOver.participant')}`" prop="participant">
            <el-select
              v-model="form.participant"
              :disabled="!form.return"
              class="form-wd log-msg-ellipsis"
              multiple
              placeholder=""
              style="width: 100%"
            >
              <el-option
                v-for="item in participantOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('approvalSkipOver.initiator')}`" prop="applyUserName">
            <el-input v-model="form.applyUserName" disabled type="text" class="form-wd" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`${$t('approvalSkipOver.reason')}`" prop="reason">
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
      <el-button type="primary" :loading="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import locale from './locale'
import optionsTitleFmt from '@/directive/optionsTitleFmt'
import { getSkipOverNodeMsgList, skipOverProcessToNode } from '@/api/bpm/bpm'

export default {
  directives: { optionsTitleFmt },
  props: {},
  data() {
    const vm = this
    return {
      visible: false,

      fullscreenLoading: false,

      returnNodeName: '',
      returnOptions: [],
      participantOptions: [],

      form: {
        participant: []
      },
      rules: {
        skipOver: [
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
            type: 'array',
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
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
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    handleOpen(row) {
      const vm = this
      this.reset()
      vm.participantOptions = []
      if (row) {
        this.form = Object.assign(this.form, row)
        vm.getReturnNodeMsgs(row.processInstance, row.taskId)
      }
      console.log(this.form, '==')
      this.visible = true
    },
    reset() {
      this.form = {
        skipOver: '',
        reason: '',
        participant: []
      }
      this.returnNodeName = ''

      this.resetForm('form')
    },
    returnChg(val) {
      const vm = this
      if (!val) {
        return []
      }
      const t = vm.returnOptions.find((item) => {
        return item.nodeId === val
      })
      if (!t) {
        return []
      }
      // const tObj = t.todoUserMap
      // const keys = Object.keys(tObj)
      vm.returnNodeName = t.nodeName
      // vm.$set(vm.form, 'participant', [])
      // vm.form.participant.length = 0
      // if (vm.$refs.createForm) {
      //   this.$nextTick(() => {
      //     vm.$refs.createForm.clearValidate('participant')
      //   })
      // }
      // vm.participantOptions.length = 0
      // // eslint-disable-next-line array-callback-return
      // keys.map((item) => {
      //   vm.participantOptions.push({ value: item, label: tObj[item] })
      // })
    },
    getReturnNodeMsgs(processInstance, taskId) {
      const vm = this
      vm.table_loading = true
      // eslint-disable-next-line no-undef
      getSkipOverNodeMsgList(processInstance, taskId)
        .then((res) => {
          vm.table_loading = false
          const results = res.data || []
          vm.returnOptions = results
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
      const vm = this

      if (vm.fullscreenLoading) {
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = {
            // participant: vm.form.participant.toString(),
            processInstance: vm.form.processInstance,
            skipOverReason: vm.form.reason,
            // returnNodeId: vm.form.return,
            // returnNodeName: vm.returnNodeName,
            skipOverNodeId: vm.form.skipOver,
            skipOverNodeName: vm.returnNodeName,
            taskId: vm.form.taskId,
            moduleKey: vm.form.moduleKey,
            businessId: vm.form.businessId
          }
          vm.fullscreenLoading = true
          skipOverProcessToNode(param)
            .then((res) => {
              vm.$message.success(
                `${vm
                  .$t('approvalSkipOver.skipOverSubmitSuccess')
                  .replace('$1', `[${vm.form.taskName}]`)}`
              )
              vm.back()
              vm.$emit('onSuccess')
              setTimeout(() => {
                vm.fullscreenLoading = false
              }, 1000)
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
