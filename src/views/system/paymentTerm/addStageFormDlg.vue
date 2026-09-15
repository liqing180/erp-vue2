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
      <div class="flex tip" v-if="isChildList">
        <div class="fs-0 mr5">💡</div>
        <div>{{ $t('system.parentPercentageCalculated') }}</div>
      </div>
      <el-form
        :model="termForm"
        :rules="termFormRules"
        label-width="140px"
        :disabled="comDisFrom"
        ref="termForm"
        class="mt20"
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
              <div style="position: relative">
                <el-input-number
                  style="width: 100%"
                  v-model="termForm.percentage"
                  placeholder="1 - 100"
                  controls-position="right"
                  :precision="0"
                  v-thousandSplit="{ precision: 0 }"
                  :min="1"
                  :max="isChildList ? 999999999 : 100"
                  :disabled="isChildList"
                  @change="inputNumberChange('percentage')"
                />

                <svg-icon
                  icon-class="lock_2"
                  class="ml5"
                  style="position: absolute; top: 7px; right: 5px; height: 15px; width: 15px"
                  v-if="isChildList"
                />
              </div>
              <div
                style="color: #b0aaa6; font-size: 12px; line-height: 20px; word-break: break-word"
                v-if="isChildList"
              >
                <div>{{ $t('system.automaticallyCalculated') }}</div>
                <div>{{ calculateFormula }}</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="`${$t('ui.trigger')}`"
              v-if="!termForm.isCivilWorks"
              key="trigger11"
            >
              <el-select
                v-model="termForm.trigger"
                clearable=""
                :disabled="isFormEdit"
                placeholder=""
                style="width: 100%"
              >
                <el-option
                  v-for="dict in dict.type.payment_term_detail_trigger"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="termForm.isCivilWorks" key="trigger22">
            <el-form-item :label="`${$t('ui.trigger')}`">
              <!-- ui.civilWorksProgressMilestone triggerCivilWorksProgressMilestone -->
              <el-select
                v-model="termForm.triggerCivilWorksProgressMilestone"
                clearable=""
                placeholder=""
                style="width: 100%"
                :disabled="isFormEdit"
              >
                <el-option
                  v-for="dict in dict.type
                    .payment_term_detail_trigger_civil_works_progress_milestone"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.stage')}`">
              <el-input :value="termForm.stage" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.dueBasis')}`" prop="dueBasis">
              <el-select
                v-model="termForm.dueBasis"
                @change="dueBasisChange"
                placeholder=""
                style="width: 100%"
                clearable=""
                :disabled="isFormEdit"
              >
                <el-option
                  v-for="dict in dict.type.payment_term_detail_due_basis"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.dueDays')}`" prop="days">
              <el-input-number
                style="width: 100%"
                v-model="termForm.days"
                controls-position="right"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                :min="0"
                :max="999"
                :disabled="termForm.dueBasis === '1' || isFormEdit"
                @change="inputNumberChange('days')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('ui.triggerDescription')">
              <MyInput
                type="textarea"
                v-model="termForm.triggerDescription"
                :title="termForm.triggerDescription"
                :autosize="{ minRows: 4, maxRows: 8 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
                :disabled="isFormEdit"
              ></MyInput>
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
        <el-row>
          <el-col :span="8" v-if="termForm.isTopRow">
            <el-form-item :label="`${$t('ui.downPayment')}`">
              <el-switch
                v-model="termForm.downPayment"
                active-value="1"
                inactive-value="0"
                :disabled="isFormEdit"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.goodsIssue')}`">
              <el-switch
                v-model="termForm.goodsIssue"
                active-value="1"
                inactive-value="0"
                :disabled="isFormEdit"
              ></el-switch>
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
            trigger: ['change', 'blur']
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
    },
    // 是否存在子级
    isChildList() {
      return this.termForm.childList && this.termForm.childList.length > 0
    },
    calculateFormula() {
      const { percentage, childList } = this.termForm
      let str = '('
      childList.forEach((item) => {
        if (item.percentage) {
          str += item.percentage + '%+'
        }
      })

      str = str.substring(0, str.length - 1)
      str += `=${percentage}%)`
      return str
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

.tip {
  color: #409eff;
  // font-weight: 700;
  padding: 10px 20px;
  background: #e6f7ff;
  border-radius: 5px;
  border: 2px solid #bbe6ff;
  word-break: break-word;
}
</style>
