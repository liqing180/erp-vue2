<template>
  <div class="email-setting-container">
    <!-- 1. 邮件配置区域 -->
    <div class="config-section">
      <el-form
        :model="piEmailFrom"
        :rules="rules"
        ref="emailForm"
        label-position="top"
        :disabled="comDisFrom"
      >
        <div class="flex">
          <div style="width: 330px">
            <!-- 发送方式 (单选框) -->
            <el-form-item prop="deliveryMethod" :class="[isModified('deliveryMethod')]">
              <template slot="label">
                {{ $t('SALES.deliveryMethod') }}
                <el-tooltip placement="top">
                  <div slot="content">
                    <div>{{ $t('SALES.donSendTip') }}</div>
                    <div>{{ $t('SALES.autoSendTip') }}</div>
                  </div>
                  <i
                    class="el-icon-info"
                    style="color: #409eff; margin-left: 4px; cursor: pointer; font-size: 14px"
                  ></i>
                </el-tooltip>
              </template>
              <el-radio-group v-model="piEmailFrom.deliveryMethod" class="w100">
                <div class="radio-box w100">
                  <div
                    class="radio-item"
                    :class="{ 'radio-item-active': piEmailFrom.deliveryMethod === 'DONT_SEND' }"
                    @click="deliveryMethodClick('DONT_SEND')"
                  >
                    <el-radio label="DONT_SEND">{{ $t('SALES.donSend') }}</el-radio>
                  </div>
                  <div
                    class="radio-item"
                    :class="{ 'radio-item-active': piEmailFrom.deliveryMethod === 'AUTO_SEND' }"
                    @click="deliveryMethodClick('AUTO_SEND')"
                  >
                    <el-radio label="AUTO_SEND">{{ $t('SALES.autoSend') }}</el-radio>
                  </div>
                </div>
              </el-radio-group>
            </el-form-item>

            <!-- 附上 PDF (下拉选择) -->
            <el-form-item
              :label="$t('SALES.attachPDF')"
              prop="attachPdfId"
              :rules="[
                {
                  required: false,
                  // required: piEmailFrom.deliveryMethod === 'AUTO_SEND',
                  message: this.$t('ui.reqMsg'),
                  trigger: 'change'
                }
              ]"
            >
              <ComparisonInput
                v-if="isModified(['attachPdfId'])"
                :beforeValue="getBeforeValue(['attachPdfId'])"
                :afterValue="getAfterValue(['attachPdfId'], piEmailFrom.attachPdfId)"
              />
              <el-select
                v-else
                v-model="piEmailFrom.attachPdfId"
                placeholder=""
                style="width: 100%"
              >
                <el-option
                  v-for="item in proformaInvoiceOptions"
                  :key="item.proformaInvoiceId"
                  :label="item.text"
                  :value="item.proformaInvoiceId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-1 form-box">
            <el-row :gutter="40">
              <!-- 左列 -->
              <el-col :span="12">
                <!-- 接收人来源 -->
                <el-form-item
                  :label="$t('SALES.recipientSource')"
                  prop="recipientSource"
                  :rules="[
                    {
                      required: piEmailFrom.deliveryMethod === 'AUTO_SEND',
                      message: this.$t('ui.reqMsg'),
                      trigger: 'change'
                    }
                  ]"
                >
                  <ComparisonInput
                    v-if="isModified(['recipientSource'])"
                    :beforeValue="getBeforeValue(['recipientSource'])"
                    :afterValue="getAfterValue(['recipientSource'], piEmailFrom.recipientSource)"
                  />
                  <el-select
                    v-else
                    v-model="piEmailFrom.recipientSource"
                    placeholder=""
                    style="width: 100%"
                    @change="recipientSourceChange"
                  >
                    <el-option
                      v-for="item in recipientSourceOptions"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- 发送给 (下拉并支持搜索/输入) -->
                <el-form-item
                  :label="$t('SALES.TO')"
                  prop="manualEmail"
                  :rules="[
                    {
                      required: piEmailFrom.deliveryMethod === 'AUTO_SEND',
                      message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.email')),
                      trigger: ['blur', 'change']
                    },
                    {
                      type: 'email',
                      validator: isEmail,
                      trigger: ['blur', 'change']
                    }
                  ]"
                  v-if="piEmailFrom.recipientSource === 'MANUAL'"
                  key="email11"
                  :class="[isModified('emailRecipientTo')]"
                >
                  <el-input
                    v-model.trim="piEmailFrom.manualEmail"
                    :title="piEmailFrom.manualEmail"
                    :disabled="comDisFrom"
                    maxlength="50"
                    @change="manualEmailChange"
                  />
                </el-form-item>
                <el-form-item
                  v-else
                  key="email22"
                  :label="$t('SALES.TO')"
                  prop="toRecipientList"
                  :rules="[
                    {
                      type: 'array',
                      required: piEmailFrom.deliveryMethod === 'AUTO_SEND',
                      message: this.$t('ui.reqMsg'),
                      trigger: 'change'
                    }
                  ]"
                  :class="[isModified('emailRecipientTo')]"
                >
                  <el-select
                    v-model="piEmailFrom.toRecipientList"
                    multiple
                    filterable
                    default-first-option
                    placeholder=""
                    style="width: 100%"
                    value-key="sourceId"
                  >
                    <el-option
                      v-for="item in getTOEmailOptions(piEmailFrom.recipientSource)"
                      :key="item.sourceId"
                      :label="item.showLabel"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 右列 -->
              <el-col :span="12">
                <!-- 邮件模板 -->
                <el-form-item
                  :label="$t('SALES.emailTemplate')"
                  prop="templateId"
                  :rules="[
                    {
                      required: piEmailFrom.deliveryMethod === 'AUTO_SEND',
                      message: this.$t('ui.reqMsg'),
                      trigger: 'change'
                    }
                  ]"
                >
                  <ComparisonInput
                    v-if="isModified(['templateId'])"
                    :beforeValue="getBeforeValue(['templateId'])"
                    :afterValue="getAfterValue(['templateId'], piEmailFrom.templateNo)"
                  />
                  <el-select
                    v-else
                    v-model="piEmailFrom.templateId"
                    placeholder=""
                    style="width: 100%"
                    @change="templateIdChange"
                  >
                    <el-option
                      v-for="item in templateOptions"
                      :key="item.id"
                      :label="item.templateNo"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- 抄送 (下拉并支持搜索/输入) -->
                <el-form-item :label="$t('SALES.CC')" :class="[isModified('emailRecipientCC')]">
                  <el-select
                    v-model="piEmailFrom.ccRecipientList"
                    multiple
                    filterable
                    default-first-option
                    style="width: 100%"
                    placeholder=""
                    value-key="sourceId"
                  >
                    <el-option
                      v-for="item in CCEmailOptions"
                      :key="item.sourceId"
                      :label="item.showLabel"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item :label="`${$t('SALES.additionalAttachments')}`">
                  <myUpload
                    ref="uploadRef"
                    :disabled="comDisFrom"
                    :modifyHighlight="modifyHighlight"
                    :updateFileList="updateFileList"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div class="mt10" v-if="formData.documentId">
              <div class="fr">
                <el-form>
                  <el-button type="primary" size="medium" plain @click="handlePreview">{{
                    $t('SALES.previewEmail')
                  }}</el-button>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>

    <!-- 2. 邮件摘要区域 -->
    <div class="summary-section">
      <div class="section-title">{{ $t('SALES.emailSummary') }}</div>
      <div class="summary-content">
        <div>
          <div class="summary-item">
            <div class="label">{{ $t('SALES.PDFVersion') }}</div>
            <div class="value">
              {{
                (
                  proformaInvoiceOptions.find(
                    (x) => x.proformaInvoiceId === piEmailFrom.attachPdfId
                  ) || {}
                ).text
              }}
            </div>
          </div>
        </div>
        <div class="split-line"></div>
        <div>
          <div class="summary-item">
            <div class="label">{{ $t('SALES.emailTemplate') }}</div>
            <div class="value">{{ piEmailFrom.templateNo }}</div>
          </div>
        </div>
        <div class="split-line"></div>
        <div>
          <div class="summary-item">
            <div class="label">{{ $t('SALES.recipients') }}</div>
            <div class="value">{{ comShowTOAndCCCount }}</div>
          </div>
        </div>
        <div class="split-line"></div>
        <div>
          <div class="summary-item">
            <div class="label">{{ $t('SALES.lastSentTime') }}</div>
            <div class="value">{{ parseTime(summaryData.lastSendTime, fmtForYmdhms) }}</div>
          </div>
        </div>
        <div class="split-line"></div>
        <div>
          <div class="summary-item">
            <div class="label">{{ $t('SALES.sentBy') }}</div>
            <div class="value">{{ summaryData.sendUserName }}</div>
          </div>
        </div>
        <div class="split-line"></div>
        <div>
          <div class="summary-item">
            <div class="label">{{ $t('SALES.totalSendCount') }}</div>
            <div class="value">{{ summaryData.totalSendCount }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 邮件历史记录 -->
    <div class="history-section mt20" v-if="emailHistoryList.length > 0">
      <div class="section-title">{{ $t('SALES.emailHistory') }}</div>
      <el-table :data="emailHistoryList" style="width: 100%">
        <el-table-column
          :label="$t('SALES.sendTime')"
          prop="sendTime"
          min-width="160"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.sendTime, fmtForYmdhms) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('SALES.deliveryMethod')"
          prop="deliveryMethod"
          min-width="140"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ selectDictLabel(dict.type.email_send_mode, scope.row.deliveryMethod) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ui.status')" prop="status" width="120" align="center">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.email_send_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('SALES.sentBy')"
          prop="sentBy"
          min-width="140"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('SALES.recipients')"
          prop="recipientSummary"
          min-width="140"
          align="center"
        >
          <!-- <template slot-scope="scope"> </template> -->
        </el-table-column>
        <el-table-column
          :label="$t('SALES.sendCount')"
          prop="sendCount"
          min-width="140"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('SALES.failedReason')"
          prop="failedReason"
          min-width="180"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
    <PreviewEmailDlg ref="PreviewEmailDlg" />
  </div>
