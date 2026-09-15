<template>
  <ul>
    <li v-for="(item, index) in list" :key="index">
      <div style="font-size: 15px; font-weight: 700; word-break: break-word">
        {{ item.categoryName }}
      </div>
      <el-form
        :ref="'form_' + item.questionnaireTemplateCategoryId"
        :model="item"
        @submit.native.prevent
        class="ml20 mt10"
        :disabled="isDisabled"
      >
        <ul>
          <li
            v-for="(child, childIndex) in item.questionsList"
            :key="keys + '_' + childIndex"
            :class="{ 'custom-item': path === 'export' }"
          >
            <div v-if="isShowQuestion(item, child, childIndex)">
              <div style="display: flex">
                <!-- <div style="width: 30px; font-weight: 700; flex-shrink: 0">
                  {{
                    childIndex -
                    item.questionsList.slice(0, childIndex).filter((x) => !x.show).length +
                    1
                  }}：
                </div> -->
                <el-form-item
                  style="width: 100%"
                  :prop="`questionsList.${childIndex}.customResult`"
                  :rules="{
                    required: child.itMust === '1',
                    message: $t('ui.reqMsg'),
                    trigger: ['change', 'blur']
                  }"
                >
                  <div slot:label>
                    <div style="line-height: 28px">
                      <span style="font-weight: 700" v-if="path === 'export'"
                        >{{ childIndex + 1 }}：</span
                      >
                      <span style="font-weight: 700" v-else
                        >{{
                          childIndex -
                          item.questionsList.slice(0, childIndex).filter((x) => !x.show).length +
                          1
                        }}：</span
                      >
                      <span style="color: #ff4949; margin-right: 2px" v-if="child.itMust === '1'"
                        >*</span
                      >
                      {{ child.questionsName }}
                      <span v-if="child.explanation"
                        >({{ $t('SALES.explanation') }}： {{ child.explanation }})</span
                      >
                    </div>
                  </div>
                  <el-input
                    style="width: 100%"
                    placeholder=""
                    v-model="child.customResult"
                    clearable
                    :maxlength="500"
                    v-if="child.answersCategory === '1'"
                  />
                  <template v-if="path === 'export'">
                    <ul class="radio-card" v-if="child.answersCategory === '2'">
                      <li
                        :class="[
                          'radio-item',
                          child.customResult === radio.optionName ? 'radio-item-active' : ''
                        ]"
                        v-for="(radio, radioIndex) in child.optionList"
                        :key="radioIndex"
                      >
                        <div class="radio"></div>
                        <div>{{ radio.optionName }}</div>
                      </li>
                    </ul>

                    <ul class="checkbox-card" v-if="child.answersCategory === '3'">
                      <li
                        :class="[
                          'checkbox-item',
                          child.customResult &&
                          child.customResult.indexOf(checkbox.optionName) !== -1
                            ? 'checkbox-item-active'
                            : ''
                        ]"
                        v-for="(checkbox, checkboxIndex) in child.optionList"
                        :key="checkboxIndex"
                      >
                        <div class="checkbox"></div>
                        <div>{{ checkbox.optionName }}</div>
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    <el-radio-group
                      v-model="child.customResult"
                      v-if="child.answersCategory === '2'"
                      @input="selectChange(item, child)"
                    >
                      <el-radio
                        v-for="(radio, radioIndex) in child.optionList"
                        :key="radioIndex"
                        :label="radio.optionName"
                        class="select"
                      ></el-radio>
                    </el-radio-group>

                    <el-checkbox-group
                      v-model="child.customResult"
                      v-if="child.answersCategory === '3'"
                      @change="selectChange(item, child)"
                    >
                      <el-checkbox
                        v-for="(checkbox, checkboxIndex) in child.optionList"
                        :key="checkboxIndex"
                        :label="checkbox.optionName"
                        class="select"
                      ></el-checkbox>
                    </el-checkbox-group>
                  </template>

                  <el-date-picker
                    v-model="child.customResult"
                    type="date"
                    placeholder
                    :format="child.dateFormat"
                    value-format="timestamp"
                    v-if="child.answersCategory === '4'"
                  />

                  <el-date-picker
                    v-model="child.customResult"
                    value-format="timestamp"
                    type="daterange"
                    range-separator="-"
                    :start-placeholder="`${$t('ui.startDate')}`"
                    :end-placeholder="`${$t('ui.endDate')}`"
                    clearable
                    :format="child.dateFormat"
                    v-if="child.answersCategory === '5'"
                  ></el-date-picker>

                  <!-- <el-input
                  style="width: 100%"
                  :placeholder="$t('SALES.additionalInformation')"
                  v-model="child.explanationAnswer"
                  clearable
                  :maxlength="500"
                  v-if="child.answersCategory !== '1'"
                /> -->
                </el-form-item>
              </div>
              <el-form-item
                :prop="`questionsList.${childIndex}.explanationAnswer`"
                :rules="{
                  required: isRequired(item, child),
                  message: $t('ui.reqMsg'),
                  trigger: ['change', 'blur']
                }"
                v-if="child.answersCategory !== '1'"
              >
                <el-input
                  style="width: 100%"
                  :placeholder="isDisabled ? '' : $t('SALES.additionalInformation')"
                  v-model="child.explanationAnswer"
                  clearable
                  :maxlength="500"
                />
              </el-form-item>
            </div>
          </li>
        </ul>
      </el-form>
    </li>
  </ul>
</template>

