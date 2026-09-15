<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :visible.sync="open"
    width="1200px"
    append-to-body
    top="5vh"
    :title="$t('SALES.associationQuestion')"
    @close="close"
    class="dialog"
    :show-close="false"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="140px"
      class="item-form"
      :rules="rules"
      @submit.native.prevent
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('SALES.question')" prop="questionsId">
            <el-select
              v-model="form.questionsId"
              placeholder=""
              style="width: 100%"
              clearable
              @change="questionChange"
            >
              <el-option
                v-for="dict in selectList"
                :key="dict.customId"
                :label="dict.questionsName"
                :value="dict.customId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('SALES.option')"
            prop="optionId"
            :rules="{
              required: form.questionsId ? true : false,
              message: this.$t('ui.reqMsg'),
              trigger: ['change', 'blur']
            }"
          >
            <el-select
              v-model="form.optionId"
              placeholder=""
              style="width: 100%"
              clearable
              :disabled="!form.questionsId"
              @change="optionChange"
            >
              <el-option
                v-for="dict in options"
                :key="dict.customId"
                :label="dict.optionName"
                :value="dict.customId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('SALES.currentQuestion')"
            prop="isShow"
            :rules="{
              required: form.questionsId ? true : false,
              message: this.$t('ui.reqMsg'),
              trigger: ['change', 'blur']
            }"
          >
            <el-select
              v-model="form.isShow"
              placeholder=""
              style="width: 100%"
              clearable
              :disabled="!form.optionId"
            >
              <el-option
                v-for="dict in showList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-form>
        <el-button @click="cancel">{{ $t('uiBtn.cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ $t('uiBtn.save') }}</el-button>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    list: {
      type: Array,
      default: () => []
    },
    index: {
      type: [String, Number],
      default: undefined
    },
    childIndex: {
      type: [String, Number],
      default: undefined
    }
  },
  data() {
    return {
      open: false,
      rules: {
        questionsId: [
          {
            required: false,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        optionId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        isShow: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      form: {},
      // 问题
      selectList: [],
      // 选项
      options: [],
      showList: [
        { value: '1', label: this.$t('SALES.show') },
        { value: '0', label: this.$t('SALES.hide') }
      ]
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
  methods: {
    handleOpen(data = {}) {
      this.reset()
      this.handlerList()
      this.open = true
    },
    handlerList() {
      let selectList = []
      const { questionsList } = this.list[this.index]
      /**
       * 筛选条件
       * 1.问题类型为单选或多选
       * 2.排除掉问题本身，只能关联其它问题
       * 3.问题名称不能为空
       * 4.单选和多选的选项至少有一个不为空的可选项
       *  */
      selectList =
        questionsList.filter(
          (x) =>
            ['2', '3'].indexOf(x.answersCategory) !== -1 &&
            x.customId !== questionsList[this.childIndex].customId &&
            !!x.questionsName &&
            x.questionsName.trim() !== '' &&
            x.optionList.some((k) => !!k.optionName && k.optionName.trim() !== '')
        ) || []

      const { associationQuestion } = questionsList[this.childIndex]
      if (associationQuestion && associationQuestion.questionsId) {
        const arr = selectList.filter((x) => x.customId === associationQuestion.questionsId)
        const { optionList } = arr[0]
        this.options = optionList
        this.form = Object.assign(this.form, associationQuestion || {})
      }
      this.selectList = selectList
    },
    questionChange() {
      const { questionsId } = this.form
      if (questionsId) {
        const arr = this.selectList.filter((x) => x.customId === questionsId)
        const { optionList, questionsName } = arr[0]
        this.options = optionList
        this.$set(this.form, 'questionsName', questionsName)
      } else {
        this.options = []
        this.$set(this.form, 'optionName', undefined)
        this.$set(this.form, 'optionId', undefined)
        this.$set(this.form, 'isShow', undefined)
        this.$set(this.form, 'questionsId', undefined)
        this.$refs.form.clearValidate(['optionId', 'isShow'])
      }
    },
    optionChange() {
      const { optionId } = this.form
      const arr = this.options.filter((x) => x.customId === optionId)
      const { optionName } = arr[0]
      this.$set(this.form, 'optionName', optionName)
      if (!optionId) {
        this.$set(this.form, 'isShow', undefined)
        this.$set(this.form, 'optionName', undefined)
      }
    },
    reset() {
      this.form = {
        questionsName: undefined,
        questionsId: undefined,
        optionName: undefined,
        optionId: undefined,
        isShow: undefined
      }
      this.resetForm('form')
    },
    cancel() {
      this.open = false
    },
    close() {
      this.open = false
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          this.$emit('onSuccess', data)
          this.open = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
