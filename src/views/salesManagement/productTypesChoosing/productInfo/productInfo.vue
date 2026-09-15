<template>
  <div class="pb20">
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane name="productDetail">
          <span slot="label">
            <span>{{ $t('SALES.project1') }}</span>
          </span>
        </el-tab-pane>
        <el-tab-pane name="purchase">
          <span slot="label">
            <span>{{ $t('SALES.purchase') }}</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <div v-show="activeName === 'productDetail'">
      <el-form
        ref="form"
        :model="contentForm"
        @submit.native.prevent
        :rules="rules"
        label-width="180px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
              <el-input v-model="contentForm.productName" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item :label="`${$t('SALES.referenceLink')}`">
              <el-input v-model="contentForm.referenceLink" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('ui.description')" prop="description">
              <MyInput
                type="textarea"
                v-model="contentForm.description"
                :autosize="{ minRows: 1, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="7000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('SALES.productRequests')" prop="productRequests">
              <MyInput
                type="textarea"
                v-model="contentForm.productRequests"
                :autosize="{ minRows: 1, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>

        <el-col :span="24">
          <el-form-item :label="`${$t('ui.attachment')}`">
            <myUpload ref="uploadRef" />
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div v-show="activeName === 'purchase'">
      <purchase ref="purchase" :formData="formData" :comDisFrom="comDisFrom" />
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import purchase from './purchase'
export default {
  mixins: [pageMixin],
  components: { purchase },
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    comDisFrom: {
      type: Boolean,
      default: false
    },
    initCommonFileList: {
      type: Array,
      default() {
        return []
      }
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateProps: {
      type: Array,
      default() {
        return []
      }
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.contentForm = newValue || {}
      }
    },
    initCommonFileList: {
      immediate: true,
      handler: function () {
        this.initFileList(this.initCommonFileList)
      }
    }
  },
  data() {
    return {
      activeName: 'productDetail',
      contentForm: {},
      rules: {
        productName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        description: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        productRequests: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  methods: {
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
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return false
      }
      return myFileIds
    },
    updateFileList(list) {
      this.curFileList = list
    },
    handleTabClick() {},

    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    async submit() {
      try {
        const myFileIds = this.$refs.uploadRef.getFileIds()
        if (myFileIds === false) {
          return false
        }
        await this.$refs.form.validate()
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.contentForm)))
        param.commonFileList = myFileIds

        const purchase = await this.$refs.purchase.submit()
        if (purchase === false) {
          this.activeName = 'purchase'
          return
        }
        return param
      } catch (err) {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
