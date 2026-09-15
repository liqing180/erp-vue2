<template>
  <el-dialog
    v-dialogDrag
    :title="$t('PRODUCT.combination')"
    :visible.sync="visible"
    width="1000px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('PRODUCT.combinationName')}`" prop="productName">
            <el-input
              v-model="form.productName"
              :title="form.productName"
              class="form-wd"
              maxlength="50"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="`${$t('PRODUCT.optionalRange')}`" :show-message="false" require>
            <div style="display: flex">
              <el-form-item prop="maxQty" style="width: 50%">
                <el-input-number
                  style="width: 100%"
                  v-model="form.maxQty"
                  controls-position="right"
                  :precision="0"
                  :min="1"
                  :max="!form.fullId ? max : form.childBomAccessoriesList.length"
                  @change="inputNumberChange('maxQty')"
                />
              </el-form-item>
              <el-form-item prop="minQty" style="width: 50%">
                <el-input-number
                  style="width: 100%"
                  v-model="form.minQty"
                  controls-position="right"
                  :precision="0"
                  :min="0"
                  :max="form.maxQty || 1"
                  :disabled="!form.maxQty"
                  @change="inputNumberChange('minQty')"
                />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :disabled="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.save')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CloseDialog',
  components: {},
  props: {
    max: {
      type: Number,
      default: 0
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        productName: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        maxQty: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        minQty: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur']
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
  methods: {
    handleOpen(row = {}) {
      this.reset()
      const { fullId } = row
      if (fullId) {
        this.form = JSON.parse(JSON.stringify(row))
      } else {
        this.$set(this.form, 'maxQty', this.max)
      }
      this.visible = true
    },
    reset() {
      this.form = {
        productName: undefined,
        maxQty: undefined,
        minQty: undefined
      }
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    inputNumberChange(code) {
      this.$refs.form.validateField(code)
      const { maxQty, minQty } = this.form
      if (maxQty < minQty) {
        this.$set(this.form, 'minQty', maxQty)
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          vm.fullscreenLoading = true
          const param = JSON.parse(JSON.stringify(this.form))
          param.bomAccessoriesType = '2'
          vm.$emit('onSuccess', param)
          this.back()
          setTimeout(() => {
            vm.fullscreenLoading = false
          }, 50)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-select-group__title .option-title-box {
  display: flex;
  flex-direction: row;
  // background-color: #aaaaaa;
  font-weight: bold;
  // color: #000000;
  color: #606266;
  font-size: 14px;
  margin-left: -20px;
  text-align: left;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .option-title-a {
    width: 85px;
  }
  .option-title-b {
    padding-left: 3px;
    padding-right: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 120px;
  }
  .option-title-c {
    width: 85px;
  }
}
</style>
<style scoped lang="scss">
.dialog-footer {
  margin-bottom: 20px;
}

.return-gp-box .el-select-dropdown__item {
  height: auto;
  white-space: wrap;
  overflow: auto;
  text-overflow: none;
}

.op-list {
  display: flex;
  flex-direction: row;
  text-align: left;
  margin-left: -20px;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .op-list-a {
    width: 85px;
  }
  .op-list-b {
    padding-left: 3px;
    padding-right: 3px;
    word-break: break-all;
    white-space: normal;
  }
  .op-list-c {
    width: 85px;
  }
}
</style>
