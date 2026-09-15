<template>
  <el-collapse v-model="activeNames">
    <div class="form-card">
      <el-collapse-item name="1">
        <FormCollapseItemTitle
          slot="title"
          :title="$t('ui.basicInfo')"
          :warning="collapseWarningForBasicInfo"
        >
        </FormCollapseItemTitle>
        <el-form
          ref="form"
          :model="form"
          @submit.native.prevent
          :rules="rules"
          label-width="140px"
          :disabled="comDisFrom"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.port')}`" prop="portName">
                <el-input
                  v-model="form.portName"
                  :title="form.portName"
                  :disabled="!!propRowId"
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.country')}`" prop="country">
                <CountrySelect
                  v-model="form.country"
                  :title="form.country"
                  class="form-wd"
                  @select="handleCountrySelect"
                  :disabled="!!propRowId"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.cityTown')}`">
                <el-input v-model="form.city" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.latLong')}`" prop="latLong">
                <el-input v-model="form.latLong" :title="form.latLong" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.telephone')}`" prop="telephone" ref="mobileNoRef">
                <MobilePhoneInput
                  :mobileCode.sync="form.mobileCode"
                  :mobileNum.sync="form.mobileNum"
                  :mobileNo.sync="form.telephone"
                  @clearValidate="$refs.mobileNoRef.clearValidate()"
                  :disabled="comDisFrom"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.website')}`" prop="website">
                <el-input v-model="form.website" :title="form.website" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.code')}`">
                <el-input v-model="form.portCode" :title="form.portCode" maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('ui.description')">
                <MyInput
                  type="textarea"
                  v-model="form.description"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  resize="none"
                  show-word-limit
                  :maxlength="3000"
                ></MyInput>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.isActive')}`">
                <el-switch v-model="form.isActive" active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </div>

    <div class="form-card mt10" v-if="!!propRowId">
      <el-collapse-item name="2">
        <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
          <template v-if="form.operationLogForLast">
            <span
              v-if="form.operationLogForLast.operatorBy"
              class="info-item mr20"
              :title="form.operationLogForLast.operatorBy"
            >
              {{ $t('ui.operName') }} : {{ form.operationLogForLast.operatorBy }}
            </span>
            <span v-if="form.operationLogForLast.operatorTime" class="info-item">
              {{ $t('ui.operTime') }} :
              {{ parseTime(form.operationLogForLast.operatorTime) }}
            </span>
          </template>
        </FormCollapseItemTitle>
        <div class="pb20">
          <SystemOperationLogTable :tableList="form.operationLogList || []" />
        </div>
      </el-collapse-item>
    </div>
  </el-collapse>
</template>

<script>
import {
  saveWorldSeaports,
  queryWorldSeaportsById,
  updateWorldSeaports
} from '@/api/system/seaport'
import pageMixin from '@/mixins/tableMinx'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import CountrySelect from '@/components/select/countrySelect'

export default {
  mixins: [pageMixin],
  components: { SystemOperationLogTable, CountrySelect },
  data() {
    function isWebsite(param) {
      const strRegex =
        // eslint-disable-next-line no-useless-escape
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
      const re = new RegExp(strRegex)
      return re.test(param)
    }
    const vm = this
    const validWebsite = (rule, value, callback) => {
      if (value && !isWebsite(value)) {
        callback(new Error(vm.$t('ui.validWebsite')))
      } else {
        callback()
      }
    }
    /* const validatorPhoneNo = (rule, value, callback) => {
      if (!this.form.mobileCode || !this.form.mobileNum) {
        callback(this.$t('ui.reqMsg').replace('$1', this.$t('ui.telephone')))
      } else {
        callback()
      }
    } */
    return {
      activeNames: ['1', '2'],
      rowId: '',
      timeId: '',
      // 是否自动生成 EmployeeNo
      form: {},
      collapseWarningForBasicInfo: false,
      rules: {
        portName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur']
          }
        ],
        country: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        // telephone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }],
        website: [
          {
            validator: validWebsite,
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    propRowId: {
      type: String,
      default: ''
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        if (this.rowId) {
          this.handleUpdate()
        } else {
          this.handleAdd()
        }
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:seaport:edit'])
    },
    comDisFrom() {
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    }
  },
  created() {
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  methods: {
    handleAdd() {
      this.reset()
      this.form.isActive = '1'
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryWorldSeaportsById({ portId: rowId }).then((response) => {
        this.form = response.data || {}
      })
    },
    handleCountrySelect(row) {
      if (row) {
        const { id, name } = row
        this.$set(this.form, 'country', name)
        this.$set(this.form, 'countryId', id)
      }
    },
    /* 表单部分 */
    // 表单重置
    reset() {
      this.form = {
        portName: '',
        description: '',
        isActive: '0',
        createdBy: this.$store.state.user.nickName
      }
      this.collapseWarningForBasicInfo = false
      this.activeNames = ['1', '2']
      this.resetForm('form')
    },
    // 取消按钮
    cancel() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/system/seaport' })
    },
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (!valid) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
        if (valid) {
          const password = this.form.password
          let param = { ...this.form }
          param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          param.password = password
          this.$modal
            .confirm(this.$t('ui.seaportSubmitConfirm'))
            .then(() => {
              if (param.portId) {
                return updateWorldSeaports(param)
              }
              return saveWorldSeaports(param)
            })
            .then((response) => {
              this.$modal.msgSuccess(
                this.$t('ui.seaportSubmitSuccess').replace('$1', param.portName)
              )
              this.cancel()
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>
<style lang="scss"></style>
