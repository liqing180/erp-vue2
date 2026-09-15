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
          <li v-for="(child, childIndex) in item.questionsList" :key="childIndex">
            <div style="display: flex">
              <div style="width: 30px; font-weight: 700; flex-shrink: 0">
                {{ childIndex + 1 }}：
              </div>
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
                <el-radio-group v-model="child.customResult" v-if="child.answersCategory === '2'">
                  <el-radio
                    v-for="(radio, radioIndex) in child.optionList"
                    :key="radioIndex"
                    :label="radio.optionName"
                  ></el-radio>
                </el-radio-group>

                <el-checkbox-group
                  v-model="child.customResult"
                  v-if="child.answersCategory === '3'"
                >
                  <el-checkbox
                    v-for="(checkbox, checkboxIndex) in child.optionList"
                    :key="checkboxIndex"
                    :label="checkbox.optionName"
                  ></el-checkbox>
                </el-checkbox-group>

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
            <el-form-item style="margin-left: 30px" v-if="child.answersCategory !== '1'">
              <el-input
                style="width: 100%"
                :placeholder="isDisabled ? '' : $t('SALES.additionalInformation')"
                v-model="child.explanationAnswer"
                clearable
                :maxlength="500"
              />
            </el-form-item>
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
      list: []
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

<style lang="scss" scoped></style>
