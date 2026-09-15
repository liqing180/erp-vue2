<template>
  <el-dialog
    v-dialogDrag
    :title="dlgTitle"
    :visible.sync="visible"
    width="1200px"
    :close-on-click-modal="false"
    append-to-body
  >
    <div>
      <el-form
        :model="termForm"
        :rules="termFormRules"
        label-width="200px"
        :disabled="comDisFrom"
        ref="termForm"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.stageName')}`" prop="stageName">
              <MyInput
                type="textarea"
                v-model="termForm.stageName"
                :title="termForm.stageName"
                :autosize="{ minRows: 1, maxRows: 4 }"
                :disabled="comDisFrom"
                :maxlength="200"
                resize="none"
                show-word-limit
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.paymentPercentage')}`" prop="percentage">
              <el-input-number
                style="width: 100%"
                v-model="termForm.percentage"
                placeholder="1 - 100"
                controls-position="right"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                :min="1"
                :max="100"
                :disabled="termForm.isDisabledPercentage"
                @change="inputNumberChange('percentage')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('ui.stageDescription')">
              <MyInput
                type="textarea"
                v-model="termForm.stageDescription"
                :title="termForm.stageDescription"
                :autosize="{ minRows: 4, maxRows: 8 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        v-if="!comDisFrom"
        :disabled="fullscreenLoading"
        @click="submitForm"
        >{{ $t('uiBtn.save') }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CloseDialog',
  dicts: [
    'payment_term_detail_trigger',
    'payment_term_detail_due_basis',
    'payment_term_detail_trigger_civil_works_progress_milestone'
  ],
  components: {},
  props: {
    max: {
      type: Number,
      default: 0
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    isFormEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dlgTitle: '',
      visible: false,
      fullscreenLoading: false,
      termForm: {},
      termFormRules: {
        stageName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.stageName')),
            trigger: ['blur']
          }
        ],
        days: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        dueBasis: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        percentage: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
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
  methods: {
    handleOpen(row = {}) {
      this.reset()
      const { rowTimeId } = row
      if (rowTimeId) {
        this.dlgTitle = this.$t('uiBtn.edit')
        this.termForm = JSON.parse(JSON.stringify(row))
      } else {
        this.termForm.parentRowTimeId = row.parentRowTimeId
        this.termForm.isTopRow = row.isTopRow
        this.termForm.stage = row.stage
        this.termForm.isCivilWorks = row.isCivilWorks
        if (row.stage === '1') {
          this.termForm.downPayment = '1'
        }

        this.dlgTitle = this.$t('uiBtn.add')
      }
      this.visible = true
    },
    dueBasisChange() {
      this.$nextTick(() => {
        if (this.termForm.dueBasis === '1') {
          this.$set(this.termForm, 'days', 0)
          this.$refs.termForm.validateField('days')
        }
      })
    },
    reset() {
      this.termForm = {
        days: undefined,
        percentage: undefined,
        stage: undefined,
        dueBasis: undefined,
        trigger: undefined,
        // 如果子级输入了百分比，则父级不能编辑百分比
        isDisabledPercentage: undefined,
        triggerDescription: '',
        stageDescription: '',
        downPayment: '0',
        goodsIssue: '0'
      }
      this.resetForm('termForm')
    },
    back() {
      this.visible = false
    },
    inputNumberChange(code) {
      this.$refs.termForm.validateField(code)
    },
    submitForm() {
      this.$refs.termForm.validate((valid) => {
        if (valid) {
          const vm = this
          vm.fullscreenLoading = true
          vm.$refs.termForm.validate((valid) => {
            if (valid) {
              const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.termForm)))
              vm.$emit('onSuccess', param)
              this.back()
              vm.reset()
              setTimeout(() => {
                vm.fullscreenLoading = false
              }, 500)
              // vm.initDraggable()
            } else {
              vm.fullscreenLoading = false
            }
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
