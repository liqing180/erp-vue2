<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <uomFromPage ref="FromPage" :propTimeId="timeId" />
    </template>
  </FormPageLayout>
</template>

<script>
import uomFromPage from './uomFromPage'

export default {
  name: 'AddSeaport',
  components: {
    uomFromPage
  },
  data() {
    return {
      timeId: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
  },
  activated() {
    this.timeId = this.$route.query.timeId
  },
  methods: {
    submitForm() {
      this.$refs.FromPage.submitForm()
    },
    cancel() {
      this.$refs.FromPage.cancel()
    }
  }
}
</script>
<style lang="scss"></style>
