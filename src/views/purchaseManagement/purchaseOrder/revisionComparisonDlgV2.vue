<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="visible"
    :title="$t('PURCHASE.versionComparisonV2.title')"
    width="1200px"
    custom-class="po-version-comparison-v2-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="!comparisonLoading"
    append-to-body
    @opened="alignComparisonFields"
    @close="handleClose"
    @closed="handleClosed"
  >
    <div slot="title" class="po-version-v2-titlebar">
      <span class="po-version-v2-title-icon" aria-hidden="true">
        <i class="el-icon-document-copy"></i>
      </span>
      <div class="po-version-v2-title-copy">
        <div class="po-version-v2-title-heading">
          <strong>{{ $t('PURCHASE.versionComparisonV2.title') }}</strong>
          <span
            v-if="hasComparisonStatistics"
            class="po-version-v2-change-count"
            aria-live="polite"
          >
            {{ changeCountText }}
          </span>
        </div>
        <div v-if="businessNo || beforeVersion || afterVersion" class="po-version-v2-document-meta">
          <span v-if="businessNo">
            <b>{{ adapter ? adapter.businessNoLabel : $t('PURCHASE.versionComparisonV2.poNumber') }}：</b>{{ businessNo }}
          </span>
          <span v-if="beforeVersion && afterVersion">
            <b>{{ $t('PURCHASE.versionComparisonV2.comparedVersions') }}：</b>
            {{ beforeVersion.versionLabel }} → {{ afterVersion.versionLabel }}
          </span>
          <span v-if="afterVersion && (afterVersion.revisedBy || afterVersion.revisionAt)">
            <template v-if="afterVersion.revisedBy">
              <b>{{ $t('PURCHASE.versionComparisonV2.revisionBy') }}：</b
              >{{ afterVersion.revisedBy }}
            </template>
            <template v-if="afterVersion.revisedBy && afterVersion.revisionAt"> · </template>
            <template v-if="afterVersion.revisionAt">{{ afterVersion.revisionAt }}</template>
          </span>
        </div>
      </div>
    </div>

    <div ref="comparisonBody" class="po-version-v2-body" v-loading="historyLoading || comparisonLoading">
      <section class="po-version-v2-selector-card">
        <div class="po-version-v2-selector-main">
          <div class="po-version-v2-version-field">
            <label>{{ $t('PURCHASE.versionComparisonV2.beforeVersion') }}</label>
            <el-select
              v-model="beforeVersionKey"
              filterable
              :aria-label="$t('PURCHASE.versionComparisonV2.beforeVersion')"
              :placeholder="$t('PURCHASE.versionComparisonV2.selectVersion')"
              :disabled="historyLoading || versionList.length < 2"
              @change="handleVersionChange"
            >
              <el-option
                v-for="item in beforeVersionOptions"
                :key="item.versionKey"
                :label="formatVersionLabel(item)"
                :value="item.versionKey"
              />
            </el-select>
          </div>

          <span class="po-version-v2-arrow" aria-hidden="true">
            <i class="el-icon-right"></i>
          </span>

          <div class="po-version-v2-version-field">
            <label>{{ $t('PURCHASE.versionComparisonV2.afterVersion') }}</label>
            <el-select
              v-model="afterVersionKey"
              filterable
              :aria-label="$t('PURCHASE.versionComparisonV2.afterVersion')"
              :placeholder="$t('PURCHASE.versionComparisonV2.selectVersion')"
              :disabled="historyLoading || versionList.length < 2"
              @change="handleVersionChange"
            >
              <el-option
                v-for="item in afterVersionOptions"
                :key="item.versionKey"
                :label="formatVersionLabel(item)"
                :value="item.versionKey"
              />
            </el-select>
          </div>
        </div>
        <p class="po-version-v2-selector-hint">
          {{ adapter ? adapter.comparisonHint : $t('PURCHASE.versionComparisonV2.compareHint') }}
        </p>
      </section>

      <section v-if="hasComparableVersions" class="po-version-v2-summarybar">
        <div class="po-version-v2-legend">
          <span class="po-version-v2-legend-item is-modified">
            <i></i>{{ $t('PURCHASE.versionComparisonV2.modified') }} {{ statistics.modified }}
          </span>
          <span class="po-version-v2-legend-item is-added">
            <i></i>{{ $t('PURCHASE.versionComparisonV2.added') }} {{ statistics.added }}
          </span>
          <span class="po-version-v2-legend-item is-removed">
            <i></i>{{ $t('PURCHASE.versionComparisonV2.removed') }} {{ statistics.removed }}
          </span>
        </div>
      </section>

      <el-alert
        v-if="errorMessage"
        class="po-version-v2-alert"
        :title="errorMessage"
        type="error"
        :closable="false"
        show-icon
      >
        <el-button slot="default" type="text" @click="retry">
          {{ $t('PURCHASE.versionComparisonV2.refresh') }}
        </el-button>
      </el-alert>

      <div v-if="contentGroups.length > 0 && !errorMessage" class="po-version-v2-ledger">
        <section v-for="group in contentGroups" :key="group.groupKey" class="po-version-v2-group">
          <header class="po-version-v2-group-title">
            <span
              class="po-version-v2-group-mark"
              :class="`is-${group.groupKey}`"
              aria-hidden="true"
            >
              <i :class="getGroupIcon(group.groupKey)"></i>
            </span>
            <strong>{{ group.groupLabel }}</strong>
            <span>{{ (group.changes || []).length }}</span>
          </header>

          <el-table
            :data="group.changes || []"
            size="mini"
            tooltip-effect="light"
            :row-key="getChangeKey"
            :row-class-name="getOperationRowClass"
            class="po-version-v2-table"
          >
            <el-table-column
              :label="$t('PURCHASE.versionComparisonV2.operation')"
              width="108"
              align="left"
              header-align="left"
            >
              <template slot-scope="scope">
                <span class="po-version-v2-operation" :class="operationClass(scope.row.operation)">
                  {{ operationLabel(scope.row.operation) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('PURCHASE.versionComparisonV2.field')"
              min-width="210"
              align="left"
              header-align="left"
              class-name="po-version-v2-field-column"
            >
              <template slot-scope="scope">
                <div class="po-version-v2-field-cell">
                  <strong>{{
                    scope.row.fieldLabel || scope.row.label || scope.row.fieldKey
                  }}</strong>
                  <span
                    v-if="scope.row.childDataChanged"
                    class="po-version-v2-child-change"
                  >
                    <i class="el-icon-connection" aria-hidden="true"></i>
                    {{ $t('PURCHASE.versionComparisonV2.childDataChanged') }}
                  </span>
                  <small v-if="scope.row.changedFieldLabels" :title="scope.row.changedFieldLabels">
                    {{ $t('PURCHASE.versionComparisonV2.changedFields') }}：{{
                      scope.row.changedFieldLabels
                    }}
                  </small>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('PURCHASE.versionComparisonV2.componentType')"
              width="132"
              align="left"
              header-align="left"
            >
              <template slot-scope="scope">
                <span class="po-version-v2-component-chip">
                  {{ componentTypeLabel(scope.row.componentType) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('PURCHASE.versionComparisonV2.oldValue')"
              min-width="245"
              align="left"
              header-align="left"
            >
              <template slot-scope="scope">
                <div
                  class="po-version-v2-value is-before"
                  :class="{
                    'is-empty': isBeforeComparisonEmpty(scope.row)
                  }"
                >
                  <template v-if="hasDirectFieldChanges(scope.row)">
                    <div
                      v-for="change in scope.row.fieldChanges"
                      :key="getChangeKey(change)"
                      class="po-version-v2-value-line"
                    >
                      <small>{{ change.fieldLabel || change.fieldKey }}</small>
                      <RevisionPaymentTermDiffTableV2
                        v-if="isPaymentTermMessage(change)"
                        :payment-term-obj="parsePaymentTermMessage(change.oldValue)"
                      />
                      <div
                        v-else-if="isConditionHtml(change, change.oldValue)"
                        class="po-version-v2-html-value"
                        v-html="getConditionHtml(change.oldValue)"
                      ></div>
                      <span v-else>{{ displayChangeValue(change.oldValue, change, scope.row.fieldKey, scope.row, 'oldValue') }}</span>
                    </div>
                  </template>
                  <RevisionPaymentTermDiffTableV2
                    v-else-if="isPaymentTermMessage(scope.row)"
                    :payment-term-obj="parsePaymentTermMessage(scope.row.beforeValue)"
                  />
                  <div
                    v-else-if="isConditionHtml(scope.row, scope.row.beforeValue)"
                    class="po-version-v2-html-value"
                    v-html="getConditionHtml(scope.row.beforeValue)"
                  ></div>
                  <span
                    v-else-if="shouldDisplayRowValue(scope.row)"
                    :title="displayChangeValue(scope.row.beforeValue, scope.row)"
                    v-text="displayChangeValue(scope.row.beforeValue, scope.row)"
                  ></span>
                  <span v-else-if="!hasBeforeChildComparison(scope.row)">—</span>
                  <div
                    v-if="scope.row.assignmentDataChanged && scope.row.beforeAssignments.length"
                    class="po-version-v2-assignment-list"
                  >
                    <div class="po-version-v2-assignment-row is-header">
                      <span>{{ $t('PURCHASE.PRNo') }}</span>
                      <span>{{ $t('PURCHASE.qty') }}</span>
                    </div>
                    <div
                      v-for="(assignment, index) in scope.row.beforeAssignments"
                      :key="getAssignmentKey(assignment, index)"
                      class="po-version-v2-assignment-row"
                    >
                      <span :title="assignment.purchaseRequisiteNo || ''">{{
                        assignment.purchaseRequisiteNo || $t('PURCHASE.excessStock')
                      }}</span>
                      <span>{{ formatAssignmentQuantity(assignment) }}</span>
                    </div>
                  </div>
                  <div
                    v-if="
                      scope.row.serviceSurchargeDataChanged &&
                      scope.row.beforeServiceSurcharges.length
                    "
                    class="po-version-v2-service-list"
                  >
                    <div class="po-version-v2-service-title">
                      {{ $t('PURCHASE.surchargeDetails') }}
                    </div>
                    <div
                      v-for="(surcharge, index) in scope.row.beforeServiceSurcharges"
                      :key="getServiceSurchargeKey(surcharge, index)"
                      class="po-version-v2-service-item"
                    >
                      <strong :title="surcharge.expenseItemName || ''">
                        {{ surcharge.expenseItemName || '—' }}
                      </strong>
                      <div class="po-version-v2-service-metrics">
                        <span>
                          <small>{{ $t('PURCHASE.qty') }}</small>
                          {{ formatServiceSurchargeQuantity(surcharge) }}
                        </span>
                        <span>
                          <small>{{ $t('PURCHASE.unitPrice') }}</small>
                          {{ formatServiceSurchargeMoney(surcharge.unitPrice) }}
                        </span>
                        <span>
                          <small>{{ $t('PURCHASE.lineTotal') }}</small>
                          {{ formatServiceSurchargeMoney(surcharge.lineTotal) }}
                        </span>
                        <span v-if="hasValue(surcharge.legalEntityLineTotal)">
                          <small>{{ $t('PURCHASE.referenceAmount') }}</small>
                          {{ formatServiceSurchargeMoney(surcharge.legalEntityLineTotal) }}
                        </span>
                      </div>
                      <div v-if="surcharge.remarks" class="po-version-v2-service-remarks">
                        <small>{{ $t('ui.remarks') }}</small>
                        <span>{{ surcharge.remarks }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('PURCHASE.versionComparisonV2.newValue')"
              min-width="245"
              align="left"
              header-align="left"
            >
              <template slot-scope="scope">
                <div
                  class="po-version-v2-value is-after"
                  :class="{
                    'is-empty': isAfterComparisonEmpty(scope.row)
                  }"
                >
                  <template v-if="hasDirectFieldChanges(scope.row)">
                    <div
                      v-for="change in scope.row.fieldChanges"
                      :key="getChangeKey(change)"
                      class="po-version-v2-value-line"
                    >
                      <small>{{ change.fieldLabel || change.fieldKey }}</small>
                      <RevisionPaymentTermDiffTableV2
                        v-if="isPaymentTermMessage(change)"
                        :payment-term-obj="parsePaymentTermMessage(change.newValue)"
                      />
                      <div
                        v-else-if="isConditionHtml(change, change.newValue)"
                        class="po-version-v2-html-value"
                        v-html="getConditionHtml(change.newValue)"
                      ></div>
                      <span v-else>{{ displayChangeValue(change.newValue, change, scope.row.fieldKey, scope.row, 'newValue') }}</span>
                    </div>
                  </template>
                  <RevisionPaymentTermDiffTableV2
                    v-else-if="isPaymentTermMessage(scope.row)"
                    :payment-term-obj="parsePaymentTermMessage(scope.row.afterValue)"
                  />
                  <div
                    v-else-if="isConditionHtml(scope.row, scope.row.afterValue)"
                    class="po-version-v2-html-value"
                    v-html="getConditionHtml(scope.row.afterValue)"
                  ></div>
                  <span
                    v-else-if="shouldDisplayRowValue(scope.row)"
                    :title="displayChangeValue(scope.row.afterValue, scope.row)"
                    v-text="displayChangeValue(scope.row.afterValue, scope.row)"
                  ></span>
                  <span v-else-if="!hasAfterChildComparison(scope.row)">—</span>
                  <div
                    v-if="scope.row.assignmentDataChanged && scope.row.afterAssignments.length"
                    class="po-version-v2-assignment-list"
                  >
                    <div class="po-version-v2-assignment-row is-header">
                      <span>{{ $t('PURCHASE.PRNo') }}</span>
                      <span>{{ $t('PURCHASE.qty') }}</span>
                    </div>
                    <div
                      v-for="(assignment, index) in scope.row.afterAssignments"
                      :key="getAssignmentKey(assignment, index)"
                      class="po-version-v2-assignment-row"
                    >
                      <span :title="assignment.purchaseRequisiteNo || ''">{{
                        assignment.purchaseRequisiteNo || $t('PURCHASE.excessStock')
                      }}</span>
                      <span>{{ formatAssignmentQuantity(assignment) }}</span>
                    </div>
                  </div>
                  <div
                    v-if="
                      scope.row.serviceSurchargeDataChanged &&
                      scope.row.afterServiceSurcharges.length
                    "
                    class="po-version-v2-service-list"
                  >
                    <div class="po-version-v2-service-title">
                      {{ $t('PURCHASE.surchargeDetails') }}
                    </div>
                    <div
                      v-for="(surcharge, index) in scope.row.afterServiceSurcharges"
                      :key="getServiceSurchargeKey(surcharge, index)"
                      class="po-version-v2-service-item"
                    >
                      <strong :title="surcharge.expenseItemName || ''">
                        {{ surcharge.expenseItemName || '—' }}
                      </strong>
                      <div class="po-version-v2-service-metrics">
                        <span>
                          <small>{{ $t('PURCHASE.qty') }}</small>
                          {{ formatServiceSurchargeQuantity(surcharge) }}
                        </span>
                        <span>
                          <small>{{ $t('PURCHASE.unitPrice') }}</small>
                          {{ formatServiceSurchargeMoney(surcharge.unitPrice) }}
                        </span>
                        <span>
                          <small>{{ $t('PURCHASE.lineTotal') }}</small>
                          {{ formatServiceSurchargeMoney(surcharge.lineTotal) }}
                        </span>
                        <span v-if="hasValue(surcharge.legalEntityLineTotal)">
                          <small>{{ $t('PURCHASE.referenceAmount') }}</small>
                          {{ formatServiceSurchargeMoney(surcharge.legalEntityLineTotal) }}
                        </span>
                      </div>
                      <div v-if="surcharge.remarks" class="po-version-v2-service-remarks">
                        <small>{{ $t('ui.remarks') }}</small>
                        <span>{{ surcharge.remarks }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </section>
      </div>

      <el-empty
        v-else-if="!historyLoading && !comparisonLoading && !errorMessage"
        :image-size="112"
        :description="emptyDescription"
        class="po-version-v2-empty"
        :class="{ 'is-no-change': isNoChangeState }"
      >
        <template v-if="isNoChangeState" slot="image">
          <span class="po-version-v2-no-change-icon" aria-hidden="true">
            <i class="el-icon-check"></i>
          </span>
        </template>
      </el-empty>
    </div>

    <div slot="footer" class="po-version-v2-footer">
      <el-button type="primary" size="small" @click="visible = false">
        {{ $t('PURCHASE.versionComparisonV2.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  comparePurchaseOrderRevisionDiff,
  queryPurchaseOrderRevisionVersions
} from '@/api/purchaseManagement/purchaseOrder'
import { parseTime } from '@/utils/ruoyi'
import { createPurchaseOrderVersionSchemaV2 } from './purchaseOrderVersionSchemaV2'
import RevisionPaymentTermDiffTableV2 from './revisionPaymentTermDiffTableV2'

const DEFAULT_SECTION_CONTENT_ORDER = ['FIELDS', 'COLLECTIONS']
const EMPTY_ORDER_MAP = new Map()
const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']
const OPERATION_CLASS_NAMES = Object.freeze({
  ADD: 'is-added',
  MODIFY: 'is-modified',
  DELETE: 'is-removed'
})
const OPERATION_I18N_KEYS = Object.freeze({
  ADD: 'PURCHASE.versionComparisonV2.added',
  MODIFY: 'PURCHASE.versionComparisonV2.modified',
  DELETE: 'PURCHASE.versionComparisonV2.removed'
})
const ERROR_I18N_KEYS = Object.freeze({
  history: 'PURCHASE.versionComparisonV2.historyLoadFailed',
  schema: 'PURCHASE.versionComparisonV2.schemaMismatch',
  pair: 'PURCHASE.versionComparisonV2.invalidVersionPair',
  comparison: 'PURCHASE.versionComparisonV2.comparisonLoadFailed'
})
const GROUP_ICONS = Object.freeze({
  basic: 'el-icon-s-order',
  recipient: 'el-icon-location-information',
  product: 'el-icon-box',
  attachment: 'el-icon-paperclip',
  conditions: 'el-icon-document',
  contact: 'el-icon-user'
})

function toStringOrEmpty(value) {
  return value === undefined || value === null ? '' : String(value)
}

function createOrderMap(items) {
  return new Map((items || []).map((item) => [item.fieldKey, Number(item.order)]))
}

function getOrder(orderMap, key) {
  return orderMap.has(key) ? orderMap.get(key) : Number.MAX_SAFE_INTEGER
}

function createComparisonDefinitionIndex(comparisonDefinition) {
  const sections = new Map()
  const collections = new Map()
  const rootFields = new Map()

  const visitCollections = (items) => {
    ;(items || []).forEach((collection) => {
      if (!collections.has(collection.fieldKey)) {
        collections.set(collection.fieldKey, {
          definition: collection,
          fields: new Map((collection.fields || []).map((field) => [field.fieldKey, field])),
          fieldOrder: createOrderMap(collection.fields),
          summaryFields: collection.summaryFields || []
        })
      }
      visitCollections(collection.collections)
    })
  }

  ;((comparisonDefinition || {}).sections || []).forEach((section) => {
    const sectionFields = section.fields || []
    const sectionCollections = section.collections || []
    sections.set(section.sectionKey, {
      definition: section,
      contentOrder: new Map(
        (section.contentOrder || DEFAULT_SECTION_CONTENT_ORDER).map((type, index) => [type, index])
      ),
      fieldOrder: createOrderMap(sectionFields),
      collectionOrder: createOrderMap(sectionCollections)
    })
    sectionFields.forEach((field) => {
      if (!rootFields.has(field.fieldKey)) rootFields.set(field.fieldKey, field)
    })
    visitCollections(sectionCollections)
  })

  return { sections, collections, rootFields }
}

export default {
  name: 'PurchaseOrderRevisionComparisonV2',
  components: { RevisionPaymentTermDiffTableV2 },
  props: {
    adapter: {
      type: Object,
      default: null
    }
  },
  dicts: [{ type: 'p_purchase_order_status', lazy: true }],
  data() {
    return {
      visible: false,
      businessId: '',
      historyLoading: false,
      comparisonLoading: false,
      versionList: [],
      beforeVersionKey: '',
      afterVersionKey: '',
      comparisonResult: {},
      errorType: '',
      requestSerial: 0
    }
  },
  computed: {
    beforeVersion() {
      return this.versionList.find((item) => item.versionKey === this.beforeVersionKey)
    },
    afterVersion() {
      return this.versionList.find((item) => item.versionKey === this.afterVersionKey)
    },
    beforeVersionOptions() {
      if (!this.afterVersion) return this.versionList.slice(0, -1)
      return this.versionList.filter((item) => item.versionOrder < this.afterVersion.versionOrder)
    },
    afterVersionOptions() {
      if (!this.beforeVersion) return this.versionList.slice(1)
      return this.versionList.filter((item) => item.versionOrder > this.beforeVersion.versionOrder)
    },
    hasComparableVersions() {
      return this.versionList.length >= 2
    },
    businessNo() {
      const result = this.comparisonResult || {}
      const currentVersion = this.versionList.find((item) => item.isCurrent) || this.afterVersion
      return result.businessNo || (currentVersion || {}).businessNo || ''
    },
    hasComparisonStatistics() {
      return Boolean((this.comparisonResult || {}).statistics)
    },
    changeCountText() {
      return this.$t('PURCHASE.versionComparisonV2.changeCount').replace(
        '{count}',
        this.statistics.total
      )
    },
    statistics() {
      const source = (this.comparisonResult || {}).statistics || {}
      const fallback = this.contentGroups.reduce(
        (result, group) => {
          ;(group.changes || []).forEach((change) => {
            result.total++
            if (change.operation === 'ADD') result.added++
            if (change.operation === 'MODIFY') result.modified++
            if (change.operation === 'DELETE') result.deleted++
          })
          return result
        },
        { total: 0, added: 0, modified: 0, deleted: 0 }
      )
      return {
        total: this.toNumber(source.total, fallback.total),
        added: this.toNumber(source.added, fallback.added),
        modified: this.toNumber(source.modified, fallback.modified),
        removed: this.toNumber(source.deleted, fallback.deleted)
      }
    },
    contentGroups() {
      const sections = (this.comparisonResult || {}).sections || []
      return sections
        .map((section) => ({
          groupKey: section.sectionKey,
          groupLabel: this.getSectionLabel(section),
          groupI18nKey: section.sectionI18nKey,
          order: section.order,
          changes: this.normalizeResponseRows(
            this.sortSectionRows(section.rows || [], section.sectionKey)
          )
        }))
        .filter((group) => group.changes.length > 0)
        .slice()
        .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    },
    errorMessage() {
      const i18nKey = ERROR_I18N_KEYS[this.errorType]
      return i18nKey ? this.$t(i18nKey) : ''
    },
    emptyDescription() {
      if (!this.hasComparableVersions) {
        return this.$t('PURCHASE.versionComparisonV2.noComparableVersion')
      }
      return this.$t('PURCHASE.versionComparisonV2.noChanges')
    },
    isNoChangeState() {
      return (
        this.hasComparableVersions &&
        this.hasComparisonStatistics &&
        this.contentGroups.length === 0
      )
    }
  },
  created() {
    // The schema is only needed for request construction and row lookup. Keeping its
    // index outside data avoids recursively observing the complete schema in Vue 2.
    this.comparisonDefinitionIndex = null
  },
  beforeDestroy() {
    this.requestSerial++
    if (this.comparisonResizeObserver) this.comparisonResizeObserver.disconnect()
    window.removeEventListener('resize', this.alignComparisonFields)
  },
  mounted() {
    window.addEventListener('resize', this.alignComparisonFields)
  },
  updated() {
    this.$nextTick(this.alignComparisonFields)
  },
  methods: {
    alignComparisonFields() {
      const body = this.$refs.comparisonBody
      if (!this.visible || !body || !body.offsetWidth) return
      if (!this.comparisonResizeObserver && typeof ResizeObserver !== 'undefined') {
        let previousWidth = body.offsetWidth
        this.comparisonResizeObserver = new ResizeObserver(() => {
          const width = body.offsetWidth
          if (width === previousWidth) return
          previousWidth = width
          this.alignComparisonFields()
        })
        this.comparisonResizeObserver.observe(body)
      }
      const pairs = []
      body.querySelectorAll('.po-version-v2-table .el-table__body > tbody > tr').forEach(row => {
        const before = row.querySelectorAll('.is-before > .po-version-v2-value-line')
        const after = row.querySelectorAll('.is-after > .po-version-v2-value-line')
        before.forEach((line, index) => {
          if (after[index]) pairs.push([line, after[index]])
        })
      })
      // 先恢复自然高度，再统一读取，避免旧高度影响换行后的测量。
      pairs.forEach(pair => pair.forEach(line => { line.style.minHeight = '' }))
      const heights = pairs.map(pair => Math.max(...pair.map(line => line.getBoundingClientRect().height)))
      pairs.forEach((pair, index) => pair.forEach(line => { line.style.minHeight = `${heights[index]}px` }))
    },
    handleOpen(businessId) {
      this.resetState()
      this.businessId = toStringOrEmpty(businessId)
      this.visible = true
      this.loadHistory()
    },
    resetState() {
      this.requestSerial++
      this.businessId = ''
      this.historyLoading = false
      this.comparisonLoading = false
      this.versionList = []
      this.beforeVersionKey = ''
      this.afterVersionKey = ''
      this.comparisonDefinitionIndex = null
      this.comparisonResult = {}
      this.errorType = ''
    },
    handleClose() {
      if (this.visible) return
      this.requestSerial++
      this.historyLoading = false
      this.comparisonLoading = false
    },
    handleClosed() {
      if (!this.visible) this.resetState()
    },
    loadHistory() {
      if (!this.businessId) return
      const requestId = ++this.requestSerial
      this.historyLoading = true
      this.errorType = ''
      const loadVersions = this.adapter ? this.adapter.loadVersions : queryPurchaseOrderRevisionVersions
      // 其他业务模块使用各自的字典；只有采购订单需要加载采购状态。
      const loadStatus = this.adapter ? Promise.resolve() : this.dict.reloadDict('p_purchase_order_status')
      Promise.all([loadVersions(this.businessId), loadStatus])
        .then(([res]) => {
          if (requestId !== this.requestSerial) return
          const responseData = res.data || []
          const rows = Array.isArray(responseData) ? responseData : responseData.list || []
          this.versionList = rows
            .map((item, index) => this.normalizeVersion(item, index))
            .filter((item) => item.versionKey)
            .sort((a, b) => a.versionOrder - b.versionOrder)
          this.historyLoading = false
          if (this.versionList.length >= 2) {
            this.beforeVersionKey = this.versionList[this.versionList.length - 2].versionKey
            this.afterVersionKey = this.versionList[this.versionList.length - 1].versionKey
            this.loadComparison()
          }
        })
        .catch(() => {
          if (requestId !== this.requestSerial) return
          this.historyLoading = false
          this.errorType = 'history'
        })
    },
    normalizeVersion(item, index) {
      const rawSequence = Number(item.sequence)
      const versionOrder = Number.isNaN(rawSequence) ? index + 1 : rawSequence
      return {
        ...item,
        versionKey: toStringOrEmpty(item.versionKey),
        versionType: item.versionType,
        updateHistoryId: toStringOrEmpty(item.updateHistoryId),
        sequence: versionOrder,
        versionOrder,
        versionLabel: item.versionLabel || `V${versionOrder}`,
        businessNo: item.businessNo || '',
        revisedBy: item.revisedBy || item.modifyName || '',
        revisionAt: this.formatRevisionAt(item.revisionAt || item.modifyTime),
        isCurrent: item.isCurrent === true || item.isCurrent === '1'
      }
    },
    handleVersionChange() {
      this.comparisonResult = {}
      this.errorType = ''
      this.loadComparison()
    },
    loadComparison() {
      const requestId = ++this.requestSerial
      const beforeVersion = this.beforeVersion
      const afterVersion = this.afterVersion
      this.comparisonLoading = false
      if (!beforeVersion || !afterVersion) return
      if (beforeVersion.versionOrder >= afterVersion.versionOrder) {
        this.errorType = 'pair'
        return
      }

      let comparisonDefinition
      try {
        const createDefinition = this.adapter ? this.adapter.createDefinition : createPurchaseOrderVersionSchemaV2
        comparisonDefinition = createDefinition({
          t: this.$t.bind(this),
          purchaseOrderStatusOptions: ((this.dict || {}).type || {}).p_purchase_order_status || []
        })
      } catch (error) {
        this.comparisonDefinitionIndex = null
        this.errorType = 'schema'
        return
      }

      this.comparisonLoading = true
      this.errorType = ''
      this.comparisonDefinitionIndex = createComparisonDefinitionIndex(comparisonDefinition)
      const compare = this.adapter ? this.adapter.compare : comparePurchaseOrderRevisionDiff
      compare({
        businessId: this.businessId,
        beforeVersion: this.createVersionReference(beforeVersion),
        afterVersion: this.createVersionReference(afterVersion),
        displayContext: {
          locale: this.getContractLocale(),
          timezone: this.getTimezone(),
          dateFormat: this.$store.getters.fmtForYmd || 'YYYY-MM-DD'
        },
        comparisonDefinition
      })
        .then((res) => {
          if (requestId !== this.requestSerial) return
          this.comparisonResult = res.data || {}
          this.comparisonLoading = false
        })
        .catch((error) => {
          if (requestId !== this.requestSerial) return
          this.comparisonLoading = false
          this.comparisonResult = {}
          this.errorType = this.classifyComparisonError(error)
        })
    },
    retry() {
      if (this.historyLoading || this.comparisonLoading) return
      if (this.errorType === 'history') {
        this.loadHistory()
      } else {
        this.loadComparison()
      }
    },
    createVersionReference(version) {
      const reference = { versionType: version.versionType }
      if (version.versionType === 'HISTORY') reference.updateHistoryId = version.updateHistoryId
      return reference
    },
    formatRevisionAt(value) {
      if (value === undefined || value === null || value === '') return ''
      if (typeof value !== 'number' && !/^\d+$/.test(String(value))) return String(value)
      const format = this.$store.getters.fmtForYmdhms || 'yyyy-MM-dd HH:mm:ss'
      return parseTime(value, format) || String(value)
    },
    getErrorText(error) {
      const response = (error || {}).response || {}
      const data = response.data || {}
      return [data.code, data.errorCode, data.msg, data.message, (error || {}).message]
        .filter((item) => item !== undefined && item !== null)
        .join(' ')
    },
    classifyComparisonError(error) {
      const errorText = this.getErrorText(error)
      if (/(?:PO_)?VERSION_(SCHEMA_INVALID|PATH_FORBIDDEN)/i.test(errorText)) return 'schema'
      if (/(?:PO_)?VERSION_(PAIR_INVALID|CROSS_DOCUMENT)/i.test(errorText)) return 'pair'
      return 'comparison'
    },
    getContractLocale() {
      const locale = String((this.$i18n || {}).locale || '')
      if (/^zh(?:[-_]|$)/i.test(locale)) return 'zh-CN'
      if (/^en(?:[-_]|$)/i.test(locale)) return 'en-US'
      return locale.replace('_', '-') || 'zh-CN'
    },
    getTimezone() {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai'
      } catch (error) {
        return 'Asia/Shanghai'
      }
    },
    formatVersionLabel(item) {
      const current = item.isCurrent ? ` · ${this.$t('PURCHASE.versionComparisonV2.current')}` : ''
      const businessNo = item.businessNo ? ` · ${item.businessNo}` : ''
      return `${item.versionLabel}${businessNo}${current}`
    },
    toNumber(value, fallback) {
      if (value === undefined || value === null || value === '') return fallback
      const number = Number(value)
      return Number.isFinite(number) ? number : fallback
    },
    getChangeKey(row) {
      return [row.operation, row.fieldPath, row.fieldKey, row.itemId, row.parentItemId]
        .map(toStringOrEmpty)
        .filter((value) => value !== '')
        .join(':')
    },
    operationClass(operation) {
      return OPERATION_CLASS_NAMES[operation] || ''
    },
    getOperationRowClass({ row }) {
      return ['po-version-v2-operation-row', this.operationClass((row || {}).operation)]
        .filter(Boolean)
        .join(' ')
    },
    operationLabel(operation) {
      const i18nKey = OPERATION_I18N_KEYS[operation]
      return i18nKey ? this.$t(i18nKey) : operation || '—'
    },
    componentTypeLabel(type) {
      const key = `PURCHASE.versionComparisonV2.componentTypes.${type || 'TEXT'}`
      const label = this.$t(key)
      return label === key ? type || '—' : label
    },
    isPaymentTermMessage(change) {
      return (change || {}).fieldKey === 'paymentTermMsg'
    },
    isConditionHtml(change, value) {
      return (change || {}).fieldKey === 'conditions' && Boolean(this.getConditionHtml(value))
    },
    getConditionHtml(value) {
      // 其他模块的条款按文本展示，不能将接口中的任意 HTML 直接插入页面。
      if (this.adapter) return ''
      const parsedValue = this.parseJsonValue(value)
      const candidates =
        parsedValue && typeof parsedValue === 'object'
          ? [parsedValue.displayValue, parsedValue.rawValue]
          : [parsedValue]

      for (const candidate of candidates) {
        const content = this.parseJsonValue(candidate)
        if (typeof content === 'string' && /<\/?[a-z][^>]*>/i.test(content)) return content
      }
      return ''
    },
    getComparisonRawValue(value) {
      if (value && typeof value === 'object' && 'rawValue' in value) return value.rawValue
      return value
    },
    parseJsonValue(value) {
      let parsed = value
      for (let index = 0; index < 3 && typeof parsed === 'string'; index++) {
        const content = parsed.trim()
        if (!content || !['{', '[', '"'].includes(content.charAt(0))) break
        try {
          parsed = JSON.parse(content)
        } catch (error) {
          break
        }
      }
      return parsed
    },
    normalizePaymentTermMessage(value) {
      const parsed = this.parseJsonValue(value)
      if (Array.isArray(parsed)) return { paymentTermDetailList: parsed }
      if (!parsed || typeof parsed !== 'object') return {}
      if (Array.isArray(parsed.paymentTermDetailList)) return parsed
      if (parsed.paymentTerm !== undefined) {
        return this.normalizePaymentTermMessage(parsed.paymentTerm)
      }
      if (parsed.paymentTermMsg !== undefined) {
        return this.normalizePaymentTermMessage(parsed.paymentTermMsg)
      }
      if (parsed.data !== undefined) return this.normalizePaymentTermMessage(parsed.data)
      return parsed
    },
    parsePaymentTermMessage(value) {
      return this.normalizePaymentTermMessage(this.getComparisonRawValue(value))
    },
    getValueByPath(source, path) {
      if (!source || typeof source !== 'object' || !path) return undefined
      if (Object.prototype.hasOwnProperty.call(source, path)) return source[path]
      return path.split('.').reduce((value, key) => {
        if (value === undefined || value === null) return undefined
        return value[key]
      }, source)
    },
    getCollectionRowValue(row, valueKey) {
      const comparisonValue = (row || {})[valueKey]
      const candidates = [
        comparisonValue && comparisonValue.rowValue,
        (row || {}).rowValue,
        comparisonValue && comparisonValue.rawValue,
        comparisonValue
      ]

      for (const value of candidates) {
        if (value === undefined || value === null) continue
        const parsed = this.parseJsonValue(value)
        if (parsed && typeof parsed === 'object' && 'rowValue' in parsed) {
          const rowValue = this.parseJsonValue(parsed.rowValue)
          if (rowValue && typeof rowValue === 'object') return rowValue
        }
        if (parsed && typeof parsed === 'object') return parsed
      }
      return null
    },
    getSchemaFieldLabel(definition, fallback) {
      if (!definition) return fallback
      const i18nKey = definition.fieldI18nKey
      const translated = i18nKey ? this.$t(i18nKey) : ''
      if (translated && translated !== i18nKey) return translated
      return definition.fieldLabel || fallback
    },
    getDeletedSummaryField(collection, summaryField, usedFields) {
      if (/(^|[._])decimalNum$/.test(summaryField)) return null
      // 精度只用于格式化数量，不作为业务字段展示。
      if (Array.from(collection.fields.values()).some(field =>
        field.formatter && (field.formatter.precisionPath === summaryField ||
          field.formatter.trimZeroWhenPath === summaryField ||
          (field.formatter.trimZeroWhenPaths || []).includes(summaryField))
      )) return null
      const directDefinition = collection.fields.get(summaryField) ||
        Array.from(collection.fields.values()).find(field => field.propertyPath === summaryField)
      if (directDefinition) {
        if (usedFields.has(directDefinition.fieldKey)) return null
        usedFields.add(directDefinition.fieldKey)
        return {
          definition: directDefinition,
          valuePath: directDefinition.propertyPath || summaryField
        }
      }
      const displayDefinition = Array.from(collection.fields.values()).find((field) =>
        (field.displayFields || []).includes(summaryField)
      )
      if (displayDefinition) {
        if (usedFields.has(displayDefinition.fieldKey)) return null
        usedFields.add(displayDefinition.fieldKey)
        return { definition: displayDefinition, valuePath: summaryField }
      }
      // 通用业务摘要只展示白名单字段；行标识和其他快照辅助值不生成独立变更项。
      if (this.adapter) return null
      return { definition: null, valuePath: summaryField }
    },
    getDeletedSummaryRawValue(rowValue, summaryField) {
      const definition = summaryField.definition
      if (definition && definition.formatter && definition.formatter.type === 'DECIMAL') {
        const rawValue = this.getValueByPath(rowValue, definition.propertyPath || definition.fieldKey)
        if (rawValue !== undefined && rawValue !== null && rawValue !== '') return rawValue
      }
      if (definition && (definition.displayFields || []).length > 0) {
        const displayValue = definition.displayFields
          .map((path) => this.getValueByPath(rowValue, path))
          .find((value) => value !== undefined && value !== null && value !== '')
        if (displayValue !== undefined) return displayValue
      }
      return this.getValueByPath(rowValue, summaryField.valuePath)
    },
    formatDeletedSummaryValue(value, definition, rowValue) {
      if (value === undefined || value === null || value === '') return ''
      const formatter = (definition || {}).formatter || {}
      if (formatter.type === 'DECIMAL') {
        const formatted = this.formatPageComparisonNumber(value, formatter, rowValue)
        return formatted === undefined ? this.displayValue(value) : formatted
      }
      if (formatter.type === 'VALUE_MAP') {
        const option = (formatter.values || []).find(
          (item) => item.value === value || String(item.value) === String(value)
        )
        if (option) return String(option.label)
      }
      if (formatter.type === 'FILE_SIZE') return this.formatFileSize(value)
      if (formatter.type === 'DATE' || formatter.type === 'DATETIME') {
        const format = formatter.type === 'DATE'
          ? this.$store.getters.fmtForYmd || 'yyyy-MM-dd'
          : this.$store.getters.fmtForYmdhms || 'yyyy-MM-dd HH:mm:ss'
        return parseTime(value === 0 ? new Date(0) : value, format) || String(value)
      }
      if (formatter.type === 'LIST_JOIN' && Array.isArray(value)) {
        return value
          .map((item) => this.getValueByPath(item, formatter.itemPath) || item)
          .filter((item) => item !== undefined && item !== null && item !== '')
          .join(formatter.separator || ', ')
      }
      if (formatter.type === 'PERCENT') {
        const number = Number(value)
        if (Number.isFinite(number)) {
          const precision = Number(formatter.precision || 0)
          return `${number.toFixed(precision)}%`
        }
      }
      return this.displayValue(value)
    },
    buildCollectionRowSummaryChanges(row, directFieldChanges) {
      if (
        row.kind !== 'COLLECTION_ITEM' ||
        !['ADD', 'DELETE'].includes(row.operation) ||
        directFieldChanges.length > 0
      ) {
        return directFieldChanges
      }
      const collection =
        this.comparisonDefinitionIndex &&
        this.comparisonDefinitionIndex.collections.get(row.fieldKey)
      const valueKey = row.operation === 'ADD' ? 'newValue' : 'oldValue'
      const rowValue = this.getCollectionRowValue(row, valueKey)
      if (!collection || !rowValue) return directFieldChanges

      const usedFields = new Set()
      const childPaths = new Set((collection.definition.collections || []).map(child => child.propertyPath))
      return collection.summaryFields.reduce((changes, summaryField) => {
        if (this.adapter && childPaths.has(summaryField)) return changes
        const schemaField = this.getDeletedSummaryField(collection, summaryField, usedFields)
        if (!schemaField) return changes
        const rawValue = this.getDeletedSummaryRawValue(rowValue, schemaField)
        if (rawValue === undefined || rawValue === null || rawValue === '') return changes
        const definition = schemaField.definition || {}
        const comparisonValue = {
          rawValue,
          displayValue: this.formatDeletedSummaryValue(rawValue, definition, rowValue)
        }
        const emptyValue = { rawValue: null, displayValue: '' }
        changes.push({
          kind: 'FIELD',
          operation: row.operation,
          fieldKey: definition.fieldKey || summaryField,
          fieldPath: `${row.fieldPath || row.fieldKey}.${schemaField.valuePath}`,
          fieldLabel: this.getSchemaFieldLabel(definition, summaryField),
          fieldI18nKey: definition.fieldI18nKey,
          componentType: definition.componentType || 'TEXT',
          itemId: row.itemId,
          parentItemId: row.parentItemId,
          oldValue: row.operation === 'DELETE' ? comparisonValue : emptyValue,
          newValue: row.operation === 'ADD' ? comparisonValue : emptyValue
        })
        return changes
      }, [])
    },
    getCollectionMetadata(fieldKey) {
      return (
        this.comparisonDefinitionIndex &&
        this.comparisonDefinitionIndex.collections.get(fieldKey)
      )
    },
    getDirectFieldChanges(row) {
      const fieldChanges = Array.isArray((row || {}).fieldChanges) ? row.fieldChanges : []
      return this.buildCollectionRowSummaryChanges(
        row,
        this.sortFieldChanges(
          fieldChanges
            .filter((item) => item.kind === 'FIELD' || !item.kind)
            .filter((item) => this.isFieldComparisonEnabled(item, row.fieldKey)),
          row.fieldKey
        )
      )
    },
    splitNestedCollectionChanges(fieldChanges) {
      return (fieldChanges || []).reduce(
        (groups, change) => {
          if (change.kind !== 'COLLECTION_ITEM') return groups
          const collection = this.getCollectionMetadata(change.fieldKey)
          const mergeToParent = Boolean(
            collection &&
              collection.definition &&
              collection.definition.mergeChangesToParent === true
          )
          groups[mergeToParent ? 'merged' : 'separate'].push(change)
          return groups
        },
        { merged: [], separate: [] }
      )
    },
    hasChildDataChange(row, ownFieldChanges, mergedCollectionChanges) {
      return Boolean(
        (row || {}).childDataChanged === true ||
          ((row || {}).changedChildCollections || []).length > 0 ||
          (mergedCollectionChanges || []).length > 0 ||
          (ownFieldChanges || []).some((change) => change.sourceCollectionKey)
      )
    },
    hasChildCollectionChange(row, ownFieldChanges, mergedCollectionChanges, collectionKey) {
      const changedChildCollections = Array.isArray((row || {}).changedChildCollections)
        ? row.changedChildCollections
        : []
      return Boolean(
        (mergedCollectionChanges || []).some((change) => change.fieldKey === collectionKey) ||
          (ownFieldChanges || []).some(
            (change) =>
              change.sourceCollectionKey === collectionKey ||
              change.collectionKey === collectionKey
          ) ||
          changedChildCollections.some((change) => {
            if (typeof change === 'string') return change === collectionKey
            return (
              change &&
              [change.fieldKey, change.collectionKey, change.sourceCollectionKey].includes(
                collectionKey
              )
            )
          })
      )
    },
    hasDirectFieldChanges(row) {
      return Array.isArray(row.fieldChanges) && row.fieldChanges.length > 0
    },
    isEmptyValue(value) {
      if (value === undefined || value === null || value === '') return true
      if (typeof value === 'object' && 'displayValue' in value) {
        const rawValue = value.rawValue
        return (
          value.displayValue === '' &&
          (rawValue === undefined || rawValue === null || rawValue === '')
        )
      }
      return false
    },
    formatPageComparisonNumber(value, formatter, rowValue) {
      if (value === undefined || value === null || value === '') return ''
      if (!['number', 'string'].includes(typeof value) || !Number.isFinite(Number(value))) return undefined
      let precisionValue = formatter.precisionPath
        ? this.getValueByPath(rowValue, formatter.precisionPath)
        : formatter.precision
      if (formatter.precisionSelectorPath) {
        const selector = this.getValueByPath(rowValue, formatter.precisionSelectorPath)
        const selectedPrecision = (formatter.precisionByValue || {})[selector]
        if (selectedPrecision === undefined) return undefined
        precisionValue = selectedPrecision
      }
      // 历史快照缺少单位精度时保留接口展示值，不能将有效小数误舍入为整数。
      if (precisionValue === undefined || precisionValue === null || precisionValue === '') return undefined
      const precision = Number(precisionValue)
      if (!Number.isInteger(precision) || precision < 0 || precision > 100) return undefined
      const trimZeroPaths = formatter.trimZeroWhenPaths ||
        (formatter.trimZeroWhenPath ? [formatter.trimZeroWhenPath] : [])
      const trimZero = trimZeroPaths.some(path => String(this.getValueByPath(rowValue, path)) === '1')
      const keepDec = formatter.minPrecision !== undefined || trimZero ? false : formatter.keepDec
      const formatted = this.$numberStr(value, precision, keepDec, formatter.minPrecision)
      return formatter.normalizeNegativeZero && formatted === '-0.00' ? '0.00' : formatted
    },
    displayChangeValue(value, change, collectionKey, row, valueKey) {
      const rawValue =
        value && typeof value === 'object' && 'rawValue' in value ? value.rawValue : value
      const definition = this.getFieldDefinition((change || {}).fieldKey, collectionKey)
      const formatter = (definition || {}).formatter
      if (formatter && formatter.type === 'DECIMAL') {
        const rowValue = this.getCollectionRowValue(row, valueKey)
        const formatted = this.formatPageComparisonNumber(rawValue, formatter, rowValue)
        if (formatted !== undefined) return formatted
      }
      if (formatter && formatter.type === 'VALUE_MAP' && !this.isEmptyValue(rawValue)) {
        const option = (formatter.values || []).find(item => String(item.value) === String(rawValue))
        if (option) return String(option.label)
      }
      if ((change || {}).fieldKey === 'fileSize') return this.formatFileSize(rawValue)
      if (
        (change || {}).fieldKey === 'commonFileList' &&
        rawValue &&
        typeof rawValue === 'object'
      ) {
        const fileName = rawValue.fileName || ''
        const fileSize = this.formatFileSize(rawValue.fileSize)
        if (fileName && fileSize) return `${fileName} (${fileSize})`
        if (fileName) return fileName
        if (fileSize) return fileSize
      }
      return this.displayValue(value)
    },
    formatFileSize(value) {
      if (value === undefined || value === null || value === '') return ''
      const bytes = Number(value)
      if (!Number.isFinite(bytes) || bytes < 0) return String(value)
      if (bytes === 0) return '0 B'
      const unitIndex = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        FILE_SIZE_UNITS.length - 1
      )
      const convertedValue = bytes / 1024 ** unitIndex
      const displayNumber =
        unitIndex === 0 ? String(Math.round(convertedValue)) : convertedValue.toFixed(2)
      return `${displayNumber} ${FILE_SIZE_UNITS[unitIndex]}`
    },
    displayValue(value) {
      if (this.isEmptyValue(value)) return '—'
      if (Array.isArray(value)) {
        return value.map((item) => this.displayValue(item)).join('\n')
      }
      if (typeof value === 'object') {
        if (
          'displayValue' in value &&
          value.displayValue !== undefined &&
          value.displayValue !== null
        ) {
          return String(value.displayValue)
        }
        if ('rawValue' in value) return this.displayValue(value.rawValue)
        if (value.available === false && !value.fileName) {
          return this.$t('PURCHASE.versionComparisonV2.unavailableFile')
        }
        if (value.fileName) return String(value.fileName)
        if (value.name) return String(value.name)
        try {
          return JSON.stringify(value)
        } catch (error) {
          return String(value)
        }
      }
      return String(value)
    },
    normalizeAssignmentList(assignList, decimalNum) {
      return (assignList || [])
        .filter((assignment) => assignment && typeof assignment === 'object')
        .map((assignment) => ({
          ...assignment,
          decimalNum:
            assignment.decimalNum === undefined ? decimalNum : assignment.decimalNum
        }))
    },
    findProductAssignmentList(value) {
      const queue = [{ value, decimalNum: undefined }]
      const wrapperKeys = ['rowValue', 'rawValue', 'value', 'data', 'content']
      for (let index = 0; index < queue.length && index < 16; index++) {
        const current = this.parseJsonValue(queue[index].value)
        if (!current || typeof current !== 'object' || Array.isArray(current)) continue
        const decimalNum =
          current.decimalNum === undefined ? queue[index].decimalNum : current.decimalNum
        if (Object.prototype.hasOwnProperty.call(current, 'assignList')) {
          const assignList = this.parseJsonValue(current.assignList)
          if (Array.isArray(assignList)) {
            return this.normalizeAssignmentList(assignList, decimalNum)
          }
        }
        wrapperKeys.forEach((key) => {
          if (current[key] !== undefined && current[key] !== current) {
            queue.push({ value: current[key], decimalNum })
          }
        })
      }
      return null
    },
    findAssignmentRow(value) {
      const queue = [value]
      const wrapperKeys = ['rowValue', 'rawValue', 'value', 'data', 'content']
      const assignmentKeys = [
        'purchaseRequisiteDetailId',
        'purchaseRequisiteId',
        'purchaseRequisiteNo',
        'purchaseQty',
        'costProjectId',
        'costProjectCode'
      ]
      for (let index = 0; index < queue.length && index < 12; index++) {
        const current = this.parseJsonValue(queue[index])
        if (!current || typeof current !== 'object' || Array.isArray(current)) continue
        if (assignmentKeys.some((key) => current[key] !== undefined)) return current
        wrapperKeys.forEach((key) => {
          if (current[key] !== undefined && current[key] !== current) queue.push(current[key])
        })
      }
      return null
    },
    getChangedAssignment(change, valueKey) {
      const operation = (change || {}).operation
      const candidates = [(change || {})[valueKey]]
      if (
        (valueKey === 'oldValue' && operation === 'DELETE') ||
        (valueKey === 'newValue' && operation === 'ADD')
      ) {
        candidates.push((change || {}).rowValue)
      }
      for (const candidate of candidates) {
        const assignment = this.findAssignmentRow(candidate)
        if (assignment) return assignment
      }

      const quantityChange = ((change || {}).fieldChanges || []).find(
        (field) => field.fieldKey === 'purchaseQty'
      )
      if (!quantityChange) return null
      const purchaseQty = this.getComparisonRawValue(quantityChange[valueKey])
      if (purchaseQty === undefined || purchaseQty === null || purchaseQty === '') return null
      return {
        purchaseRequisiteNo: change.purchaseRequisiteNo || change.itemLabel || '',
        purchaseQty,
        decimalNum: change.decimalNum
      }
    },
    getProductAssignments(value, row, collectionChanges, valueKey) {
      if ((row || {}).fieldKey !== 'purchaseOrderDetailList') return []
      const valueAssignments = this.findProductAssignmentList(value)
      if (valueAssignments !== null) return valueAssignments

      const rowValueKeys =
        valueKey === 'oldValue'
          ? ['oldRowValue', 'beforeRowValue']
          : ['newRowValue', 'afterRowValue']
      for (const key of rowValueKeys) {
        const rowAssignments = this.findProductAssignmentList((row || {})[key])
        if (rowAssignments !== null) return rowAssignments
      }

      return (collectionChanges || [])
        .map((change) => this.getChangedAssignment(change, valueKey))
        .filter(Boolean)
    },
    getAssignmentKey(assignment, index) {
      const row = assignment || {}
      const identity = [
        row.purchaseRequisiteDetailId,
        row.purchaseRequisiteId,
        row.purchaseRequisiteNo,
        row.productId
      ].find((value) => value !== undefined && value !== null && value !== '')
      return `${toStringOrEmpty(identity) || 'assignment'}:${index}`
    },
    formatAssignmentQuantity(assignment) {
      const quantity = (assignment || {}).purchaseQty
      if (quantity === undefined || quantity === null || quantity === '') return '—'
      if (typeof this.$numberStr === 'function') {
        return this.$numberStr(quantity, assignment.decimalNum)
      }
      const number = Number(quantity)
      if (!Number.isFinite(number)) return String(quantity)
      const precisionValue = Number(assignment.decimalNum)
      const precision = Number.isInteger(precisionValue) && precisionValue >= 0
        ? precisionValue
        : undefined
      return number.toLocaleString(this.getContractLocale(), {
        useGrouping: true,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      })
    },
    normalizeServiceSurchargeList(serviceSurchargeList, decimalNum) {
      return (serviceSurchargeList || [])
        .filter((surcharge) => surcharge && typeof surcharge === 'object')
        .map((surcharge) => ({
          ...surcharge,
          decimalNum:
            surcharge.decimalNum === undefined ? decimalNum : surcharge.decimalNum
        }))
    },
    findProductServiceSurchargeList(value) {
      const queue = [{ value, decimalNum: undefined }]
      const wrapperKeys = ['rowValue', 'rawValue', 'value', 'data', 'content']
      for (let index = 0; index < queue.length && index < 16; index++) {
        const current = this.parseJsonValue(queue[index].value)
        if (!current || typeof current !== 'object' || Array.isArray(current)) continue
        const decimalNum =
          current.decimalNum === undefined ? queue[index].decimalNum : current.decimalNum
        if (Object.prototype.hasOwnProperty.call(current, 'serviceSurchargeList')) {
          const serviceSurchargeList = this.parseJsonValue(current.serviceSurchargeList)
          if (Array.isArray(serviceSurchargeList)) {
            return this.normalizeServiceSurchargeList(serviceSurchargeList, decimalNum)
          }
        }
        wrapperKeys.forEach((key) => {
          if (current[key] !== undefined && current[key] !== current) {
            queue.push({ value: current[key], decimalNum })
          }
        })
      }
      return null
    },
    findServiceSurchargeRow(value) {
      const queue = [value]
      const wrapperKeys = ['rowValue', 'rawValue', 'value', 'data', 'content']
      for (let index = 0; index < queue.length && index < 12; index++) {
        const current = this.parseJsonValue(queue[index])
        if (!current || typeof current !== 'object' || Array.isArray(current)) continue
        if (current.serviceSurchargeId !== undefined || current.expenseItemName !== undefined) {
          return current
        }
        wrapperKeys.forEach((key) => {
          if (current[key] !== undefined && current[key] !== current) queue.push(current[key])
        })
      }
      return null
    },
    getChangedServiceSurcharge(change, valueKey) {
      const operation = (change || {}).operation
      const candidates = [(change || {})[valueKey]]
      if (
        (valueKey === 'oldValue' && operation === 'DELETE') ||
        (valueKey === 'newValue' && operation === 'ADD')
      ) {
        candidates.push((change || {}).rowValue)
      }
      for (const candidate of candidates) {
        const surcharge = this.findServiceSurchargeRow(candidate)
        if (surcharge) return surcharge
      }

      const surcharge = { expenseItemName: (change || {}).itemLabel || '' }
      let hasFieldValue = false
      ;((change || {}).fieldChanges || []).forEach((field) => {
        const value = this.getComparisonRawValue(field[valueKey])
        if (value === undefined || value === null || value === '') return
        surcharge[field.fieldKey] = value
        hasFieldValue = true
      })
      return hasFieldValue ? surcharge : null
    },
    getProductServiceSurcharges(value, row, collectionChanges, valueKey) {
      if ((row || {}).fieldKey !== 'purchaseOrderDetailList') return []
      const valueSurcharges = this.findProductServiceSurchargeList(value)
      if (valueSurcharges !== null) return valueSurcharges

      const rowValueKeys =
        valueKey === 'oldValue'
          ? ['oldRowValue', 'beforeRowValue']
          : ['newRowValue', 'afterRowValue']
      for (const key of rowValueKeys) {
        const rowSurcharges = this.findProductServiceSurchargeList((row || {})[key])
        if (rowSurcharges !== null) return rowSurcharges
      }

      return (collectionChanges || [])
        .map((change) => this.getChangedServiceSurcharge(change, valueKey))
        .filter(Boolean)
    },
    getServiceSurchargeKey(surcharge, index) {
      const row = surcharge || {}
      const identity =
        row.serviceSurchargeId ||
        [row.expenseItemName, row.unit]
          .map(toStringOrEmpty)
          .filter(Boolean)
          .join(':')
      return (identity || 'service-surcharge') + ':' + index
    },
    formatServiceSurchargeQuantity(surcharge) {
      const row = surcharge || {}
      const quantity = row.qty
      if (!this.hasValue(quantity)) return '—'
      const formatted =
        typeof this.$numberStr === 'function'
          ? this.$numberStr(quantity, row.decimalNum)
          : this.formatLocaleNumber(quantity, row.decimalNum)
      return row.unit ? formatted + ' ' + row.unit : formatted
    },
    formatServiceSurchargeMoney(value) {
      if (!this.hasValue(value)) return '—'
      if (typeof this.$numberStr === 'function') return this.$numberStr(value, 6, false, 2)
      return this.formatLocaleNumber(value, 6, 2)
    },
    formatLocaleNumber(value, precision, minPrecision = precision) {
      const number = Number(value)
      if (!Number.isFinite(number)) return String(value)
      const precisionValue = Number(precision)
      const digits =
        Number.isInteger(precisionValue) && precisionValue >= 0 ? precisionValue : undefined
      return number.toLocaleString(this.getContractLocale(), {
        useGrouping: true,
        minimumFractionDigits: minPrecision,
        maximumFractionDigits: digits
      })
    },
    hasValue(value) {
      return value !== undefined && value !== null && value !== ''
    },
    hasBeforeChildComparison(row) {
      return Boolean(
        ((row || {}).assignmentDataChanged && ((row || {}).beforeAssignments || []).length) ||
          ((row || {}).serviceSurchargeDataChanged &&
            ((row || {}).beforeServiceSurcharges || []).length)
      )
    },
    hasAfterChildComparison(row) {
      return Boolean(
        ((row || {}).assignmentDataChanged && ((row || {}).afterAssignments || []).length) ||
          ((row || {}).serviceSurchargeDataChanged &&
            ((row || {}).afterServiceSurcharges || []).length)
      )
    },
    isProductChildOnlyChange(row) {
      return Boolean(
        (row || {}).fieldKey === 'purchaseOrderDetailList' &&
          (row || {}).operation === 'MODIFY' &&
          !this.hasDirectFieldChanges(row) &&
          ((row || {}).assignmentDataChanged || (row || {}).serviceSurchargeDataChanged)
      )
    },
    shouldDisplayRowValue(row) {
      return (row || {}).kind !== 'COLLECTION_ITEM'
    },
    isBeforeComparisonEmpty(row) {
      if (this.isProductChildOnlyChange(row)) return !this.hasBeforeChildComparison(row)
      return this.isEmptyValue((row || {}).beforeValue) && !this.hasBeforeChildComparison(row)
    },
    isAfterComparisonEmpty(row) {
      if (this.isProductChildOnlyChange(row)) return !this.hasAfterChildComparison(row)
      return this.isEmptyValue((row || {}).afterValue) && !this.hasAfterChildComparison(row)
    },
    getAddedRemovedChildChanges(row) {
      if (!this.adapter || row.kind !== 'COLLECTION_ITEM' || !['ADD', 'DELETE'].includes(row.operation)) return []
      const collection = this.getCollectionMetadata(row.fieldKey)
      if (!collection) return []
      const valueKey = row.operation === 'ADD' ? 'newValue' : 'oldValue'
      const rowValue = this.getCollectionRowValue(row, valueKey)
      const existingChildren = (row.fieldChanges || []).filter(change => change.kind === 'COLLECTION_ITEM')
      return (collection.definition.collections || []).reduce((changes, child) => {
        if (existingChildren.some(change => change.fieldKey === child.fieldKey)) return changes
        const items = this.getValueByPath(rowValue, child.propertyPath)
        if (!Array.isArray(items)) return changes
        items.forEach((item, index) => {
          if (!item || typeof item !== 'object') return
          const identity = (child.identityRules || []).find(rule =>
            rule.fields.every(path => !this.isEmptyValue(this.getValueByPath(item, path))) &&
            (rule.requiredEmptyFields || []).every(path => this.isEmptyValue(this.getValueByPath(item, path)))
          )
          const identityValue = identity
            ? JSON.stringify(identity.fields.map(path => this.getValueByPath(item, path)))
            : ''
          // 相同业务标识可能重复，父行和快照位置共同保证展示行 key 唯一。
          const itemId = `${row.itemId}:${child.itemKeyPrefix}:${identityValue}:${index}`
          const label = (child.itemLabelFields || [])
            .map(path => this.getValueByPath(item, path))
            .filter(value => !this.isEmptyValue(value))
            .join(' ')
          changes.push({
            kind: 'COLLECTION_ITEM',
            operation: row.operation,
            fieldKey: child.fieldKey,
            fieldPath: `${row.fieldPath || row.fieldKey}.${child.propertyPath}[${index}]`,
            fieldLabel: child.fieldLabel,
            componentType: child.componentType,
            itemId,
            itemLabel: [row.itemLabel, label || child.fieldLabel].filter(Boolean).join(' / '),
            [valueKey]: { rawValue: item },
            fieldChanges: []
          })
        })
        return changes
      }, [])
    },
    normalizeResponseRows(rows, parentItemId = '') {
      return (rows || []).reduce((result, row) => {
        if (row.kind === 'FIELD' && !this.isFieldComparisonEnabled(row)) return result
        const fieldChanges = Array.isArray(row.fieldChanges) ? row.fieldChanges : []
        const ownFieldChanges = this.getDirectFieldChanges(row)
        const nestedChanges = this.splitNestedCollectionChanges(fieldChanges)
        const mergedCollectionChanges = nestedChanges.merged
        const nestedCollectionChanges = nestedChanges.separate.concat(
          this.getAddedRemovedChildChanges(row)
        )
        const directFieldChanges = ownFieldChanges
        const assignmentChanges = mergedCollectionChanges.filter(
          (change) => change.fieldKey === 'assignList'
        )
        const serviceSurchargeChanges = mergedCollectionChanges.filter(
          (change) => change.fieldKey === 'serviceSurchargeList'
        )
        const assignmentDataChanged = this.hasChildCollectionChange(
          row,
          ownFieldChanges,
          assignmentChanges,
          'assignList'
        )
        const serviceSurchargeDataChanged = this.hasChildCollectionChange(
          row,
          ownFieldChanges,
          serviceSurchargeChanges,
          'serviceSurchargeList'
        )
        const childDataChanged = this.hasChildDataChange(
          row,
          ownFieldChanges,
          mergedCollectionChanges
        )
        const isCollectionItem = row.kind === 'COLLECTION_ITEM'
        const containsOnlyDisabledChanges =
          fieldChanges.length > 0 &&
          directFieldChanges.length === 0 &&
          nestedCollectionChanges.length === 0 &&
          !childDataChanged
        const shouldRender =
          !containsOnlyDisabledChanges &&
          (!isCollectionItem ||
            row.operation === 'ADD' ||
            row.operation === 'DELETE' ||
            directFieldChanges.length > 0 ||
            childDataChanged ||
            nestedCollectionChanges.length === 0)

        if (shouldRender) {
          const changedFieldLabels = directFieldChanges
            .map((item) => item.fieldLabel || item.label || item.fieldKey)
            .filter(Boolean)
            .join('、')
          const beforeAssignments = this.getProductAssignments(
            row.oldValue,
            row,
            assignmentChanges,
            'oldValue'
          )
          const afterAssignments = this.getProductAssignments(
            row.newValue,
            row,
            assignmentChanges,
            'newValue'
          )
          const beforeServiceSurcharges = this.getProductServiceSurcharges(
            row.oldValue,
            row,
            serviceSurchargeChanges,
            'oldValue'
          )
          const afterServiceSurcharges = this.getProductServiceSurcharges(
            row.newValue,
            row,
            serviceSurchargeChanges,
            'newValue'
          )
          result.push({
            ...row,
            parentItemId,
            fieldLabel: isCollectionItem ? row.itemLabel || row.fieldLabel : row.fieldLabel,
            beforeValue: row.oldValue,
            afterValue: row.newValue,
            fieldChanges: directFieldChanges,
            changedFieldLabels,
            childDataChanged,
            assignmentDataChanged,
            serviceSurchargeDataChanged,
            beforeAssignments,
            afterAssignments,
            beforeServiceSurcharges,
            afterServiceSurcharges
          })
        }
        if (nestedCollectionChanges.length > 0) {
          result.push(
            ...this.normalizeResponseRows(nestedCollectionChanges, row.itemId || parentItemId)
          )
        }
        return result
      }, [])
    },
    sortSectionRows(rows, sectionKey) {
      const index = this.comparisonDefinitionIndex
      const section = index && index.sections.get(sectionKey)
      if (!section) return rows
      return rows
        .map((row, index) => ({ row, index }))
        .sort((left, right) => {
          const leftType = section.collectionOrder.has(left.row.fieldKey) ? 'COLLECTIONS' : 'FIELDS'
          const rightType = section.collectionOrder.has(right.row.fieldKey)
            ? 'COLLECTIONS'
            : 'FIELDS'
          const typeOrder =
            getOrder(section.contentOrder, leftType) - getOrder(section.contentOrder, rightType)
          if (typeOrder !== 0) return typeOrder
          const orderMap = leftType === 'COLLECTIONS' ? section.collectionOrder : section.fieldOrder
          const leftOrder = getOrder(orderMap, left.row.fieldKey)
          const rightOrder = getOrder(orderMap, right.row.fieldKey)
          return leftOrder - rightOrder || left.index - right.index
        })
        .map((item) => item.row)
    },
    getFieldDefinition(fieldKey, collectionKey) {
      const index = this.comparisonDefinitionIndex
      if (!index) return null
      if (collectionKey) {
        const collection = index.collections.get(collectionKey)
        return collection ? collection.fields.get(fieldKey) : null
      }
      return index.rootFields.get(fieldKey) || null
    },
    isFieldComparisonEnabled(change, collectionKey) {
      const definition = this.getFieldDefinition(change.fieldKey, collectionKey)
      // 数量精度保留在快照中用于格式化，不作为独立业务字段展示。
      if ([change.fieldKey, change.fieldPath, (definition || {}).propertyPath]
        .some(path => typeof path === 'string' && /(^|[._])decimalNum$/.test(path))) return false
      if (this.adapter && this.comparisonDefinitionIndex && !definition) return false
      return !definition || definition.compareEnabled !== false
    },
    sortFieldChanges(changes, collectionKey) {
      const index = this.comparisonDefinitionIndex
      const collection = index && index.collections.get(collectionKey)
      const orderMap = collection ? collection.fieldOrder : EMPTY_ORDER_MAP
      return changes
        .map((change, index) => ({ change, index }))
        .sort((left, right) => {
          const leftOrder = getOrder(orderMap, left.change.fieldKey)
          const rightOrder = getOrder(orderMap, right.change.fieldKey)
          return leftOrder - rightOrder || left.index - right.index
        })
        .map((item) => item.change)
    },
    getSectionLabel(section) {
      const metadata = this.comparisonDefinitionIndex &&
        this.comparisonDefinitionIndex.sections.get(section.sectionKey)
      const definition = (metadata && metadata.definition) || section
      const translated = definition.sectionI18nKey ? this.$t(definition.sectionI18nKey) : ''
      if (translated && translated !== definition.sectionI18nKey) {
        return translated + (definition.sectionLabelSuffix || '')
      }
      return definition.sectionLabel || section.sectionLabel || section.sectionKey
    },
    getGroupIcon(groupKey) {
      return GROUP_ICONS[groupKey] || 'el-icon-folder-opened'
    }
  }
}
</script>

<style lang="scss">
.po-version-comparison-v2-dialog {
  --po-v2-blue: #1769d2;
  --po-v2-blue-soft: #edf5ff;
  --po-v2-blue-line: #b9d5fb;
  --po-v2-ink: #142033;
  --po-v2-muted: #68758a;
  --po-v2-line: #dfe5ec;
  --po-v2-canvas: #f5f7fa;
  --po-v2-success: #2f8f6b;
  --po-v2-success-soft: #eef8f4;
  --po-v2-success-line: #bfe1d5;

  max-width: calc(100vw - 32px);
  margin-top: 5vh !important;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 22px 70px rgba(20, 32, 51, 0.18);

  .el-dialog__header {
    padding: 0;
    border-bottom: 1px solid var(--po-v2-line);
  }

  .el-dialog__headerbtn {
    top: 17px;
    right: 18px;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    background: #f2f4f7;

    &:hover {
      background: #e7ebf0;
    }
  }

  .el-dialog__body {
    padding: 0;
    background: var(--po-v2-canvas);
  }

  .el-dialog__footer {
    padding: 12px 18px;
    border-top: 1px solid var(--po-v2-line);
    background: #fff;
  }
}

.po-version-v2-titlebar {
  display: flex;
  align-items: center;
  min-height: 78px;
  padding: 0 64px 0 18px;
  background: #fff;
}

.po-version-v2-title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-right: 10px;
  border-radius: 8px;
  color: #fff;
  background: #1769d2;
  box-shadow: 0 6px 16px rgba(23, 105, 210, 0.22);
}

.po-version-v2-title-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 11px 0;

  strong {
    color: #142033;
    font-size: 16px;
    line-height: 22px;
  }
}

.po-version-v2-title-heading {
  display: flex;
  align-items: center;
  gap: 9px;
}

.po-version-v2-change-count {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 2px 8px;
  border: 1px solid #bdd7f7;
  border-radius: 11px;
  color: #1769d2;
  background: #edf5ff;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
}

.po-version-v2-document-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3px 16px;
  margin-top: 4px;
  color: #6d788a;
  font-size: 12px;
  line-height: 18px;

  b {
    color: #536176;
    font-weight: 500;
  }
}

.po-version-v2-body {
  min-height: 380px;
  max-height: calc(90vh - 142px);
  padding: 16px;
  overflow-y: auto;
}

.po-version-v2-selector-card {
  padding: 14px 16px 11px;
  border: 1px solid var(--po-v2-blue-line);
  border-radius: 8px;
  background: linear-gradient(105deg, #f7fbff 0%, var(--po-v2-blue-soft) 100%);
}

.po-version-v2-selector-main {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.po-version-v2-version-field {
  flex: 0 1 270px;

  label {
    display: block;
    margin-bottom: 6px;
    color: #334155;
    font-size: 12px;
    font-weight: 600;
  }

  .el-select {
    width: 100%;
  }
}

.po-version-v2-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-bottom: 1px;
  border: 1px solid #c8dcf6;
  border-radius: 50%;
  color: var(--po-v2-blue);
  background: #fff;
}

.po-version-v2-selector-hint {
  margin: 9px 0 0;
  color: #6f7d91;
  font-size: 12px;
}

.po-version-v2-summarybar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 12px 0;
  padding: 10px 14px;
  border: 1px solid var(--po-v2-line);
  border-radius: 7px;
  background: #fff;
}

.po-version-v2-legend {
  display: flex;
  align-items: center;
  gap: 18px;
}

.po-version-v2-legend-item {
  display: inline-flex;
  align-items: center;
  color: #536176;
  font-size: 12px;

  i {
    display: inline-block;
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    box-sizing: border-box;
    border: 1px solid #c0c4cc;
    border-radius: 3px;
  }

  &.is-modified i {
    border-color: #1a73e8;
    background: #d2e3fc;
  }

  &.is-added i {
    border-color: #1557b0;
    background: #1a73e8;
  }

  &.is-removed i {
    border-color: #78716c;
    background: #f5f5f4;
  }
}

.po-version-v2-alert {
  margin: 12px 0;

  .el-alert__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}

.po-version-v2-ledger {
  display: grid;
  gap: 12px;
}

.po-version-v2-group {
  overflow: hidden;
  border: 1px solid var(--po-v2-line);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(20, 32, 51, 0.03);
}

.po-version-v2-group-title {
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 0 12px;
  border-bottom: 1px solid var(--po-v2-line);
  color: var(--po-v2-ink);
  background: #fbfcfd;

  strong {
    font-size: 13px;
  }

  > span:last-child {
    margin-left: 8px;
    padding: 1px 7px;
    border-radius: 10px;
    color: #607089;
    background: #edf1f5;
    font-size: 11px;
  }
}

.po-version-v2-group-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  margin-right: 8px;
  border-radius: 6px;
  color: #1769d2;
  background: #e9f3ff;

  &.is-product {
    color: #147a65;
    background: #e6f6f1;
  }

  &.is-attachment {
    color: #3974bc;
    background: #eaf2fc;
  }

  &.is-conditions {
    color: #956311;
    background: #fff5dd;
  }

  &.is-contact {
    color: #7352a6;
    background: #f2ecfb;
  }
}

