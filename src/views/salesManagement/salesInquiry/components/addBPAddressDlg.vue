<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('ui.address')"
      :visible.sync="visible"
      width="1140px"
      :modal="true"
      :close-on-click-modal="false"
      @closed="closed"
    >
      <el-form
        :model="termForm"
        :rules="termFormRules"
        label-width="180px"
        :disabled="comDisFrom"
        ref="termForm"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.label')}`" prop="labelList">
              <CommonMultipleSelect
                :ids="termForm.labelList"
                :labels="termForm.labelList"
                :showTitle="false"
                idKey="value"
                labelKey="label"
                :collapseTags="false"
                :options="dict.type.address_label.filter((i) => i.value !== 'Registered')"
                @change="labelListChange"
              />
              <!-- <el-input v-model="termForm.label" maxlength="200"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.addressLine1')}`" prop="address1">
              <el-input v-model="termForm.address1" maxlength="500"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="`${$t('ui.addressLine2')}`">
              <el-input v-model="termForm.address2" maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.locationPrecinct')}`">
              <el-input v-model="termForm.location" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.cityTown')}`" prop="city">
              <el-input v-model="termForm.city" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.provinceState')}`">
              <el-input v-model="termForm.province" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.postalCode')}`">
              <el-input v-model="termForm.postalCode" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('ui.country')}`" prop="country">
              <CountrySelect
                v-model="termForm.country"
                class="form-wd"
                @select="handleCountrySelect"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('ui.remarks')">
              <MyInput
                type="textarea"
                v-model="termForm.remarks"
                :autosize="{ minRows: 2, maxRows: 4 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.isActive')}`">
              <el-switch
                v-model="termForm.isActive"
                :disabled="comDisFrom"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <!-- <div style="text-align: center; margin-bottom: 10px"> -->
      <div slot="footer" class="dialog-footer">
        <template>
          <el-button size="small" @click="visible = false">{{ $t('uiBtn.back') }}</el-button>
          <el-button type="primary" v-if="!comDisFrom" size="small" @click="handleEditTerm">{{
            $t('uiBtn.save')
          }}</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CountrySelect from '@/components/select/countrySelect'

export default {
  dicts: ['address_label'],
  components: {
    CountrySelect
  },
  props: {
    comDisFrom: {
      type: [Boolean],
      default: false
    },
    isStoreIssueChit: {
      type: [Boolean],
      default: false
    }
  },
  data() {
    return {
      /* 表格表单部分 */
      termForm: {
        label: ''
      },
      termFormRules: {
        labelList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        address1: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        city: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        province: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        country: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      visible: false
    }
  },
  methods: {
    labelListChange(ids, labels) {
      this.$set(this.termForm, 'labelList', ids)
      this.$set(this.termForm, 'label', ids.join(', '))
    },
    reset() {
      this.selected = []
      this.handleResetTerm()
    },
    /* 表格表单部分 */
    handleCountrySelect(row) {
      if (row) {
        const { id, name } = row
        this.$set(this.termForm, 'country', name)
        this.$set(this.termForm, 'countryId', id)
      }
    },
    handleResetTerm() {
      this.termForm = {
        label: '',
        labelList: [],
        address1: '',
        city: '',
        province: '',
        isActive: '1',
        countryId: undefined,
        country: undefined
      }
      this.$nextTick(() => {
        this.$refs.termForm && this.$refs.termForm.clearValidate()
      })
    },
    closed() {
      this.handleResetTerm()
    },
    handleEdit(dataRow) {
      this.handleResetTerm()
      const vm = this
      if (dataRow && dataRow.label) {
        if (dataRow.label) {
          dataRow.labelList = dataRow.label.split(', ')
        }
        const params = JSON.parse(JSON.stringify(dataRow))
        vm.termForm = {
          ...params
        }
      }

      this.visible = true
    },

    handleEditTerm() {
      const vm = this
      vm.$refs.termForm.validate((valid) => {
        if (valid) {
          const params = this.$trimOfObj(JSON.parse(JSON.stringify(vm.termForm)))
          params.district = `${params.country}`
          if (params.province) {
            params.district += ` - ${params.province}`
          }
          if (params.city) {
            params.district += ` - ${params.city}`
          }
          const strList = [params.address1]
          if (params.address2) {
            strList.push(params.address2)
          }
          if (params.location) {
            strList.push(params.location)
          }
          if (params.city) {
            strList.push(params.city)
          }
          if (params.province) {
            strList.push(params.province)
          }
          if (params.country) {
            strList.push(params.country)
          }
          params.receiveAddress = strList.join(' - ')
          this.$emit('update', params)
          vm.visible = false
        }
      })
    }
  }
}
</script>