<script>
import locale from '@/views/salesManagement/lang/index'

export default {
  data() {
    return {
      list: [],
      keys: Date.now()
    }
  },
  props: {
    categoryList: {
      type: Array,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: ''
    }
  },
  watch: {
    categoryList: {
      handler(newVal) {
        this.list = JSON.parse(JSON.stringify(newVal))
      },
      deep: true
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  methods: {
    init(data = []) {
      this.list = JSON.parse(JSON.stringify(data))
    },
    isShowQuestion(item, child, childIndex) {
      if (this.path === 'export') {
        return true
      }
      const { questionsList } = item
      const { associationQuestion } = child
      const { questionsId, optionName, isShow } = associationQuestion
      if (questionsId) {
        const arr = questionsList.filter((x) => x.customId === questionsId)
        const { customResult, answersCategory } = arr[0]
        if (answersCategory === '2') {
          if (customResult && optionName === customResult) {
            this.$set(child, 'show', isShow === '1')
            return isShow === '1'
          } else {
            this.$set(child, 'show', isShow === '0')
            return isShow === '0'
          }
        } else if (answersCategory === '3') {
          if (customResult && customResult.indexOf(optionName) !== -1) {
            this.$set(child, 'show', isShow === '1')
            return isShow === '1'
          } else {
            this.$set(child, 'show', isShow === '0')
            return isShow === '0'
          }
        }
      }
      this.$set(child, 'show', true)
      return true
    },
    selectChange() {
      this.list.forEach((x) => {
        x.questionsList.forEach((k, j) => {
          if (!k.show) {
            this.$nextTick(() => {
              this.$set(
                k,
                'customResult',
                ['3', '5'].indexOf(k.answersCategory) !== -1 ? [] : undefined
              )
            })
          }
        })
      })
      this.$nextTick(() => {
        this.keys = Date.now()
      })
    },
    isRequired(item, child) {
      let flag = false
      const { answersCategory, customResult, optionList } = child
      if (answersCategory === '2' && customResult) {
        flag = optionList.some((x) => x.optionName === customResult && x.isRequired === '1')
        flag = optionList.some((x) => x.optionName === customResult && x.customId === '1-1-1')
        return flag
      }
      if (answersCategory === '3' && customResult && customResult.length > 0) {
        flag = optionList.some(
          (x) => customResult.indexOf(x.optionName) !== -1 && x.isRequired === '1'
        )
        return flag
      }
      return flag
    },
    handler() {
      this.list.forEach((x) => {
        x.questionsList.forEach((k, j) => {
          if (k.answersCategory === '1') {
            k.explanationAnswer = k.customResult
          } else if (k.answersCategory === '2') {
            k.optionList.forEach((m) => {
              if (k.customResult && m.optionName === k.customResult) {
                m.isSelect = '1'
              } else {
                m.isSelect = '0'
              }
            })
          } else if (k.answersCategory === '3') {
            k.optionList.forEach((m) => {
              if (k.customResult && k.customResult.indexOf(m.optionName) !== -1) {
                m.isSelect = '1'
              } else {
                m.isSelect = '0'
              }
            })
          } else if (k.answersCategory === '4') {
            k.fixedTime = k.customResult
          } else if (k.answersCategory === '5') {
            if (k.customResult && k.customResult.length === 2) {
              k.startTime = k.customResult[0]
              k.endTime = k.customResult[1] + 86399000
            }
          }
        })
      })
      return this.list
    },
    async submitForm() {
      let flag = true
      for (let i = 0; i < this.list.length; i++) {
        try {
          // console.log(this.$refs['form_' + this.list[i].questionnaireTemplateCategoryId][0], '==')
          await this.$refs['form_' + this.list[i].questionnaireTemplateCategoryId][0].validate()
        } catch (err) {
          flag = false
          return false
        }

        if (i === this.list.length - 1 && flag) {
          return this.handler()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
  padding: 0;
}
.custom-item .select {
  /deep/ .el-radio__inner::after {
    background-color: initial !important;
  }
  /deep/ .el-checkbox__inner::after {
    border-color: #1890ff;
  }
}
.radio-card {
  display: flex;
  flex-wrap: wrap;
  .radio-item {
    display: flex;
    align-items: center;
    margin-right: 30px;
    .radio {
      border: 1px solid #dcdfe6;
      border-radius: 100%;
      width: 14px;
      height: 14px;
      margin-right: 10px;
      background-color: #f5f7fa;
      border-color: #dfe4ed;
    }
  }
  .radio-item-active {
    color: #1890ff;
    .radio {
      position: relative;
      border-color: #1890ff;
      background: #1890ff;
      &:after {
        width: 4px;
        height: 4px;
        border-radius: 100%;
        background-color: #ffffff;
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

.checkbox-card {
  display: flex;
  flex-wrap: wrap;
  .checkbox-item {
    display: flex;
    align-items: center;
    margin-right: 30px;
    .checkbox {
      display: inline-block;
      position: relative;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      margin-right: 10px;
      z-index: 1;
      background-color: #f5f7fa;
      border-color: #dfe4ed;
    }
  }

  .checkbox-item-active {
    color: #1890ff;
    .checkbox {
      position: relative;
      border-color: #1890ff;
      background: #1890ff;
      &:after {
        box-sizing: content-box;
        content: '';
        border: 1px solid #ffffff;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        width: 3px;
        transform-origin: center;
        transform: rotate(45deg) scaleY(1);
      }
    }
  }
}
</style>