.po-version-v2-table {
  border: 0;

  &::before,
  &::after {
    display: none;
  }

  th.el-table__cell {
    border-bottom: 1px solid #b7c2cf;
    color: #59677a;
    background: #f7f9fb;
    font-size: 12px;
    font-weight: 600;
    vertical-align: top;
  }

  td.el-table__cell {
    padding: 8px 0;
    border-bottom: 1px solid #bdc8d5;
    color: #263347;
    vertical-align: top;
  }

  .el-table__row:hover > td.el-table__cell {
    background: #f8fbff;
  }

  .el-table__row.po-version-v2-operation-row.is-modified > td.el-table__cell {
    background: #f0f7ff;
  }

  .el-table__row.po-version-v2-operation-row.is-added > td.el-table__cell {
    background: #d2e3fc;
  }

  .el-table__row.po-version-v2-operation-row.is-removed > td.el-table__cell {
    background: #f5f5f4;
  }

  .el-table__row.po-version-v2-operation-row.is-modified:hover > td.el-table__cell {
    background: #f0f7ff;
  }

  .el-table__row.po-version-v2-operation-row.is-added:hover > td.el-table__cell {
    background: #d2e3fc;
  }

  .el-table__row.po-version-v2-operation-row.is-removed:hover > td.el-table__cell {
    background: #f5f5f4;
  }
}