</template>

<script>
import PreviewEmailDlg from './PreviewEmailDlg.vue'
export default {
  dicts: ['email_send_status', 'email_send_mode'],
  name: 'EmailSetting',
  components: {
    PreviewEmailDlg
  },

  props: {
    comDisFrom: Boolean,
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    piEmailFromData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    initEmailFileList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    piEmailFromData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.piEmailFrom = newValue || {}
      }
    },
    'piEmailFrom.deliveryMethod': {
      immediate: true,
      handler(newValue) {
        this.$nextTick(() => {
          this.$refs.emailForm?.clearValidate()
        })
      }
    },
    initEmailFileList: {
      immediate: true,
      handler: function () {
        this.initFileList(this.initEmailFileList)
      }
    }
  },
  data() {
    return {
      // 表单数据
      piEmailFrom: {},
      // 表单校验规则 (对应图1文档的 必填项)
      rules: {
        deliveryMethod: [{ required: true, message: this.$t('ui.reqMsg'), trigger: 'change' }]
      }
    }
  },
  computed: {
    basicUpdateMsgList() {
      return this.piEmailFrom.updateMsgList || []
    },
    comShowTOAndCCCount() {
      let toCount = 0
      let ccCount = 0
      let showStr = ''
      if (this.piEmailFrom.recipientSource === 'MANUAL') {
        if (this.piEmailFrom.manualEmail) {
          toCount = 1
        }
      } else {
        toCount = (this.piEmailFrom.toRecipientList || []).length
      }
      ccCount = (this.piEmailFrom.ccRecipientList || []).length
      // if (toCount) {
      showStr += `${toCount} To`
      // }
      // if (toCount && ccCount) {
      showStr += ' · '
      // }
      // if (ccCount) {
      showStr += `${ccCount} CC`
      // }
      return showStr
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    summaryData() {
      return this.piEmailFrom.emailSummary || {}
    },
    emailHistoryList() {
      // return [{}]
      return this.piEmailFrom.emailHistoryList || []
    },
    recipientSourceOptions() {
      const emailOptions = this.piEmailFrom.emailOptions || {}
      const recipientSourceList = emailOptions.recipientSourceList || []
      return recipientSourceList
    },
    proformaInvoiceOptions() {
      const emailOptions = this.piEmailFrom.emailOptions || {}
      const proformaInvoiceList = emailOptions.proformaInvoiceList || []
      return proformaInvoiceList
    },
    templateOptions() {
      const emailOptions = this.piEmailFrom.emailOptions || {}
      const templateList = emailOptions.templateList || []
      return templateList
    },
    CCEmailOptions() {
      const emailOptions = this.piEmailFrom.emailOptions || {}
      const ccRecipientList = emailOptions.ccRecipientList || []
      ccRecipientList.forEach((item) => {
        if (!item.showLabel) {
          item.showLabel = item.displayName ? `${item.email} - ${item.displayName}` : item.email
        }
      })
      return ccRecipientList
    }
  },
  methods: {
    getComparisonItem(props) {
      const propList = Array.isArray(props) ? props : [props]
      return this.basicUpdateMsgList.find((item) => propList.includes(item.name))
    },
    isModified(props) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.getComparisonItem(props)) {
        return 'edit-outline'
      }
      return ''
    },
    getBeforeValue(props) {
      const item = this.getComparisonItem(props) || {}
      return this.formatComparisonValue(item.name, item.beforeValue)
    },
    getAfterValue(props, fallback) {
      const item = this.getComparisonItem(props)
      const value = item && item.afterValue !== undefined ? item.afterValue : fallback
      return this.formatComparisonValue((item || {}).name, value)
    },
    formatComparisonValue(prop, value) {
      if (value === null || value === undefined || value === '') return ''
      if (['deliveryMethod'].includes(prop)) {
        return this.selectDictLabel(this.dict.type.email_send_mode, value)
      }
      if (['recipientSource'].includes(prop)) {
        const option = this.recipientSourceOptions.find(
          (item) => String(item.dictValue) === String(value)
        )
        return option ? option.dictLabel : value
      }
      if (prop === 'attachPdfId') {
        const option = this.proformaInvoiceOptions.find(
          (item) => String(item.proformaInvoiceId) === String(value)
        )
        return option ? option.text : value
      }
      if (prop === 'templateId') {
        const option = this.templateOptions.find((item) => String(item.id) === String(value))
        return option ? option.templateNo : value
      }
      return value
    },
    deliveryMethodClick(type) {
      if (this.comDisFrom) return
      if (type === 'DONT_SEND') {
        this.$set(this.piEmailFrom, 'deliveryMethod', 'DONT_SEND')
      }
      if (type === 'AUTO_SEND') {
        this.$set(this.piEmailFrom, 'deliveryMethod', 'AUTO_SEND')
      }
    },

    getTOEmailOptions(recipientSource) {
      if (!recipientSource) {
        return []
      }
      if (recipientSource === 'MANUAL') {
        return []
      }
      const emailOptions = this.piEmailFrom.emailOptions || {}
      const recipientSourceList = emailOptions.recipientSourceList || []
      const findItem = recipientSourceList.find((x) => x.dictValue === recipientSource) || {}
      const list = findItem.toRecipientList || []
      list.forEach((item) => {
        if (!item.showLabel) {
          item.showLabel = item.displayName ? `${item.email} - ${item.displayName}` : item.email
        }
      })
      return list
    },

    recipientSourceChange() {
      this.$nextTick(() => {
        if (!this.piEmailFrom.recipientSource) {
          return
        }
        if (this.piEmailFrom.recipientSource === 'MANUAL') {
          this.$set(this.piEmailFrom, 'toRecipientList', [
            { sourceType: 'MANUAL', email: this.piEmailFrom.manualEmail }
          ])
          return
        }
        const list = this.getTOEmailOptions(this.piEmailFrom.recipientSource)
        this.$set(this.piEmailFrom, 'toRecipientList', list)
      })
    },

    manualEmailChange() {
      this.$set(this.piEmailFrom, 'toRecipientList', [
        { sourceType: 'MANUAL', email: this.piEmailFrom.manualEmail }
      ])
    },

    templateIdChange() {
      if (this.piEmailFrom.templateId) {
        const item =
          this.templateOptions.find((item) => String(item.id) === this.piEmailFrom.templateId) || {}
        this.$set(this.piEmailFrom, 'templateNo', item.templateNo)
        this.$set(this.piEmailFrom, 'templateName', item.templateForShow)
      }
    },
    // 预览邮件回调
    handlePreview() {
      this.$refs.emailForm.validate((valid) => {
        if (valid) {
          this.$refs.PreviewEmailDlg.handleOpen({ ...this.piEmailFrom })
          // this.$message.success('校验通过，准备打开预览弹窗')
        } else {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.emailSettings'))
          )
          return false
        }
      })
    },
    validEmailFrom() {
      return this.$refs.emailForm.validate()
    },

    initFileList(FileList) {
      const maxAttempts = 10 // 最大尝试次数
      const interval = 200 // 每次尝试的间隔时间（毫秒）
      let attempts = 0
      const retry = () => {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(() => {
            if (this.$refs.uploadRef) {
              this.$refs.uploadRef.initFileList(FileList)
            } else {
              retry()
            }
          }, interval)
        } else {
          console.log('无法获取组件')
        }
      }
      retry()
    },
    getFileIds() {
      return this.$refs.uploadRef.getFileIds()
    },
    updateFileList(list) {
      this.piEmailFrom.attachmentList = list
    }
  }
}
</script>

