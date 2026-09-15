<template>
  <div class="customerQuestionnaire">
    <template v-if="customerQuestionnaireStatus === '1'">
      <div class="header">
        <img :src="require('@/assets/logo/logo_01.png')" class="logo" alt="" />
        <div style="margin: 0 300px">
          <div class="title">
            {{ previewForm.questionnaireTemplateName }}
          </div>
        </div>
      </div>
      <div class="desc mt10" v-if="previewForm.description">
        {{ previewForm.description }}
      </div>
      <paper ref="paper" class="mt20" />

      <div style="text-align: center">
        <el-button type="primary" style="width: 200px" @click="submit">{{
          $t('uiBtn.submit')
        }}</el-button>
      </div>
    </template>
    <template v-else-if="customerQuestionnaireStatus === 'ok'">
      <div class="flexCen" style="font-size: 25px; height: 100vh">
        {{ $t('SALES.writeSuccess1') }}
      </div>
    </template>
    <template v-else>
      <div class="flexCen" style="font-size: 25px; height: 100vh">
        {{ $t('SALES.questionnaireExpired') }}
      </div>
    </template>
  </div>
</template>

<script>
import locale from '@/views/salesManagement/lang/index'

import paper from '@/views/salesManagement/questionnaireTemplate/components/paper.vue'
import {
  externalQueryCustomerQuestionnaireById,
  externalCompletedCustomerQuestionnaire
} from '@/api/salesManagement/customerQuestionnaire'
export default {
  components: { paper },
  data() {
    return {
      query: {},
      previewForm: {},
      customerQuestionnaireStatus: ''
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
  created() {
    this.query = this.$route.query
    this.getInfo()
  },
  methods: {
    getInfo() {
      if (!this.query.id) return
      externalQueryCustomerQuestionnaireById({
        customerQuestionnaireId: this.query.id
      })
        .then((res) => {
          const { categoryList, ...params } = res.data
          this.customerQuestionnaireStatus = res.data.customerQuestionnaireStatus
          if (this.customerQuestionnaireStatus !== '1') return
          this.previewForm = params
          categoryList.forEach((x) => {
            x.questionsList &&
              x.questionsList.forEach((k) => {
                this.$set(k, 'customResult', k.explanationAnswer || undefined)
                this.$set(k, 'explanationAnswer', undefined)
                if (k.answersCategory === '1') {
                  this.$set(k, 'customResult', k.explanationAnswer || undefined)
                } else if (k.answersCategory === '2') {
                  const arr = k.optionList.filter((x) => x.isSelect === '1')
                  if (arr && arr.length > 0) {
                    this.$set(k, 'customResult', arr[0].optionName)
                  } else {
                    this.$set(k, 'customResult', undefined)
                  }
                } else if (k.answersCategory === '3') {
                  const arr = k.optionList.filter((x) => x.isSelect === '1')
                  if (arr && arr.length > 0) {
                    this.$set(
                      k,
                      'customResult',
                      arr.map((k) => k.optionName)
                    )
                  } else {
                    this.$set(k, 'customResult', [])
                  }
                } else if (k.answersCategory === '4') {
                  this.$set(k, 'customResult', k.fixedTime || undefined)
                } else if (k.answersCategory === '5') {
                  if (k.startTime && k.endTime) {
                    this.$set(k, 'customResult', [k.startTime, k.endTime - 86399000] || undefined)
                  } else {
                    this.$set(k, 'customResult', undefined)
                  }
                }
              })
          })
          this.$nextTick(() => {
            this.$refs.paper.init(categoryList)
          })
        })
        .catch(() => {})
    },
    async submit() {
      const params = JSON.parse(JSON.stringify(this.previewForm))
      const categoryList = await this.$refs.paper.submitForm()
      if (!categoryList) {
        return
      }
      params.categoryList = categoryList
      this.$modal
        .confirm(this.$t('SALES.writeConfirm'))
        .then(() => {
          return externalCompletedCustomerQuestionnaire(params)
        })
        .then((response) => {
          this.customerQuestionnaireStatus = 'ok'
          // this.$modal.msgSuccess(this.$t('SALES.writeSuccess1'))
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.customerQuestionnaire {
  padding: 20px;
  width: 1200px;
  margin: 0 auto;
}
.header {
  position: relative;
  text-align: center;
  word-break: break-word;
  min-height: 60px;

  .logo {
    position: absolute;
    top: -10px;
    left: -20px;
    width: 300px;
    height: 75px;
  }
  .title {
    font-size: 15px;
    font-weight: 700;
  }
}
</style>