.po-version-v2-operation {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 24px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  &.is-modified {
    border: 1px solid #2b83e6;
    color: #1769d2;
    background: #f5faff;
  }

  &.is-added {
    color: #fff;
    background: #1769d2;
  }

  &.is-removed {
    border: 1px solid #aeb7c3;
    color: #657084;
    background: #f5f6f8;
  }
}

.po-version-v2-field-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: flex-start;
  text-align: left;

  strong {
    color: #202d41;
    font-size: 12px;
    font-weight: 600;
  }

  small {
    overflow: hidden;
    color: #78869a;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.po-version-v2-child-change {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 3px;
  padding: 1px 6px;
  border: 1px solid var(--po-v2-blue-line);
  border-radius: 10px;
  color: var(--po-v2-blue);
  background: var(--po-v2-blue-soft);
  font-size: 10px;
  line-height: 16px;
  white-space: nowrap;
}

.po-version-v2-component-chip {
  display: inline-block;
  max-width: 112px;
  padding: 2px 7px;
  overflow: hidden;
  border-radius: 4px;
  color: #607089;
  background: #eef2f6;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.po-version-v2-value {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  word-wrap: break-word;
  word-break: break-word;
  min-height: 18px;
  overflow-wrap: anywhere;
  color: #223047;
  font-size: 12px;
  line-height: 18px;
  white-space: pre-wrap;

  &.is-empty {
    color: #a1aab7;
  }

  a {
    color: #1769d2;
    text-decoration: none;

    i {
      margin-right: 4px;
    }

    &:hover {
      text-decoration: underline;
    }
  }
}

