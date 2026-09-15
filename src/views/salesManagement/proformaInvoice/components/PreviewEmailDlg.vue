<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('SALES.previewEmail')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
  >
    <div>
      <el-form ref="createForm" :model="createForm" label-width="195px">
        <el-row v-loading="loading">
          <el-col :span="24">
            <el-form-item :label="`${$t('system.to')}`" prop="toUser">
              <el-input
                v-model="createForm.toUser"
                :title="createForm.toUser"
                disabled
                resize="none"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('system.cc')}`" prop="ccUser">
              <el-input
                v-model="createForm.ccUser"
                :title="createForm.ccUser"
                disabled
                class="form-wd"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('system.bcc')}`" prop="bccUser">
              <el-input
                v-model="createForm.bccUser"
                :title="createForm.bccUser"
                disabled
                class="form-wd"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="`${$t('system.subject')}`" prop="templateSubject">
              <MyInput
                type="textarea"
                v-model="createForm.templateSubject"
                :autosize="{ minRows: 1, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="100"
                disabled
              ></MyInput>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="`${$t('system.content')}`" prop="content">
              <emailEditor
                v-model="createForm.content"
                class="form-wd"
                :init-content="initContent"
                :config="config"
                readOnly
              ></emailEditor>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item :label="`${$t('system.sendMode')}`" prop="sentMode">
              <el-input
                :value="selectDictLabel(dict.type.email_send_mode, createForm.sentMode)"
                :maxlength="200"
                class="form-wd"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('system.sendStatus')}`" prop="sentStatus">
              <el-input
                :value="selectDictLabel(dict.type.email_send_status, createForm.sentStatus)"
                :maxlength="200"
                class="form-wd"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('system.sendBy')}`" prop="sendUserName">
              <el-input :value="createForm.sendUserName" disabled class="form-wd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('system.dateSend')}`" prop="sendTime">
              <el-date-picker
                v-model="createForm.sendTime"
                :editable="false"
                disabled
                type="date"
                :format="fmtForYmdhms"
                class="form-wd"
                placeholder
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col> -->
          <el-col
            :span="24"
            v-show="createForm && createForm.commonFileList && createForm.commonFileList.length > 0"
          >
            <el-form-item :label="`${$t('ui.attachment')}`">
              <myUpload ref="uploadRef" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { previewEmail } from '@/api/salesManagement/proformaInvoice'
import locale from '@/views/system/lang/index'
import emailEditor from '@/views/system/emailManagement/editor/editor'
export default {
  components: { emailEditor },
  dicts: ['email_send_status', 'email_send_mode'],
  props: {},
  data() {
    return {
      loading: false,
      visible: false,
      createForm: {},
      initContent: '',
      config: {
        width: '100%', // px
        height: 440, // px
        contentReadOnly: true,
        isShowToolBar: false,
        disabled: true,
        buttonsOption: [
          {
            componentName: 'BtnServTpl',
            isShow: true
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    handleOpen(params) {
      this.visible = true
      this.loading = true
      const vm = this
      vm.createForm = {}
      vm.initContent = ''
      previewEmail(params)
        .then((res) => {
          this.loading = false
          const results = res.data
          const { templateContent } = results
          vm.initContent = templateContent
          vm.createForm = results
          vm.$set(vm.createForm, 'content', results.templateContent)
          setTimeout(() => {
            vm.$refs.uploadRef && vm.$refs.uploadRef.initFileList(results.commonFileList)
          }, 300)
        })
        .catch(() => {
          this.loading = false
        })
    },
    getList() {},
    handleBack() {
      const vm = this
      vm.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
</style>
