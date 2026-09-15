<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="$t('uiBtn.export')"
    :visible.sync="visible"
    width="400px"
    append-to-body
    @close="close"
  >
    <el-radio-group v-model="exportType" @change="radioChange">
      <div class="mb20">
        <el-radio :label="1">{{ $t('exportMsg.option1') }}</el-radio>
      </div>
      <div class="mb20">
        <el-radio :label="2">{{ $t('exportMsg.option2') }}</el-radio>
      </div>
      <div class="mb20">
        <el-radio :label="3">{{ $t('exportMsg.option3') }}</el-radio>
      </div>
      <div class="mb10" v-if="!hideItems.includes(4)">
        <el-radio :label="4">{{ $t('exportMsg.option4') }}</el-radio>
      </div>
    </el-radio-group>
    <!-- <div v-if="exportType === '4'">
      <el-input-number
        v-model="exportNum"
        controls-position="right"
        :precision="0"
        v-thousandSplit="{ precision: 0 }"
        :min="1"
        :max="99999"
      ></el-input-number>
    </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" :loading="loading" @click="submit">{{
        $t('uiBtn.export')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'ExportDlg',
  props: {
    exportOptions: {
      type: [Object],
      default() {
        return {}
      }
    },
    selectList: {
      type: [Array],
      default() {
        return []
      }
    },
    loading: {
      type: [Boolean],
      default: false
    },
    hideItems: {
      type: [Array],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      visible: false,
      exportType: 1,
      // exportNum: undefined,
      headers: { Authorization: 'Bearer ' + getToken() },
      disabled: false
    }
  },
  beforeCreate() {
    const locale = {
      zh: {
        exportMsg: {
          option1: '以查询条件导出数据',
          option2: '导出当前页面数据',
          option3: '导出列表中选中的数据',
          option4: '导出所有数据'
        }
      },
      en: {
        exportMsg: {
          option1: 'Export data with query conditions',
          option2: 'Export current page data',
          option3: 'Export selected data in the list',
          option4: 'Export all data'
        }
      }
    }
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  computed: {},
  methods: {
    radioChange() {
      // this.exportNum = undefined
    },
    open() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    // 提交上传文件
    submit() {
      if (this.disabled) return
      this.disabled = true
      this.$emit('export', {
        exportType: this.exportType
      })
      setTimeout(() => {
        this.disabled = false
      }, 1000)
    },
    close() {
      this.exportType = 1
      // this.exportNum = undefined
    }
  }
}
</script>

<style lang="scss" scoped></style>
