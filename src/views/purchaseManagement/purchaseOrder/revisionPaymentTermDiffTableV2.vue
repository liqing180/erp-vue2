<template>
  <div class="payment-term-comparison-table">
    <table
      v-if="rows.length"
      :aria-label="$t('PURCHASE.versionComparisonV2.paymentTermDetails')"
    >
      <thead>
        <tr>
          <th>{{ $t('ui.paymentPercentage') }}</th>
          <th>{{ $t('ui.stageName') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="getRowKey(row, index)">
          <td>{{ formatPercentage(row.percentage) }}</td>
          <td>
            <div
              class="payment-term-comparison-table__stage"
              :style="{ paddingLeft: `${(row.comparisonLevel - 1) * 14}px` }"
            >
              <span>{{ row.comparisonStage }}.</span>
              <strong>{{ row.stageName || '—' }}</strong>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <span v-else class="payment-term-comparison-table__empty">—</span>
  </div>
</template>

<script>
export default {
  name: 'RevisionPaymentTermDiffTableV2',
  props: {
    paymentTermObj: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    rows() {
      return this.flattenDetails(this.paymentTermObj.paymentTermDetailList || [])
    }
  },
  methods: {
    flattenDetails(detailList, parentStage = '', level = 1, rows = []) {
      ;(detailList || []).forEach((item, index) => {
        const comparisonStage = parentStage ? `${parentStage}.${index + 1}` : `${index + 1}`
        rows.push({
          ...item,
          comparisonLevel: level,
          comparisonStage
        })
        if (Array.isArray(item.childList) && item.childList.length) {
          this.flattenDetails(item.childList, comparisonStage, level + 1, rows)
        }
      })
      return rows
    },
    getRowKey(row, index) {
      return row.paymentTermDetailId || row.rowTimeId || `${row.comparisonStage}:${index}`
    },
    formatPercentage(value) {
      if (value === undefined || value === null || value === '') return '—'
      const percentage =
        typeof this.$numberStr === 'function' ? this.$numberStr(value, 0) : String(value)
      return `${percentage}%`
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-term-comparison-table {
  width: 100%;
  min-width: 0;

  table {
    width: 100%;
    overflow: hidden;
    border: 1px solid #dce4ee;
    border-radius: 5px;
    border-spacing: 0;
    border-collapse: separate;
    background: #fff;
    table-layout: fixed;
  }

  th,
  td {
    padding: 5px 7px;
    border-bottom: 1px solid #edf1f5;
    color: #263347;
    font-size: 11px;
    line-height: 16px;
    text-align: left;
    vertical-align: top;
    word-break: break-word;
  }

  th {
    color: #69778b;
    background: #f4f7fa;
    font-weight: 600;
    text-align: center;
  }

  th:first-child,
  td:first-child {
    width: 88px;
    border-right: 1px solid #edf1f5;
    font-variant-numeric: tabular-nums;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
}

.payment-term-comparison-table__stage {
  position: relative;
  display: flex;
  align-items: flex-start;
  min-width: 0;

  span {
    flex: 0 0 auto;
    margin-right: 4px;
    color: #1769d2;
    font-weight: 600;
  }

  strong {
    min-width: 0;
    color: #263347;
    font-weight: 400;
  }
}

.payment-term-comparison-table__empty {
  color: #a1aab7;
}
</style>
