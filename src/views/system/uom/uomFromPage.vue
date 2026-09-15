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
              <el-form-item :label="`${$t('ui.localization')}`" prop="localization">
                <el-select
                  v-model="form.localization"
                  :title="form.localization"
                  clearable
                  placeholder=""
                  style="width: 100%"
                  class="log-msg-ellipsis"
                  @change="localizationChange"
                  :disabled="!!rowId"
                >
                  <el-option
                    v-for="dict in localizationList"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.uom')}`" prop="uomName">
                <el-input v-model="form.uomName" :title="form.uomName" maxlength="5" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.createdBy')}`">
                <el-input :value="form.createdBy" disabled class="form-wd"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.createdTime')}`">
                <el-date-picker
                  :value="form.createdTime"
                  :editable="false"
                  disabled
                  type="date"
                  :format="fmtForYmdhms"
                  :style="{ width: '100%' }"
                  placeholder
                ></el-date-picker>
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

    <div class="form-card mt10">
      <el-collapse-item name="3">
        <FormCollapseItemTitle
          slot="title"
          :title="$t('system.expandInfo')"
          :warning="collapseWarningForExpandInfo"
        >
        </FormCollapseItemTitle>
        <div class="pb20">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                @click="handleBtnAdd"
                :disabled="!form.localization"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                >{{ $t('uiBtn.add') }}</el-button
              >
            </el-col>
          </el-row>
          <el-table
            border
            ref="tables"
            max-height="600px"
            :row-key="rowIdKey"
            :data="tableList"
            v-table-tab
          >
            <el-table-column
              type="index"
              key="index"
              :label="$t('ui.sn')"
              width="60"
              fixed="left"
              align="center"
              class-name="allowDrag"
            >
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="item in visibleColumn"
              :key="item.prop + item.colSortIndex"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :min-width="item.minWidth"
              :show-overflow-tooltip="item.tooltip"
              :fixed="item.fixed"
              :sortable="item.sortable"
              :align="item.align || 'left'"
              header-align="center"
            >
              <template slot="header" slot-scope="{ column }">
                <span v-if="['localization', 'uomName'].includes(item.prop)">
                  <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                </span>
                <span v-else>{{ column.label }}</span>
              </template>
              <template slot-scope="scope">
                <template v-if="item.prop === 'localization'">
                  <el-select
                    v-model="scope.row.localization"
                    clearable
                    placeholder=""
                    style="width: 100%"
                    class="log-msg-ellipsis"
                    :disabled="!!scope.row.id"
                  >
                    <el-option
                      v-for="dict in selectLocalizationList(scope.$index)"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else-if="item.prop === 'uomName'">
                  <el-input
                    style="width: 98%"
                    :title="scope.row.uomName"
                    v-model="scope.row.uomName"
                    :maxlength="5"
                  />
                </template>
                <template v-else-if="item.prop === 'description'">
                  <el-input
                    style="width: 98%"
                    :title="scope.row.description"
                    v-model="scope.row.description"
                    :maxlength="200"
                  />
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('ui.action')"
              key="action"
              align="center"
              min-width="120"
              class-name="small-padding fixed-width"
              fixed="right"
            >
              <template slot-scope="scope">
                <div class="flexCen" v-if="!scope.row.id">
                  <i
                    class="el-icon-delete pointer"
                    style="font-size: 20px; color: #f56c6c"
                    :title="$t('uiBtn.delete')"
                    @click="handleDelRow(scope.$index, scope.row)"
                  ></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
import { addUom, queryUomById, updateUom } from '@/api/system/uom'
import pageMixin from '@/mixins/tableMinx'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import locale from '@/views/system/lang/index'

export default {
  mixins: [pageMixin],
  components: { SystemOperationLogTable },
  dicts: ['sys_localization'],
  data() {
    const vm = this
    return {
      loading: false,
      saveKey: '5',
      rowIdKey: 'customId',
      activeNames: ['1', '2', '3'],
      rowId: '',
      timeId: '',
      // 是否自动生成 EmployeeNo
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForExpandInfo: false,
      rules: {
        uomName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: 'blur'
          }
        ],
        localization: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ]
      },
      columns: [
        {
          prop: 'localization',
          label: vm.$t('ui.localization'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'uomName',
          label: vm.$t('ui.uom'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      tableList: [],
      localizationList: []
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
        this.getLocalizationDicts()
        if (this.rowId) {
          this.handleUpdate()
        } else {
          this.handleAdd()
        }
        this.$$initColumnVisible(this.saveKey, this.columns)
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:uom:edit'])
    },
    comDisFrom() {
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  methods: {
    handleAdd() {
      this.reset()
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryUomById(rowId).then((response) => {
        this.form = response.data || {}
        const { uomExtendedList } = this.form
        this.tableList = uomExtendedList || []
      })
    },
    getLocalizationDicts() {
      this.MyDictDataClass.getDictFn('sys_localization').then((res) => {
        this.localizationList = res || []
      })
    },
    selectLocalizationList(index) {
      const list = this.localizationList.filter((x) => x.dictValue !== this.form.localization)
      // this.tableList.forEach((x, i) => {
      //   if (x.localization && index !== i) {
      //     list = list.filter((item) => item.dictValue !== x.localization)
      //   }
      // })
      return list
    },
    localizationChange() {
      this.tableList.forEach((x) => {
        this.$set(x, 'localization', undefined)
      })
    },
    handleBtnAdd() {
      if (this.loading) return
      this.loading = true
      const timeStamp = new Date().getTime()
      const form = {
        localization: undefined,
        uomName: undefined,
        description: undefined,
        customId: JSON.stringify(timeStamp)
      }
      this.tableList.push(JSON.parse(JSON.stringify(form)))
      setTimeout(() => {
        this.loading = false
      }, 200)
    },
    /* 行删除 */
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
      })
    },
    /* 表单部分 */
    // 表单重置
    reset() {
      this.form = {
        uomName: '',
        description: '',
        isActive: '1',
        createdBy: this.$store.state.user.nickName
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForExpandInfo = false
      this.activeNames = ['1', '2', '3']
      this.resetForm('form')
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/system/uom' })
    },
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (!valid) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
        if (valid) {
          if (this.tableList && this.tableList.length > 0) {
            const localization = this.tableList.some((x) => !this.$resultOfBoolean(x.localization))
            if (localization) {
              this.collapseWarningForExpandInfo = true
              this.$modal.msgError(
                this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.localization'))
              )
              return
            }
            const uomName = this.tableList.some((x) => !this.$resultOfBoolean(x.uomName))
            if (uomName) {
              this.collapseWarningForExpandInfo = true
              this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.uom')))
              return
            }
          }
          this.collapseWarningForExpandInfo = false
          let param = { ...this.form }
          param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          param.uomExtendedList = this.tableList
          this.$modal
            .confirm(this.$t('ui.uomSubmitConfirm'))
            .then(() => {
              if (param.id) {
                return updateUom(param)
              }
              return addUom(param)
            })
            .then((response) => {
              this.$modal.msgSuccess(this.$t('ui.uomSubmitSuccess'))
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
