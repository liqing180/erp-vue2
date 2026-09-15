<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    :title="title"
    v-dialogDragWidth
    :visible.sync="open"
    width="1100px"
    append-to-body
    @closed="closed"
  >
    <el-form ref="formRef1" class="mr40" :model="form" :rules="rules" label-width="250px">
      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="$t('Operation.noticeOfShipmentGoods')"
            prop="noticeOfShipmentGoods"
            required
          >
            <div class="input-switch-box">
              <div class="con-left">
                <el-switch
                  v-model="form.noticeOfShipmentGoods"
                  :disabled="comDisFrom"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </div>
              <div class="con-right" v-if="form.noticeOfShipmentGoods === '1'">
                <el-select
                  :disabled="comDisFrom"
                  style="width: 100%"
                  v-model="form.deliveryNotificationType"
                  placeholder=""
                  @change="deliveryNotificationTypeChange"
                >
                  <el-option
                    v-for="item in list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.noticeOfShipmentGoods === '1'">
          <el-form-item
            :label="$t('Operation.locationDistance')"
            prop="locationDistance"
            v-if="form.deliveryNotificationType === '1'"
          >
            <div style="display: flex">
              <el-input-number
                style="width: 100%"
                v-model="form.locationDistance"
                controls-position="right"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                :min="1"
                :max="99999"
                :placeholder="`1 - ${$numberStr(99999, 0)}`"
                :disabled="comDisFrom"
                @change="inputNumberChange('locationDistance')"
              />
              <div class="unit">m</div>
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('Operation.locationTime')"
            prop="locationTime"
            v-else-if="form.deliveryNotificationType === '2'"
          >
            <div style="display: flex">
              <el-input-number
                style="width: 100%"
                v-model="form.locationTime"
                controls-position="right"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                :min="1"
                :max="999"
                placeholder="1 - 999"
                :disabled="comDisFrom"
                @change="inputNumberChange('locationTime')"
              />
              <div class="unit">min</div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('Operation.arrivalNotice')}`" required>
            <el-switch
              v-model="form.arrivalNotice"
              :disabled="comDisFrom"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.arrivalNotice === '1'">
          <el-form-item :label="$t('Operation.deliveryDistance')" prop="deliveryDistance" required>
            <div style="display: flex">
              <el-input-number
                style="width: 100%"
                v-model="form.deliveryDistance"
                controls-position="right"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                :min="1"
                :max="99999"
                :placeholder="`1 - ${$numberStr(99999, 0)}`"
                :disabled="comDisFrom"
                @change="inputNumberChange('deliveryDistance')"
              />
              <div class="unit">m</div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('Operation.notificationMethod')" prop="notificationMethod">
            <el-select
              :disabled="comDisFrom"
              style="width: 100%"
              v-model="form.notificationMethod"
              placeholder=""
              clearable
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in deliveryNotificationList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('ui.modifiedBy')">
            <el-input disabled v-model="form.modifiedBy" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.modifiedTime')}`">
            <el-date-picker
              :value="form.modifiedTime"
              :format="fmtForYmdhms"
              :style="{ width: '100%' }"
              disabled
              placeholder=""
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" v-if="!comDisFrom" @click="submitForm" :loading="btnLoading">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { querySetupFieldById, updateSetupField } from '@/api/operation/setup'
export default {
  props: {
    editAuth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnLoading: false,
      open: false,
      title: '',
      list: [
        { value: '1', label: this.$t('Operation.distance') },
        { value: '2', label: this.$t('Operation.time1') }
      ],
      deliveryNotificationList: [
        { value: '1', label: 'Email' },
        { value: '2', label: 'WhatsApp' }
      ],
      form: {},
      // 表单校验
      rules: {
        noticeOfShipmentGoods: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.noticeOfShipmentGoods')),
            trigger: ['blur', 'change']
          }
        ],
        notificationMethod: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.notificationMethod')),
            trigger: ['blur', 'change']
          }
        ],
        locationDistance: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.locationDistance')),
            trigger: ['blur']
          }
        ],
        locationTime: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.locationTime')),
            trigger: ['blur', 'change']
          }
        ],
        deliveryDistance: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.deliveryDistance')),
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comDisFrom() {
      return !this.editAuth
    }
  },
  created() {},
  methods: {
    inputNumberChange(code) {
      this.$refs.formRef1.validateField(code)
    },
    // 发货通知
    deliveryNotificationTypeChange() {
      this.$nextTick(() => {
        this.$refs.formRef1.clearValidate('locationTime')
        this.$refs.formRef1.clearValidate('locationDistance')
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        noticeOfShipmentGoods: undefined,
        deliveryNotificationType: undefined,
        locationDistance: undefined,
        locationTime: undefined,
        arrivalNotice: undefined,
        deliveryDistance: undefined,
        notificationMethod: undefined
      }
      this.resetForm('formRef1')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = this.$t('uiBtn.edit')
      if (this.comDisFrom) {
        this.title = this.$t('uiBtn.view')
      }
      this.reset()
      const id = row.setupId
      querySetupFieldById(id).then((response) => {
        if (response.code === 200) {
          const data = response.data || {}
          const config = data.customConfigFields || {}
          this.form = data
          this.$set(this.form, 'noticeOfShipmentGoods', config.DELIVERY_NOTIFICATION_IS_OPEN)
          this.$set(this.form, 'deliveryNotificationType', config.DELIVERY_NOTIFICATION_TYPE)
          this.$set(this.form, 'locationDistance', config.PLANT_DISTANCE)
          this.$set(this.form, 'locationTime', config.PLANT_TIME)
          this.$set(this.form, 'arrivalNotice', config.ARRIVAL_NOTIFICATION_IS_OPEN)
          this.$set(this.form, 'deliveryDistance', config.ARRIVAL_DISTANCE)
          this.$set(this.form, 'notificationMethod', config.NOTIFICATION_METHOD.split(','))
          this.open = true
        }
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      // 分类被删除时, getCheckedNodes() = [null], 将无效分类ID 清除
      this.$refs.formRef1.validate((valid) => {
        if (!valid) {
          return
        }
        if (valid) {
          this.form.customConfigFields = this.form.customConfigFields || {}
          this.form.customConfigFields.DELIVERY_NOTIFICATION_IS_OPEN =
            this.form.noticeOfShipmentGoods
          this.form.customConfigFields.DELIVERY_NOTIFICATION_TYPE =
            this.form.deliveryNotificationType
          this.form.customConfigFields.PLANT_DISTANCE = this.form.locationDistance
          this.form.customConfigFields.PLANT_TIME = this.form.locationTime
          this.form.customConfigFields.ARRIVAL_NOTIFICATION_IS_OPEN = this.form.arrivalNotice
          this.form.customConfigFields.ARRIVAL_DISTANCE = this.form.deliveryDistance
          this.form.customConfigFields.NOTIFICATION_METHOD = this.form.notificationMethod.join(',')
          const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          this.$modal
            .confirm(this.$t('Operation.setupSubmitConfirm'))
            .then(() => {
              this.btnLoading = true
              return updateSetupField(param)
            })
            .then((response) => {
              this.btnLoading = false
              this.$modal.msgSuccess(this.$t('Operation.setupSubmitSuccess'))

              this.open = false
              this.$emit('onSuccess')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.unit {
  flex-shrink: 0;
  width: 40px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}

.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
  }
  .con-right {
    margin-left: 10px;
    line-height: 0;
  }
}
</style>
