<template>
  <div class="questionnaire-details" ref="box">
    <div class="left">
      <div class="header" :style="{ top: leftTop }">
        <div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :disabled="list.length >= 10"
            @click="handleAddCategory"
            v-if="!isDisabled"
            >{{ $t('SALES.addCategory') }}</el-button
          >
        </div>

        <div style="font-size: 14px; font-weight: 700">
          <span class="mr20">{{ $t('SALES.numberOfCategory') }}：{{ list.length }}</span>
          <span>{{ $t('SALES.questionNo') }}：{{ questionsCount }}</span>
        </div>
      </div>

      <div class="flex" style="position: relative; height: 40px; z-index: -9999; opacity: 0">
        <div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :disabled="list.length >= 10"
            @click="handleAddCategory"
            v-if="!isDisabled"
            >{{ $t('SALES.addCategory') }}</el-button
          >
        </div>

        <div>
          <span class="mr20">{{ $t('SALES.numberOfCategory') }}：{{ list.length }}</span>
          <span>{{ $t('SALES.questionNo') }}：{{ questionsCount }}</span>
        </div>
      </div>

      <ul class="mt10">
        <li
          class="item"
          v-for="(item, index) in list"
          :key="item.customId"
          :ref="'item_' + item.customId"
        >
          <el-form
            :ref="'form_' + item.customId"
            :model="item"
            label-width="auto"
            class="item-form"
            @submit.native.prevent
            :disabled="isDisabled"
          >
            <el-form-item
              :label="`${$t('SALES.categoryNumber').replace('$1', index + 1)}`"
              prop="categoryName"
              :rules="{
                required: true,
                message: $t('ui.reqMsg'),
                pattern: new RegExp(/^(?!(\s+$))/g),
                trigger: ['change', 'blur']
              }"
            >
              <div class="flexCen">
                <el-input v-model="item.categoryName" maxlength="500"></el-input>
                <el-button
                  icon="el-icon-delete"
                  type="text"
                  class="ml10"
                  style="font-size: 20px; color: #f56c6c; padding: 0"
                  @click="delItem(index, item)"
                  v-if="list.length !== 1 && !isDisabled"
                ></el-button>
              </div>
            </el-form-item>
          </el-form>
          <ul class="child-card">
            <li
              class="child-item"
              v-for="(child, childIndex) in item.questionsList"
              :key="child.customId"
            >
              <el-form
                :ref="'child_' + child.customId"
                :model="child"
                label-width="120px"
                @submit.native.prevent
              >
                <el-row>
                  <el-col :span="10">
                    <el-form-item
                      :label="`${$t('SALES.questionNumber').replace('$1', childIndex + 1)}`"
                      prop="questionsName"
                      :rules="{
                        required: true,
                        message: $t('ui.reqMsg'),
                        pattern: new RegExp(/^(?!(\s+$))/g),
                        trigger: ['change', 'blur']
                      }"
                    >
                      <el-input
                        v-model="child.questionsName"
                        maxlength="500"
                        :disabled="isDisabled"
                        @input="questionsNameChange(child, index)"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="14">
                    <el-form-item
                      :label="`${$t('SALES.answersCategory').replace('$1', childIndex + 1)}`"
                      prop="answersCategory"
                      :rules="{
                        required: true,
                        message: $t('ui.reqMsg'),
                        pattern: new RegExp(/^(?!(\s+$))/g),
                        trigger: ['change', 'blur']
                      }"
                    >
                      <div class="flexCen">
                        <el-select
                          v-model="child.answersCategory"
                          placeholder=""
                          style="width: 100%"
                          clearable
                          @change="answersCategoryChange(child, index)"
                          :disabled="isDisabled"
                        >
                          <el-option
                            v-for="dict in answersCategoryList"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                          ></el-option>
                        </el-select>
                        <el-button
                          :type="
                            childItem && childItem.customId === child.customId ? 'primary' : 'info'
                          "
                          class="mr10"
                          @click="detailQuestions(child, index, childIndex)"
                          >{{ $t('SALES.details') }}</el-button
                        >
                        <template v-if="!isDisabled">
                          <div class="action-btn flexCCen" v-if="item.questionsList.length < 20">
                            <i
                              class="el-icon-circle-plus pointer mr10"
                              style="font-size: 24px; border: none; margin-right: 5px"
                              @click.stop="addQuestions(child, index, childIndex)"
                            ></i>
                          </div>
                          <div class="action-btn flexCCen">
                            <i
                              class="el-icon-remove pointer"
                              style="font-size: 24px; border: none; color: #f56c6c"
                              @click.stop="delQuestions(child, index, childIndex)"
                              v-if="item.questionsList.length !== 1"
                            ></i>
                          </div>
                        </template>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="right">
      <div ref="content">
        <div class="content" ref="" :style="{ top: top }" v-show="index !== null">
          <div class="header">
            {{ $t('SALES.categoryNumber').replace('$1', index + 1) }}
            -
            {{ $t('SALES.questionNumber').replace('$1', childIndex + 1) }}
            -
            {{ $t('SALES.details') }}
          </div>

          <el-form
            class="mt20"
            ref="detailsForm"
            :model="childItem"
            label-width="0"
            @submit.native.prevent
            :disabled="isDisabled"
          >
            <el-form-item prop="itMust">
              <div class="flexStart">
                <div class="mr10" slot:label>
                  {{ $t('SALES.whetherItMustBeFilled') }}
                </div>
                <el-switch
                  v-model="childItem.itMust"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </div>
            </el-form-item>
            <el-form-item prop="associationQuestion" v-if="associationQuestionAuth">
              <div class="flexStart">
                <div class="mr10" slot:label>
                  {{ $t('SALES.associationQuestion') }}
                </div>
                <el-button type="primary" @click="openSetting">{{ $t('SALES.setting') }}</el-button>
              </div>
            </el-form-item>
            <el-form-item prop="explanation">
              <div slot:label>
                {{ $t('SALES.explanation') }}
              </div>
              <MyInput
                type="textarea"
                v-model="childItem.explanation"
                :autosize="{ minRows: 1, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="childItem.answersCategory === '1' ? 70 : 70"
              ></MyInput>
            </el-form-item>
            <el-form-item
              prop="dateFormat"
              v-if="childItem.answersCategory === '4' || childItem.answersCategory === '5'"
            >
              <div slot:label>
                {{ $t('SALES.dateFormat') }}
              </div>
              <el-select
                v-model="childItem.dateFormat"
                placeholder=""
                style="width: 100%"
                @change="dateFormatChange"
              >
                <el-option
                  v-for="dict in dict.type.sys_date_format"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="childItem.answersCategory === '2' || childItem.answersCategory === '3'"
            >
              <ul class="select-card drag-card" ref="dragCard">
                <li class="select-item select-item-header" :key="keyValue - 1">
                  <div class="select-item-box select-item-left">{{ $t('ui.sn') }}</div>
                  <div class="select-item-box select-item-center">
                    <span style="color: #ff4949; margin-right: 4px">*</span>{{ $t('SALES.option') }}
                  </div>
                  <div class="select-item-box select-item-required">
                    {{ $t('SALES.remarksMustBeFilledIn') }}
                  </div>
                  <div class="select-item-box select-item-right">{{ $t('ui.action') }}</div>
                </li>
                <li
                  class="select-item drag-item"
                  v-for="(item, index) in childItem.optionList"
                  :key="index + keyValue"
                >
                  <div class="select-item-box select-item-left allowDrag">{{ index + 1 }}</div>
                  <div class="select-item-box select-item-center">
                    <el-input v-model="item.optionName" maxlength="100"></el-input>
                  </div>
                  <div class="select-item-box select-item-required">
                    <el-switch
                      v-model="item.isRequired"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </div>
                  <div class="select-item-box select-item-right flexCen">
                    <template v-if="!isDisabled">
                      <div class="action-btn flexCCen" v-if="childItem.optionList.length < 10">
                        <i
                          class="el-icon-circle-plus pointer mr10"
                          style="font-size: 24px; border: none; margin-right: 5px"
                          @click="addOption(item, index)"
                        ></i>
                      </div>
                      <div class="action-btn flexCCen">
                        <i
                          class="el-icon-remove pointer"
                          style="font-size: 24px; border: none; color: #f56c6c"
                          @click="delOption(item, index)"
                          v-if="childItem.optionList.length !== 1"
                        ></i>
                      </div>
                    </template>
                  </div>
                </li>
              </ul>
            </el-form-item>
          </el-form>
        </div>

        <div style="position: relative; z-index: -9999; padding: 10px 20px; opacity: 0">
          <div class="header">
            {{ $t('SALES.categoryNumber').replace('$1', index + 1) }}
            -
            {{ $t('SALES.questionNumber').replace('$1', childIndex + 1) }}
            -
            {{ $t('SALES.details') }}
          </div>

          <el-form class="mt20" :model="childItem" label-width="0" @submit.native.prevent disabled>
            <el-form-item prop="itMust">
              <div class="flexStart">
                <div class="mr10" slot:label>
                  {{ $t('SALES.whetherItMustBeFilled') }}
                </div>
                <el-switch
                  v-model="childItem.itMust"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </div>
            </el-form-item>
            <el-form-item prop="associationQuestion" v-if="associationQuestionAuth">
              <div class="flexStart">
                <div class="mr10" slot:label>
                  {{ $t('SALES.associationQuestion') }}
                </div>
                <el-button type="primary">{{ $t('SALES.setting') }}</el-button>
              </div>
            </el-form-item>
            <el-form-item prop="explanation">
              <div slot:label>
                {{ $t('SALES.explanation') }}
              </div>
              <MyInput
                type="textarea"
                v-model="childItem.explanation"
                :autosize="{ minRows: 1, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="childItem.answersCategory === '1' ? 70 : 70"
              ></MyInput>
            </el-form-item>
            <el-form-item
              prop="dateFormat"
              v-if="childItem.answersCategory === '4' || childItem.answersCategory === '5'"
            >
              <div slot:label>
                {{ $t('SALES.dateFormat') }}
              </div>
              <el-select
                v-model="childItem.dateFormat"
                placeholder=""
                style="width: 100%"
                @change="dateFormatChange"
              >
                <el-option
                  v-for="dict in dict.type.sys_date_format"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="childItem.answersCategory === '2' || childItem.answersCategory === '3'"
            >
              <ul class="select-card">
                <li class="select-item select-item-header">
                  <div class="select-item-box select-item-left">{{ $t('ui.sn') }}</div>
                  <div class="select-item-box select-item-center">
                    <span style="color: #ff4949; margin-right: 4px">*</span>{{ $t('SALES.option') }}
                  </div>
                  <div class="select-item-box select-item-right">{{ $t('ui.action') }}</div>
                </li>
                <li class="select-item" v-for="(item, index) in childItem.optionList" :key="index">
                  <div class="select-item-box select-item-left">{{ index + 1 }}</div>
                  <div class="select-item-box select-item-center">
                    <el-input v-model="item.optionName" maxlength="100"></el-input>
                  </div>
                  <div class="select-item-box select-item-right flexCen">
                    <template v-if="!isDisabled">
                      <div class="action-btn flexCCen" v-if="childItem.optionList.length < 10">
                        <i
                          class="el-icon-circle-plus pointer mr10"
                          style="font-size: 24px; border: none; margin-right: 5px"
                        ></i>
                      </div>
                      <div class="action-btn flexCCen">
                        <i
                          class="el-icon-remove pointer"
                          style="font-size: 24px; border: none; color: #f56c6c"
                          v-if="childItem.optionList.length !== 1"
                        ></i>
                      </div>
                    </template>
                  </div>
                </li>
              </ul>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <settingDlg
      ref="settingDlg"
      :list="list"
      :index="index"
      :childIndex="childIndex"
      @onSuccess="updateSetting"
    />
  </div>