.po-version-v2-value-line {
  box-sizing: border-box;
  align-content: start;
  align-items: start;
  display: grid;
  grid-template-columns: minmax(72px, 0.8fr) minmax(90px, 1.2fr);
  gap: 8px;
  padding: 3px 0;
  border-bottom: 1px dashed #e4e9f0;

  &:last-child {
    border-bottom: 0;
  }

  small {
    min-width: 0;
    line-height: 18px;
    overflow: hidden;
    color: #7b8798;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    min-width: 0;
    line-height: 18px;
    color: #223047;
  }
}

.po-version-v2-table td.po-version-v2-field-column {
  text-align: left;
}

.po-version-v2-html-value {
  min-width: 0;
  overflow-wrap: anywhere;
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }

  p,
  ul,
  ol {
    margin: 0 0 4px;
  }

  ul,
  ol {
    padding-left: 20px;
  }

  img {
    max-width: 100%;
    height: auto;
  }
}

.po-version-v2-assignment-list {
  margin-top: 7px;
  overflow: hidden;
  border: 1px solid #dce4ee;
  border-radius: 5px;
  background: #fff;
}

.po-version-v2-assignment-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(62px, 0.45fr);
  min-height: 25px;
  border-top: 1px solid #edf1f5;

  &:first-child {
    border-top: 0;
  }

  &.is-header {
    color: #69778b;
    background: #f4f7fa;
    font-size: 10px;
    font-weight: 600;
  }

  span {
    padding: 3px 7px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:last-child {
      border-left: 1px solid #edf1f5;
      font-variant-numeric: tabular-nums;
      text-align: left;
    }
  }
}

