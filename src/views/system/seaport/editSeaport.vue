<template>
  <div>
    <FormPageLayout>
      <template v-slot:btn>
        <el-button type="primary" size="mini" @click="submitForm"
          >{{ $t('uiBtn.submit') }}
        </el-button>
        <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
      </template>
      <template v-slot:content>
        <uomFromPage ref="FromPage" :propRowId="rowId" :propTimeId="timeId" />
      </template>
    </FormPageLayout>
  </div>
</template>

<script>
import uomFromPage from './uomFromPage'

export default {
  name: 'EditSeaport',
  components: {
    uomFromPage
  },
  data() {
    return {
      timeId: undefined,
      rowId: undefined
    }
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
  },
  activated() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
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