<style scoped>
.email-setting-container {
  padding: 20px;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

/* 1. 配置区 */
.config-section {
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
/* 调整Radio样式贴近原型选中项 */
.radio-box {
  display: flex;
  gap: 20px;
}
.radio-item {
  border-radius: 6px;
  padding: 20px 30px;
  border: 1px solid #dcdfe6;
}
.radio-item-active {
  border-color: #1890ff;
}
/* 表单区 */
.form-box {
  margin-left: 30px;
  padding-left: 30px;
  border-left: 1px solid #dcdfe6;
}

/* 2. 摘要区 */
.summary-section {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 20px;
}
.section-title {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}
.summary-content {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  max-width: 1200px;
}
.split-line {
  height: 40px;
  width: 2px;
  background-color: #ebeef5;
}
.summary-item {
  display: flex;
  flex-direction: column;
  min-width: 60px;
}
.summary-item .label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}
.summary-item .value {
  font-size: 14px;
  color: #303133;
}
.tag-badge {
  background: #f4f4f5;
  color: #909399;
  font-size: 12px;
  padding: 0 8px;
  border-radius: 4px;
  margin-left: 5px;
}

/* 3. 历史记录区 */
.history-section .section-title {
  border-left: none;
  padding-left: 0;
  margin-bottom: 20px;
}
</style>