.po-version-v2-service-list {
  margin-top: 7px;
  overflow: hidden;
  border: 1px solid #dce4ee;
  border-radius: 5px;
  background: #fff;
}

.po-version-v2-service-title {
  padding: 4px 7px;
  color: #69778b;
  background: #f4f7fa;
  font-size: 10px;
  font-weight: 600;
}

.po-version-v2-service-item {
  padding: 6px 7px;
  border-top: 1px solid #edf1f5;

  > strong {
    display: block;
    overflow: hidden;
    color: #263347;
    font-size: 11px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.po-version-v2-service-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px 8px;
  margin-top: 5px;

  span {
    min-width: 0;
    color: #263347;
    font-variant-numeric: tabular-nums;
  }

  small {
    display: block;
    overflow: hidden;
    color: #7b8798;
    font-size: 9px;
    line-height: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.po-version-v2-service-remarks {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 5px;
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px dashed #e4e9f0;

  small {
    color: #7b8798;
  }

  span {
    min-width: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.po-version-v2-empty {
  position: relative;
  overflow: hidden;
  margin-top: 12px;
  padding: 48px 0 58px;
  border: 1px solid var(--po-v2-line);
  border-radius: 8px;
  background: #fff;

  &.is-no-change {
    border-color: var(--po-v2-success-line);
    background-color: var(--po-v2-success-soft);
    background-image: linear-gradient(rgba(47, 143, 107, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(47, 143, 107, 0.035) 1px, transparent 1px),
      radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.96), rgba(238, 248, 244, 0.72) 58%);
    background-size: 24px 24px, 24px 24px, 100% 100%;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88);

    .el-empty__description p {
      color: #376653;
      font-weight: 600;
    }
  }
}

.po-version-v2-no-change-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border: 1px solid var(--po-v2-success-line);
  border-radius: 50%;
  color: var(--po-v2-success);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 28px rgba(47, 143, 107, 0.14), 0 0 0 10px rgba(255, 255, 255, 0.42);

  i {
    font-size: 34px;
    font-weight: 700;
  }
}

.po-version-v2-footer {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 900px) {
  .po-version-comparison-v2-dialog {
    width: calc(100vw - 24px) !important;
  }

  .po-version-v2-selector-main {
    align-items: stretch;
    flex-wrap: wrap;
  }

  .po-version-v2-version-field {
    flex: 1 1 calc(50% - 28px);
  }

  .po-version-v2-document-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 1px;
  }

  .po-version-v2-summarybar {
    justify-content: flex-start;
  }

  .po-version-v2-legend {
    flex-wrap: wrap;
  }
}
</style>
