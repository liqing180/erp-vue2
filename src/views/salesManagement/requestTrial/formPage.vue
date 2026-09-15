<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        :loading="btnLoading"
        @click="submitForm"
        v-if="!comDisFrom"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button type="primary" size="mini" :loading="previewPDFLoading" @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button>

      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>

      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.requestTrial') }}</div>
    </template>
    <template v-slot:content>
      <div>
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
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customer')}`">
                      <el-input
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.project')}`">
                      <el-input
                        :value="form.projectName"
                        :title="form.projectName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.projectContactPersonName')}`">
                      <el-input
                        :value="form.projectContactPersonNames"
                        :title="form.projectContactPersonNames"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.address')}`">
                      <el-input
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('notification.plant')}`"
                      prop="plantId"
                      :rules="{
                        required: true,
                        message: $t('ui.reqMsg'),
                        trigger: ['change']
                      }"
                      :class="[isModified('plantId')]"
                    >
                      <CommonSelect
                        :id="form.plantId"
                        :label="form.plantName"
                        idKey="plantId"
                        labelKey="plantName"
                        filterable
                        :options="form.plantList || []"
                        @change="plantChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.processStatus')}`" prop="approvedStatus">
                      <el-input
                        :value="selectDictLabel(dict.type.approved_status, form.approvedStatus)"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('SALES.specialRequirement')"
                      :class="[isModified('specialRequirement')]"
                    >
                      <el-input
                        v-model="form.specialRequirement"
                        :title="form.specialRequirement"
                        :maxlength="300"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>

              <div class="pb20">
                <el-table
                  border
                  :data="tableList"
                  :max-height="tableMaxHeight"
                  :key="'table' + modifyHighlight"
                  :cell-class-name="tableCellClassName"
                >
                  <el-table-column
                    type="index"
                    :label="$t('ui.sn')"
                    width="60"
                    fixed="left"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="mixRef"
                    :label="$t('SALES.mixRef')"
                    header-align="center"
                    align="center"
                    :min-width="180"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-if="!comDisFrom"
                        style="width: 98%"
                        :title="scope.row.mixRef"
                        v-model="scope.row.mixRef"
                        :maxlength="100"
                        size="mini"
                      />
                      <template v-else>{{ scope.row.mixRef }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="mixDesignName"
                    :label="$t('SALES.grade')"
                    header-align="center"
                    align="center"
                    :min-width="180"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>
                  <el-table-column
                    v-for="item in materialColumns"
                    :key="item.productId"
                    :label="item.materialName"
                    :min-width="120"
                    :show-overflow-tooltip="item.tooltip"
                    :align="'center'"
                    header-align="center"
                  >
                    <template slot-scope="scope">
                      {{ $numberStr(item.mixMaterialQtyData[scope.row.mixDesignId], 3, false) }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.testQTY')"
                :warning="collapseWarningForTestQTY"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-table
                  border
                  :data="comTestQTYtableList"
                  :key="'table' + modifyHighlight"
                  :cell-class-name="tableCellClassName"
                  :max-height="tableMaxHeight"
                >
                  <el-table-column
                    type="index"
                    :label="$t('ui.sn')"
                    width="60"
                    fixed="left"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span v-if="!scope.row.isTotal">{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="mixDesignName"
                    :label="$t('SALES.grade')"
                    header-align="center"
                    align="center"
                    :min-width="180"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>
                  <el-table-column
                    v-for="item in ageColumns"
                    :key="'cell1' + item.age"
                    :label="item.age + ''"
                    :min-width="120"
                    :show-overflow-tooltip="item.tooltip"
                    :align="'center'"
                    header-align="center"
                  >
                    <template slot-scope="scope">
                      {{ item.mixAgeTestNumData[scope.row.mixDesignId] }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="waterP"
                    :label="$t('SALES.waterP')"
                    header-align="center"
                    align="center"
                    :min-width="120"
                  >
                    <template slot-scope="scope">
                      <el-input-number
                        v-if="!comDisFrom && !scope.row.isTotal"
                        style="width: 98%"
                        v-model="scope.row.waterP"
                        controls-position="right"
                        :precision="0"
                        :min="1"
                        :max="99"
                        @change="waterPChange(scope.row)"
                        size="mini"
                      />
                      <template v-else>{{ scope.row.waterP }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="spare"
                    :label="$t('SALES.spare')"
                    header-align="center"
                    align="center"
                    :min-width="120"
                  >
                    <template slot-scope="scope">
                      <el-input-number
                        v-if="!comDisFrom && !scope.row.isTotal"
                        style="width: 98%"
                        v-model="scope.row.spare"
                        controls-position="right"
                        :precision="0"
                        :min="1"
                        :max="99"
                        @change="waterPChange(scope.row)"
                        size="mini"
                      />
                      <template v-else>{{ scope.row.spare }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="total"
                    :label="$t('SALES.total')"
                    header-align="center"
                    align="center"
                    :min-width="120"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.isTotal">{{ comAllTotal }}</span>
                      <span v-else>{{ scope.row.total }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.testPreview')"
                :warning="collapseWarningForTestPreview"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <el-table
                  border
                  :data="tableList"
                  :key="'table' + modifyHighlight"
                  :cell-class-name="tableCellClassName"
                  :max-height="tableMaxHeight"
                >
                  <el-table-column
                    type="index"
                    :label="$t('ui.sn')"
                    width="60"
                    fixed="left"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="mixDesignCode"
                    :label="$t('SALES.itemCode')"
                    header-align="center"
                    align="center"
                    :min-width="180"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="trialStartTime"
                    :label="$t('SALES.trialMixDate')"
                    header-align="center"
                    align="center"
                    :min-width="160"
                    :show-overflow-tooltip="true"
                  >
                    <template slot="header">
                      <span style="color: #ff4949; margin-right: 4px">*</span
                      >{{ $t('SALES.trialMixDate') }}
                    </template>
                    <template slot-scope="scope">
                      <el-date-picker
                        v-if="!comDisFrom"
                        v-model="scope.row.trialStartTime"
                        :picker-options="timeDatePickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        style="width: 98%"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                      <template v-else>{{
                        parseTime(scope.row.trialStartTime, fmtForYmd)
                      }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="productionBatch"
                    :label="$t('SALES.noOfBatches')"
                    header-align="center"
                    align="center"
                    :min-width="120"
                  >
                    <template slot-scope="scope">
                      <el-input-number
                        v-if="!comDisFrom"
                        style="width: 98%"
                        v-model="scope.row.productionBatch"
                        controls-position="right"
                        :precision="0"
                        :min="1"
                        :max="99"
                        size="mini"
                      />
                      <template v-else>{{ scope.row.productionBatch }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="slump"
                    :label="$t('SALES.slump')"
                    header-align="center"
                    align="center"
                    :min-width="120"
                  >
                    <template slot-scope="scope">
                      {{ $numberStr(scope.row.slump, 3, false) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="item in ageColumns"
                    :key="'cell2' + item.age"
                    :label="item.age + ''"
                    :min-width="120"
                    :show-overflow-tooltip="item.tooltip"
                    :align="'center'"
                    header-align="center"
                  >
                    <template slot-scope="scope">
                      {{ $numberStr(item.mixAgeTestResultData[scope.row.mixDesignId], 3, false) }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-form
                ref="form2"
                :model="form"
                @submit.native.prevent
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.requiredBy')}`">
                      <el-input :value="form.requestBy" :title="form.requestBy" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.sign')}`">
                      <div class="sign-img w100">
                        <el-image
                          v-if="form.requestSignatureUrl"
                          style="height: 30px"
                          :src="form.requestSignatureUrl"
                          :preview-src-list="[form.requestSignatureUrl]"
                          fit="contain"
                        >
                        </el-image>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.date')}`">
                      <el-date-picker
                        :value="form.requestTime"
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.approvedBy')}`">
                      <el-input
                        :value="form.approvedBy"
                        :title="form.approvedBy"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.sign')}`">
                      <div class="sign-img w100">
                        <el-image
                          v-if="form.approvedSignatureUrl"
                          style="height: 30px"
                          :src="form.approvedSignatureUrl"
                          :preview-src-list="[form.approvedSignatureUrl]"
                          fit="contain"
                        >
                        </el-image>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.date')}`">
                      <el-date-picker
                        :value="form.approvedTime"
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
              </el-form>
            </el-collapse-item>
          </div>
        </el-collapse>

        <div>
          <pdfFormPage
            ref="pdfFormPageRef"
            :tableList="tableList"
            :materialColumns="materialColumns"
            :ageColumns="ageColumns"
            :form="form"
            :comTestQTYtableList="comTestQTYtableList"
            :comAllTotal="comAllTotal"
            @onSuccess="pdfViewSuccess"
          />
          <!-- <div v-for="i in 60" :key="i" style="padding-bottom: 10px">测试内容 {{ i }}</div> -->
        </div>
      </div>
    </template>

    <ApprovedDialog
      :id="form.requestTrialId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.requestTrialId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
  </FormPageLayoutTabs>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import locale from '@/views/salesManagement/lang/index'
import {
  queryInitRequestTrial,
  saveRequestTrial,
  queryRequestTrialById,
  approvedRequestTrial,
  rejectedRequestTrial,
  withdrawApprovedRequestTrial
} from '@/api/salesManagement/requestTrial'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import pdfFormPage from './pdfFormPage.vue'
export default {
  dicts: ['approved_status'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    ApprovedDialog,
    RejectDialog,
    pdfFormPage
  },
  data() {
    return {
      previewPDFLoading: false,
      activeNames: ['1', '2', '3', '4'],
      btnLoading: false,
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForTestQTY: false,
      collapseWarningForTestPreview: false,
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        combinationProductName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },

      tableList: [],
      materialColumns: [],
      ageColumns: [],

      /* 审批 */
      buttonAuthMsg: {},
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedRequestTrial,
      rejectedUrl: rejectedRequestTrial,
      /* 版本比对高亮 */
      basicUpdateProps: []
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
    },
    taskId: {
      type: String,
      default: ''
    },
    comeFrom: {
      type: [String],
      // 1:update进入，2:审批流进入
      default: '1'
    },
    dataType: {
      type: [String, Number],
      default: '1' // todo:1, history:2, 管理员todo: 3
    },
    isRevisePage: {
      type: [String],
      // 1: Revise 页面，0: 其他
      default: '0'
    },
    isView: {
      type: [String],
      // 1: 查看页面，0: 其他
      default: '0'
    }
  },
  watch: {
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    },
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
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comTestQTYtableList() {
      const list = [...this.tableList]
      if (list.length > 0) {
        list.push({
          mixDesignName: this.$t('SALES.total'),
          isTotal: true
        })
      }
      return list
    },
    comAllTotal() {
      let total = 0
      this.tableList.forEach((item) => {
        total += item.total || 0
      })
      return total
    },
    editAuth() {
      return this.checkPermi(['salesManagement:salesOrder:requestTrial'])
    },

    comDisFrom() {
      let dis = true
      if (!this.rowId) return false
      if (!this.editAuth) {
        return true
      }
      if (this.form.requestTrialId && this.buttonAuthMsg.isCanUpdate === '1') {
        dis = false
      }
      return dis
    },

    approvedBtnShow() {
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.requestTrialId &&
        this.buttonAuthMsg.isCanApproved === '1'
      ) {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.requestTrialId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      // if (!this.checkPermi(['productManagement:BOMManagement:withdrawApprove'])) {
      //   return false
      // }
      let show = false

      if (this.form.requestTrialId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    modifyHighlight() {
      if (this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1') {
        return true
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    // this.$$initColumnVisible('null', this.columns)
  },
  methods: {
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }

      return cellClass
    },
    handleAdd() {
      this.reset()

      const query = this.$route.query || {}
      if (query.soId) {
        queryInitRequestTrial({ salesOrderId: query.soId }).then((res) => {
          const data = res.data || {}
          this.form = {
            ...data
          }
          const tableList = data.requestTrialMixDesignList || []
          this.getMaterialColumns(tableList)
          this.getAgeColumns(tableList)
          this.tableList = tableList
          this.buttonAuthMsg = data.buttonAuthMsg || {}
        })
      }
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryRequestTrialById({ requestTrialId: rowId }).then((res) => {
        const data = res.data || {}
        this.form = data
        const tableList = data.requestTrialMixDesignList || []
        this.getMaterialColumns(tableList)
        this.getAgeColumns(tableList)
        this.tableList = tableList
        this.buttonAuthMsg = data.buttonAuthMsg || {}

        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []

        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
        }, 100)
      })
    },
    getMaterialColumns(list) {
      const AllMaterialList = []
      list.forEach((item) => {
        if (item.materialList) {
          item.materialList.forEach((m) => {
            const findItem = AllMaterialList.find((i) => i.productId === m.productId)
            if (!findItem) {
              m.mixMaterialQtyData = {
                [item.mixDesignId]: m.qty
              }
              AllMaterialList.push(m)
            } else {
              findItem.mixMaterialQtyData[item.mixDesignId] = m.qty
            }
          })
        }
      })
      this.materialColumns = AllMaterialList
    },
    getAgeColumns(list) {
      const AllAgeList = []
      list.forEach((item) => {
        if (item.ageList) {
          let initTotal = 0
          item.ageList.forEach((m) => {
            initTotal += m.testQuantity || 0
            const findItem = AllAgeList.find((i) => i.age === m.age)
            if (!findItem) {
              m.mixAgeTestNumData = {
                [item.mixDesignId]: m.testQuantity
              }
              m.mixAgeTestResultData = {
                [item.mixDesignId]: m.averagePressureValue
              }
              AllAgeList.push(m)
            } else {
              findItem.mixAgeTestNumData[item.mixDesignId] = m.testQuantity
              findItem.mixAgeTestResultData[item.mixDesignId] = m.averagePressureValue
            }
          })
          item.initTotal = initTotal
          this.$set(item, 'total', initTotal + (item.waterP || 0) + (item.spare || 0))
          // item.total =
        }
      })
      AllAgeList.sort((a, b) => a.age - b.age)
      this.ageColumns = AllAgeList
    },
    initColumnWidth() {
      /* const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      }) */
    },
    plantChange(row) {
      this.$set(this.form, 'plantId', row.plantId)
      this.$set(this.form, 'plantName', row.plantName)
      this.$set(this.form, 'contactPersonName', row.contactPersonName)
      this.$set(this.form, 'mobileNo', row.mobileNo)
    },
    reset() {
      this.form = {
        combinationProductName: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForTestQTY = false
      this.collapseWarningForTestPreview = false
      this.activeNames = ['1', '2', '3', '4']
      this.ageColumns = []
      this.materialColumns = []
      this.basicUpdateProps = []
      this.previewPDFLoading = false
      this.resetForm('form1')
    },

    waterPChange(row) {
      const newTotal = (row.initTotal || 0) + (row.waterP || 0) + (row.spare || 0)
      this.$set(row, 'total', newTotal)
    },

    async submitForm() {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        this.collapseWarningForBasicInfo = true
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      this.collapseWarningForBasicInfo = false

      if (this.tableList.length <= 0) {
        this.collapseWarningForProductInfo = true
        return
      }
      this.collapseWarningForProductInfo = false

      if (this.tableList.find((item) => !item.trialStartTime)) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.trialMixDate'))
        )
        this.collapseWarningForTestPreview = true
        return
      }
      this.collapseWarningForTestPreview = false
      this.form.requestTrialMixDesignList = this.tableList
      const param = JSON.parse(JSON.stringify(this.form))
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          return saveRequestTrial(param).then((res) => {
            const { bomNo } = res.data || {}
            this.$modal.msgSuccess(
              this.$t('ui.submitPageSuccess').replace('$1', bomNo || this.form.bomNo)
            )
            this.back()
          })
        })
        .catch(() => {})
    },

    /* 审批 */
    back(type) {
      this.$emit('back', type)
    },
    handleApproved() {
      this.aplVisible = true
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.approvedSuccess')}`.replace('$1', `${this.$t('menu.requestTrial')}`)
      )
      this.aplVisible = false
      vm.back('onApprovedSuccess')
    },
    handleRejected() {
      this.rjVisible = true
    },
    rjVisibleChange(data) {
      this.rjVisible = data || false
    },
    rjSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.rejectedSuccess')}`.replace('$1', `${this.$t('menu.requestTrial')}`)
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApprovedRequestTrial({
            businessId: this.form.requestTrialId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handlePreviewPDF() {
      // this.getPdf()
      this.previewPDFLoading = true
      // this.previewPDFLoading = false
      // window.open(myUrl, 'print')
      this.$refs.pdfFormPageRef.getPdf()
    },
    pdfViewSuccess() {
      this.previewPDFLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.sign-img {
  height: 32px;
  padding-bottom: 2px;
  border-bottom: 1px solid #dfe6ec;
}
</style>
