<template>
  <el-dialog
    v-dialogDrag
    :title="$t('uiBtn.revisionComparison')"
    :visible.sync="visible"
    width="1140px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div v-show="showBasicUpdateMsg">
      <el-table
        :data="basicUpdateMsgList"
        :stripe="false"
        border
        class="w100"
        :max-height="390"
        tooltip-effect="light"
      >
        <el-table-column
          prop="label"
          :label="$t('uiBtn.fieldName')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="beforeValue"
          :formatter="formatRevisionColumn"
          :label="$t('uiBtn.beforeModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <userAvatar
              v-if="scope.row.prop === 'trademarkUrl' && scope.row.beforeValue"
              :dlgTitle="$t('organization.trademark')"
              :photoUrl="scope.row.beforeValue"
              :disabled="true"
            />
            <span v-else>{{ scope.row.beforeValue }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="afterValue"
          :formatter="formatRevisionColumn"
          :label="$t('uiBtn.afterModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <userAvatar
              v-if="scope.row.prop === 'trademarkUrl' && scope.row.afterValue"
              :dlgTitle="$t('organization.trademark')"
              :photoUrl="scope.row.afterValue"
              :disabled="true"
            />
            <span v-else>{{ scope.row.afterValue }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-collapse
      v-model="activeNames"
      v-show="
        showAddressList ||
        showContactList ||
        showProjectList ||
        showAccountSupplierUpdateMsg ||
        showAccountCustomerUpdateMsg ||
        showCommonFileList
      "
      class="mt20"
    >
      <div class="form-card">
        <el-collapse-item name="1" v-show="beforeCommonFileList.length > 0">
          <template slot="title">
            <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
            <strong>{{ $t('ui.attachment') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <el-row class="mb20">
            <el-col :span="24">
              <myUpload ref="uploadRef1" :disabled="true" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2" v-show="afterCommonFileList.length > 0">
          <template slot="title">
            <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
            <strong>{{ $t('ui.attachment') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <el-row class="mb20">
            <el-col :span="24">
              <myUpload ref="uploadRef2" :disabled="true" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="3" v-if="beforeBusinessAddressList.length > 0">
          <template slot="title">
            <strong>{{ $t('ui.addressInfo') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeBusinessAddressList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in addressColumns"
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
                <template slot-scope="scope">
                  <template v-if="item.prop === 'isActive'">
                    <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
                    <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                      $t('uiBtn.inactive')
                    }}</el-tag>
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4" v-if="afterBusinessAddressList.length > 0">
          <template slot="title">
            <strong>{{ $t('ui.addressInfo') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterBusinessAddressList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in addressColumns"
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
                <template slot-scope="scope">
                  <template v-if="item.prop === 'isActive'">
                    <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
                    <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                      $t('uiBtn.inactive')
                    }}</el-tag>
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>

        <el-collapse-item name="5" v-if="beforeBusinessContactPersonList.length > 0">
          <template slot="title">
            <strong>{{ $t('ui.contactPersonInfo') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeBusinessContactPersonList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in contactColumns"
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
                <template slot-scope="scope">
                  <template v-if="item.prop === 'isActive'">
                    <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
                    <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                      $t('uiBtn.inactive')
                    }}</el-tag>
                  </template>
                  <template v-else-if="item.prop === 'isPurchaseDefault'">
                    <el-tag v-if="scope.row.isPurchaseDefault === '1'">{{ $t('ui.y') }}</el-tag>
                    <el-tag v-if="scope.row.isPurchaseDefault === '0'" type="danger">{{
                      $t('ui.n')
                    }}</el-tag>
                  </template>
                  <template v-else-if="item.prop === 'isSalesDefault'">
                    <el-tag v-if="scope.row.isSalesDefault === '1'">{{ $t('ui.y') }}</el-tag>
                    <el-tag v-if="scope.row.isSalesDefault === '0'" type="danger">{{
                      $t('ui.n')
                    }}</el-tag>
                  </template>
                  <template v-else-if="item.prop === 'isDefault'">
                    <el-tag v-if="scope.row.isDefault === '1'">{{ $t('ui.y') }}</el-tag>
                    <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{
                      $t('ui.n')
                    }}</el-tag>
                  </template>
                  <span v-else-if="item.prop === 'addressNamesList'">{{
                    scope.row.addressNamesList ? scope.row.addressNamesList.join(', ') : ''
                  }}</span>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="6" v-if="afterBusinessContactPersonList.length > 0">
          <template slot="title">
            <strong>{{ $t('ui.contactPersonInfo') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterBusinessContactPersonList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in contactColumns"
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
                <template slot-scope="scope">
                  <!-- <template v-if="item.prop === 'isActive'">
                    <el-switch
                      v-model="scope.row.isActive"
                      :disabled="true"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </template> -->
                  <template v-if="item.prop === 'isActive'">
                    <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
                    <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                      $t('uiBtn.inactive')
                    }}</el-tag>
                  </template>
                  <template v-else-if="item.prop === 'isPurchaseDefault'">
                    <el-tag v-if="scope.row.isPurchaseDefault === '1'">{{ $t('ui.y') }}</el-tag>
                    <el-tag v-if="scope.row.isPurchaseDefault === '0'" type="danger">{{
                      $t('ui.n')
                    }}</el-tag>
                  </template>
                  <template v-else-if="item.prop === 'isSalesDefault'">
                    <el-tag v-if="scope.row.isSalesDefault === '1'">{{ $t('ui.y') }}</el-tag>
                    <el-tag v-if="scope.row.isSalesDefault === '0'" type="danger">{{
                      $t('ui.n')
                    }}</el-tag>
                  </template>
                  <template v-else-if="item.prop === 'isDefault'">
                    <el-tag v-if="scope.row.isDefault === '1'">{{ $t('uiBtn.active') }}</el-tag>
                    <el-tag v-if="scope.row.isDefault === '0'" type="danger">{{
                      $t('uiBtn.inactive')
                    }}</el-tag>
                  </template>
                  <span v-else-if="item.prop === 'addressNamesList'">{{
                    scope.row.addressNamesList ? scope.row.addressNamesList.join(', ') : ''
                  }}</span>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="7" v-if="showAccountSupplierUpdateMsg">
          <template slot="title">
            <strong>{{ $t('bp.supplierInfo') }}</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="accountSupplierUpdateMsgList"
              :stripe="false"
              border
              class="w100"
              :max-height="390"
              tooltip-effect="light"
            >
              <el-table-column
                prop="label"
                :label="$t('uiBtn.fieldName')"
                header-align="center"
                align="left"
                min-width="200"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="beforeValue"
          :formatter="formatRevisionColumn"
                :label="$t('uiBtn.beforeModification')"
                header-align="center"
                align="left"
                min-width="200"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="afterValue"
          :formatter="formatRevisionColumn"
                :label="$t('uiBtn.afterModification')"
                header-align="center"
                align="left"
                min-width="200"
                :show-overflow-tooltip="true"
              />
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="8" v-if="showAccountCustomerUpdateMsg">
          <template slot="title">
            <strong>{{ $t('bp.customerInfo') }}</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="accountCustomerUpdateMsgList"
              :stripe="false"
              border
              class="w100"
              :max-height="390"
              tooltip-effect="light"
            >
              <el-table-column
                prop="label"
                :label="$t('uiBtn.fieldName')"
                header-align="center"
                align="left"
                min-width="200"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="beforeValue"
          :formatter="formatRevisionColumn"
                :label="$t('uiBtn.beforeModification')"
                header-align="center"
                align="left"
                min-width="200"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                prop="afterValue"
          :formatter="formatRevisionColumn"
                :label="$t('uiBtn.afterModification')"
                header-align="center"
                align="left"
                min-width="200"
                :show-overflow-tooltip="true"
              />
            </el-table>
          </div>
        </el-collapse-item>

        <el-collapse-item name="9" v-if="beforeProjectList.length > 0">
          <template slot="title">
            <strong>{{ $t('bp.project') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeProjectList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in projectColumns"
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
                <template slot-scope="scope">
                  <template v-if="item.prop === 'isActive'">
                    <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
                    <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                      $t('uiBtn.inactive')
                    }}</el-tag>
                  </template>
                  <template v-else-if="item.prop === 'credit'">
                    <el-tag v-if="scope.row.credit === '1'">{{ $t('ui.y') }}</el-tag>
                    <el-tag v-if="scope.row.credit === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="10" v-if="afterProjectList.length > 0">
          <template slot="title">
            <strong>{{ $t('bp.project') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterProjectList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in projectColumns"
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
                <template slot-scope="scope">
                  <template v-if="item.prop === 'isActive'">
                    <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
                    <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
                      $t('uiBtn.inactive')
                    }}</el-tag>
                  </template>
                  <template v-else-if="item.prop === 'credit'">
                    <el-tag v-if="scope.row.credit === '1'">{{ $t('ui.y') }}</el-tag>
                    <el-tag v-if="scope.row.credit === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
    <div style="text-align: center; width: 100%">
      <el-empty
        v-if="
          !(
            showAddressList ||
            showContactList ||
            showProjectList ||
            showBasicUpdateMsg ||
            showAccountSupplierUpdateMsg ||
            showAccountCustomerUpdateMsg ||
            showCommonFileList
          )
        "
        :image-size="200"
        :description="$t('ui.noData')"
      ></el-empty>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="visible = false">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createRevisionDisplayMixin } from '@/components/RevisionComparison/legacyDisplay'
import { queryUpdateMsgBP } from '@/api/businessPartner/businessPartner'
import userAvatar from '@/components/Common/htz-image-upload/userAvatar.vue'

export default {
  mixins: [createRevisionDisplayMixin({ switches: ['isActive', 'isDefault', 'isPurchaseDefault', 'isSalesDefault'], dictionaries: { businessPartnerType: 'business_partner_type', customerType: 'bp_customer_type', customerGroup: 'bp_customer_group', supplierType: 'bp_supplier_type', supplierGroup: 'bp_supplier_group', invoiceType: 'bp_invoice_type' } })],
  components: {
    userAvatar
  },
  props: {
    businessPartnerId: {
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      basicUpdateMsgList: [],
      accountSupplierUpdateMsgList: [],
      accountCustomerUpdateMsgList: [],

      beforeBusinessAddressList: [],
      afterBusinessAddressList: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      beforeBusinessContactPersonList: [],
      afterBusinessContactPersonList: [],

      beforeProjectList: [],
      afterProjectList: [],

      updatePropList: [
        {
          prop: 'businessPartnerType',
          label: vm.$t('ui.category')
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('ui.businessPartnerName')
        },
        {
          prop: 'abbreviation',
          label: vm.$t('ui.abbreviation')
        },
        {
          prop: 'alias',
          label: vm.$t('bp.alias')
        },
        {
          prop: 'email',
          label: vm.$t('ui.email')
        },
        {
          prop: 'mobilePhone',
          label: vm.$t('ui.phone')
        },

        {
          prop: 'remarks',
          label: vm.$t('ui.remarks')
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive')
        },
        {
          prop: 'shippingAgent',
          label: vm.$t('bp.shippingAgent')
        },
        {
          prop: 'trademarkUrl',
          label: vm.$t('organization.trademark')
        },
        {
          prop: 'taxpayerIdentificationNo',
          label: vm.$t('ui.taxpayerIdentificationNo')
        },
        {
          prop: 'website',
          label: vm.$t('ui.website')
        },
        {
          prop: 'fax',
          label: vm.$t('ui.fax')
        },
        {
          prop: 'companyRegNo',
          label: vm.$t('ui.companyRegNo')
        },
        {
          prop: 'registeredCapital',
          label: vm.$t('ui.registeredCapital')
        },
        {
          prop: 'corporateRepresentative',
          label: vm.$t('ui.corporateRepresentative')
        },
        {
          prop: 'country',
          label: vm.$t('ui.country')
        },
        {
          prop: 'registeredAddress',
          label: vm.$t('ui.registeredAddress')
        },
        {
          prop: 'regCurrency',
          label: vm.$t('ui.currency')
        }
      ],
      accountCustomerPropList: [
        {
          prop: 'customerType',
          label: vm.$t('ui.customerType')
        },
        {
          prop: 'customerGroup',
          label: vm.$t('ui.customerGroup')
        },
        {
          prop: 'bankName',
          label: vm.$t('ui.bankName')
        },
        {
          prop: 'bankAccount',
          label: vm.$t('ui.bankAccountNo')
        },
        {
          prop: 'accountName',
          label: vm.$t('ui.accountName')
        },
        {
          prop: 'branch',
          label: vm.$t('ui.branch')
        },
        {
          prop: 'taxNo',
          label: vm.$t('ui.tax')
        },
        {
          prop: 'bankAddress',
          label: vm.$t('ui.bankAddress')
        },
        {
          prop: 'bankRemarks',
          label: vm.$t('ui.remarks')
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency')
        },
        {
          prop: 'invoiceType',
          label: vm.$t('ui.invoiceType')
        },
        {
          prop: 'paymentMethodId',
          label: vm.$t('ui.paymentMethod')
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('ui.paymentTermName')
        }
      ],
      accountSupplierPropList: [
        {
          prop: 'supplierType',
          label: vm.$t('ui.supplierType')
        },
        {
          prop: 'supplierGroup',
          label: vm.$t('ui.supplierGroup')
        },
        {
          prop: 'bankName',
          label: vm.$t('ui.bankName')
        },
        {
          prop: 'bankAccount',
          label: vm.$t('ui.bankAccountNo')
        },
        {
          prop: 'accountName',
          label: vm.$t('ui.accountName')
        },
        {
          prop: 'branch',
          label: vm.$t('ui.branch')
        },
        {
          prop: 'taxNo',
          label: vm.$t('ui.tax')
        },
        {
          prop: 'bankAddress',
          label: vm.$t('ui.bankAddress')
        },
        {
          prop: 'bankRemarks',
          label: vm.$t('ui.remarks')
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency')
        },
        {
          prop: 'invoiceType',
          label: vm.$t('ui.invoiceType')
        },
        {
          prop: 'paymentMethodId',
          label: vm.$t('ui.paymentMethod')
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('ui.paymentTermName')
        }
      ],
      /* 表格部分 */
      addressColumns: [
        {
          prop: 'label',
          label: vm.$t('ui.label'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },

        {
          prop: 'address1',
          label: vm.$t('ui.addressLine1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'address2',
          label: vm.$t('ui.addressLine2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'location',
          label: vm.$t('ui.locationPrecinct'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'city',
          label: vm.$t('ui.cityTown'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'province',
          label: vm.$t('ui.provinceState'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'postalCode',
          label: vm.$t('ui.postalCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      contactColumns: [
        {
          prop: 'title',
          label: vm.$t('ui.title'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'position',
          label: vm.$t('ui.position'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'contactPersonName',
          label: vm.$t('ui.contactPersonName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        /* {
          prop: 'addressNamesList',
          label: vm.$t('ui.address'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        {
          prop: 'mobilePhone',
          label: vm.$t('ui.mobilePhone'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'email',
          label: vm.$t('ui.email'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'other',
          label: vm.$t('bp.other'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'isDefault',
        //   label: vm.$t('ui.isDefault'),
        //   visible: true,
        //   minWidth: 140,
        //   tooltip: true
        // },
        {
          prop: 'isSalesDefault',
          label: vm.$t('ui.defaultSalesContact'),
          visible: true,
          minWidth: 150,
          tooltip: true
        },
        {
          prop: 'isPurchaseDefault',
          label: vm.$t('ui.defaultPurchasingContact'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      projectColumns: [
        {
          prop: 'projectCode',
          label: vm.$t('bp.projectCode'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'projectName',
          label: vm.$t('bp.projectName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'zoneName',
          label: vm.$t('bp.projectZone'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'siteAddress',
          label: vm.$t('bp.projectAddress'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'credit',
          label: vm.$t('bp.credit'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 180,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 180,
          visible: true,
          tooltip: true
        }
      ]
    }
  },
  computed: {
    showAddressList() {
      return this.beforeBusinessAddressList.length > 0 || this.afterBusinessAddressList.length > 0
    },
    showContactList() {
      return (
        this.beforeBusinessContactPersonList.length > 0 ||
        this.afterBusinessContactPersonList.length > 0
      )
    },
    showProjectList() {
      return this.beforeProjectList.length > 0 || this.afterProjectList.length > 0
    },

    showBasicUpdateMsg() {
      return this.basicUpdateMsgList.length > 0
    },
    showAccountSupplierUpdateMsg() {
      return this.accountSupplierUpdateMsgList.length > 0
    },
    showAccountCustomerUpdateMsg() {
      return this.accountCustomerUpdateMsgList.length > 0
    },

    showCommonFileList() {
      return this.beforeCommonFileList.length > 0 || this.afterCommonFileList.length > 0
    }
  },

  methods: {
    closed() {
      this.basicUpdateMsgList = []
      this.accountSupplierUpdateMsgList = []
      this.accountCustomerUpdateMsgList = []
      this.beforeBusinessAddressList = []
      this.afterBusinessAddressList = []
      this.beforeCommonFileList = []
      this.afterCommonFileList = []
      this.beforeBusinessContactPersonList = []
      this.afterBusinessContactPersonList = []
      this.beforeProjectList = []
      this.afterProjectList = []
    },
    rowClassName({ row }) {
      if (row.updateType === '2') {
        return 'new-add-row'
      } else if (row.updateType === '3') {
        return 'cancel-row'
      }
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (row.updateType === '1') {
        if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
          cellClass = 'edit-table-cell'
        }
      }
      return cellClass
    },
    async handleOpen(id) {
      if (!await this.loadRevisionDictionaries()) return
      this.activeNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      queryUpdateMsgBP({ businessPartnerMainId: id }).then((res) => {
        const results = res.data || {}
        this.visible = true
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])

        this.accountSupplierUpdateMsgList = this.getAccountSupplierMsgList(
          results.accountSupplierUpdateMsgList || []
        )
        this.accountCustomerUpdateMsgList = this.getAccountCustomerMsgList(
          results.accountCustomerUpdateMsgList || []
        )

        this.beforeBusinessAddressList = results.beforeBusinessAddressList || []
        this.afterBusinessAddressList = results.afterBusinessAddressList || []
        this.beforeCommonFileList = results.beforeCommonFileList || []
        this.afterCommonFileList = results.afterCommonFileList || []
        this.beforeBusinessContactPersonList = results.beforeBusinessContactPersonList || []
        this.afterBusinessContactPersonList = results.afterBusinessContactPersonList || []

        this.beforeProjectList = this.handleProjectList(results.beforeProjectList || [])
        this.afterProjectList = this.handleProjectList(results.afterProjectList || [])

        setTimeout(() => {
          this.$refs.uploadRef1.initFileList(results.beforeCommonFileList)
          this.$refs.uploadRef2.initFileList(results.afterCommonFileList)
        }, 100)
      })
    },
    getBasicUpdateMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        /* if (['quoteDate', 'purchaseQuotationShipDetailList.committedDate'].includes(item.name)) {
            item.beforeValue = this.$dateFmt(Number(item.beforeValue), this.fmtForYmd())
            item.afterValue = this.$dateFmt(Number(item.afterValue), this.fmtForYmd())
          } */
        MsgObj[item.name] = item
      })
      this.updatePropList.forEach((item) => {
        const editItem = MsgObj[item.prop]
        if (editItem) {
          const row = {
            ...item,
            beforeValue: editItem.beforeValue,
            afterValue: editItem.afterValue
          }
          MsgShowList.push(row)
        }
      })
      return MsgShowList
    },
    getAccountCustomerMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        /* if (['quoteDate', 'purchaseQuotationShipDetailList.committedDate'].includes(item.name)) {
            item.beforeValue = this.$dateFmt(Number(item.beforeValue), this.fmtForYmd())
            item.afterValue = this.$dateFmt(Number(item.afterValue), this.fmtForYmd())
          } */
        MsgObj[item.name] = item
      })
      this.accountCustomerPropList.forEach((item) => {
        const editItem = MsgObj[item.prop]
        if (editItem) {
          const row = {
            ...item,
            beforeValue: editItem.beforeValue,
            afterValue: editItem.afterValue
          }
          MsgShowList.push(row)
        }
      })
      return MsgShowList
    },
    getAccountSupplierMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        /* if (['quoteDate', 'purchaseQuotationShipDetailList.committedDate'].includes(item.name)) {
            item.beforeValue = this.$dateFmt(Number(item.beforeValue), this.fmtForYmd())
            item.afterValue = this.$dateFmt(Number(item.afterValue), this.fmtForYmd())
          } */
        MsgObj[item.name] = item
      })
      this.accountSupplierPropList.forEach((item) => {
        const editItem = MsgObj[item.prop]
        if (editItem) {
          const row = {
            ...item,
            beforeValue: editItem.beforeValue,
            afterValue: editItem.afterValue
          }
          MsgShowList.push(row)
        }
      })
      return MsgShowList
    },
    handleProjectList(list) {
      const vm = this
      return list.map((item) => {
        item.createdTime = vm.parseTime(item.createdTime)
        item.modifiedTime = vm.parseTime(item.modifiedTime)
        item.siteAddress = this.siteAddressTitle(item.customerAddressList || [])
        return item
      })
    },
    siteAddressTitle(e) {
      if (!e || e.length <= 0) return ''
      let location = ''
      e.forEach((x) => {
        const { country, provinceState, cityTown, address1, province, city } = x
        location += address1 + '-' + (city || cityTown)
        if (province || provinceState) {
          location += `-${province || provinceState}`
        }
        location += `-${country} / `
      })
      location = location.substring(0, location.length - 3)
      return location
    }
  }
}
</script>
<style lang="scss"></style>
