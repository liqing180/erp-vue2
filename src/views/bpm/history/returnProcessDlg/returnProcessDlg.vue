<template>
  <el-dialog
    v-dialogDrag
    :title="$t('return.dlgTitle')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="195px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('return.return')}`" prop="return">
            <el-select
              v-model="form.return"
              :title="titleReturn"
              :prefix="0"
              class="form-wd"
              placeholder=""
              @change="returnChg"
              style="width: 100%"
            >
              <el-option-group
                v-for="group in returnOptions"
                :key="group.label"
                v-optionsTitleFmt
                :label="group.label"
                class="return-gp-box"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.nodeId"
                  :label="`${item.nodeName}(${item.nodeNum})`"
                  :value="item.nodeId"
                >
                  <div :key="item.nodeId" class="op-list">
                    <div class="op-list-a" :title="!item.nodeNum ? '' : item.nodeNum">
                      {{ item.nodeNum }}
                    </div>
                    <div class="op-list-b" :title="!item.nodeName ? '' : item.nodeName">
                      {{ item.nodeName }}
                    </div>
                    <!-- 【指派产品到仓库，总经理节点还能往回跳节点】https://www.tapd.cn/53232180/bugtrace/bugs/view?bug_id=1153232180001005742 -->
                    <!-- <div class="op-list-c" :title="!item.handleName?'':item.handleName">{{ item.handleName }}</div> -->
                  </div>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('return.taskName')}`" prop="taskName">
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
          <el-form-item :label="`${$t('return.participant')}`" prop="participant">
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
          <el-form-item :label="`${$t('return.initiator')}`" prop="applyUserName">
            <el-input v-model="form.applyUserName" disabled type="text" class="form-wd" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`${$t('return.reason')}`" prop="reason">
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
  </el-dialog>
</template>

<script>
import locale from './locale'
import optionsTitleFmt from '@/directive/optionsTitleFmt'
import { getReturnNodeMsgList, returnProcessToNode } from '@/api/bpm/bpm'

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
      // returnOptionsTitle: `${vm.$t('return.returnNode')},${vm.$t('return.taskName')},${vm.$t('return.handler')}`,
      returnOptionsTitle: `${vm.$t('return.returnNode')},${vm.$t('return.taskName')}`,

      form: {
        participant: []
      },
      rules: {
        return: [
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
    handleOpen(row) {
      const vm = this
      this.reset()
      vm.participantOptions = []
      if (row) {
        this.form = Object.assign(this.form, row)
        console.log(this.form, '==')
        vm.getReturnNodeMsgs(row.processInstance)
      }
      this.visible = true
    },
    reset() {
      this.form = {
        return: '',
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
      const t = vm.returnOptions[0].options.find((item) => {
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
    getReturnNodeMsgs(processInstance) {
      const vm = this
      vm.table_loading = true
      getReturnNodeMsgList(processInstance)
        .then((res) => {
          vm.table_loading = false
          const results = res.data || []
          vm.returnOptions = [
            {
              label: vm.returnOptionsTitle,
              options: results
            }
          ]
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
            skipOverReason: vm.form.reason,
            // reason: vm.form.reason,
            // returnNodeId: vm.form.return,
            // returnNodeName: vm.returnNodeName,
            skipOverNodeId: vm.form.return,
            skipOverNodeName: vm.returnNodeName,
            taskId: vm.form.taskId,
            moduleKey: vm.form.moduleKey,
            businessId: vm.form.businessId
          }
          vm.fullscreenLoading = true
          returnProcessToNode(param)
            .then((res) => {
              vm.$message.success(
                `${vm.$t('return.returnSubmitSuccess').replace('$1', `[${vm.form.taskName}]`)}`
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