</template>

<script>
import settingDlg from './settingDlg.vue'
import Sortable from 'sortablejs'

export default {
  name: 'QuestionnaireDetails',
  dicts: ['sys_date_format'],
  components: { settingDlg },
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      list: [
        {
          customId: '1',
          categoryName: undefined,
          questionsList: [
            {
              customId: '1-1',
              questionsName: undefined,
              answersCategory: '1',
              itMust: '1',
              explanation: '',
              dateFormat: 'dd/MM/yyyy',
              optionList: [{ optionName: '', isRequired: '0', customId: '1-1-1' }],
              associationQuestion: {}
            }
          ]
        }
      ],
      index: null,
      childIndex: null,
      childItem: {},
      // 答案类型
      answersCategoryList: [
        {
          value: '1',
          label: this.$t('SALES.textField')
        },
        {
          value: '2',
          label: this.$t('SALES.singleOption')
        },
        {
          value: '3',
          label: this.$t('SALES.multiOption')
        },
        {
          value: '4',
          label: this.$t('SALES.dateSelection')
        },
        {
          value: '5',
          label: this.$t('SALES.dateInterval')
        }
      ],
      btnDisabled: false,
      oldScrollTop: 0,
      top: 0,
      leftTop: 0,
      sortableDom: undefined,
      keyValue: +new Date()
    }
  },
  computed: {
    questionsCount() {
      let count = 0
      this.list.forEach((x) => {
        count += x.questionsList.length
      })
      return count
    },
    associationQuestionAuth() {
      return this.checkPermi(['salesManagement:questionnaireTemplate:associationQuestion'])
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    initDraggable() {
      const that = this
      this.destroyDraggable()
      setTimeout(() => {
        const el = this.$refs.dragCard
        this.sortableDom = Sortable.create(el, {
          handle: '.allowDrag',
          animation: 100,
          ghostClass: 'blue-background-class',
          onEnd: (evt) => {
            if (evt.newIndex === 0 || evt.oldIndex === evt.newIndex) return that.keyValue++
            const { optionList } = that.childItem
            const targetRow = optionList.splice(evt.oldIndex - 1, 1)[0]
            optionList.splice(evt.newIndex - 1, 0, targetRow)
            this.$set(that.childItem, 'optionList', optionList)
            this.$set(that.list[that.index].questionsList, that.childIndex, that.childItem)
            that.keyValue++
          }
        })
      }, 300)
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },
    handleScroll() {
      if (this.$refs.content) {
        const box = this.$refs.box
        const content = this.$refs.content
        const boxHeight = box.offsetHeight
        const contentBox = content.getBoundingClientRect()
        const contentHeight = content.offsetHeight
        this.contentTop = contentBox.top
        if (150 - this.contentTop + contentHeight >= boxHeight) {
          return (this.top = boxHeight - contentHeight + 'px')
        }
        if (this.contentTop <= 150) {
          this.top = 150 - this.contentTop + 'px'
          this.leftTop = 150 - 16 - this.contentTop + 'px'
        } else {
          this.top = 0
          this.leftTop = 0
        }
      }
    },
    init(data) {
      this.list = JSON.parse(JSON.stringify(data))
      this.list.forEach((x) => {
        // x.customId = x.questionnaireTemplateCategoryId
        x.questionsList.forEach((k, j) => {
          // k.customId = k.questionnaireTemplateQuestionsId
          if (!k.dateFormat) {
            k.dateFormat = 'dd/MM/yyyy'
          }
          if (!k.optionList || k.optionList.length <= 0) {
            const timeStamp = JSON.stringify(Date.now())
            k.optionList = [{ optionName: '', isRequired: '0', customId: timeStamp + '_' + j }]
          }
        })
      })
    },
    // 新增分类
    handleAddCategory() {
      if (this.btnDisabled) return
      this.btnDisabled = true
      setTimeout(() => {
        this.btnDisabled = false
      }, 200)
      const timeStamp = JSON.stringify(Date.now())
      this.list.push({
        customId: timeStamp,
        categoryName: undefined,
        questionsList: [
          {
            customId: timeStamp,
            questionsName: undefined,
            answersCategory: '1',
            itMust: '1',
            explanation: '',
            dateFormat: 'dd/MM/yyyy',
            optionList: [{ optionName: '', isRequired: '0', customId: timeStamp }],
            associationQuestion: {}
          }
        ]
      })

      this.$nextTick(() => {
        const target = this.$refs['item_' + timeStamp][0]

        // 获取元素的位置信息
        const rect = target.getBoundingClientRect()
        // 视口尺寸
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        const vHeight = viewportHeight - 20
        // 判断元素是否在可视范围内
        // 元素顶部 < 视口高度 && 元素底部 > 0 && 元素左侧 < 视口宽度 && 元素右侧 > 0
        const isVisible =
          rect.bottom < vHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0
        if (!isVisible) {
          target.scrollIntoView(false)
        }
        this.handleScroll()
      })
    },
    // 删除分类
    delItem(index, item) {
      const flag = item.questionsList.some((x) => x.customId === this.childItem.customId)
      if (flag) {
        this.index = null
        this.childIndex = null
        this.childItem = {}
      }
      this.list.splice(index, 1)
      this.handleScroll()
    },
    // 问题明细
    detailQuestions(child, index, childIndex) {
      this.index = index
      this.childIndex = childIndex
      this.childItem = child
      if (child.answersCategory === '2' || child.answersCategory === '3') {
        this.initDraggable()
      }
    },
    // 新增问题
    addQuestions(child, index, childIndex) {
      if (this.btnDisabled) return
      this.btnDisabled = true
      setTimeout(() => {
        this.btnDisabled = false
      }, 200)
      const timeStamp = JSON.stringify(Date.now())
      const { questionsList } = this.list[index]
      questionsList.push({
        customId: timeStamp,
        questionsName: undefined,
        answersCategory: '1',
        itMust: '1',
        explanation: '',
        dateFormat: 'dd/MM/yyyy',
        optionList: [{ optionName: '', isRequired: '0', customId: timeStamp }],
        associationQuestion: {}
      })
      this.$set(this.list[index], 'questionsList', questionsList)

      this.$nextTick(() => {
        const target = this.$refs['child_' + timeStamp][0].$el
        // 获取元素的位置信息
        const rect = target.getBoundingClientRect()
        // 视口尺寸
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        const vHeight = viewportHeight - 20
        // 判断元素是否在可视范围内
        // 元素顶部 < 视口高度 && 元素底部 > 0 && 元素左侧 < 视口宽度 && 元素右侧 > 0
        const isVisible =
          rect.bottom < vHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0
        if (!isVisible) {
          target.scrollIntoView(false)
        }
      })
    },
    // 关联问题
    openSetting() {
      this.$refs.settingDlg.handleOpen()
    },
    // 更新关联问题
    updateSetting(data) {
      this.$set(this.list[this.index].questionsList[this.childIndex], 'associationQuestion', data)
    },
    // 删除问题
    delQuestions(child, index, childIndex) {
      if (['2', '3'].indexOf(child.answersCategory) !== -1) {
        if (child.optionList && child.optionList.length > 0) {
          this.associationQuestionHandler(child, index)
        }
      }
      if (child.customId === this.childItem.customId) {
        this.index = null
        this.childIndex = null
        this.childItem = {}
      }
      const { questionsList } = this.list[index]
      questionsList.splice(childIndex, 1)
      this.$set(this.list[index], 'questionsList', questionsList)
    },
    // 答案类型
    answersCategoryChange(child, index) {
      const { answersCategory } = child
      if (['2', '3'].indexOf(answersCategory) === -1) {
        this.associationQuestionHandler(child, index)
        const timeStamp = JSON.stringify(Date.now())
        this.$set(child, 'optionList', [{ optionName: '', isRequired: '0', customId: timeStamp }])
      }
    },
    // 时间格式
    dateFormatChange() {},
    // 新增选项
    addOption(item, index) {
      if (this.btnDisabled) return
      this.btnDisabled = true
      setTimeout(() => {
        this.btnDisabled = false
      }, 200)
      const timeStamp = JSON.stringify(Date.now())
      this.childItem.optionList.push({
        optionName: '',
        isRequired: '0',
        customId: timeStamp
      })
    },
    // 删除选项
    delOption(item, index) {
      this.associationQuestionHandler(this.childItem, this.index)
      this.childItem.optionList.splice(index, 1)
    },
    // 问题名称
    questionsNameChange(child, index) {
      const { answersCategory } = child
      if (['2', '3'].indexOf(answersCategory) !== -1) {
        this.associationQuestionHandler(child, index)
      }
    },
    // 删除问题或单选、多选里面的选项时，处理关联问题
    associationQuestionHandler(data, index) {
      const { optionList } = data
      const { questionsList } = this.list[index]
      questionsList.forEach((x) => {
        if (x.associationQuestion && !!x.associationQuestion.questionsId) {
          const flag = optionList.some((k) => k.customId === x.associationQuestion.optionId)
          if (flag) {
            x.associationQuestion = {}
          }
        }
      })
      console.log(questionsList)
    },
    // 表单校验
    checkForm() {
      for (let i = 0; i < this.list.length; i++) {
        for (let j = 0; j < this.list[i].questionsList.length; j++) {
          if (
            this.list[i].questionsList[j].answersCategory === '2' ||
            this.list[i].questionsList[j].answersCategory === '3'
          ) {
            if (this.list[i].questionsList[j].optionList.some((m) => m.optionName === '')) {
              this.$modal.msgError(this.$t('ui.reqMsg'))
              this.detailQuestions(this.list[i].questionsList[j], i, j)
              return false
            }
          }
          if (i === this.list.length - 1 && j === this.list[i].questionsList.length - 1) {
            return true
          }
        }
      }
    },
    async submitForm() {
      let flag = true
      for (let i = 0; i < this.list.length; i++) {
        try {
          await this.$refs['form_' + this.list[i].customId][0].validate()
          for (let j = 0; j < this.list[i].questionsList.length; j++) {
            try {
              await this.$refs['child_' + this.list[i].questionsList[j].customId][0].validate()
            } catch (err) {
              flag = false
              return false
            }
            if (i === this.list.length - 1 && j === this.list[i].questionsList.length - 1 && flag) {
              const status = this.checkForm()
              if (status) {
                return JSON.parse(JSON.stringify(this.list))
              } else {
                return false
              }
            }
          }
        } catch (err) {
          flag = false
          return false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.questionnaire-details {
  display: flex;
  height: 100%;
  min-height: 500px;
  overflow: hidden;
}
.left {
  position: relative;
  width: 65%;
  padding: 0 10px;
  margin-right: 10px;
  background-color: #fff;
  border-right: 1px solid #ccc;
  overflow: hidden;
  .header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    padding-right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    z-index: 1;
    box-shadow: 0 0 5px 0 rgba($color: #000000, $alpha: 0.3);
  }
}
.right {
  position: relative;
  width: 35%;
  min-width: 510px;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 20px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .header {
    font-size: 15px;
    font-weight: 700;
  }
}

.action-btn {
  width: 30px;
}

.select-card {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  .select-item {
    display: flex;
    height: 35px;
    line-height: 35px;

    .select-item-box {
      padding: 0 10px;
      text-align: center;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    .select-item-left {
      width: 60px;
      flex-shrink: 0;
    }
    .select-item-center {
      flex: 1;
      min-width: 100px;
    }
    .select-item-required {
      width: 200px;
      flex-shrink: 0;
    }
    .select-item-right {
      width: 100px;
      flex-shrink: 0;
    }
  }
  .select-item-header {
    font-weight: 700;
  }
}
</style>
