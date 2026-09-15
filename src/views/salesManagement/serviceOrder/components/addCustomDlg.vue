<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="$t('uiBtn.add')"
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
            <el-form-item :label="$t('PRODUCT.typeOfService')" prop="productName">
              <MyInput
                type="textarea"
                v-model="termForm.productName"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <!--
                删除 :precision="3" ==> 未输入小数时不填充小数
                保留 v-thousandSplit，控制小数位不要超出3位，
                keepDec: false 数字小数位不会补0
                change处理多输入的小数位 row.qty = this.$num(row.qty, row.decimalNum)
              -->
            <el-form-item :label="`${$t('PRODUCT.qty')}`" prop="qty">
              <el-input-number
                style="width: 100%"
                v-model="termForm.qty"
                controls-position="right"
                v-thousandSplit="{ precision: 3, keepDec: false }"
                :min="0.001"
                :max="999"
                :disabled="comDisFrom"
                @change="qtyChange"
              />
              <!--
                v-thousandSplit="{ precision: 0 }"
                :min="1"
                :max="999" -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('PRODUCT.uom')}`" prop="uom">
              <!-- <el-input v-model="termForm.uom"></el-input> -->
              <el-select
                v-model="termForm.uom"
                :title="showUomLabel(termForm.uom) || termForm.uom"
                placeholder=""
                filterable
                clearable
                style="width: 100%"
              >
                <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('ui.remarks')">
              <MyInput
                type="textarea"
                v-model="termForm.remarks"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
                show-word-limit
                :maxlength="3000"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
import { queryAllUomListByLocalization } from '@/api/system/uom'
export default {
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /* 表格表单部分 */
      termForm: {},
      termFormRules: {
        productName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        uom: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.roleKey')),
            trigger: ['change', 'blur']
          }
        ],
        qty: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.underTolerance')),
            trigger: ['blur']
          }
        ]
      },
      visible: false,
      zoneList: [],
      enterpriseIds: [],
      allUomList: []
    }
  },
  computed: {},
  methods: {
    queryAllUomList() {
      // queryAllUomList().then((res) => {
      //   console.log(res, '===')
      //   this.allUomList = res.data || []
      // })
      queryAllUomListByLocalization({}).then((res) => {
        console.log(res, '===201')
        this.allUomList = (res.data || []).map((x) => x.uomName)
        const flag = this.allUomList.some((x) => x === 'job')
        if (flag && !this.termForm.uom) {
          this.$set(this.termForm, 'uom', 'job')
        }
        const flag2 = this.allUomList.some((x) => x === 'JOB')
        if (flag2 && !this.termForm.uom) {
          this.$set(this.termForm, 'uom', 'JOB')
        }
        this.$set(this.termForm, 'uomList', this.allUomList)
      })
    },
    qtyChange() {
      this.$nextTick(() => {
        if (this.termForm.qty) {
          this.$set(this.termForm, 'qty', this.$num(this.termForm.qty, 3))
        }
      })
      this.$refs.termForm.validateField('qty')
    },
    reset() {
      this.handleResetTerm()
    },
    /* 表格表单部分 */
    handleResetTerm() {
      this.termForm = {
        productName: '',
        qty: 1,
        uom: undefined,
        remarks: '',
        customId: +new Date(),
        isTemp: '1',
        uomList: []
      }
      this.$nextTick(() => {
        this.$refs.termForm && this.$refs.termForm.clearValidate()
      })
    },
    closed() {
      this.handleResetTerm()
    },
    handleAdd() {
      this.handleResetTerm()
      this.queryAllUomList()
      this.visible = true
    },
    handleEdit(dataRow) {
      this.queryAllUomList()
      const vm = this
      vm.termForm = { ...dataRow }
      this.visible = true
    },
    async handleEditTerm() {
      const valid3 = await this.$refs.termForm.validate().catch((err) => {
        return err
      })

      if (!valid3) {
        return
      }
      const params = { ...this.termForm, productType: '2' }
      if (this.hasDecimal(params.qty)) {
        params.includeDecimal = '1'
        params.decimalNum = 3
      } else {
        params.includeDecimal = '0'
        params.decimalNum = 0
      }
      this.$emit('onSuccess', params || {})
      this.visible = false
    },
    hasDecimal(num) {
      // 先判断是不是数字，避免报错
      if (typeof num !== 'number' || isNaN(num)) return false
      return num % 1 !== 0
    }
  }
}
</script>
